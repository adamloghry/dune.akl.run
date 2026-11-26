// The service worker behind offline reading. After a first visit it quietly saves every page in the
// sitemap, with the styles, scripts and pictures those pages use, so the site works with no signal.
// Pages are fetched fresh when online and fall back to the saved copy when not. Each build gets a
// new version, so a deploy refreshes the saved copy.
import type { APIRoute } from "astro";

const version = new Date().toISOString();

const worker = (v: string) => `"use strict";
const CACHE = "dune-${v}";
const SAME = (u) => new URL(u, self.location.origin).origin === self.location.origin;

async function saveAll() {
  if (self.navigator.connection && self.navigator.connection.saveData) return;
  const cache = await caches.open(CACHE);
  const idx = await fetch("/sitemap-0.xml").then((r) => (r.ok ? r.text() : ""));
  const pages = [...idx.matchAll(/<loc>([^<]+)<\\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const assets = new Set();
  for (const p of ["/", ...pages]) {
    try {
      const res = await fetch(p);
      if (!res.ok || res.redirected) continue;
      const html = await res.clone().text();
      await cache.put(p, res);
      for (const m of html.matchAll(/(?:src|href)="(\\/(?:_astro|assets|art|og)\\/[^"#?]+)"/g)) assets.add(m[1]);
    } catch {}
  }
  assets.add("/favicon.svg");
  for (const a of assets) {
    if (await cache.match(a)) continue;
    try {
      const res = await fetch(a);
      if (!res.ok) continue;
      if (a.endsWith(".css"))
        for (const m of (await res.clone().text()).matchAll(/url\\((\\/_astro\\/[^)"']+)\\)/g)) assets.add(m[1]);
      await cache.put(a, res);
    } catch {}
  }
}

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
      await self.clients.claim();
      await saveAll();
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || !SAME(req.url)) return;
  const url = new URL(req.url);
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(url.pathname, res.clone()));
          return res;
        })
        .catch(async () => (await caches.match(url.pathname)) || (await caches.match("/404.html")) || Response.error()),
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok && /^\\/(_astro|assets|art|og)\\//.test(url.pathname))
            caches.open(CACHE).then((c) => c.put(req, res.clone()));
          return res;
        }),
    ),
  );
});
`;

export const GET: APIRoute = () =>
  new Response(worker(version), { headers: { "Content-Type": "text/javascript; charset=utf-8" } });
