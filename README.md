# The Golden Path

Home: **https://dune.akl.run** (Cloudflare Workers static assets, not deployed yet).

A pixel-art chronicle of the in-universe history of Frank Herbert's Dune, from the Zensunni
schism (1381 B.G.) to the last page of Chapterhouse: Dune (≈15,230 A.G.). The books are the
record; every place where Denis Villeneuve's Dune (2021) and Dune: Part Two (2024) diverge is
marked inline as KEPT, CHANGED, CUT or ADDED, and collected on a separate ledger page.

This README is the authority for the handoff.

## Scope

- **Canon:** Frank Herbert's six novels plus the appendices and glossary printed with Dune.
  They outrank everything else on the site.
- **Films:** Villeneuve's two released films come second, marked inline as KEPT, CHANGED, CUT
  or ADDED.
- **Secondary tiers, always labelled:** the later novels by Brian Herbert and Kevin J. Anderson
  (dashed cards; a RETCON tag where they contradict Frank Herbert), and the other screen versions
  (Lynch 1984, the two Sci-Fi Channel miniseries), shown on `/beyond/` and under the events they touch.
- **Spoilers:** every event, person, term and note has the point in the books at which it stops
  being a spoiler (`src/data/spoilers.ts`). The shield in the header veils anything past the
  reader's choice; nothing is veiled until they choose, or without JavaScript.
- **Dates:** hard A.G. dates only where Herbert gives them (deep past, opening of Dune).
  Everything later is shown as an interval from the previous book and marked `≈`.

## Pages

| Route      | What                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| `/`        | Hero, era scale ruler, full eight-era timeline with inline film notes       |
| `/films/`  | Divergence ledger: counts by kind, one table per film                       |
| `/characters/` and `/characters/<id>/` | 26 people: portrait, factions, arc by era, every event, film casting note, who they share events with |
| `/factions/` and `/factions/<id>/` | 13 powers: weight per era, members, which other factions they collide with, every event |
| `/web/`    | Intersections: lifelines, powers by era heatmap, allegiance matrix, collisions heatmap |
| `/family/` | Atreides family tree across all six novels, with film differences flagged    |
| `/beyond/` | Later novels by Brian Herbert and Kevin J. Anderson, a ledger of every retcon against Frank Herbert's text, and the other screen versions |
| `/map/`    | Star map of the Imperium: worlds, what happens on each, by era              |
| `/scale/`  | Every event placed by its year: true scale, zoom on Dune, Paul's lifetime, inside the novel, Leto II to the end |
| `/glossary/` | 109 terms; the same definitions appear on hover wherever a term is used in the text |
| `/guide/`  | What to read and watch, in which order, and what each adaptation covers      |
| `/events/<id>/` | One page per event (canon and later books), with a share button and preview image |
| `/og/<id>.png`, `/og/site.png` | 1200x630 pixel-art share cards drawn at build time; past Dune, the card hides the title |
| `/search/` | Client-side search over every event, person and faction (index embedded at build; `/` opens it) |
| `/about/`  | Canon, dating method, build commands                                        |
| `/404.html`| Served by Cloudflare for unknown paths                                      |

The timeline has two CSS-only toggles (they work with JavaScript off, via `:has()`):
**show film notes** and **only what the films touch**. JavaScript adds the theme and art switches, the spoiler shield, search and sharing.

## Layout

```
flake.nix, nix/         Nix (flake-parts): package, devenv shell, checks, treefmt, deploy app
wrangler.jsonc          Cloudflare Workers static-assets config (free tier)
tests/                  unit/ (Vitest), bombadil/ (browser properties), e2e/serve.mjs (local server with _headers)
astro.config.mjs        static output, directory URLs, trailing slashes
src/data/timeline.ts    eras, events, film notes
src/data/cast.ts        characters, factions, and the event → people/factions tags
src/data/query.ts       derived views (events per person, companions, faction links)
src/data/family.ts      family tree nodes, unions and descent lines (hand-placed layout)
src/data/search.ts      builds the search index embedded in /search/
src/data/beyond.ts      later books and other screen versions (secondary tiers; types in beyond-types.ts, joins in beyond-view.ts)
src/data/sprites.ts     pixel sprites as character grids (palette chars → CSS vars)
src/components/         Sprite (grid → merged-run SVG), Dunes (seeded landscape), EventCard, Avatar (procedural portrait)
src/layouts/Base.astro  shell, nav, theme switch, footer
src/scripts/            the site's JavaScript (bundled by Astro; no inline scripts)
src/pages/              index, films, about, 404, web, family, search, characters/, factions/
src/styles/global.css   tokens (dark = Arrakis night, light = Arrakis day), all styling
public/                 favicon, robots.txt, _headers, assets/js/boot.js
```

Design notes:

- **Pixel art is generated, not drawn as images.** Sprites are character grids rendered to SVG
  at build time; each colour is a CSS variable, so every sprite re-themes for day and night.
  The dune landscape uses a seeded PRNG, so builds are byte-identical (good for Nix).
- **Fonts are self-hosted** through `@fontsource` (Silkscreen for headings, VT323 for labels,
  IBM Plex Mono for body). No third-party requests at runtime.
- **Motion** (worm rising, ornithopter, twinkling stars) is CSS `steps()` animation and is
  switched off under `prefers-reduced-motion`.

## Build and test

The repo is set up the same way as akl.run: a flake-parts flake with a devenv shell, treefmt
(prettier and nixfmt), Vitest unit tests, Bombadil browser properties and a GitHub Actions job that
runs them all.

```sh
nix develop --impure        # node 24, npm install, treefmt pre-commit hook (or: direnv allow)
npm run dev                 # http://localhost:4321
npm run build               # static site in dist/
npm test                    # Vitest: data cross-references, _headers and robots.txt
npm run check               # astro check (type errors fail it)
npm run test:bombadil       # Bombadil clicks, types and resizes across the built site
nix build                   # the same site, reproducibly, in ./result
nix flake check --impure    # build, astro-check, unit, csp-output and treefmt
nix fmt                     # format everything treefmt owns
```

The flake uses `importNpmLock`, which reads `package-lock.json` directly. There is no
`npmDepsHash` to update when dependencies change: run `npm install`, commit the lockfile, rebuild.

Bombadil needs Chromium: it uses `$CHROME`, or builds `nixpkgs#chromium` once and caches the
path in `tmp/`. On a failure it leaves a trace in `tmp/bombadil-*/trace.bin`; CI uploads it.

## Deploy (Cloudflare Workers static assets, free tier)

**Workers Builds** deploys every push to `main`: build command `npm ci && npm run build`, deploy
command `npx wrangler deploy`. `wrangler.jsonc` names the Worker, the `dist` assets folder and the
`dune.akl.run` custom domain (the `akl.run` zone is in the same Cloudflare account).

**From a workstation:** `nix build && nix run .#deploy`, with `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` set. On `main` it deploys production; on any other branch it uploads a
preview version under the branch name. This is the same deploy app as akl.run's.

The site URL is `https://dune.akl.run`, set in `astro.config.mjs` (overridable with `SITE_URL`).

### Security headers, indexing

`public/_headers` sets HSTS and a strict Content-Security-Policy with `script-src 'self'`: there
are no inline scripts or inline event handlers. `public/assets/js/boot.js` sets the theme, art
style and spoiler level before first paint (linked with a `?v=` content hash through
`src/lib/asset.ts`); everything else is in `src/scripts/` and bundled by Astro. The `csp-output`
flake check fails the build if an inline script or handler comes back. Styles still allow
`'unsafe-inline'`, because the family tree, map and web views position and colour elements with
`style` attributes. Nothing loads from another origin.

`public/robots.txt` lets search engines index the site, asks known AI-training crawlers
(GPTBot, ClaudeBot, CCBot, Google-Extended and others) to stay out, and points to the sitemap
that `@astrojs/sitemap` writes.

## Credits and licence

Code: MIT (`LICENSE`). Original writing and pixel art: CC BY-NC 4.0 (`LICENSE-CONTENT.md`). Dune
belongs to its owners; the full credits are on the about page and in `LICENSE-CONTENT.md`.

## Editing content

Each event in `src/data/timeline.ts` has a `book` tag, an optional `approx` flag, and an
optional `films` array of `{ film, kind, text }`. The films page and all counts are derived from
that file, so nothing else needs changing.
