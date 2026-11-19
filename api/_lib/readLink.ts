import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_CHARS = 12000;

function privateAddress(ip: string) {
  if (ip.includes(":")) {
    const v = ip.toLowerCase();
    if (v.startsWith("::ffff:")) return privateAddress(v.slice(7));
    return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80");
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
}

async function assertPublic(url: URL) {
  if (!/^https?:$/.test(url.protocol)) throw new Error("only http(s) links");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addrs = isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
  if (!addrs.length || addrs.some((a) => privateAddress(a.address))) throw new Error("private address");
}

function htmlToText(html: string) {
  const meta = [...html.matchAll(/<meta[^>]+(?:name|property)=["'](?:description|og:description|og:title|twitter:description)["'][^>]*content=["']([^"']*)["']/gi)].map((m) => m[1]);
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "";
  const body = html
    .replace(/<(script|style|noscript|svg|iframe)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6]|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
  return [title, ...meta, body].filter(Boolean).join("\n").slice(0, MAX_CHARS);
}

/** Fetches a public web page and returns readable text. Refuses private and local addresses. */
export async function readLink(raw: string): Promise<string> {
  let url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  for (let hop = 0; hop < 4; hop++) {
    await assertPublic(url);
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; DistributionStudio/1.0)", accept: "text/html,text/plain;q=0.9,*/*;q=0.5" },
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      url = new URL(res.headers.get("location")!, url);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get("content-type") ?? "";
    if (!/text|html|json|xml/.test(type)) throw new Error("not a text page");
    const text = await res.text();
    return /html/.test(type) ? htmlToText(text) : text.slice(0, MAX_CHARS);
  }
  throw new Error("too many redirects");
}
