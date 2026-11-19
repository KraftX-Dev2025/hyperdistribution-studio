export class AIError extends Error {}

/** Calls this app's /api/ai route. The key is sent per request and never stored on the server. */
export async function ai<T>(task: "brain" | "ideas" | "blast" | "script", input: unknown, apiKey: string): Promise<{ result: T; linkStatus?: Record<string, "read" | "failed"> }> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json", ...(apiKey ? { "x-anthropic-key": apiKey } : {}) },
    body: JSON.stringify({ task, input }),
  });
  const data = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
  if (!res.ok) throw new AIError(data.error || `Server error ${res.status}`);
  return data;
}
