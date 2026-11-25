{
  perSystem = _: {
    treefmt = {
      projectRootFile = "flake.nix";

      programs.nixfmt.enable = true;
      programs.prettier.enable = true;

      # Files that ship byte-for-byte or are not ours to reformat:
      # - public/assets/**: served verbatim at fixed URLs (boot.js, with a ?v= hash).
      # - public/_headers: served verbatim; one header per line, read by Cloudflare.
      # - Markdown: prose and licence texts, kept as written (as on akl.run).
      settings.global.excludes = [
        "public/assets/**"
        "public/_headers"
        "public/robots.txt"
        "**/package-lock.json"
        "*.png"
        "*.svg"
        "*.md"
        "LICENSE"
        "screenshots/**"
      ];
    };
  };
}
