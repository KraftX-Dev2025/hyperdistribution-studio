import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { get, set } from "idb-keyval";
import { emptyWorkspace, type Workspace } from "./types";

const KEY = "distribution:workspace";

type Ctx = {
  ws: Workspace;
  ready: boolean;
  update: (fn: (draft: Workspace) => void) => void;
  replace: (ws: Workspace) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ws, setWs] = useState<Workspace>(emptyWorkspace);
  const [ready, setReady] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    get<Workspace>(KEY)
      .then((saved) => {
        if (saved && saved.version === 1) setWs({ ...emptyWorkspace(), ...saved, settings: { ...emptyWorkspace().settings, ...saved.settings } });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const latest = useRef<Workspace | null>(null);
  useEffect(() => {
    if (!ready) return;
    latest.current = ws;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { latest.current = null; set(KEY, ws).catch(() => {}); }, 250);
  }, [ws, ready]);
  useEffect(() => {
    // Flush a pending save when the tab is hidden or closed.
    const flush = () => { if (latest.current) { window.clearTimeout(timer.current); set(KEY, latest.current).catch(() => {}); latest.current = null; } };
    addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    return () => { removeEventListener("pagehide", flush); document.removeEventListener("visibilitychange", flush); };
  }, []);

  const update = useCallback((fn: (draft: Workspace) => void) => {
    setWs((prev) => {
      const draft = structuredClone(prev);
      fn(draft);
      return draft;
    });
  }, []);

  const replace = useCallback((next: Workspace) => setWs({ ...emptyWorkspace(), ...next }), []);

  return <StoreCtx.Provider value={{ ws, ready, update, replace }}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside StoreProvider");
  return c;
}

export function exportWorkspace(ws: Workspace) {
  const clean = { ...ws, settings: { ...ws.settings, apiKey: "" } }; // never export the key
  const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `distribution-workspace-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
