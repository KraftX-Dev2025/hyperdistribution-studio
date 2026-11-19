/** Claude, link reading and settings for the ported board. */

const KEY = "hds:anthropic-key";
const LICENSE = "hds:remotion-license";
const get = (k: string) => { try { return localStorage.getItem(k) ?? ""; } catch { return ""; } };
const put = (k: string, v: string) => { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch { /* private mode */ } };

export const settingsStore = {
  apiKey: () => get(KEY),
  license: () => get(LICENSE),
};

const err = (code: string, message: string) => Object.assign(new Error(message), { code });

async function toBase64(b: Blob): Promise<{ media_type: string; data: string } | null> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(b.type)) {
    // Re-encode anything else (SVG, HEIC…) to JPEG through a canvas.
    try {
      const bmp = await createImageBitmap(b);
      const c = new OffscreenCanvas(Math.min(1568, bmp.width), Math.round((Math.min(1568, bmp.width) / bmp.width) * bmp.height));
      c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
      b = await c.convertToBlob({ type: "image/jpeg", quality: 0.85 });
    } catch { return null; }
  }
  const buf = new Uint8Array(await b.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { media_type: b.type, data: btoa(s) };
}

export const sample = {
  async limits() {
    return { images: { maxCount: 4, maxInputBytes: 900_000 } };
  },
  async json(prompt: string, opts: { images?: Blob[] } = {}) {
    const key = settingsStore.apiKey();
    if (!key) {
      openSettings("Add your Claude API key to use the ✦ features.");
      throw err("no_key", "Add your Claude API key in Settings.");
    }
    const images = (await Promise.all((opts.images ?? []).slice(0, 4).map(toBase64))).filter(Boolean);
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json", "x-anthropic-key": key },
      body: JSON.stringify({ prompt, images }),
    });
    const data = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
    if (!res.ok) throw err(data.code || (res.status === 429 ? "rate_limited" : "error"), data.error || "Claude couldn't answer. Try again.");
    return data.result;
  },
};

/** Stands in for the desktop app's browser tool: "navigate" fetches the page on the server, "get_page_text" returns it. */
const pages = new Map<string, string>();
export const mcp = {
  async describeTool(_server: string, name: string) {
    return name === "get_page_text"
      ? { inputSchema: { required: ["tabId"], properties: { tabId: { type: "string" } } } }
      : { inputSchema: { required: ["url"], properties: { url: { type: "string" } } } };
  },
  async callTool(_server: string, name: string, input: { url?: string; tabId?: string }) {
    if (name === "navigate") {
      const res = await fetch("/api/read-link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: input.url }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.text) throw err("read_failed", data.error || "Couldn't read that page");
      const tabId = "t" + pages.size;
      pages.set(tabId, data.text);
      return { payload: { tabId }, content: [{ type: "text", text: `Opened tab id ${tabId}` }] };
    }
    if (name === "get_page_text") {
      const text = pages.get(String(input.tabId)) ?? "";
      pages.delete(String(input.tabId));
      return { content: [{ type: "text", text }] };
    }
    throw err("unknown_tool", name);
  },
};

type Win = Window & { openPanel?: (html: string, wide?: boolean) => void; closePanel?: () => void; toast?: (m: string) => void };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function openSettings(note = "") {
  const w = window as Win;
  if (!w.openPanel) return;
  w.openPanel(`<div class="panel-h"><h2>Settings</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
    ${note ? `<div class="banner">${esc(note)}</div>` : ""}
    <div class="form">
      <div class="field full"><label for="hds_key">Claude API key</label><input id="hds_key" type="password" autocomplete="off" placeholder="sk-ant-..." value="${esc(settingsStore.apiKey())}">
        <span class="muted" style="font-size:12px">Powers brand brains, plans, blasts and clip picking. Get one at <a href="https://platform.claude.com/settings/keys" target="_blank" rel="noopener">platform.claude.com</a>. It stays in this browser and is sent only with each request to this app's server, which passes it to Anthropic and never stores it.</span></div>
      <div class="field full"><label for="hds_lic">Remotion license</label><input id="hds_lic" placeholder="free-license" value="${esc(settingsStore.license())}">
        <span class="muted" style="font-size:12px">Videos render in your browser with <a href="https://www.remotion.dev" target="_blank" rel="noopener">Remotion</a>. It's free for individuals and companies of up to 3 people: type <code>free-license</code>. Larger companies need a <a href="https://www.remotion.dev/license" target="_blank" rel="noopener">company license</a> key.</span></div>
    </div>
    <div class="field"><span class="lbl">Your data</span><span class="muted" style="font-size:12px">Brands, posts, dumps and renders are saved in this browser only. Export a backup to move them to another computer.</span>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px"><button class="btn sm" id="hds_export">Export backup</button><label class="btn sm">Import backup<input type="file" id="hds_import" accept="application/json" hidden></label></div></div>
    <div class="panel-foot"><span></span><div class="actions"><button class="btn" data-close>Cancel</button><button class="btn primary" id="hds_save">Save</button></div></div>`);
  document.getElementById("hds_save")!.onclick = () => {
    put(KEY, (document.getElementById("hds_key") as HTMLInputElement).value.trim());
    put(LICENSE, (document.getElementById("hds_lic") as HTMLInputElement).value.trim());
    w.closePanel?.();
    w.toast?.("Settings saved");
  };
  document.getElementById("hds_export")!.onclick = () => window.dispatchEvent(new Event("hds:export"));
  (document.getElementById("hds_import") as HTMLInputElement).onchange = (e) => {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) window.dispatchEvent(new CustomEvent("hds:import", { detail: f }));
  };
}
