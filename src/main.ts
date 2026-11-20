/**
 * Boots the board: provides the services it expects from its host
 * (database, Claude, uploads, link reading), then loads the board script.
 */
import { db, docsOf } from "./shim/db";
import { assets, registerWorker } from "./shim/assets";
import { sample, mcp, openSettings } from "./shim/services";
import { folder } from "./shim/folder";
import { startRenderer } from "./shim/render";
import { saveFile, setupNative } from "./shim/native";


// Saving files: a download on the web, the share sheet in the apps.
const downloads = {
  async save({ filename, data }: { filename: string; data: Blob | ArrayBuffer | Uint8Array | string }) {
    const blob = data instanceof Blob ? data : new Blob([data as BlobPart]);
    await saveFile(blob, filename);
  },
};
const services: Record<string, unknown> = { db, sample, assets, mcp, downloads };
(window as unknown as { claude: unknown }).claude = { use: async (name: string) => services[name] ?? null };
(window as unknown as { __hds: unknown }).__hds = { folderNote: () => folder.note(), settings: () => openSettings() };

// Folder buttons live inside the board's panels.
document.addEventListener("click", async (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>("[data-hdsfolder]");
  if (!b) return;
  try {
    if (b.dataset.hdsfolder === "disconnect") await folder.disconnect();
    else await folder.connect();
  } catch (err) {
    if ((err as Error).name !== "AbortError") (window as unknown as { toast: (m: string) => void }).toast?.("Couldn't open that folder");
  }
});
// Keep any open media panel in step with the folder.
window.addEventListener("hds:folder", () => {
  document.querySelectorAll<HTMLElement>("#panel .muted").forEach((el) => {
    if (el.querySelector("[data-hdsfolder]")) el.innerHTML = folder.note();
  });
  document.getElementById("mSearch")?.dispatchEvent(new Event("input"));
});

// Backups.
const COLS = ["brands", "posts", "dumps", "renders", "subs", "styles", "analyses", "kits", "setups", "campaigns", "messages"];
window.addEventListener("hds:export", async () => {
  const out: Record<string, unknown[]> = {};
  for (const c of COLS) out[c] = await docsOf(c);
  out.media = (await docsOf("media")).filter((m) => (m as { source?: string }).source !== "folder");
  const blob = new Blob([JSON.stringify({ app: "hypermixer", version: 1, ...out }, null, 2)], { type: "application/json" });
  await saveFile(blob, `hypermixer-backup-${new Date().toISOString().slice(0, 10)}.json`);
});
window.addEventListener("hds:import", async (e) => {
  const toast = (window as unknown as { toast: (m: string) => void }).toast;
  try {
    const data = JSON.parse(await ((e as CustomEvent).detail as File).text());
    if (data.app !== "hypermixer" && data.app !== "hyperdistribution-studio") throw new Error();
    let n = 0;
    for (const c of [...COLS, "media"]) for (const d of data[c] ?? []) { const { id, ...rest } = d; await db.collection(c).doc(id).set(rest); n++; }
    toast?.(`Imported ${n} items`);
  } catch {
    toast?.("That file isn't a HyperMixer backup");
  }
});

(async () => {
  setupNative();
  await registerWorker();
  const s = document.createElement("script");
  s.src = "/legacy/app.js";
  s.onload = () => {
    startRenderer();
    folder.restore();
  };
  document.body.appendChild(s);
})();
