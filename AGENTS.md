# AGENTS.md

The Golden Path (https://dune.akl.run): a static Astro 7 site, in pixel art, that tells the
in-universe history of Frank Herbert's Dune. `npm run build` (or `nix build`) produces the whole
site in `dist/`; there is no server-side runtime. Cloudflare Workers Builds deploys every push to
`main`, so `main` is production.

The tooling matches akl.run: a flake-parts flake with a devenv shell, treefmt, Vitest, Bombadil
and one GitHub Actions job. See README.md for the commands.

## Canon order (the content rule)

1. Frank Herbert's six novels and the appendices to Dune are the record.
2. Denis Villeneuve's films come next, as film notes tagged KEPT, CHANGED, CUT or ADDED.
3. The later books by Brian Herbert and Kevin J. Anderson are a marked, secondary tier (dashed
   cards; RETCON cards must say what Frank Herbert wrote).
4. Other screen versions (Lynch, the Sci Fi Channel miniseries, Dune: Prophecy) are hidden by default.

Write summaries in our own words. Quote at most a sentence or two, always attributed. Check a
claim against a source before adding it, or leave it out. Portraits follow Herbert's text and
never an actor's look.

## Layout

- `src/data/` — all content: `timeline.ts` (eras, events, film notes), `cast.ts` (people, factions,
  event tags), `beyond.ts` (later books, other screen versions), `family.ts`, `glossary.ts`.
  `tests/unit/data.test.ts` checks every id one record names.
- `src/lib/` — the pixel-art engine (`pix.ts`, `art.ts`, `scenes.ts`, `style.ts`) and helpers.
  Pictures are drawn at build time by endpoints under `src/pages/art/` and `src/pages/og/`.
- `src/scripts/` — all page JavaScript, bundled by Astro as modules. Include one with exactly
  `<script src="../scripts/name.js"></script>` (any other attribute makes Astro treat it as inline).
- `public/assets/js/boot.js` — the one synchronous script (theme, art style, spoiler level before
  first paint). Link it with `asset()` from `src/lib/asset.ts` and `is:inline src=...`.
- `public/_headers` — HSTS, CSP and caching for Cloudflare. `public/robots.txt` — search engines in,
  AI-training crawlers out, sitemap.

## Rules

- **No inline scripts or inline event handlers.** The CSP is `script-src 'self'`; the browser
  blocks them silently, and the `csp-output` flake check fails on them. Inline `style` attributes are
  allowed (`style-src 'unsafe-inline'`) for computed layouts.
- No requests to other origins. Fonts are self-hosted through `@fontsource` and emitted as files
  (`assetsInlineLimit: 0`).
- No page may scroll sideways at 320 px or wider. Wide views (tree, map, web, scale) scroll inside
  their own box. Bombadil checks this at 360, 800 and 1440 px.
- Run `nix fmt` before committing (prettier `printWidth: 110` for JS, TS, CSS and JSON; nixfmt for
  Nix). Markdown, `public/_headers`, `public/robots.txt` and `public/assets/**` are not formatted.
- Do not deploy by hand unless asked; pushing to `main` already deploys.
