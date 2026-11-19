import type { View } from "../App";
import { useStore } from "../lib/store";
import { useMedia } from "../lib/media";

export function Home({ go }: { go: (v: View) => void }) {
  const { ws } = useStore();
  const media = useMedia();
  const steps: { done: boolean; title: string; body: string; view: View; cta: string }[] = [
    { done: !!ws.settings.apiKey, title: "Add your Claude API key", body: "Brand brains, ideas, blasts and scripts run on Claude with your own key. It stays in this browser.", view: "settings", cta: "Open settings" },
    { done: media.items.length > 0, title: "Connect your media folder", body: "Point at a folder of your photos, clips and music. Nothing is uploaded; files are read in your browser.", view: "media", cta: "Connect folder" },
    { done: ws.brands.length > 0, title: "Add a brand and its channels", body: "Paste its website and profile links. Claude reads them and builds a brand brain: voice, audience, pillars, hooks.", view: "brands", cta: "Add a brand" },
    { done: ws.dumps.length > 0, title: "Dump ideas, then blast them", body: "Throw in raw thoughts and links. Turn them into ideas, and blast one idea across every brand and channel at once.", view: "ideas", cta: "Open ideas" },
    { done: ws.scripts.length > 0, title: "Script and edit a video", body: "Claude writes the script and picks clips from your folder. Preview the edit live and export an MP4 in the browser.", view: "studio", cta: "Open studio" },
  ];
  const next = steps.find((s) => !s.done);
  const posts = ws.posts;
  return (
    <>
      <div className="head">
        <div>
          <div className="eyebrow">Free and open source</div>
          <h1>Your content, end to end</h1>
          <p className="muted" style={{ maxWidth: 640, marginTop: 6 }}>
            Connect a folder of media, describe your brands, and HyperDistribution Studio plans posts across 50+ channels, writes scripts and cuts videos with Remotion.
          </p>
        </div>
        {next ? <button className="btn primary" onClick={() => go(next.view)}>{next.cta}</button> : null}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))" }}>
        {[
          ["Brands", ws.brands.length],
          ["Channels", ws.brands.reduce((n, b) => n + b.channels.length, 0)],
          ["Ideas waiting", ws.dumps.filter((d) => !d.used).length],
          ["Posts planned", posts.filter((p) => p.status === "scheduled").length],
          ["Posted", posts.filter((p) => p.status === "posted").length],
          ["Media files", media.items.length],
        ].map(([k, v]) => (
          <div className="card" key={k}>
            <div className="eyebrow">{k}</div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 28, fontWeight: 700 }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="stack">
        {steps.map((s, i) => (
          <div className="card row" key={s.title} style={{ justifyContent: "space-between", opacity: s.done ? 0.65 : 1 }}>
            <div className="row" style={{ gap: 14, flexWrap: "nowrap" }}>
              <span className="glyph" style={{ background: s.done ? "var(--posted)" : "var(--accent)", minWidth: 28, height: 28, fontSize: 13 }}>{s.done ? "✓" : i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p className="muted">{s.body}</p>
              </div>
            </div>
            <button className={`btn${s.done ? "" : " primary"}`} onClick={() => go(s.view)}>{s.done ? "Open" : s.cta}</button>
          </div>
        ))}
      </div>
    </>
  );
}
