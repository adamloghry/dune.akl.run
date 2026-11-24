# The Golden Path

Home: **https://dune.akl.run** (Cloudflare Workers static assets, not deployed yet).

A pixel-art chronicle of the in-universe history of Frank Herbert's Dune, from the Zensunni
schism (1381 B.G.) to the last page of Chapterhouse: Dune (≈15,230 A.G.). The books are the
record; every place where Denis Villeneuve's Dune (2021) and Dune: Part Two (2024) diverge is
marked inline as KEPT, CHANGED, CUT or ADDED, and collected on a separate ledger page.

This README is the authority for the handoff.

## Scope

- **Canon:** Frank Herbert's six novels plus the appendices and glossary printed with Dune.
  Nothing from Brian Herbert and Kevin J. Anderson.
- **Films:** Villeneuve's two released films only. No Lynch (1984), no Sci-Fi Channel
  miniseries, no Prophecy series. The upcoming Messiah film is out of scope until it exists.
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
src/data/sprites.ts     pixel sprites as character grids (palette chars → CSS vars)
src/components/         Sprite (grid → merged-run SVG), Dunes (seeded landscape), EventCard, Avatar (procedural portrait)
src/layouts/Base.astro  shell, nav, theme switch, footer
src/pages/              index, films, about, 404, web, characters/, factions/
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

## Editing content

Each event in `src/data/timeline.ts` has a `book` tag, an optional `approx` flag, and an
optional `films` array of `{ film, kind, text }`. The films page and all counts are derived from
that file, so nothing else needs changing.
