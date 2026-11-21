import { db, docsOf } from "./db";
import { putAsset } from "./assets";
import { settingsStore } from "./services";
import { DIMENSIONS, Edit, totalFrames, type EditProps } from "../video/Edit";
import type { EditSpec, Segment } from "../lib/types";

/**
 * The board's "Send to Remotion" queue. Where the original board waited for a
 * renderer on the owner's Mac, this renders each queued edit right here in the
 * browser with @remotion/web-renderer and saves the MP4 back onto the render.
 */
type Clip = { mediaId: string; inSec?: number; outSec?: number; beat?: string };
type Render = {
  id: string; status: string; title?: string; brand?: string; handle?: string; style?: string; lengthSec?: number;
  aspect?: string; music?: string; clips?: Clip[]; colors?: (string | undefined)[];
};
type Media = { id: string; kind: string; name: string; assetUrl?: string; durationSec?: number };

const lookFor = (style = ""): "clean" | "camcorder" | "punch" | "bw" =>
  /camcorder|flashback|retro|vhs/i.test(style) ? "camcorder" : /phonk|beat|slam|punch|fast/i.test(style) ? "punch" : /b\s*&\s*w|black.?and.?white|mono/i.test(style) ? "bw" : "clean";
const short = (s = "", n = 48) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

export function buildSpec(r: Render, media: Media[]): { spec: EditSpec; srcs: Record<string, string> } {
  const byId = new Map(media.map((m) => [m.id, m]));
  const visual = media.filter((m) => m.kind !== "audio" && m.assetUrl);
  let clips = (r.clips ?? []).filter((c) => byId.get(c.mediaId)?.assetUrl && byId.get(c.mediaId)!.kind !== "audio");
  if (!clips.length) clips = visual.slice(0, 6).map((m) => ({ mediaId: m.id }));
  const length = Math.max(5, Math.min(600, r.lengthSec || 25));
  const accent = r.colors?.find((c) => /^#[0-9a-f]{6}$/i.test(c || "")) || "#3846F0";
  const hook = 1.8, outro = 2.2;
  const free = Math.max(1, length - hook - outro);
  const fixed = clips.reduce((n, c) => n + (c.outSec && c.outSec > (c.inSec ?? 0) ? c.outSec - (c.inSec ?? 0) : 0), 0);
  const open = clips.filter((c) => !(c.outSec && c.outSec > (c.inSec ?? 0))).length;
  const each = open ? Math.max(1, (free - fixed) / open) : 0;
  const look = lookFor(r.style);
  const segments: Segment[] = [{ type: "card", style: "slam", text: short(r.title || "Watch this", 60), seconds: hook }];
  for (const c of clips) {
    const m = byId.get(c.mediaId)!;
    const from = Math.max(0, c.inSec ?? 0);
    let seconds = c.outSec && c.outSec > from ? c.outSec - from : each;
    if (m.durationSec) seconds = Math.min(seconds, Math.max(0.5, m.durationSec - from));
    segments.push({ type: "clip", file: m.id, from, seconds: Math.max(0.5, seconds), caption: c.beat ? short(c.beat) : undefined, look });
  }
  segments.push({ type: "card", style: "title", text: r.brand || r.title || "", sub: r.handle || undefined, seconds: outro });
  const music = r.music ? media.find((m) => m.kind === "audio" && m.assetUrl && m.name.toLowerCase().includes(r.music!.toLowerCase().slice(0, 40))) : undefined;
  const aspect = (["9:16", "1:1", "16:9", "4:5"].includes(r.aspect || "") ? r.aspect : "9:16") as EditSpec["aspect"];
  const srcs = Object.fromEntries(media.filter((m) => m.assetUrl).map((m) => [m.id, m.assetUrl!]));
  return { spec: { title: r.title || "Edit", aspect, fps: 30, accent, music: music?.id, segments }, srcs };
}

let busy = false;
const queue: string[] = [];

async function renderOne(id: string) {
  const ref = db.collection("renders").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return;
  const r = { ...(snap.data() as Render), id };
  if (r.status !== "queued") return;
  const license = settingsStore.license();
  if (!license) {
    await ref.update({ status: "failed", error: "Set up the video engine in Connect, then try again.", updatedAt: Date.now() });
    return;
  }
  const media = (await docsOf("media")) as unknown as Media[];
  const { spec, srcs } = buildSpec(r, media);
  if (!spec.segments.some((s) => s.type === "clip")) {
    await ref.update({ status: "failed", error: "No photos or clips to cut from yet. Add your media in Connect, then try again.", updatedAt: Date.now() });
    return;
  }
  await ref.update({ status: "rendering", progress: 0, updatedAt: Date.now() });
  try {
    const { renderMediaOnWeb } = await import("@remotion/web-renderer");
    const dims = DIMENSIONS[spec.aspect];
    let last = 0;
    const result = await renderMediaOnWeb({
      composition: { id: "Edit", component: Edit as unknown as React.FC<Record<string, unknown>>, width: dims.width, height: dims.height, fps: spec.fps, durationInFrames: totalFrames(spec) },
      inputProps: { spec, srcs } satisfies EditProps as unknown as Record<string, unknown>,
      licenseKey: license,
      onProgress: (p) => {
        if (p.progress - last >= 0.1) { last = p.progress; ref.update({ progress: Math.round(p.progress * 100), updatedAt: Date.now() }).catch(() => {}); }
      },
    });
    const blob = await result.getBlob();
    const asset = await putAsset(blob, ".mp4");
    await ref.update({ status: "done", progress: 100, output: { assetUrl: asset.url, bytes: blob.size }, spec, updatedAt: Date.now() });
  } catch (e) {
    await ref.update({ status: "failed", error: `Render failed: ${(e as Error).message}. Chrome or Edge work best.`, updatedAt: Date.now() });
  }
}

async function pump() {
  if (busy) return;
  busy = true;
  try { while (queue.length) await renderOne(queue.shift()!); } finally { busy = false; }
}

export function startRenderer() {
  db.collection("renders").onSnapshot((snap) => {
    for (const d of snap.docs) {
      const r = d.data() as Render;
      if (r.status === "queued" && !queue.includes(d.id)) queue.push(d.id);
    }
    pump();
  });
  // A tab closed mid-render leaves "rendering" behind: put those back in the queue.
  docsOf("renders").then((all) => all.forEach((r) => {
    if ((r as Render).status === "rendering") db.collection("renders").doc(r.id as string).update({ status: "queued" }).catch(() => {});
  }));
  db.collection("meta").doc("renderer").set({ at: Date.now(), where: "browser" }).catch(() => {});
}
