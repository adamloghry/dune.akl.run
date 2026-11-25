{
  description = "The Golden Path: a pixel-art Astro chronicle of Frank Herbert's Dune";

  nixConfig = {
    extra-substituters = [ "https://devenv.cachix.org" ];
    extra-trusted-public-keys = [ "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=" ];
  };

  # Same inputs and layout as akl.run (flake-parts, devenv, treefmt-nix), so both repos
  # build, format and check the same way.
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    devenv = {
      url = "github:cachix/devenv";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{ flake-parts, devenv, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      imports = [
        inputs.treefmt-nix.flakeModule
        ./nix/checks.nix
        ./nix/treefmt.nix
      ];

      perSystem =
        {
          pkgs,
          self',
          config,
          ...
        }:
        let
          treefmtWrapper = config.treefmt.build.wrapper;
        in
        {
          # `nix build` -> ./result is the static site (the same tree as dist/).
          # importNpmLock reads package-lock.json directly, so there is no npmDepsHash to maintain.
          packages.default = pkgs.buildNpmPackage {
            pname = "dune-akl-run";
            version = "1.0.0";

            src = ./.;

            npmDeps = pkgs.importNpmLock { npmRoot = ./.; };
            npmConfigHook = pkgs.importNpmLock.npmConfigHook;

            nodejs = pkgs.nodejs_24;

            env = {
              ASTRO_TELEMETRY_DISABLED = "1";
            };

            installPhase = ''
              runHook preInstall
              cp -r dist $out
              runHook postInstall
            '';
          };

          # Deploy the assets-only Worker straight from a workstation, bypassing Workers Builds:
          # nix build -> dereference -> upload. On main it deploys production; on any other
          # branch it uploads a preview version. Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.
          apps.deploy = {
            type = "app";
            program = "${
              pkgs.writeShellApplication {
                name = "deploy";
                runtimeInputs = [
                  pkgs.wrangler
                  pkgs.git
                  pkgs.coreutils
                  pkgs.gnused
                ];
                text = ''
                  export WRANGLER_SEND_METRICS=false

                  src="''${1:-}"
                  if [ -z "$src" ]; then
                    if [ -e result ]; then
                      src=result
                    elif [ -d dist ]; then
                      src=dist
                    else
                      echo "error: no build found. Run 'nix build' (preferred) or 'npm run build'." >&2
                      exit 1
                    fi
                  fi
                  [ -f "$src/index.html" ] || { echo "error: $src/index.html not found" >&2; exit 1; }
                  [ -f wrangler.jsonc ] || { echo "error: run from the repo root (wrangler.jsonc not found)" >&2; exit 1; }

                  : "''${CLOUDFLARE_API_TOKEN:?set CLOUDFLARE_API_TOKEN (a token with the Workers Scripts:Edit permission)}"
                  : "''${CLOUDFLARE_ACCOUNT_ID:?set CLOUDFLARE_ACCOUNT_ID}"

                  # result/ is a symlink into the read-only nix store; wrangler wants a real,
                  # writable tree named ./dist next to wrangler.jsonc.
                  work=$(mktemp -d)
                  trap 'rm -rf "$work"' EXIT
                  cp -rL "$src" "$work/dist"
                  chmod -R u+w "$work/dist"
                  cp wrangler.jsonc "$work/"

                  branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo detached)
                  commit=$(git rev-parse --short=12 HEAD 2>/dev/null || echo unknown)
                  dirty=false
                  if ! git diff --quiet HEAD 2>/dev/null; then dirty=true; fi
                  message="$branch@$commit dirty=$dirty"

                  cd "$work"
                  if [ "$branch" = main ]; then
                    echo "deploying $src -> Worker dune-akl-run, production ($message)"
                    wrangler deploy --message "$message"
                  else
                    alias=$(printf '%s' "$branch" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9-' '-' \
                      | sed 's/--*/-/g; s/^-//' | cut -c1-40 | sed 's/-$//')
                    echo "uploading $src -> Worker dune-akl-run, preview '$alias' ($message)"
                    wrangler versions upload --preview-alias "$alias" --message "$message"
                  fi
                '';
              }
            }/bin/deploy";
          };

          devShells.default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [
              (
                { pkgs, ... }:
                {
                  languages.javascript = {
                    enable = true;
                    package = pkgs.nodejs_24;
                    npm.enable = true;
                    npm.install.enable = true;
                  };

                  # treefmt is the single formatting authority (see nix/treefmt.nix).
                  git-hooks.hooks = {
                    treefmt = {
                      enable = true;
                      package = treefmtWrapper;
                    };
                  };

                  scripts.dev.exec = "npm run dev";
                  scripts.build.exec = "npm run build";
                  scripts.preview.exec = "npm run preview";

                  processes.astro.exec = "npm run dev";

                  enterShell = ''
                    echo "dune.akl.run dev environment"
                    echo "  dev     - start the Astro dev server (npm run dev)"
                    echo "  build   - build the site to dist/ (npm run build)"
                    echo "  preview - preview the production build (npm run preview)"
                  '';
                }
              )
            ];
          };

          checks.build = self'.packages.default;

          checks.astro-check = pkgs.buildNpmPackage {
            pname = "dune-akl-run-check";
            version = "1.0.0";
            src = ./.;
            npmDeps = pkgs.importNpmLock { npmRoot = ./.; };
            npmConfigHook = pkgs.importNpmLock.npmConfigHook;
            nodejs = pkgs.nodejs_24;
            env.ASTRO_TELEMETRY_DISABLED = "1";
            buildPhase = ''
              runHook preBuild
              npm run check
              runHook postBuild
            '';
            installPhase = ''
              runHook preInstall
              touch $out
              runHook postInstall
            '';
          };
        };
    };
}
