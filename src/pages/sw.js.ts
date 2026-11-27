// The service worker behind offline reading. After a first visit it quietly saves every page and
// every file those pages load, so the site works with no signal. Pages are fetched fresh when online
// and fall back to the saved copy when not. The list of what to save, and the version, are filled in
// after the build by src/build/offline.mjs, from the build output itself. A deploy that changes any
// listed file gets a new version, which refreshes the saved copy.
import type { APIRoute } from "astro";

const worker = `"use strict";
const CACHE = "dune-__VERSION__";
const FILES = "__PRECACHE__";
const SAME = (u) => new URL(u, self.location.origin).origin === self.location.origin;

async function saveAll() {
  if (!Array.isArray(FILES)) return; // dev server: nothing to save
  if (self.navigator.connection && self.navigator.connection.saveData) return;
  const cache = await caches.open(CACHE);
  const todo = [...FILES];
  const one = async () => {
    for (let u; (u = todo.shift()) !== undefined; ) {
      try {
        if (await cache.match(u)) continue;
        const res = await fetch(u, { cache: "no-cache" });
        if (res.ok && !res.redirected) await cache.put(u, res);
      } catch {}
    }
  };
  await Promise.all(Array.from({ length: 6 }, one));
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
  new Response(worker, { headers: { "Content-Type": "text/javascript; charset=utf-8" } });
