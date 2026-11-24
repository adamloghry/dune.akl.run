{
  description = "The Golden Path: a pixel-art Astro chronicle of Frank Herbert's Dune";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAll = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      # `nix build` -> ./result is the static site (the same tree as dist/).
      # importNpmLock reads package-lock.json directly, so there is no npmDepsHash to maintain:
      # the lockfile's integrity hashes are the pin.
      packages = forAll (pkgs: {
        default = pkgs.buildNpmPackage {
          pname = "dune-chronicle";
          version = "1.0.0";
          src = pkgs.lib.fileset.toSource {
            root = ./.;
            fileset = pkgs.lib.fileset.unions [
              ./package.json ./package-lock.json ./astro.config.mjs ./tsconfig.json ./src ./public
            ];
          };
          nodejs = pkgs.nodejs_22;
          npmDeps = pkgs.importNpmLock { npmRoot = ./.; };
          npmConfigHook = pkgs.importNpmLock.npmConfigHook;
          env = {
            ASTRO_TELEMETRY_DISABLED = "1";
            SITE_URL = "https://dune.akl.run";
          };
          npmBuildScript = "build";
          installPhase = ''
            runHook preInstall
            cp -r dist $out
            runHook postInstall
          '';
        };
      });

      # `nix run .#deploy` -> builds, then publishes to Cloudflare (needs `wrangler login` once,
      # or CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID in the environment).
      apps = forAll (pkgs: {
        deploy = {
          type = "app";
          program = toString (pkgs.writeShellScript "deploy" ''
            set -euo pipefail
            site=${self.packages.${pkgs.system}.default}
            tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
            cp -r "$site" "$tmp/dist"; chmod -R u+w "$tmp/dist"
            cp ${./wrangler.toml} "$tmp/wrangler.toml"
            cd "$tmp" && ${pkgs.wrangler}/bin/wrangler deploy
          '');
        };
      });

      devShells = forAll (pkgs: {
        default = pkgs.mkShell {
          packages = [ pkgs.nodejs_22 pkgs.wrangler ];
          ASTRO_TELEMETRY_DISABLED = "1";
        };
      });

      formatter = forAll (pkgs: pkgs.nixfmt-rfc-style);
    };
}
