import { useRef, useState } from "react";
import { draftPosts, hasKey } from "../ai";
import { go, type ScreenProps } from "../App";
import { isVideo, pf } from "../platforms";
import { addPost, deletePost, savePost, type Post } from "../store";
import { brandColor, errText, Icon, initials, toast } from "../ui";

const THRESHOLD = 110;

export default function Swipe({ brands, posts }: ScreenProps) {
  const queue = posts.filter((p) => p.status === "idea").sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
  const [busy, setBusy] = useState("");
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState<0 | 1 | -1>(0);
  const start = useRef<number | null>(null);
  const brandOf = (id: string) => brands.find((b) => b.id === id);
  const card = queue[0];
  const brand = card ? brandOf(card.brandId) : undefined;
  const chan = brand?.channels?.find((c) => c.id === card?.channelId);

  const decide = async (yes: boolean, p: Post | undefined = card) => {
    if (!p || leaving) return;
    setLeaving(yes ? 1 : -1);
    setTimeout(async () => {
      try {
        if (yes) {
          await savePost(p.id, { status: "drafting", approvedAt: Date.now() } as Partial<Post>);
          toast(isVideo(p.format) ? "Approved · waiting in Edit" : "Approved · in Edit to schedule");
        } else await deletePost(p.id);
      } catch (e) { toast(errText(e)); }
      setLeaving(0); setDx(0);
    }, 180);
  };

  const generate = async () => {
    if (!hasKey()) { toast("Connect Claude first"); return go("connect"); }
    const ready = brands.filter((b) => (b.channels ?? []).length);
    if (!ready.length) { toast("Give a brand at least one channel"); return go("brands"); }
    let n = 0;
    for (const b of ready) {
      setBusy(`Drafting for ${b.name}…`);
      try {
        for (const d of await draftPosts(b, 4)) {
          const c = b.channels!.find((x) => x.id === d.channelId)!;
          await addPost({ brandId: b.id, channelId: c.id, platform: c.platform, title: d.hook, notes: d.caption, format: d.format, why: d.why, status: "idea", date: "" });
          n++;
        }
      } catch (e) { toast(`${b.name}: ${errText(e)}`); }
    }
    setBusy("");
    if (n) toast(`${n} new drafts to swipe`);
  };

  const [dragging, setDragging] = useState(false);
  const onDown = (e: React.PointerEvent) => { start.current = e.clientX; setDragging(true); (e.currentTarget as Element).setPointerCapture?.(e.pointerId); };
  const onMove = (e: React.PointerEvent) => { if (start.current !== null) setDx(e.clientX - start.current); };
  const onUp = () => {
    if (start.current === null) return;
    start.current = null;
    setDragging(false);
    if (Math.abs(dx) > THRESHOLD) decide(dx > 0); else setDx(0);
  };
  const shift = leaving ? leaving * 600 : dx;

  return (
    <main className="screen">
      <header className="head">
        <div>
          <h1>Swipe</h1>
          <p>Right to approve, left to skip.</p>
        </div>
        <div className="stack" style={{ alignItems: "flex-end", gap: 0 }}>
          <b style={{ font: "700 22px var(--f-display)" }}>{queue.length}</b>
          <span className="small muted">drafts left</span>
        </div>
      </header>

      {card ? (
        <>
          <div className="deck">
            {queue.length > 2 && <div className="ghost" style={{ left: 20, right: 20, top: 0, bottom: 24 }} />}
            {queue.length > 1 && <div className="ghost" style={{ left: 10, right: 10, top: 10, bottom: 12 }} />}
            <article className="swipe-card" aria-label={`Draft for ${brand?.name ?? "brand"}: ${card.title}`}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
              style={{ transform: `translateX(${shift}px) rotate(${shift / 24}deg)`, transition: dragging ? "none" : "transform .18s ease-out", opacity: leaving ? 0 : 1 }}>
              <div className="top" style={{ background: brandColor(brand) }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="chip">
                    <span style={{ width: 22, height: 22, borderRadius: 7, background: "#fff", color: brandColor(brand), display: "grid", placeItems: "center", font: "700 9.5px var(--f-display)" }}>{initials(brand?.name)}</span>
                    {brand?.name ?? "Unknown brand"}
                  </span>
                  <span className="chip" style={{ padding: "5px 10px" }}>{pf(card.platform ?? chan?.platform).label} · {card.format || "Post"}</span>
                </div>
                <div className="hook">{card.title}</div>
              </div>
              <div className="body">
                <div className="eyebrow">{isVideo(card.format) ? "Script" : "Caption"}</div>
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{card.notes || "No caption yet."}</p>
                {card.why && <span className="tag plain" style={{ alignSelf: "flex-start", marginTop: "auto" }}>{card.why}</span>}
              </div>
              {Math.abs(dx) > 30 && (
                <span className="stamp" style={dx > 0 ? { left: 18, color: "var(--ok)", borderColor: "var(--ok)", transform: "rotate(-10deg)" } : { right: 18, color: "var(--bad)", borderColor: "var(--bad)", transform: "rotate(10deg)" }}>
                  {dx > 0 ? "APPROVE" : "SKIP"}
                </span>
              )}
            </article>
          </div>
          <div className="actions">
            <button type="button" className="round no" aria-label="Skip draft" onClick={() => decide(false)}><Icon name="x" size={26} stroke={2.4} /></button>
            <a className="round sm" style={{ color: "var(--ink)" }} aria-label="Approve and edit now" href={`#/edit/${card.id}`} onClick={() => savePost(card.id, { status: "drafting" })}><Icon name="edit" /></a>
            <button type="button" className="round yes" aria-label="Approve draft" onClick={() => decide(true)}><Icon name="check" size={28} stroke={2.6} /></button>
          </div>
        </>
      ) : (
        <div className="empty">
          <h2>{posts.some((p) => p.status === "drafting") ? "All caught up" : "Nothing to swipe yet"}</h2>
          <p>{brands.length ? "Claude drafts posts for every brand and channel in its voice. You only judge." : "Add a brand first, then come back for drafts."}</p>
          {brands.length
            ? <button type="button" className="btn primary" disabled={!!busy} onClick={generate}><Icon name="spark" size={18} />{busy || "Draft new posts"}</button>
            : <button type="button" className="btn primary" onClick={() => go("brands")}>Add a brand</button>}
          {posts.some((p) => p.status === "drafting") && <a className="btn" href="#/edit">Go to Edit</a>}
        </div>
      )}
      {card && <button type="button" className="btn" disabled={!!busy} onClick={generate} style={{ alignSelf: "center" }}><Icon name="spark" size={18} />{busy || "Draft more"}</button>}
    </main>
  );
}
