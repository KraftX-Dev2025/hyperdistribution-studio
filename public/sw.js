// HyperMixer service worker.
// 1. Serves files the app stored in Cache Storage at /_blob/<id>, with range support for video.
// 2. Keeps a copy of the app itself so the installed app opens offline (network first, cache as fallback).
const CACHE = "hds-assets";
const SHELL = "hypermixer-shell-v1";
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(["/", "/manifest.webmanifest", "/favicon.svg", "/legacy/app.js"]).catch(() => {})));
});
self.addEventListener("activate", (e) =>
  e.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (k.startsWith("hypermixer-shell-") && k !== SHELL) await caches.delete(k);
      await self.clients.claim();
    })(),
  ),
);

async function blob(event, url) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(url.pathname);
  if (!hit) return new Response("Not found", { status: 404 });
  const range = event.request.headers.get("range");
  if (!range) return hit;
  const buf = await hit.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const start = m && m[1] ? +m[1] : 0;
  const end = m && m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      "content-type": hit.headers.get("content-type") || "application/octet-stream",
      "content-range": `bytes ${start}-${end}/${buf.byteLength}`,
      "content-length": String(end - start + 1),
      "accept-ranges": "bytes",
    },
  });
}

async function shell(event) {
  const req = event.request;
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(req);
    if (res.ok && res.type === "basic") cache.put(req.mode === "navigate" ? "/" : req, res.clone());
    return res;
  } catch {
    return (await cache.match(req.mode === "navigate" ? "/" : req)) || Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin || event.request.method !== "GET") return;
  if (url.pathname.startsWith("/_blob/")) return event.respondWith(blob(event, url));
  if (url.pathname.startsWith("/api/")) return;
  if (event.request.headers.has("range")) return;
  event.respondWith(shell(event));
});
