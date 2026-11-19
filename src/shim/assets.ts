/**
 * Uploaded files (logos, dump images, rendered videos) are kept in the browser's
 * Cache Storage and served at /_blob/<id> by the service worker in public/sw.js,
 * so their URLs survive reloads.
 */
const CACHE = "hds-assets";

export async function putAsset(blob: Blob, ext = ""): Promise<{ id: string; url: string }> {
  const id = crypto.randomUUID().replace(/-/g, "") + ext;
  const url = `/_blob/${id}`;
  const cache = await caches.open(CACHE);
  await cache.put(url, new Response(blob, { headers: { "content-type": blob.type || "application/octet-stream", "content-length": String(blob.size) } }));
  return { id, url };
}

export const assets = {
  async upload(file: File) {
    if (file.size > 500 * 1024 * 1024) throw Object.assign(new Error("too large"), { code: "too_large" });
    const ext = (file.name.match(/\.[a-z0-9]{1,5}$/i)?.[0] ?? "").toLowerCase();
    return putAsset(file, ext);
  },
};

export async function registerWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
  } catch (e) {
    console.warn("Service worker unavailable; uploaded files won't survive a reload.", e);
  }
}
