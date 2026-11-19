import Anthropic from "@anthropic-ai/sdk";
import { readLink } from "./_lib/readLink.js";
import { TASKS, type TaskName } from "./_lib/tasks.js";

export const config = { maxDuration: 120 };

const MODEL = process.env.HDS_MODEL || "claude-opus-5-5";

function keyFor(req: Request) {
  const user = req.headers.get("x-anthropic-key")?.trim();
  if (user) return user;
  // Self-hosters can pay for everyone by setting ANTHROPIC_API_KEY and HDS_SHARED_KEY=true.
  if (process.env.HDS_SHARED_KEY === "true" && process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  return null;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export async function POST(req: Request) {
  const apiKey = keyFor(req);
  if (!apiKey) return json({ error: "Add your Anthropic API key in Settings." }, 401);

  let body: { task?: string; input?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad JSON" }, 400);
  }
  const task = TASKS[body.task as TaskName];
  if (!task) return json({ error: "Unknown task" }, 400);
  const input = body.input ?? {};

  // Brand brains read the brand's links on the server, so the browser doesn't hit CORS walls.
  let linkStatus: Record<string, "read" | "failed"> | undefined;
  if (body.task === "brain" && Array.isArray(input.links)) {
    linkStatus = {};
    const pages = await Promise.all(
      (input.links as string[]).slice(0, 12).map(async (url) => {
        try {
          const text = await readLink(url);
          linkStatus![url] = "read";
          return { url, text };
        } catch {
          linkStatus![url] = "failed";
          return { url, text: "" };
        }
      }),
    );
    input.pages = pages.filter((p) => p.text);
  }

  const client = new Anthropic({ apiKey });
  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: task.effort, format: { type: "json_schema", schema: task.schema } },
      system: task.system,
      messages: [{ role: "user", content: task.content(input) }],
    });
    if (response.stop_reason === "refusal") return json({ error: "Claude declined this request. Try rewording it." }, 422);
    if (response.stop_reason === "max_tokens") return json({ error: "The answer was too long. Try a smaller request." }, 422);
    const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
    return json({ result: JSON.parse(text), linkStatus });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return json({ error: "That API key was rejected. Check it in Settings." }, 401);
    if (err instanceof Anthropic.RateLimitError) return json({ error: "Rate limited by Anthropic. Wait a moment and retry." }, 429);
    if (err instanceof Anthropic.APIError) return json({ error: `Claude API error ${err.status ?? ""}: ${err.message}` }, 502);
    if (err instanceof SyntaxError) return json({ error: "Claude returned something unreadable. Try again." }, 502);
    return json({ error: "Something went wrong talking to Claude." }, 500);
  }
}
