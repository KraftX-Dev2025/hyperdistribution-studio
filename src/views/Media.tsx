import { useRef, useState } from "react";
import { fmtDur, useMedia, type MediaItem, type MediaKind } from "../lib/media";
import { Modal, useToast } from "../ui";

function Thumb({ m, selected, onClick }: { m: MediaItem; selected?: boolean; onClick?: () => void }) {
  return (
    <button type="button" className={`thumb${selected ? " sel" : ""}`} onClick={onClick} title={m.path} style={{ padding: 0, cursor: onClick ? "pointer" : "default" }}>
      {m.thumb ? <img src={m.thumb} alt="" loading="lazy" /> : <div style={{ display: "grid", placeItems: "center", height: "100%", fontSize: 28 }}>{m.kind === "audio" ? "♪" : "…"}</div>}
      <div className="meta">{m.kind === "image" ? "" : `${fmtDur(m.duration)} · `}{m.name}</div>
    </button>
  );
}

export function ConnectButtons() {
  const media = useMedia();
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="row">
      {media.needsReconnect ? <button className="btn primary" onClick={media.reconnect}>Reconnect “{media.folderName}”</button> : null}
      {media.supportsPicker ? (
        <button className={`btn${media.needsReconnect ? "" : " primary"}`} onClick={() => media.connect().catch((e) => e?.name !== "AbortError" && toast("Couldn't open that folder", true))}>
          {media.folderName ? "Choose another folder" : "Connect a folder"}
        </button>
      ) : (
        <>
          <button className="btn primary" onClick={() => input.current?.click()}>Choose a folder</button>
          <input ref={input} type="file" hidden multiple {...{ webkitdirectory: "" }} onChange={(e) => e.target.files && media.loadFromInput(e.target.files)} />
        </>
      )}
      {media.folderName ? <button className="btn ghost" onClick={media.disconnect}>Disconnect</button> : null}
    </div>
  );
}

export function Media() {
  const media = useMedia();
  const [kind, setKind] = useState<MediaKind | "all">("all");
  const [q, setQ] = useState("");
  const list = media.items.filter((m) => (kind === "all" || m.kind === kind) && m.path.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="head">
        <div>
          <h1>Media folder</h1>
          <p className="muted">
            {media.folderName ? <>Connected to <b>{media.folderName}</b>{media.scanning ? ", scanning…" : `, ${media.items.length} files`}.</> : "Connect the folder where your photos, clips and music live."} Files never leave your computer; edits are rendered in your browser.
          </p>
        </div>
        <ConnectButtons />
      </div>
      {!media.supportsPicker ? <p className="muted small">Your browser can't remember folders, so you'll choose it again on each visit. Chrome, Edge and Arc remember it.</p> : null}
      {media.items.length ? (
        <>
          <div className="row">
            {(["all", "video", "image", "audio"] as const).map((k) => (
              <button key={k} className={`btn sm${kind === k ? " primary" : ""}`} onClick={() => setKind(k)}>
                {k === "all" ? "All" : k[0].toUpperCase() + k.slice(1)} {k === "all" ? media.items.length : media.items.filter((m) => m.kind === k).length}
              </button>
            ))}
            <input className="i" style={{ maxWidth: 240 }} placeholder="Search file names" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="media-grid">{list.slice(0, 400).map((m) => <Thumb key={m.path} m={m} />)}</div>
          {list.length > 400 ? <p className="muted">Showing 400 of {list.length}. Search to narrow it down.</p> : null}
        </>
      ) : media.folderName && !media.scanning && !media.needsReconnect ? (
        <div className="empty">No photos, videos or audio found in that folder.</div>
      ) : null}
    </>
  );
}

export function MediaPicker({ selected, onPick, onClose, kinds, single }: { selected: string[]; onPick: (paths: string[]) => void; onClose: () => void; kinds?: MediaKind[]; single?: boolean }) {
  const media = useMedia();
  const [sel, setSel] = useState<string[]>(selected);
  const [q, setQ] = useState("");
  const list = media.items.filter((m) => (!kinds || kinds.includes(m.kind)) && m.path.toLowerCase().includes(q.toLowerCase())).slice(0, 300);
  return (
    <Modal title="Pick from your media" onClose={onClose}>
      {!media.items.length ? <div className="empty"><p>No folder connected yet.</p><ConnectButtons /></div> : (
        <>
          <input className="i" placeholder="Search file names" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="media-grid">
            {list.map((m) => (
              <Thumb key={m.path} m={m} selected={sel.includes(m.path)} onClick={() => single ? onPick([m.path]) : setSel(sel.includes(m.path) ? sel.filter((s) => s !== m.path) : [...sel, m.path])} />
            ))}
          </div>
          {!single ? (
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn" onClick={onClose}>Cancel</button>
              <button className="btn primary" onClick={() => onPick(sel)}>Use {sel.length} file{sel.length === 1 ? "" : "s"}</button>
            </div>
          ) : null}
        </>
      )}
    </Modal>
  );
}
