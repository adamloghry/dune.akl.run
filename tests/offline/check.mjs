// Offline check of a built site: fails if any page, or any file a page loads, is missing from the
// list that sw.js saves for offline reading. Run after a build: node tests/offline/check.mjs [dist]
//
// This deliberately does not reuse src/build/offline.mjs. It casts a wider net (every quoted
// "/path" and url(/path) in every page, stylesheet and script) and compares the exact URL,
// query included, because the worker's saved copy is looked up by the exact URL the page asks for.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const dist = path.resolve(process.argv[2] ?? "dist");
const fail = (msg) => {
  console.error(`offline check: ${msg}`);
  process.exitCode = 1;
};

const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = path.join(d, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(dist);
const urlOf = (f) => {
  const u = "/" + path.relative(dist, f).split(path.sep).join("/");
  return u.endsWith("/index.html") ? u.slice(0, -10) : u;
};

const sw = readFileSync(path.join(dist, "sw.js"), "utf8");
if (sw.includes("__PRECACHE__") || sw.includes("__VERSION__"))
  fail("sw.js was not filled in after the build");
const listed = sw.match(/const FILES = (\[.*?\]);/s);
if (!listed) {
  fail("sw.js has no FILES list");
  process.exit();
}
const saved = new Set(JSON.parse(listed[1]));

// Every page must be saved.
for (const f of files.filter((f) => f.endsWith(".html")))
  if (!saved.has(urlOf(f))) fail(`page ${urlOf(f)} is not saved`);

// Every saved URL must exist in the build.
for (const u of saved) {
  const p = u.split("?")[0];
  const f = path.join(dist, p.endsWith("/") ? p + "index.html" : p);
  if (!existsSync(f)) fail(`sw.js saves ${u}, which is not in the build`);
}

// Every file that a page, stylesheet or script points at must be saved under the exact URL used.
const exists = (p) => existsSync(path.join(dist, p)) && statSync(path.join(dist, p)).isFile();
let checked = 0;
for (const f of files.filter((f) => /\.(html|css|js)$/.test(f) && !f.endsWith(`${path.sep}sw.js`))) {
  const text = readFileSync(f, "utf8").replace(/&amp;/g, "&");
  const base = urlOf(f);
  const refs = [
    ...[...text.matchAll(/["'(=]\s*(\/(?!\/)[^"'()\s<>#]*)/g)].map((m) => m[1]),
    ...[...text.matchAll(/["'](\.{1,2}\/[^"'\s]+\.(?:js|css))["']/g)].map(
      (m) => new URL(m[1], "https://x" + base).pathname,
    ),
  ];
  for (const ref of refs) {
    const p = ref.split("?")[0];
    if (p === "/sw.js" || p.endsWith("/") || p.endsWith(".html") || !exists(p)) continue;
    checked++;
    if (!saved.has(ref)) fail(`${base} loads ${ref}, which is not saved for offline reading`);
  }
}
if (!process.exitCode)
  console.log(`offline check: ${saved.size} URLs saved; ${checked} references checked, none missing`);
