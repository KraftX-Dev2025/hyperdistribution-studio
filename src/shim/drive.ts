/**
 * Google Drive for the board's ☁️ Drive sync, signed in with the user's own
 * Google account (Google Identity Services token flow, drive.file scope: the
 * app only sees files it created). Takes the same tool names and inputs the
 * board uses with the Google Drive MCP server.
 */
const CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || "";
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const API = "https://www.googleapis.com/drive/v3";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink";
const FLAG = "hm:drive-on";

type TokenClient = { requestAccessToken: (o?: { prompt?: string }) => void; callback: (r: { access_token?: string; expires_in?: number; error?: string }) => void };
type Gis = { accounts: { oauth2: { initTokenClient: (o: Record<string, unknown>) => TokenClient; revoke: (t: string, cb?: () => void) => void } } };

let token = "", expires = 0, client: TokenClient | null = null;
const err = (code: string, message: string) => Object.assign(new Error(message), { code });

export const driveAvailable = () => !!CLIENT_ID;
export const driveConnected = () => { try { return localStorage.getItem(FLAG) === "1"; } catch { return false; } };

function loadGis(): Promise<Gis> {
  const w = window as unknown as { google?: Gis };
  if (w.google?.accounts?.oauth2) return Promise.resolve(w.google);
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.onload = () => (w.google ? res(w.google) : rej(new Error("Google sign-in didn't load")));
    s.onerror = () => rej(new Error("Google sign-in didn't load"));
    document.head.appendChild(s);
  });
}

/** Gets an access token; interactive=true may open Google's consent popup. */
async function getToken(interactive: boolean): Promise<string> {
  if (token && Date.now() < expires - 60_000) return token;
  if (!CLIENT_ID) throw err("server_not_connected", "Google Drive isn't set up on this site yet.");
  if (!interactive && !driveConnected()) throw err("server_not_connected", "Connect Google Drive in Settings → Connectors.");
  const gis = await loadGis();
  return new Promise((res, rej) => {
    client = gis.accounts.oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPE, callback: () => {} });
    client.callback = (r) => {
      if (!r.access_token) return rej(err(r.error === "access_denied" ? "not_granted" : "needs_reauth", "Google Drive sign-in didn't finish."));
      token = r.access_token;
      expires = Date.now() + (r.expires_in || 3600) * 1000;
      try { localStorage.setItem(FLAG, "1"); } catch { /* private mode */ }
      res(token);
    };
    client.requestAccessToken({ prompt: interactive ? "consent" : "" });
  });
}

export async function connectDrive() { await getToken(true); }
export async function disconnectDrive() {
  try { localStorage.removeItem(FLAG); } catch { /* private mode */ }
  if (token) { const gis = await loadGis().catch(() => null); gis?.accounts.oauth2.revoke(token); }
  token = ""; expires = 0;
}

async function api(path: string, init: RequestInit = {}) {
  const t = await getToken(false);
  const res = await fetch(path.startsWith("http") ? path : API + path, { ...init, headers: { authorization: `Bearer ${t}`, ...(init.headers || {}) } });
  if (res.status === 401) { token = ""; throw err("needs_reauth", "Google Drive sign-in expired. Reconnect it in Settings → Connectors."); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw err(res.status === 404 ? "tool_error" : "upstream_error", data?.error?.message || `Drive error ${res.status}`);
  return data;
}

/** The board's search syntax (title = 'x' and parentId = 'y' …) in Drive's own query language. */
const toQ = (q: string) => q.replace(/\btitle\s*=/g, "name =").replace(/parentId\s*=\s*'([^']*)'/g, "'$1' in parents");

const GOOGLE_TYPE: Record<string, string> = {
  "text/csv": "application/vnd.google-apps.spreadsheet",
  "text/plain": "application/vnd.google-apps.document",
  "text/markdown": "application/vnd.google-apps.document",
  "text/html": "application/vnd.google-apps.document",
};

function b64ToBytes(b64: string) {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

type In = Record<string, unknown>;
export async function driveTool(name: string, input: In) {
  if (name === "get_file_metadata") return api(`/files/${encodeURIComponent(String(input.fileId || "x"))}?fields=id,name,trashed,webViewLink`);
  if (name === "search_files") {
    const q = new URLSearchParams({ q: toQ(String(input.query || "")), pageSize: String(input.pageSize || 10), fields: "files(id,name,webViewLink)" });
    return api(`/files?${q}`);
  }
  if (name === "trash_file") return api(`/files/${encodeURIComponent(String(input.fileId))}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ trashed: true }) });
  if (name === "create_file") {
    const mime = String(input.contentMimeType || "application/octet-stream");
    const meta: In = { name: input.title, parents: [input.parentId === "root" || !input.parentId ? "root" : input.parentId] };
    if (mime === "application/vnd.google-apps.folder") {
      meta.mimeType = mime;
      const f = await api("/files?fields=id,webViewLink", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(meta) });
      return { id: f.id, viewUrl: f.webViewLink };
    }
    if (!input.disableConversionToGoogleType && GOOGLE_TYPE[mime]) meta.mimeType = GOOGLE_TYPE[mime];
    const body = input.textContent != null ? new Blob([String(input.textContent)], { type: mime }) : new Blob([b64ToBytes(String(input.base64Content || ""))], { type: mime });
    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(meta)], { type: "application/json" }));
    form.append("file", body);
    const f = await api(UPLOAD, { method: "POST", body: form });
    return { id: f.id, viewUrl: f.webViewLink };
  }
  throw err("unknown_tool", name);
}
