{
  perSystem =
    { pkgs, self', ... }:
    {
      # Unit tests (vitest) against the locked deps; no network needed.
      checks.unit = pkgs.buildNpmPackage {
        pname = "dune-akl-run-unit";
        version = "1.0.0";
        src = ./..;
        npmDeps = pkgs.importNpmLock { npmRoot = ./..; };
        npmConfigHook = pkgs.importNpmLock.npmConfigHook;
        nodejs = pkgs.nodejs_24;
        env.CI = "1";
        buildPhase = ''
          runHook preBuild
          npm test
          runHook postBuild
        '';
        installPhase = ''
          runHook preInstall
          touch $out
          runHook postInstall
        '';
      };

      # The CSP has script-src 'self': the browser silently blocks inline scripts and
      # inline event handlers, so turn either into a build failure. (Inline styles are
      # still allowed: style-src keeps 'unsafe-inline' for the generated pixel layouts.)
      checks.csp-output = pkgs.runCommand "csp-output" { } ''
        set -euo pipefail
        site=${self'.packages.default}
        status=0
        for f in $(find "$site" -name '*.html'); do
          if grep -oE '<script[^>]*>' "$f" | grep -v ' src=' | grep -vqE 'application/(ld\+)?json'; then
            echo "csp-output: inline <script> in $f" >&2; status=1
          fi
          if grep -qE ' on(click|submit|load|error|change|input)=' "$f"; then
            echo "csp-output: inline event handler in $f" >&2; status=1
          fi
        done
        grep -q 'boot.js?v=' "$site/index.html" || { echo "csp-output: boot.js missing" >&2; status=1; }
        grep -q "script-src 'self';" "$site/_headers" || { echo "csp-output: script-src changed in _headers" >&2; status=1; }
        [ "$status" -eq 0 ]
        echo ok > $out
      '';
    };
}
