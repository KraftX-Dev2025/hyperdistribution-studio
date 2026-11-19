import { useEffect, useMemo, useState } from "react";
import { Player } from "@remotion/player";
import { useStore } from "../lib/store";
import { useMedia, type MediaItem } from "../lib/media";
import { ai } from "../lib/ai";
import { now, uid, type EditSpec, type Script, type Segment } from "../lib/types";
import { DIMENSIONS, Edit, totalFrames, type EditProps } from "../video/Edit";
import { BrandDot, channelName, useToast } from "../ui";
import { MediaPicker } from "./Media";
import { newPost } from "./Board";

type FlatSeg = { type: "card" | "clip"; style: string; text: string; sub: string; file: string; from: number; seconds: number; caption: string; look: string };
type ScriptOut = { hook: string; beats: { line: string; visual: string }[]; caption: string; hashtags: string[]; edit: { title: string; music: string; segments: FlatSeg[] } };

const LOOKS = ["clean", "camcorder", "punch", "bw"] as const;
const STYLES = ["slam", "title", "caption"] as const;

/** Turns Claude's flat segments into typed ones and drops anything that points at a missing file. */
function normalize(out: ScriptOut, byPath: (p: string) => MediaItem | undefined): Segment[] {
  return out.edit.segments.flatMap<Segment>((s) => {
    const seconds = Math.min(15, Math.max(0.4, Number(s.seconds) || 1));
    if (s.type === "clip") {
      const m = byPath(s.file);
      if (!m || m.kind === "audio") return [];
      const dur = m.duration ?? Infinity;
      const from = Math.max(0, Math.min(Number(s.from) || 0, Math.max(0, dur - seconds)));
      return [{ type: "clip", file: s.file, from, seconds: Math.min(seconds, dur), caption: s.caption || undefined, look: (LOOKS as readonly string[]).includes(s.look) ? (s.look as Segment & { type: "clip" } extends { look: infer L } ? L : never) : "clean" }];
    }
    return [{ type: "card", text: s.text || s.caption || "…", sub: s.sub || undefined, seconds, style: (STYLES as readonly string[]).includes(s.style) ? (s.style as "slam") : "caption" }];
  });
}

/** Library sent to Claude: prefer the user's chosen files, else the most recent ones. */
function librarySample(items: MediaItem[], chosen: string[]) {
  const pool = chosen.length ? items.filter((m) => chosen.includes(m.path)) : items;
  const visual = pool.filter((m) => m.kind !== "audio").slice(0, 60);
  const audio = pool.filter((m) => m.kind === "audio").slice(0, 15);
  return [...visual, ...audio].map((m) => ({ path: m.path, kind: m.kind, duration: m.duration, thumb: m.thumb }));
}

export function Studio() {
  const { ws, update } = useStore();
  const media = useMedia();
  const toast = useToast();
  const [openId, setOpenId] = useState<string | null>(ws.scripts[0]?.id ?? null);
  const [form, setForm] = useState({ brandId: ws.brands[0]?.id ?? "", idea: "", platform: "Instagram Reel", aspect: "9:16" as EditSpec["aspect"], seconds: 25, style: "" });
  const [chosen, setChosen] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("hds:studio");
      if (!raw) return;
      sessionStorage.removeItem("hds:studio");
      const { idea, brandId } = JSON.parse(raw);
      setForm((f) => ({ ...f, idea, brandId: brandId ?? f.brandId }));
      setOpenId(null);
    } catch { /* ignore */ }
  }, []);

  const brand = ws.brands.find((b) => b.id === form.brandId);
  const open = ws.scripts.find((s) => s.id === openId);

  const write = async () => {
    if (!brand || !form.idea.trim()) return;
    setBusy(true);
    try {
      const { result } = await ai<ScriptOut>("script", {
        idea: form.idea, platform: form.platform, aspect: form.aspect, seconds: form.seconds, style: form.style,
        brain: brand.brain ?? { name: brand.name, tagline: brand.tagline, notes: brand.notes },
        media: librarySample(media.items, chosen),
      }, ws.settings.apiKey);
      const segments = normalize(result, media.byPath);
      const music = media.byPath(result.edit.music)?.kind === "audio" ? result.edit.music : undefined;
      const script: Script = {
        id: uid(), brandId: brand.id, idea: form.idea, hook: result.hook, beats: result.beats, caption: result.caption, hashtags: result.hashtags, createdAt: now(),
        edit: { title: result.edit.title || form.idea.slice(0, 40), aspect: form.aspect, fps: 30, accent: brand.color, music, segments: segments.length ? segments : [{ type: "card", style: "slam", text: result.hook, seconds: 3 }] },
      };
      update((d) => { d.scripts.unshift(script); });
      setOpenId(script.id);
      toast("Script and edit ready");
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="head">
        <div>
          <h1>Scripts & edits</h1>
          <p className="muted">Claude writes the script and cuts it from your media folder. Tweak any segment, preview live, and export an MP4 in your browser.</p>
        </div>
        <div className="row">
          {ws.scripts.length ? (
            <select className="i" style={{ width: "auto", maxWidth: 280 }} value={openId ?? ""} onChange={(e) => setOpenId(e.target.value || null)}>
              <option value="">+ New script</option>
              {ws.scripts.map((s) => <option key={s.id} value={s.id}>{s.edit.title}</option>)}
            </select>
          ) : null}
        </div>
      </div>

      {!open ? (
        ws.brands.length === 0 ? (
          <div className="empty"><h3>Add a brand first</h3><p>Scripts are written in a brand's voice.</p><a className="btn primary" href="#brands">Go to brands</a></div>
        ) : (
          <div className="card stack">
            <h2>New script</h2>
            <div className="split">
              <label className="f">Brand
                <select className="i" value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })}>
                  {ws.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </label>
              <label className="f">For
                <input className="i" list="hds-platforms" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} />
                <datalist id="hds-platforms">{["Instagram Reel", "TikTok", "YouTube Short", "LinkedIn video", "YouTube video", "X video"].map((p) => <option key={p} value={p} />)}{brand?.channels.map((c) => <option key={c.id} value={channelName(c)} />)}</datalist>
              </label>
            </div>
            <label className="f">Idea<textarea className="i" value={form.idea} onChange={(e) => setForm({ ...form, idea: e.target.value })} placeholder="What's the video about? Paste an idea from Ideas & dumps, or write one." /></label>
            <div className="split">
              <label className="f">Aspect
                <select className="i" value={form.aspect} onChange={(e) => setForm({ ...form, aspect: e.target.value as EditSpec["aspect"] })}>
                  <option value="9:16">9:16 vertical</option><option value="1:1">1:1 square</option><option value="16:9">16:9 wide</option>
                </select>
              </label>
              <label className="f">Length (seconds)<input className="i" type="number" min={5} max={180} value={form.seconds} onChange={(e) => setForm({ ...form, seconds: Math.max(5, +e.target.value) })} /></label>
            </div>
            <label className="f">Editing style (optional)<input className="i" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} placeholder="e.g. deadpan captions, camcorder flashback then fast beat cuts" /></label>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="row">
                <span className="muted small">{media.items.length ? (chosen.length ? `Using ${chosen.length} chosen files` : `Claude will choose from your ${media.items.length} files`) : "No media folder connected: the edit will use text cards only."}</span>
                {media.items.length ? <button className="btn sm" onClick={() => setPicking(true)}>Choose files</button> : <a className="btn sm" href="#media">Connect folder</a>}
              </div>
              <button className="btn primary" disabled={busy || !form.idea.trim() || !brand} onClick={write}>{busy ? "Writing and cutting…" : "Write script & edit"}</button>
            </div>
          </div>
        )
      ) : (
        <ScriptView key={open.id} script={open} onDelete={() => { update((d) => { d.scripts = d.scripts.filter((s) => s.id !== open.id); }); setOpenId(null); }} />
      )}

      {picking ? <MediaPicker selected={chosen} kinds={["video", "image", "audio"]} onClose={() => setPicking(false)} onPick={(s) => { setChosen(s); setPicking(false); }} /> : null}
    </>
  );
}

function ScriptView({ script, onDelete }: { script: Script; onDelete: () => void }) {
  const { ws, update } = useStore();
  const media = useMedia();
  const toast = useToast();
  const [pick, setPick] = useState<number | "music" | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const brand = ws.brands.find((b) => b.id === script.brandId);
  const spec = script.edit;

  const patch = (fn: (s: Script) => void) => update((d) => { const s = d.scripts.find((x) => x.id === script.id); if (s) fn(s); });
  const setSeg = (i: number, p: Partial<Segment>) => patch((s) => { s.edit.segments[i] = { ...s.edit.segments[i], ...p } as Segment; });
  const move = (i: number, by: number) => patch((s) => { const a = s.edit.segments; const j = i + by; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; });

  const srcs = useMemo(() => Object.fromEntries(media.items.map((m) => [m.path, m.url])), [media.items]);
  const missing = spec.segments.filter((s) => s.type === "clip" && !srcs[s.file]).length + (spec.music && !srcs[spec.music] ? 1 : 0);
  // In the browser, a clip whose file isn't available is shown as a caption card so the preview never breaks.
  const playable: EditSpec = useMemo(() => ({
    ...spec,
    music: spec.music && srcs[spec.music] ? spec.music : undefined,
    segments: spec.segments.map((s) => (s.type === "clip" && !srcs[s.file] ? { type: "card", style: "caption", text: `[missing: ${s.file}]`, seconds: s.seconds } : s)),
  }), [spec, srcs]);
  const dims = DIMENSIONS[spec.aspect];
  const frames = totalFrames(playable);
  const props: EditProps = { spec: playable, srcs };

  const exportMp4 = async () => {
    if (!ws.settings.remotionLicense) return toast("Add your Remotion license (or free-license) in Settings first", true);
    setProgress(0);
    try {
      const { renderMediaOnWeb } = await import("@remotion/web-renderer");
      const result = await renderMediaOnWeb({
        composition: { id: "Edit", component: Edit as unknown as React.FC<Record<string, unknown>>, width: dims.width, height: dims.height, fps: spec.fps, durationInFrames: frames },
        inputProps: props as unknown as Record<string, unknown>,
        licenseKey: ws.settings.remotionLicense,
        onProgress: (p) => setProgress(p.progress),
      });
      const blob = await result.getBlob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${spec.title.replace(/[^\w-]+/g, "-").toLowerCase() || "edit"}.mp4`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      toast("MP4 exported");
    } catch (e) {
      toast(`Export failed: ${(e as Error).message}. Try Chrome, or render with the CLI (Download edit).`, true);
    } finally {
      setProgress(null);
    }
  };

  const downloadSpec = () => {
    const blob = new Blob([JSON.stringify({ spec }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "edit.json";
    a.click();
  };

  return (
    <div className="split" style={{ gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)" }}>
      <div className="stack">
        <div className="card stack">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="row"><BrandDot brand={brand} /><b>{brand?.name}</b></span>
            <button className="btn sm danger" onClick={() => confirm("Delete this script?") && onDelete()}>Delete</button>
          </div>
          <input className="i" style={{ fontFamily: "var(--f-display)", fontSize: 18, fontWeight: 600 }} value={spec.title} onChange={(e) => patch((s) => { s.edit.title = e.target.value; })} />
          <p><b>Hook:</b> {script.hook}</p>
          <ol style={{ margin: 0, paddingLeft: 18 }}>
            {script.beats.map((b, i) => <li key={i}>{b.line} <span className="muted">({b.visual})</span></li>)}
          </ol>
          <label className="f">Caption<textarea className="i" value={script.caption} onChange={(e) => patch((s) => { s.caption = e.target.value; })} /></label>
          <p className="small muted">{script.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}</p>
          <div className="row">
            <button className="btn sm" onClick={() => navigator.clipboard.writeText(`${script.caption}\n\n${script.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}`).then(() => toast("Caption copied"))}>Copy caption</button>
            {brand?.channels[0] ? (
              <button className="btn sm" onClick={() => {
                const p = newPost(brand.id, brand.channels[0].id);
                update((d) => { d.posts.push({ ...p, title: spec.title, body: script.caption, format: "Reel", status: "drafting", scriptId: script.id }); });
                toast("Added to the Plan backlog");
              }}>Add to plan</button>
            ) : null}
          </div>
        </div>

        <div className="card stack">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2>Edit</h2>
            <span className="muted small mono">{(frames / spec.fps).toFixed(1)}s · {spec.segments.length} segments</span>
          </div>
          {missing ? <p className="small" style={{ color: "var(--danger)" }}>{missing} file{missing > 1 ? "s" : ""} not found in the connected folder. Reconnect it in Media folder, or swap them.</p> : null}
          {spec.segments.map((s, i) => (
            <div className="seg" key={i}>
              <span className="mono muted small">{i + 1}</span>
              <span className="hide-sm">
                {s.type === "clip" ? (
                  <button className="thumb" style={{ width: 90, height: 56, aspectRatio: "auto", padding: 0 }} onClick={() => setPick(i)} title="Swap file">
                    {media.byPath(s.file)?.thumb ? <img src={media.byPath(s.file)!.thumb} alt="" /> : <span className="small">{s.file.split("/").pop()}</span>}
                  </button>
                ) : (
                  <select className="i" value={s.style} onChange={(e) => setSeg(i, { style: e.target.value as "slam" })}>{STYLES.map((x) => <option key={x}>{x}</option>)}</select>
                )}
              </span>
              <span className="stack" style={{ gap: 4 }}>
                {s.type === "clip" ? (
                  <>
                    <input className="i" placeholder="Caption" value={s.caption ?? ""} onChange={(e) => setSeg(i, { caption: e.target.value || undefined })} />
                    <span className="row small">
                      <select className="i" style={{ width: "auto", padding: "3px 6px" }} value={s.look} onChange={(e) => setSeg(i, { look: e.target.value as "clean" })}>{LOOKS.map((x) => <option key={x}>{x}</option>)}</select>
                      <span className="muted">from</span><input className="i" type="number" step={0.1} min={0} style={{ width: 70, padding: "3px 6px" }} value={s.from} onChange={(e) => setSeg(i, { from: Math.max(0, +e.target.value) })} /><span className="muted">s</span>
                    </span>
                  </>
                ) : (
                  <>
                    <input className="i" value={s.text} onChange={(e) => setSeg(i, { text: e.target.value })} />
                    <input className="i" placeholder="Subtitle" value={s.sub ?? ""} onChange={(e) => setSeg(i, { sub: e.target.value || undefined })} />
                  </>
                )}
              </span>
              <input className="i" type="number" step={0.1} min={0.3} aria-label="Seconds" value={s.seconds} onChange={(e) => setSeg(i, { seconds: Math.max(0.3, +e.target.value) })} />
              <span className="row" style={{ gap: 2, flexWrap: "nowrap" }}>
                <button className="btn ghost sm" aria-label="Move up" onClick={() => move(i, -1)}>↑</button>
                <button className="btn ghost sm" aria-label="Move down" onClick={() => move(i, 1)}>↓</button>
                <button className="btn ghost sm" aria-label="Remove" onClick={() => patch((x) => { x.edit.segments.splice(i, 1); })}>✕</button>
              </span>
            </div>
          ))}
          <div className="row">
            <button className="btn sm" onClick={() => patch((x) => { x.edit.segments.push({ type: "card", style: "title", text: "New card", seconds: 2 }); })}>+ Text card</button>
            <button className="btn sm" onClick={() => setPick(spec.segments.length)}>+ Clip</button>
            <button className="btn sm" onClick={() => setPick("music")}>{spec.music ? `Music: ${spec.music.split("/").pop()}` : "+ Music"}</button>
            {spec.music ? <button className="btn sm ghost" onClick={() => patch((x) => { x.edit.music = undefined; })}>Remove music</button> : null}
          </div>
        </div>
      </div>

      <div className="stack" style={{ position: "sticky", top: 16, alignSelf: "start" }}>
        <div className="player-wrap">
          <Player
            component={Edit}
            inputProps={props}
            durationInFrames={frames}
            fps={spec.fps}
            compositionWidth={dims.width}
            compositionHeight={dims.height}
            controls
            style={{ width: "100%", maxHeight: "70vh", aspectRatio: `${dims.width}/${dims.height}` }}
            acknowledgeRemotionLicense
          />
        </div>
        <div className="row">
          <button className="btn primary" disabled={progress !== null} onClick={exportMp4}>{progress !== null ? `Rendering ${Math.round(progress * 100)}%` : "Export MP4"}</button>
          <button className="btn" onClick={downloadSpec}>Download edit (CLI)</button>
        </div>
        <p className="muted small">
          Export runs in your browser (Chrome works best). For long or high-quality renders, use the CLI: <span className="mono">npx remotion render remotion/index.ts Edit out.mp4 --props=edit.json --public-dir="your media folder"</span>
        </p>
      </div>

      {pick !== null ? (
        <MediaPicker
          single
          selected={[]}
          kinds={pick === "music" ? ["audio"] : ["video", "image"]}
          onClose={() => setPick(null)}
          onPick={([path]) => {
            if (pick === "music") patch((x) => { x.edit.music = path; });
            else if (pick >= spec.segments.length) patch((x) => { x.edit.segments.push({ type: "clip", file: path, from: 0, seconds: Math.min(3, media.byPath(path)?.duration ?? 3), look: "clean" }); });
            else setSeg(pick, { file: path, from: 0 });
            setPick(null);
          }}
        />
      ) : null}
    </div>
  );
}
