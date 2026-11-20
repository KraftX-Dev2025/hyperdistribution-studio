/**
 * The iOS and Android apps load HyperMixer from inside the app
 * (capacitor://localhost on iOS, https://localhost on Android) and call these
 * functions on the hosted site, so they need CORS. Browsers on the site itself
 * are same-origin and don't.
 */
const APP_ORIGINS = new Set(["capacitor://localhost", "https://localhost", "http://localhost"]);

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  if (!APP_ORIGINS.has(origin)) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type, x-anthropic-key",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

export const preflight = (req: Request) => new Response(null, { status: 204, headers: corsHeaders(req) });

export async function withCors(req: Request, handle: (req: Request) => Promise<Response>) {
  const res = await handle(req);
  for (const [k, v] of Object.entries(corsHeaders(req))) res.headers.set(k, v);
  return res;
}
