import { useState } from "react";
import { saveFile } from "../../shim/native";
import { isNative } from "../../shim/platform";
import type { ScreenProps } from "../App";
import { isVideo, pf } from "../platforms";
import { dayLabel, savePost, thisWeek, useCollection, type Post, type Render } from "../store";
import { Glyph, Icon, Mono, toast } from "../ui";

async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

export default function Publish({ brands, posts }: ScreenProps) {
  const renders = useCollection<Render>("renders");
  const [showPosted, setShowPosted] = useState(false);
  const brandOf = (id: string) => brands.find((b) => b.id === id);
  const videoOf = (p: Post) => renders.filter((r) => r.postId === p.id && r.status === "done" && r.output?.assetUrl).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))[0];

  const queue = posts.filter((p) => p.status === "scheduled").sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const week = thisWeek();
  const posted = posts.filter((p) => p.status === "posted" && week.includes(p.date ?? "")).sort((a, b) => (b.postedAt ?? 0) - (a.postedAt ?? 0));
  const days = [...new Set(queue.map((p) => p.date ?? ""))];

  const share = async (p: Post) => {
    const caption = [p.title, p.notes].filter(Boolean).join("\n\n");
    const copied = await copy(caption);
    const v = videoOf(p);
    if (v) {
      const blob = await fetch(v.output!.assetUrl).then((r) => r.blob()).catch(() => null);
      if (!blob) return toast("Couldn't open the video. Render it again in Edit.");
      if (copied) toast("Caption copied · paste it in the app");
      return saveFile(blob, `${(brandOf(p.brandId)?.name ?? "hypermixer").replace(/\W+/g, "-").toLowerCase()}-${p.date || "post"}.mp4`);
    }
    if (!isNative && navigator.share) { try { await navigator.share({ text: caption }); return; } catch { /* cancelled */ } }
    toast(copied ? `Caption copied · paste it in ${pf(p.platform).label}` : "Couldn't copy. Long-press the caption in Edit.");
  };
  const markPosted = async (p: Post) => { await savePost(p.id, { status: "posted", postedAt: Date.now(), date: p.date || week[0] }); toast("Marked as posted"); };

  return (
    <main className="screen">
      <header className="head">
        <div>
          <h1>Publish</h1>
          <p>Edited posts, lined up by time. Share sends the video and caption to the app.</p>
        </div>
      </header>

      {queue.length ? days.map((d) => (
        <section key={d} className="stack" aria-label={dayLabel(d)}>
          <div className="eyebrow">{dayLabel(d)}</div>
          <div className="card list">
            {queue.filter((p) => (p.date ?? "") === d).map((p) => {
              const b = brandOf(p.brandId);
              const needsVideo = isVideo(p.format) && !videoOf(p);
              return (
                <div key={p.id} className="stack" style={{ padding: "12px 14px", gap: 10 }}>
                  <div className="row">
                    <span style={{ position: "relative", flex: "none" }}>
                      <Mono brand={b} />
                      <span style={{ position: "absolute", right: -5, bottom: -5, border: "2px solid var(--surface)", borderRadius: 8, display: "flex" }}><Glyph platform={p.platform} small /></span>
                    </span>
                    <div className="grow stack" style={{ gap: 0 }}>
                      <strong className="ellipsis">{p.title}</strong>
                      <span className="small muted">{p.time || "Any time"} · {pf(p.platform).label} {p.format}</span>
                    </div>
                    <span className={`tag ${needsVideo ? "warn" : "info"}`}>{needsVideo ? "Needs video" : "Ready"}</span>
                  </div>
                  <div className="row wrap" style={{ gap: 8 }}>
                    {needsVideo
                      ? <a className="btn pill primary" href={`#/edit/${p.id}`}>Render in Edit</a>
                      : <button type="button" className="btn pill primary" onClick={() => share(p)}><Icon name="share" size={16} />Share to {pf(p.platform).label}</button>}
                    <button type="button" className="btn pill" onClick={() => copy([p.title, p.notes].filter(Boolean).join("\n\n")).then((ok) => toast(ok ? "Caption copied" : "Couldn't copy"))}><Icon name="copy" size={16} />Caption</button>
                    <button type="button" className="btn pill" onClick={() => markPosted(p)}><Icon name="check" size={16} />Posted</button>
                    <a className="btn pill" href={`#/edit/${p.id}`} aria-label={`Edit ${p.title}`}><Icon name="edit" size={16} /></a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )) : (
        <div className="empty">
          <h2>Nothing scheduled</h2>
          <p>Finish a post in Edit and send it here.</p>
          <a className="btn primary" href="#/edit">Go to Edit</a>
        </div>
      )}

      {posted.length > 0 && (
        <section className="stack">
          <button type="button" className="btn" style={{ alignSelf: "flex-start" }} aria-expanded={showPosted} onClick={() => setShowPosted(!showPosted)}>
            Posted this week · {posted.length}
          </button>
          {showPosted && (
            <div className="card list">
              {posted.map((p) => (
                <div key={p.id} className="item">
                  <Mono brand={brandOf(p.brandId)} size={34} />
                  <div className="grow stack" style={{ gap: 0 }}>
                    <span className="ellipsis">{p.title}</span>
                    <span className="small muted">{dayLabel(p.date)} · {pf(p.platform).label}</span>
                  </div>
                  <button type="button" className="btn pill" onClick={() => savePost(p.id, { status: "scheduled" })}>Undo</button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
