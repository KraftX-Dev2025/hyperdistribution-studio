// Serves files the app stored in Cache Storage at /_blob/<id>, with range support for video.
const CACHE = "hds-assets";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin || !url.pathname.startsWith("/_blob/")) return;
  event.respondWith(
    (async () => {
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
    })(),
  );
});
