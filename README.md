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
**show film notes** and **only what the films touch**. The only JavaScript on the site is ~10
lines for the day/night theme switch, which defaults to the system setting.

## Layout

```
flake.nix               Nix: package (static site), devShell, deploy app
wrangler.toml           Cloudflare Workers static-assets config (free tier)
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
src/pages/              index, films, about, 404, web, family, search, characters/, factions/
src/styles/global.css   tokens (dark = Arrakis night, light = Arrakis day), all styling
public/                 favicon, robots.txt, _headers (immutable caching for hashed assets)
```

Design notes:

- **Pixel art is generated, not drawn as images.** Sprites are character grids rendered to SVG
  at build time; each colour is a CSS variable, so every sprite re-themes for day and night.
  The dune landscape uses a seeded PRNG, so builds are byte-identical (good for Nix).
- **Fonts are self-hosted** through `@fontsource` (Silkscreen for headings, VT323 for labels,
  IBM Plex Mono for body). No third-party requests at runtime.
- **Motion** (worm rising, ornithopter, twinkling stars) is CSS `steps()` animation and is
  switched off under `prefers-reduced-motion`.

## Build

```sh
nix develop                 # node 22 + wrangler
npm ci && npm run dev       # http://localhost:4321
nix build                   # reproducible static site in ./result
```

The flake uses `importNpmLock`, which reads `package-lock.json` directly. There is no
`npmDepsHash` to update when dependencies change: run `npm install`, commit the lockfile, rebuild.

## Deploy to Cloudflare (free tier)

Either target is free for a static site.

**Workers static assets (recommended):**

```sh
npx wrangler login          # once
nix run .#deploy            # builds via Nix, then `wrangler deploy`
```

**Pages:** `npm run build && npx wrangler pages deploy dist --project-name dune-akl-run`, or
connect the repo in the dashboard with build command `npm run build` and output `dist`.

The site URL is `https://dune.akl.run`, set in `astro.config.mjs` (overridable with `SITE_URL`)
and in `flake.nix`. `wrangler.toml` attaches the `dune.akl.run` custom domain, which needs the
`akl.run` zone in the same Cloudflare account.

**Workers Builds (deploy on push):** in the Cloudflare dashboard, create a Worker from this
repository with build command `npm ci && npm run build` and deploy command `npx wrangler deploy`.
`wrangler.toml` already names the Worker, the `dist` assets folder and the custom domain.

### Security headers, indexing

`public/_headers` sets HSTS and a strict Content-Security-Policy. Inline scripts are allowed by
SHA-256 hash only: `integrations/csp.mjs` hashes every inline script after the build and writes the
hashes into `dist/_headers` in place of `__SCRIPT_HASHES__`, so editing a script needs no manual step.
Styles allow `'unsafe-inline'` because components use `style` attributes. Nothing loads from another
origin.

`public/robots.txt` lets search engines index the site and asks known AI-training crawlers
(GPTBot, ClaudeBot, CCBot, Google-Extended and others) to stay out.

## Credits and licence

Code: MIT (`LICENSE`). Original writing and pixel art: CC BY-NC 4.0 (`LICENSE-CONTENT.md`). Dune
belongs to its owners; the full credits are on the about page and in `LICENSE-CONTENT.md`.

## Editing content

Each event in `src/data/timeline.ts` has a `book` tag, an optional `approx` flag, and an
optional `films` array of `{ film, kind, text }`. The films page and all counts are derived from
that file, so nothing else needs changing.
