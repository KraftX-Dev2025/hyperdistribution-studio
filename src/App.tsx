import { useEffect, useState } from "react";
import { useStore } from "./lib/store";
import { useMedia } from "./lib/media";
import { ToastProvider } from "./ui";
import { REPO_URL } from "./config";
import { Home } from "./views/Home";
import { Brands } from "./views/Brands";
import { Board } from "./views/Board";
import { Ideas } from "./views/Ideas";
import { Studio } from "./views/Studio";
import { Media } from "./views/Media";
import { Settings } from "./views/Settings";

const VIEWS = ["home", "brands", "board", "ideas", "studio", "media", "settings"] as const;
export type View = (typeof VIEWS)[number];
const LABELS: Record<View, string> = { home: "Start", brands: "Brands", board: "Plan", ideas: "Ideas & dumps", studio: "Scripts & edits", media: "Media folder", settings: "Settings" };

const fromHash = (): View => {
  const h = location.hash.slice(1) as View;
  return VIEWS.includes(h) ? h : "home";
};

export default function App() {
  const { ws, ready } = useStore();
  const media = useMedia();
  const [view, setView] = useState<View>(fromHash);
  useEffect(() => {
    const on = () => setView(fromHash());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  const go = (v: View) => { location.hash = v; setView(v); };

  const counts: Partial<Record<View, number>> = {
    brands: ws.brands.length,
    board: ws.posts.filter((p) => p.status !== "posted").length,
    ideas: ws.dumps.filter((d) => !d.used).length,
    studio: ws.scripts.length,
    media: media.items.length,
  };

  if (!ready) return null;
  return (
    <ToastProvider>
      <div className="shell">
        <nav className="side" aria-label="Sections">
          <div className="logo"><img src="/favicon.svg" alt="" /><span>HyperDistribution<br />Studio</span></div>
          {VIEWS.map((v) => (
            <button key={v} className={`nav${view === v ? " on" : ""}`} onClick={() => go(v)} aria-current={view === v ? "page" : undefined}>
              {LABELS[v]}
              {counts[v] ? <span className="n">{counts[v]}</span> : null}
            </button>
          ))}
          <div className="foot">
            <span>Your data stays in this browser.</span>
            <a href={REPO_URL} target="_blank" rel="noreferrer">Open source on GitHub</a>
          </div>
        </nav>
        <main className="main">
          {view === "home" && <Home go={go} />}
          {view === "brands" && <Brands />}
          {view === "board" && <Board />}
          {view === "ideas" && <Ideas />}
          {view === "studio" && <Studio />}
          {view === "media" && <Media />}
          {view === "settings" && <Settings />}
        </main>
      </div>
    </ToastProvider>
  );
}
