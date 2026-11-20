import { readLink } from "./_lib/readLink.js";
import { preflight, withCors } from "./_lib/cors.js";

export const config = { maxDuration: 30 };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export const OPTIONS = preflight;
export const POST = (req: Request) => withCors(req, handle);

/** Reads a public web page as text, so brand brains can learn from a brand's links. */
async function handle(req: Request): Promise<Response> {
  let url = "";
  try {
    url = String((await req.json()).url || "");
  } catch {
    return json({ error: "Bad JSON" }, 400);
  }
  if (!url) return json({ error: "No url" }, 400);
  try {
    const text = await readLink(url);
    return json({ text });
  } catch (e) {
    return json({ error: (e as Error).message || "Couldn't read that page" }, 422);
  }
}
