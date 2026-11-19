import { useState } from "react";
import { useStore } from "../lib/store";
import { CATEGORIES, PLATFORMS } from "../lib/platforms";
import { ai } from "../lib/ai";
import { now, uid, type Brain, type Brand, type Channel } from "../lib/types";
import { Glyph, Modal, channelName, useToast } from "../ui";

const COLORS = ["#3846F0", "#E8367A", "#1E9E62", "#C98A00", "#8A3FD1", "#0A9396", "#D23B3B", "#3A3F4B"];

export function PlatformSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select className="i" value={value} onChange={(e) => onChange(e.target.value)}>
      {CATEGORIES.map((cat) => (
        <optgroup key={cat} label={cat}>
          {Object.entries(PLATFORMS).filter(([, p]) => p.cat === cat).map(([id, p]) => <option key={id} value={id}>{p.label}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

export function useBuildBrain() {
  const { ws, update } = useStore();
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const build = async (b: Brand) => {
    setBusy(b.id);
    try {
      const links = [...new Set([...b.links, ...b.channels.map((c) => c.url)].map((l) => l.trim()).filter(Boolean))];
      const { result, linkStatus } = await ai<Brain>("brain", { name: b.name, tagline: b.tagline, notes: b.notes, links }, ws.settings.apiKey);
      update((d) => {
        const t = d.brands.find((x) => x.id === b.id);
        if (t) { t.brain = result; t.brainBuiltAt = now(); t.linkStatus = linkStatus; }
      });
      const failed = Object.values(linkStatus ?? {}).filter((s) => s === "failed").length;
      toast(failed ? `Brain built. ${failed} link${failed > 1 ? "s" : ""} couldn't be read (often login walls); add notes to fill gaps.` : "Brain built");
    } catch (e) {
      toast((e as Error).message, true);
    } finally {
      setBusy(null);
    }
  };
  return { build, busy };
}

export function Brands() {
  const { ws, update } = useStore();
  const [editing, setEditing] = useState<Brand | null>(null);
  const [viewing, setViewing] = useState<Brand | null>(null);
  const { build, busy } = useBuildBrain();

  const blank = (): Brand => ({ id: uid(), name: "", tagline: "", color: COLORS[ws.brands.length % COLORS.length], links: [], notes: "", channels: [], createdAt: now() });

  return (
    <>
      <div className="head">
        <div>
          <h1>Brands</h1>
          <p className="muted">Each brand gets its own voice, channels and weekly targets.</p>
        </div>
        <button className="btn primary" onClick={() => setEditing(blank())}>Add brand</button>
      </div>

      {ws.brands.length === 0 ? (
        <div className="empty">
          <h3>No brands yet</h3>
          <p>Add your personal brand, your company, or a client. Paste their links and Claude builds a brand brain from them.</p>
          <button className="btn primary" onClick={() => setEditing(blank())}>Add your first brand</button>
        </div>
      ) : (
        <div className="grid">
          {ws.brands.map((b) => (
            <div className="card stack" key={b.id} style={{ borderTop: `4px solid ${b.color}` }}>
              <div>
                <h2>{b.name}</h2>
                <p className="muted">{b.tagline || "No tagline"}</p>
              </div>
              <div className="row">
                {b.channels.length ? b.channels.map((c) => <span key={c.id} className="chip"><Glyph platform={c.platform} />{c.handle || channelName(c)}</span>) : <span className="muted small">No channels</span>}
              </div>
              <p className="small">{b.brain ? b.brain.summary : <span className="muted">No brain yet. Build one from the brand's links.</span>}</p>
              <div className="row">
                <button className="btn sm" onClick={() => setEditing(b)}>Edit</button>
                {b.brain ? <button className="btn sm" onClick={() => setViewing(b)}>View brain</button> : null}
                <button className="btn sm primary" disabled={busy === b.id} onClick={() => build(b)}>{busy === b.id ? "Reading links…" : b.brain ? "Rebuild brain" : "Build brain"}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing ? (
        <BrandForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(b) => {
            update((d) => {
              const i = d.brands.findIndex((x) => x.id === b.id);
              if (i >= 0) d.brands[i] = b; else d.brands.push(b);
            });
            setEditing(null);
          }}
          onDelete={ws.brands.some((x) => x.id === editing.id) ? () => {
            if (!confirm(`Delete ${editing.name} and all its posts, ideas and scripts?`)) return;
            update((d) => {
              d.brands = d.brands.filter((x) => x.id !== editing.id);
              d.posts = d.posts.filter((p) => p.brandId !== editing.id);
              d.dumps = d.dumps.filter((p) => p.brandId !== editing.id);
              d.scripts = d.scripts.filter((p) => p.brandId !== editing.id);
            });
            setEditing(null);
          } : undefined}
        />
      ) : null}

      {viewing?.brain ? <BrainView brand={viewing} onClose={() => setViewing(null)} /> : null}
    </>
  );
}

function BrandForm({ initial, onSave, onClose, onDelete }: { initial: Brand; onSave: (b: Brand) => void; onClose: () => void; onDelete?: () => void }) {
  const [b, setB] = useState<Brand>(initial);
  const set = <K extends keyof Brand>(k: K, v: Brand[K]) => setB({ ...b, [k]: v });
  const setCh = (i: number, patch: Partial<Channel>) => set("channels", b.channels.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  return (
    <Modal title={initial.name ? `Edit ${initial.name}` : "New brand"} onClose={onClose}>
      <div className="split">
        <label className="f">Name<input className="i" value={b.name} onChange={(e) => set("name", e.target.value)} autoFocus /></label>
        <label className="f">Tagline<input className="i" value={b.tagline} onChange={(e) => set("tagline", e.target.value)} /></label>
      </div>
      <label className="f">Colour
        <div className="row">
          {COLORS.map((c) => <button key={c} type="button" aria-label={c} onClick={() => set("color", c)} style={{ width: 26, height: 26, borderRadius: 8, background: c, border: b.color === c ? "3px solid var(--ink)" : "1px solid var(--line)" }} />)}
          <input type="color" value={b.color} onChange={(e) => set("color", e.target.value)} />
        </div>
      </label>
      <label className="f">Links Claude should read (one per line: website, about page, articles, profiles)
        <textarea className="i" value={b.links.join("\n")} onChange={(e) => set("links", e.target.value.split("\n"))} placeholder="https://example.com" />
      </label>
      <label className="f">Notes for the brain (who it's for, what to avoid, anything the links don't say)
        <textarea className="i" value={b.notes} onChange={(e) => set("notes", e.target.value)} />
      </label>
      <div className="stack">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h3>Channels</h3>
          <button className="btn sm" onClick={() => set("channels", [...b.channels, { id: uid(), platform: "instagram", handle: "", url: "", cadence: 3 }])}>Add channel</button>
        </div>
        {b.channels.map((c, i) => (
          <div key={c.id} className="row" style={{ flexWrap: "nowrap", alignItems: "flex-end" }}>
            <label className="f" style={{ flex: "1 1 150px" }}>Platform<PlatformSelect value={c.platform} onChange={(v) => setCh(i, { platform: v })} /></label>
            {c.platform === "other" ? <label className="f" style={{ flex: "1 1 100px" }}>Name<input className="i" value={c.label ?? ""} onChange={(e) => setCh(i, { label: e.target.value })} /></label> : null}
            <label className="f" style={{ flex: "1 1 120px" }}>Handle<input className="i" value={c.handle} onChange={(e) => setCh(i, { handle: e.target.value })} placeholder="@handle" /></label>
            <label className="f" style={{ flex: "2 1 160px" }}>URL<input className="i" value={c.url} onChange={(e) => setCh(i, { url: e.target.value })} /></label>
            <label className="f" style={{ flex: "0 0 70px" }}>Per week<input className="i" type="number" min={0} value={c.cadence} onChange={(e) => setCh(i, { cadence: Math.max(0, +e.target.value) })} /></label>
            <button className="btn ghost" aria-label="Remove channel" onClick={() => set("channels", b.channels.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
      </div>
      <div className="row" style={{ justifyContent: "space-between" }}>
        {onDelete ? <button className="btn danger" onClick={onDelete}>Delete brand</button> : <span />}
        <div className="row">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!b.name.trim()} onClick={() => onSave({ ...b, name: b.name.trim(), links: b.links.map((l) => l.trim()).filter(Boolean) })}>Save</button>
        </div>
      </div>
    </Modal>
  );
}

function BrainView({ brand, onClose }: { brand: Brand; onClose: () => void }) {
  const { update } = useStore();
  const [brain, setBrain] = useState<Brain>(brand.brain!);
  const list = (k: keyof Brain, label: string) => (
    <label className="f">{label} (one per line)
      <textarea className="i" value={(brain[k] as string[]).join("\n")} onChange={(e) => setBrain({ ...brain, [k]: e.target.value.split("\n") })} />
    </label>
  );
  const text = (k: keyof Brain, label: string) => (
    <label className="f">{label}<textarea className="i" style={{ minHeight: 56 }} value={brain[k] as string} onChange={(e) => setBrain({ ...brain, [k]: e.target.value })} /></label>
  );
  return (
    <Modal title={`${brand.name} brain`} onClose={onClose}>
      {brand.linkStatus ? (
        <div className="row small">
          {Object.entries(brand.linkStatus).map(([u, s]) => <span key={u} className="chip" title={u}><span className="dot" style={{ background: s === "read" ? "var(--posted)" : "var(--danger)" }} />{u.replace(/^https?:\/\/(www\.)?/, "").slice(0, 36)}</span>)}
        </div>
      ) : null}
      {text("summary", "Summary")}
      {text("audience", "Audience")}
      {text("tone", "Tone")}
      <div className="split">{list("personality", "Personality")}{list("pillars", "Content pillars")}</div>
      {list("hooks", "Hooks")}
      <div className="split">{list("dos", "Do")}{list("donts", "Don't")}</div>
      <div className="split">{list("vocabulary", "Vocabulary")}{list("hashtags", "Hashtags")}</div>
      {text("ctaStyle", "Call-to-action style")}
      {text("visual", "Visual style")}
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" onClick={() => {
          const clean = Object.fromEntries(Object.entries(brain).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => x.trim()).filter(Boolean) : v])) as Brain;
          update((d) => { const t = d.brands.find((x) => x.id === brand.id); if (t) t.brain = clean; });
          onClose();
        }}>Save brain</button>
      </div>
    </Modal>
  );
}
