import { createStore, get, set } from "idb-keyval";
import { isNative } from "./platform";

/**
 * Uploaded files (logos, dump images, rendered videos) live at stable
 * /_blob/<id> URLs so they survive reloads.
 *
 * On the web they are kept in Cache Storage and served by the service worker in
 * public/sw.js. The iOS and Android apps have no service worker, so there the
 * files are kept in IndexedDB and every /_blob/ URL on the page is swapped for
 * an object URL as it appears (and fetch() of one is answered locally).
 */
const CACHE = "hds-assets";
const blobs = createStore("hypermixer-blobs", "files");
let useWorker = false;

export async function putAsset(blob: Blob, ext = ""): Promise<{ id: string; url: string }> {
  const id = crypto.randomUUID().replace(/-/g, "") + ext;
  const url = `/_blob/${id}`;
  if (useWorker) {
    const cache = await caches.open(CACHE);
    await cache.put(url, new Response(blob, { headers: { "content-type": blob.type || "application/octet-stream", "content-length": String(blob.size) } }));
  } else {
    await set(id, blob, blobs);
  }
  return { id, url };
}

export const assets = {
  async upload(file: File) {
    if (file.size > 500 * 1024 * 1024) throw Object.assign(new Error("too large"), { code: "too_large" });
    const ext = (file.name.match(/\.[a-z0-9]{1,5}$/i)?.[0] ?? "").toLowerCase();
    return putAsset(file, ext);
  },
};

// ---- Local resolver for apps without a service worker ----
const objectUrls = new Map<string, Promise<string | null>>();
const blobId = (u: string | null) => {
  if (!u) return null;
  const m = /(?:^|\/\/[^/]+)\/_blob\/([\w.-]+)$/.exec(u);
  return m ? m[1] : null;
};
function objectUrl(id: string) {
  if (!objectUrls.has(id)) objectUrls.set(id, get<Blob>(id, blobs).then((b) => (b ? URL.createObjectURL(b) : null)).catch(() => null));
  return objectUrls.get(id)!;
}
const ATTRS = ["src", "poster", "href"];
async function swap(el: Element) {
  for (const a of ATTRS) {
    const id = blobId(el.getAttribute(a));
    if (!id) continue;
    const url = await objectUrl(id);
    if (url) el.setAttribute(a, url);
  }
}
function startResolver() {
  const scan = (root: ParentNode) => root.querySelectorAll("[src*='/_blob/'],[poster*='/_blob/'],[href*='/_blob/']").forEach(swap);
  scan(document);
  new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "attributes") swap(m.target as Element);
      else m.addedNodes.forEach((n) => { if (n.nodeType === 1) { swap(n as Element); scan(n as Element); } });
    }
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ATTRS });
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const id = blobId(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    if (id) {
      const b = await get<Blob>(id, blobs).catch(() => undefined);
      return b ? new Response(b, { headers: { "content-type": b.type || "application/octet-stream" } }) : new Response("Not found", { status: 404 });
    }
    return realFetch(input, init);
  };
}

export async function registerWorker() {
  if (!isNative && "serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/sw.js");
      // ready never settles where workers are blocked (some private modes, policies), so don't wait forever.
      const ok = await Promise.race([navigator.serviceWorker.ready.then(() => true), new Promise<boolean>((r) => setTimeout(() => r(false), 4000))]);
      if (ok) { useWorker = true; return; }
      console.warn("Service worker didn't start; keeping uploads in IndexedDB instead.");
    } catch (e) {
      console.warn("Service worker unavailable; keeping uploads in IndexedDB instead.", e);
    }
  }
  startResolver();
}
