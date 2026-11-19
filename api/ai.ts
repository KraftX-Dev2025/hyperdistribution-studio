import Anthropic from "@anthropic-ai/sdk";

export const config = { maxDuration: 300 };

const MODEL = process.env.HDS_MODEL || "claude-opus-5-5";

type Img = "image/jpeg" | "image/png" | "image/webp" | "image/gif";
const IMG_TYPES: string[] = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const SYSTEM =
  "You are the planning and writing engine of a content studio. The user message describes the task and the exact JSON shape to return. Reply with only that JSON: no prose before or after, no code fences.";

function keyFor(req: Request) {
  const user = req.headers.get("x-anthropic-key")?.trim();
  if (user) return user;
  // Self-hosters can pay for everyone by setting ANTHROPIC_API_KEY and HDS_SHARED_KEY=true.
  if (process.env.HDS_SHARED_KEY === "true" && process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  return null;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

/** Pulls the JSON value out of a reply, tolerating stray prose or code fences. */
function parseJson(text: string): unknown {
  const t = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  try {
    return JSON.parse(t);
  } catch {
    /* fall through */
  }
  const start = t.search(/[[{]/);
  const end = Math.max(t.lastIndexOf("]"), t.lastIndexOf("}"));
  if (start >= 0 && end > start) return JSON.parse(t.slice(start, end + 1));
  throw new SyntaxError("no JSON");
}

/** One generic endpoint: the page sends a prompt (plus optional images) and gets JSON back. */
export async function POST(req: Request) {
  const apiKey = keyFor(req);
  if (!apiKey) return json({ error: "Add your Claude API key in Settings.", code: "no_key" }, 401);

  let body: { prompt?: unknown; images?: { media_type: Img; data: string }[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad JSON" }, 400);
  }
  const prompt = typeof body.prompt === "string" ? body.prompt.slice(0, 200_000) : "";
  if (!prompt) return json({ error: "Empty prompt" }, 400);
  const images = (Array.isArray(body.images) ? body.images : [])
    .slice(0, 5)
    .filter((i) => !!i && IMG_TYPES.includes(i.media_type) && typeof i.data === "string");

  const client = new Anthropic({ apiKey });
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            ...images.map((i) => ({ type: "image" as const, source: { type: "base64" as const, media_type: i.media_type, data: i.data } })),
            { type: "text" as const, text: prompt },
          ],
        },
      ],
    });
    if (response.stop_reason === "refusal") return json({ error: "Claude declined this request. Try rewording it.", code: "refused" }, 422);
    if (response.stop_reason === "max_tokens") return json({ error: "The answer was too long. Try a smaller request." }, 422);
    const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
    return json({ result: parseJson(text) });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return json({ error: "That API key was rejected. Check it in Settings.", code: "bad_key" }, 401);
    if (err instanceof Anthropic.RateLimitError) return json({ error: "Rate limited by Anthropic. Wait a moment and retry.", code: "rate_limited" }, 429);
    if (err instanceof Anthropic.APIError) return json({ error: `Claude API error ${err.status ?? ""}: ${err.message}` }, 502);
    if (err instanceof SyntaxError) return json({ error: "Claude returned something unreadable. Try again." }, 502);
    return json({ error: "Something went wrong talking to Claude." }, 500);
  }
}
