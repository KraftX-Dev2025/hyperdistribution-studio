import { useEffect, useState, type ReactNode } from "react";
import { pf } from "./platforms";
import type { Brand } from "./store";

const HEX = /^#[0-9a-f]{6}$/i;
export const brandColor = (b?: Partial<Brand>) => (HEX.test(b?.color ?? "") ? b!.color! : "#5C6176");
export const brandColor2 = (b?: Partial<Brand>) => (HEX.test(b?.color2 ?? "") ? b!.color2! : brandColor(b));
export const initials = (name = "?") =>
  name.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

export function Mono({ brand, size = 40 }: { brand?: Partial<Brand>; size?: number }) {
  return (
    <span className="mono" style={{ background: brandColor(brand), width: size, height: size, fontSize: size * 0.36, borderRadius: size * 0.3 }} aria-hidden="true">
      {initials(brand?.name)}
    </span>
  );
}

export function Glyph({ platform, small }: { platform?: string; small?: boolean }) {
  const p = pf(platform);
  return <span className={small ? "glyph sm" : "glyph"} style={{ background: p.c }} title={p.label} aria-label={p.label} role="img">{p.g}</span>;
}

const ICONS: Record<string, string> = {
  home: "M3 12 12 4l9 8M5 10v10h14V10",
  brands: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  swipe: "M7 4h10a2 2 0 0 1 2 2v14l-7-4-7 4V6a2 2 0 0 1 2-2z",
  edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  publish: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
  link: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  plus: "M12 5v14M5 12h14",
  check: "M20 6 9 17l-5-5",
  x: "M6 6l12 12M18 6 6 18",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  share: "M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M8 7l4-4 4 4",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  back: "M15 18 9 12l6-6",
};
export function Icon({ name, size = 22, stroke = 2 }: { name: keyof typeof ICONS | string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="sheet-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="row">
          <h2 className="grow">{title}</h2>
          <button type="button" className="btn icon" aria-label="Close" onClick={onClose}><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

let pushToast: (m: string) => void = () => {};
export const toast = (m: string) => pushToast(m);
export function Toaster() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    pushToast = (m) => { setMsg(m); clearTimeout(t); t = setTimeout(() => setMsg(""), 3200); };
  }, []);
  return msg ? <div className="toast" role="status">{msg}</div> : null;
}

export const errText = (e: unknown) => (e instanceof Error ? e.message : String(e)) || "Something went wrong";
