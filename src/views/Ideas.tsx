import { useState } from "react";
import { useStore } from "../lib/store";
import { useMedia } from "../lib/media";
import { PLATFORMS } from "../lib/platforms";
import { ai } from "../lib/ai";
import { now, uid, type Dump } from "../lib/types";
import { BrandDot, Glyph, Modal, channelName, useToast } from "../ui";
import { MediaPicker } from "./Media";

export function sendToStudio(idea: string, brandId: string | null) {
  try { sessionStorage.setItem("hds:studio", JSON.stringify({ idea, brandId })); } catch { /* ignore */ }
  location.hash = "studio";
}

export function Ideas() {
  const { ws, update } = useStore();
  const toast = useToast();
  const [brandId, setBrandId] = useState<string>("all");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [blasting, setBlasting] = useState<Dump | null>(null);

  const shown = ws.dumps.filter((d) => brandId === "all" || d.brandId === brandId || d.brandId === null).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const brandOf = (id: string | null) => ws.brands.find((b) => b.id === id);

  const add = () => {
    if (!text.trim() && !files.length) return;
    update((d) => { d.dumps.push({ id: uid(), brandId: brandId === "all" ? null : brandId, text: text.trim(), media: files, kind: "dump", used: false, createdAt: now() }); });
    setText(""); setFiles([]);
  };

  const generate = async () => {
    const brand = brandOf(brandId);
    if (!brand) return toast("Pick a brand first, so ideas fit its voice", true);
    const dumps = ws.dumps.filter((d) => d.kind === "dump" && !d.used && (d.brandId === brand.id || d.brandId === null));
    if (!dumps.length) return toast("Add a few dumps first", true);
    setBusy(true);
    try {
      const { result } = await ai<{ ideas: { title: string; angle: string; hook: string; formats: string[] }[] }>("ideas", {
        brain: brand.brain ?? { name: brand.name, tagline: brand.tagline, notes: brand.notes },
        channels: brand.channels.map((c) => channelName(c)),
        dumps: dumps.map((d) => ({ text: d.text, media: d.media })),
      }, ws.settings.apiKey);
      update((d) => {
        result.ideas.forEach((i) => d.dumps.push({ id: uid(), brandId: brand.id, kind: "idea", used: false, createdAt: now(), text: `${i.title}\n\nAngle: ${i.angle}\nHook: ${i.hook}\nFormats: ${i.formats.join(", ")}` }));
        d.dumps.forEach((x) => { if (dumps.some((u) => u.id === x.id)) x.used = true; });
      });
      toast(`${result.ideas.length} ideas added`);
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
          <h1>Ideas & dumps</h1>
          <p className="muted">Dump anything raw. Turn dumps into ideas, then blast an idea across brands and channels, or script it into a video.</p>
        </div>
        <div className="row">
          <select className="i" style={{ width: "auto" }} value={brandId} onChange={(e) => setBrandId(e.target.value)}>
            <option value="all">All brands</option>
            {ws.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <button className="btn primary" disabled={busy || brandId === "all"} title={brandId === "all" ? "Pick a brand" : ""} onClick={generate}>{busy ? "Thinking…" : "Turn dumps into ideas"}</button>
        </div>
      </div>

      <div className="card stack">
        <textarea className="i" placeholder={`Dump a thought, a link, a voice-note transcript…${brandId === "all" ? " (shared with every brand)" : ""}`} value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) add(); }} />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <button className="btn sm" onClick={() => setPicking(true)}>Attach media{files.length ? ` (${files.length})` : ""}</button>
            {files.map((f) => <span className="chip" key={f}>{f}</span>)}
          </div>
          <button className="btn primary" onClick={add}>Add dump</button>
        </div>
      </div>

      {shown.length === 0 ? <div className="empty"><h3>Nothing here yet</h3><p>Dumps are raw material. Add a few, then press "Turn dumps into ideas".</p></div> : (
        <div className="grid">
          {shown.map((d) => (
            <div className="card stack" key={d.id} style={{ opacity: d.used ? 0.55 : 1 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="row small"><span className="chip">{d.kind}</span>{d.brandId ? <><BrandDot brand={brandOf(d.brandId)} />{brandOf(d.brandId)?.name}</> : <span className="muted">All brands</span>}</span>
                <button className="btn ghost sm" aria-label="Delete" onClick={() => update((w) => { w.dumps = w.dumps.filter((x) => x.id !== d.id); })}>✕</button>
              </div>
              <p style={{ whiteSpace: "pre-wrap" }}>{d.text}</p>
              {d.media?.length ? <div className="row">{d.media.map((m) => <span className="chip small" key={m}>{m}</span>)}</div> : null}
              <div className="row">
                <button className="btn sm primary" onClick={() => setBlasting(d)}>Blast</button>
                <button className="btn sm" onClick={() => sendToStudio(d.text, d.brandId)}>Script a video</button>
                <button className="btn sm ghost" onClick={() => update((w) => { const x = w.dumps.find((y) => y.id === d.id); if (x) x.used = !x.used; })}>{d.used ? "Mark unused" : "Mark used"}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {picking ? <MediaPicker selected={files} onClose={() => setPicking(false)} onPick={(s) => { setFiles(s); setPicking(false); }} /> : null}
      {blasting ? <Blast dump={blasting} onClose={() => setBlasting(null)} /> : null}
    </>
  );
}

function Blast({ dump, onClose }: { dump: Dump; onClose: () => void }) {
  const { ws, update } = useStore();
  const toast = useToast();
  const media = useMedia();
  const all = ws.brands.flatMap((b) => b.channels.map((c) => ({ b, c })));
  const [sel, setSel] = useState<Set<string>>(() => new Set(all.filter(({ b }) => !dump.brandId || b.id === dump.brandId).map(({ c }) => c.id)));
  const [idea, setIdea] = useState(dump.text);
  const [busy, setBusy] = useState(false);
  const toggle = (id: string) => { const s = new Set(sel); if (s.has(id)) s.delete(id); else s.add(id); setSel(s); };

  const go = async () => {
    const targets = all.filter(({ c }) => sel.has(c.id));
    if (!targets.length) return;
    setBusy(true);
    try {
      const mediaNote = dump.media?.length ? `\nAttached media: ${dump.media.map((m) => `${m} (${media.byPath(m)?.kind ?? "file"})`).join(", ")}` : "";
      const { result } = await ai<{ posts: { targetId: string; title: string; body: string; format: string }[] }>("blast", {
        idea: idea + mediaNote,
        targets: targets.map(({ b, c }) => ({
          id: c.id, brand: b.name, platform: channelName(c), handle: c.handle, formats: PLATFORMS[c.platform]?.formats ?? [],
          brain: b.brain ? { summary: b.brain.summary, audience: b.brain.audience, tone: b.brain.tone, vocabulary: b.brain.vocabulary, hashtags: b.brain.hashtags, donts: b.brain.donts, ctaStyle: b.brain.ctaStyle } : { tagline: b.tagline, notes: b.notes },
        })),
      }, ws.settings.apiKey);
      const blastId = uid();
      update((d) => {
        result.posts.forEach((p) => {
          const t = targets.find(({ c }) => c.id === p.targetId);
          if (t) d.posts.push({ id: uid(), brandId: t.b.id, channelId: t.c.id, title: p.title, body: p.body, format: p.format, status: "drafting", date: "", blastId, createdAt: now() });
        });
        const x = d.dumps.find((y) => y.id === dump.id);
        if (x) x.used = true;
      });
      toast(`${result.posts.length} drafts added to the Plan backlog`);
      onClose();
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Blast one idea everywhere" onClose={onClose}>
      <label className="f">Idea<textarea className="i" value={idea} onChange={(e) => setIdea(e.target.value)} /></label>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3>Where ({sel.size})</h3>
        <div className="row">
          <button className="btn sm" onClick={() => setSel(new Set(all.map(({ c }) => c.id)))}>All</button>
          <button className="btn sm" onClick={() => setSel(new Set())}>None</button>
        </div>
      </div>
      {all.length === 0 ? <p className="muted">Add channels to your brands first.</p> : (
        <div className="stack" style={{ gap: 4 }}>
          {ws.brands.filter((b) => b.channels.length).map((b) => (
            <div key={b.id} className="row" style={{ alignItems: "flex-start" }}>
              <span className="row" style={{ width: 140, flexWrap: "nowrap" }}><BrandDot brand={b} /><b>{b.name}</b></span>
              <div className="row" style={{ flex: 1 }}>
                {b.channels.map((c) => (
                  <label key={c.id} className="chip" style={{ cursor: "pointer", borderColor: sel.has(c.id) ? "var(--accent)" : undefined }}>
                    <input type="checkbox" checked={sel.has(c.id)} onChange={() => toggle(c.id)} /><Glyph platform={c.platform} />{c.handle || channelName(c)}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" disabled={busy || !sel.size} onClick={go}>{busy ? `Writing ${sel.size} versions…` : `Write ${sel.size} versions`}</button>
      </div>
    </Modal>
  );
}
