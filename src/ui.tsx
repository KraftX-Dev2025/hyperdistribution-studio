import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { PLATFORMS } from "./lib/platforms";
import type { Brand, Channel } from "./lib/types";

type ToastFn = (msg: string, err?: boolean) => void;
const ToastCtx = createContext<ToastFn>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState<{ msg: string; err: boolean } | null>(null);
  const show = useCallback<ToastFn>((msg, err = false) => {
    setT({ msg, err });
    window.setTimeout(() => setT((cur) => (cur?.msg === msg ? null : cur)), err ? 6000 : 3000);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {t ? <div className={`toast${t.err ? " err" : ""}`} role="status">{t.msg}</div> : null}
    </ToastCtx.Provider>
  );
}

export const Glyph = ({ platform }: { platform: string }) => {
  const p = PLATFORMS[platform] ?? PLATFORMS.other;
  return <span className="glyph" style={{ background: p.c }} title={p.label}>{p.g}</span>;
};

export const channelName = (c: Channel) => (c.platform === "other" && c.label ? c.label : PLATFORMS[c.platform]?.label ?? c.platform);

export const BrandDot = ({ brand }: { brand?: Brand }) => <span className="dot" style={{ background: brand?.color ?? "var(--idea)" }} />;

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-label={title}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>{title}</h2>
          <button className="btn ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const weekStart = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};
export const weekDays = (start: Date) => Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
