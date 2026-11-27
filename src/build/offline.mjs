// Offline reading, part 2 of 2 (part 1 is src/pages/sw.js.ts, the service worker itself).
// After the build, this walks dist/ and lists every page plus every file those pages load, exactly
// as the pages ask for it (a ?v= query included, since the worker's cache keys must match), then
// writes that list into dist/sw.js. The list comes from the build output, so a new script, style,
// font or picture is saved for offline use without anyone touching this file.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PLACEHOLDER = '"__PRECACHE__"';
const VERSION_PLACEHOLDER = "__VERSION__";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** The URL a built HTML file is served at: dist/duncan/index.html -> /duncan/. */
export function pageUrl(dist, file) {
  const rel = "/" + path.relative(dist, file).split(path.sep).join("/");
  return rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel;
}

/** Same-origin paths a page, stylesheet or script refers to, resolved against `from`. */
export function references(text, from, kind) {
  const found = [];
  const add = (raw) => {
    const v = raw.trim().replace(/&amp;/g, "&");
    if (!v || v.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(v) || v.startsWith("#")) return;
    const u = new URL(v, "https://x" + from);
    found.push(u.pathname + u.search);
  };
  if (kind === "html") {
    for (const m of text.matchAll(/\s(?:src|href|poster)=["']?([^"'\s>]+)/g)) add(m[1]);
    for (const m of text.matchAll(/\ssrcset=["']([^"']+)["']/g))
      for (const part of m[1].split(",")) add(part.trim().split(/\s+/)[0]);
  }
  if (kind === "html" || kind === "css")
    for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) add(m[1]);
  if (kind === "js")
    for (const m of text.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)["'](\.{1,2}\/[^"']+)["']/g))
      add(m[1]);
  return found;
}

/**
 * Every URL the worker should save: all pages, and every file they load, followed through
 * stylesheets and scripts. Throws if a page refers to a file that is not in the build, since that
 * file would be missing online too.
 */
export function precacheList(dist) {
  const files = walk(dist);
  const pages = files.filter((f) => f.endsWith(".html")).map((f) => pageUrl(dist, f));
  const isPage = (u) => u.endsWith("/") || u.endsWith(".html");
  const assets = new Set();
  const missing = [];
  const queue = files
    .filter((f) => f.endsWith(".html"))
    .map((f) => [pageUrl(dist, f), readFileSync(f, "utf8"), "html"]);
  while (queue.length) {
    const [from, text, kind] = queue.shift();
    for (const ref of references(text, from, kind)) {
      if (isPage(ref.split("?")[0]) || assets.has(ref)) continue;
      const file = path.join(dist, decodeURIComponent(ref.split("?")[0]));
      if (!existsSync(file) || statSync(file).isDirectory()) {
        missing.push(`${from} -> ${ref}`);
        continue;
      }
      assets.add(ref);
      const ext = path.extname(file);
      if (ext === ".css" || ext === ".js") queue.push([ref, readFileSync(file, "utf8"), ext.slice(1)]);
    }
  }
  if (missing.length) throw new Error(`pages refer to files not in the build:\n  ${missing.join("\n  ")}`);
  return [...pages.sort(), ...[...assets].sort()];
}

/** A short hash of every listed file, so the saved copy is refreshed only when something changed. */
export function versionOf(dist, list) {
  const h = createHash("sha256");
  for (const u of list) {
    const p = u.split("?")[0];
    const file = path.join(dist, decodeURIComponent(p.endsWith("/") ? p + "index.html" : p));
    h.update(u).update(readFileSync(file));
  }
  return h.digest("hex").slice(0, 12);
}

/** Astro integration: fill in dist/sw.js once the whole site is built. */
export default function offline() {
  return {
    name: "offline-precache",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const sw = path.join(dist, "sw.js");
        const src = readFileSync(sw, "utf8");
        if (!src.includes(PLACEHOLDER)) throw new Error("sw.js has no precache placeholder");
        const list = precacheList(dist);
        writeFileSync(
          sw,
          src
            .replace(PLACEHOLDER, JSON.stringify(list))
            .replaceAll(VERSION_PLACEHOLDER, versionOf(dist, list)),
        );
        logger.info(`sw.js saves ${list.length} pages and files for offline reading`);
      },
    },
  };
}
