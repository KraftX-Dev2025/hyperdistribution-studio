import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { PLATFORMS } from "../lib/platforms";
import { STATUSES, now, uid, type Post } from "../lib/types";
import { BrandDot, Glyph, Modal, channelName, weekDays, weekStart, ymd } from "../ui";

export function PostForm({ initial, onClose }: { initial: Post; onClose: () => void }) {
  const { ws, update } = useStore();
  const [p, setP] = useState<Post>(initial);
  const brand = ws.brands.find((b) => b.id === p.brandId);
  const channel = brand?.channels.find((c) => c.id === p.channelId);
  const formats = PLATFORMS[channel?.platform ?? "other"]?.formats ?? PLATFORMS.other.formats;
  const exists = ws.posts.some((x) => x.id === p.id);
  return (
    <Modal title={exists ? "Edit post" : "New post"} onClose={onClose}>
      <div className="split">
        <label className="f">Brand
          <select className="i" value={p.brandId} onChange={(e) => { const b = ws.brands.find((x) => x.id === e.target.value); setP({ ...p, brandId: e.target.value, channelId: b?.channels[0]?.id ?? "" }); }}>
            {ws.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label className="f">Channel
          <select className="i" value={p.channelId} onChange={(e) => setP({ ...p, channelId: e.target.value })}>
            {brand?.channels.map((c) => <option key={c.id} value={c.id}>{channelName(c)} {c.handle}</option>)}
          </select>
        </label>
      </div>
      <label className="f">Title<input className="i" value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} /></label>
      <label className="f">Copy<textarea className="i" style={{ minHeight: 160 }} value={p.body} onChange={(e) => setP({ ...p, body: e.target.value })} /></label>
      <div className="split">
        <label className="f">Format
          <select className="i" value={p.format} onChange={(e) => setP({ ...p, format: e.target.value })}>
            {[...new Set([p.format, ...formats])].filter(Boolean).map((f) => <option key={f}>{f}</option>)}
          </select>
        </label>
        <label className="f">Status
          <select className="i" value={p.status} onChange={(e) => setP({ ...p, status: e.target.value as Post["status"] })}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <label className="f">Date<input className="i" type="date" value={p.date} onChange={(e) => setP({ ...p, date: e.target.value, status: e.target.value && p.status === "idea" ? "scheduled" : p.status })} /></label>
      <div className="row" style={{ justifyContent: "space-between" }}>
        {exists ? <button className="btn danger" onClick={() => { update((d) => { d.posts = d.posts.filter((x) => x.id !== p.id); }); onClose(); }}>Delete</button> : <span />}
        <div className="row">
          {p.body ? <button className="btn" onClick={() => navigator.clipboard.writeText(p.body)}>Copy text</button> : null}
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={!p.brandId || !p.channelId} onClick={() => {
            update((d) => { const i = d.posts.findIndex((x) => x.id === p.id); if (i >= 0) d.posts[i] = p; else d.posts.push(p); });
            onClose();
          }}>Save</button>
        </div>
      </div>
    </Modal>
  );
}

export const newPost = (brandId: string, channelId: string, date = ""): Post => ({
  id: uid(), brandId, channelId, title: "", body: "", format: "", status: date ? "scheduled" : "idea", date, createdAt: now(),
});

export function Board() {
  const { ws } = useStore();
  const [start, setStart] = useState(weekStart);
  const [editing, setEditing] = useState<Post | null>(null);
  const days = weekDays(start);
  const from = ymd(days[0]), to = ymd(days[6]);
  const inWeek = useMemo(() => ws.posts.filter((p) => p.date >= from && p.date <= to), [ws.posts, from, to]);
  const backlog = ws.posts.filter((p) => !p.date && p.status !== "posted");
  const brandOf = (id: string) => ws.brands.find((b) => b.id === id);
  const chOf = (p: Post) => brandOf(p.brandId)?.channels.find((c) => c.id === p.channelId);
  const shift = (n: number) => { const d = new Date(start); d.setDate(d.getDate() + n * 7); setStart(d); };
  const firstTarget = ws.brands.find((b) => b.channels.length);

  if (!firstTarget) {
    return (
      <>
        <div className="head"><h1>Plan</h1></div>
        <div className="empty"><h3>Add a brand with at least one channel first</h3><p>The plan shows each channel's weekly target against what's scheduled.</p><a className="btn primary" href="#brands">Go to brands</a></div>
      </>
    );
  }

  return (
    <>
      <div className="head">
        <div>
          <h1>Plan</h1>
          <p className="muted">Week of {days[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })}. Click a day to add a post.</p>
        </div>
        <div className="row">
          <button className="btn" onClick={() => shift(-1)} aria-label="Previous week">←</button>
          <button className="btn" onClick={() => setStart(weekStart())}>This week</button>
          <button className="btn" onClick={() => shift(1)} aria-label="Next week">→</button>
          <button className="btn primary" onClick={() => setEditing(newPost(firstTarget.id, firstTarget.channels[0].id))}>New post</button>
        </div>
      </div>

      <div className="card scroll-x">
        <h2 style={{ marginBottom: 8 }}>Fire grid</h2>
        <table className="fire">
          <thead><tr><th>Brand</th><th>Channel</th><th>Target / wk</th><th>This week</th><th style={{ width: "30%" }}>Progress</th><th /></tr></thead>
          <tbody>
            {ws.brands.flatMap((b) => b.channels.map((c) => {
              const n = inWeek.filter((p) => p.channelId === c.id && p.status !== "idea").length;
              const pct = c.cadence ? Math.min(100, (n / c.cadence) * 100) : 0;
              return (
                <tr key={c.id}>
                  <td><span className="row" style={{ flexWrap: "nowrap" }}><BrandDot brand={b} />{b.name}</span></td>
                  <td><span className="row" style={{ flexWrap: "nowrap" }}><Glyph platform={c.platform} />{c.handle || channelName(c)}</span></td>
                  <td className="mono">{c.cadence}</td>
                  <td className="mono" style={{ color: n < c.cadence ? "var(--danger)" : "var(--posted)" }}>{n}</td>
                  <td><div className="meter"><span style={{ width: `${pct}%`, background: pct >= 100 ? "var(--posted)" : undefined }} /></div></td>
                  <td><button className="btn sm" onClick={() => setEditing(newPost(b.id, c.id, ymd(new Date()) < from ? from : ymd(new Date()) > to ? from : ymd(new Date())))}>+ Post</button></td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>

      <div className="scroll-x">
        <div className="week">
          {days.map((d) => {
            const key = ymd(d);
            const list = inWeek.filter((p) => p.date === key);
            return (
              <div className="day" key={key} onClick={(e) => e.target === e.currentTarget && setEditing(newPost(firstTarget.id, firstTarget.channels[0].id, key))}>
                <div className="eyebrow" style={{ color: key === ymd(new Date()) ? "var(--accent)" : undefined }}>{d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</div>
                {list.map((p) => {
                  const c = chOf(p);
                  return (
                    <button className="post" key={p.id} onClick={() => setEditing(p)}>
                      <span className="row" style={{ gap: 5 }}><BrandDot brand={brandOf(p.brandId)} />{c ? <Glyph platform={c.platform} /> : null}<span className={`dot st-${p.status}`} title={p.status} /></span>
                      <span style={{ fontWeight: 600 }}>{p.title || p.body.slice(0, 50) || "Untitled"}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card stack">
        <h2>Backlog <span className="muted small">({backlog.length} without a date)</span></h2>
        {backlog.length === 0 ? <p className="muted">Nothing waiting. Blast an idea from Ideas & dumps to fill it.</p> : (
          <div className="grid">
            {backlog.map((p) => {
              const c = chOf(p);
              return (
                <button className="post" key={p.id} onClick={() => setEditing(p)}>
                  <span className="row" style={{ gap: 6 }}><BrandDot brand={brandOf(p.brandId)} />{c ? <Glyph platform={c.platform} /> : null}<span className="muted">{brandOf(p.brandId)?.name}</span><span className={`dot st-${p.status}`} /></span>
                  <span style={{ fontWeight: 600 }}>{p.title || "Untitled"}</span>
                  <span className="muted">{p.body.slice(0, 120)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {editing ? <PostForm initial={editing} onClose={() => setEditing(null)} /> : null}
    </>
  );
}
