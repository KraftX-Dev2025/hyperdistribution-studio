export const config = { maxDuration: 30 };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

const BASE = "https://api.heygen.com";
type Input = Record<string, unknown>;

/**
 * HeyGen, with the user's own API key (sent per request in x-heygen-key, never stored).
 * Takes the same tool names and inputs the board uses with HeyGen's MCP server and
 * maps them to HeyGen's REST API.
 */
export async function POST(req: Request) {
  const key = req.headers.get("x-heygen-key") || "";
  if (!key) return json({ code: "server_not_connected", error: "Add your HeyGen API key in Settings → Connectors." }, 401);
  let tool = "", input: Input = {};
  try {
    const body = await req.json();
    tool = String(body.tool || "");
    input = (body.input as Input) || {};
  } catch {
    return json({ error: "Bad JSON" }, 400);
  }

  const call = async (path: string, init: RequestInit = {}) => {
    const res = await fetch(BASE + path, { ...init, headers: { "x-api-key": key, "content-type": "application/json", accept: "application/json", ...(init.headers || {}) } });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 403) throw Object.assign(new Error("HeyGen rejected the API key. Check it in Settings → Connectors."), { code: "needs_reauth", status: 401 });
    if (res.status === 429) throw Object.assign(new Error("HeyGen is busy. Try again in a minute."), { code: "rate_limited", status: 429 });
    if (!res.ok) {
      const msg = data?.error?.message || data?.message || `HeyGen error ${res.status}`;
      throw Object.assign(new Error(String(msg).slice(0, 300)), { code: "tool_error", status: 422 });
    }
    return data?.data ?? data;
  };

  try {
    if (tool === "list_avatar_looks") {
      const q = new URLSearchParams();
      if (input.ownership) q.set("ownership", String(input.ownership));
      q.set("limit", String(Math.min(50, Math.max(1, Number(input.limit) || 20))));
      const data = await call(`/v3/avatars/looks?${q}`);
      return json({ items: Array.isArray(data) ? data : data?.items ?? [] });
    }
    if (tool === "create_video_from_avatar") {
      const body: Input = { type: "avatar", avatar_id: input.avatarId, script: input.script, aspect_ratio: input.aspectRatio || "9:16" };
      if (input.voiceId) body.voice_id = input.voiceId;
      if (input.title) body.title = input.title;
      if (input.caption) body.caption = input.caption;
      return json(await call("/v3/videos", { method: "POST", body: JSON.stringify(body) }));
    }
    if (tool === "get_video") {
      const id = encodeURIComponent(String(input.videoId || ""));
      return json(await call(`/v3/videos/${id}`));
    }
    return json({ code: "unknown_tool", error: `Unknown HeyGen action: ${tool}` }, 400);
  } catch (e) {
    const err = e as Error & { code?: string; status?: number };
    return json({ code: err.code || "tool_error", error: err.message }, err.status || 502);
  }
}
