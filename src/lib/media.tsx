import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { del, get, set } from "idb-keyval";

export type MediaKind = "video" | "image" | "audio";
export type MediaItem = {
  path: string; // relative to the connected folder, e.g. "trips/goa.mp4"
  name: string;
  kind: MediaKind;
  size: number;
  modified: number;
  url: string; // object URL, valid for this tab only
  duration?: number; // seconds, video/audio
  width?: number;
  height?: number;
  thumb?: string; // small JPEG data URL
};

const EXT: Record<string, MediaKind> = {
  mp4: "video", mov: "video", m4v: "video", webm: "video",
  jpg: "image", jpeg: "image", png: "image", webp: "image", gif: "image", avif: "image",
  mp3: "audio", wav: "audio", m4a: "audio", aac: "audio", ogg: "audio",
};
const HANDLE_KEY = "distribution:folder";
const MAX_FILES = 2000;

type DirHandle = FileSystemDirectoryHandle & {
  values(): AsyncIterable<FileSystemHandle>;
  queryPermission(o: { mode: "read" }): Promise<PermissionState>;
  requestPermission(o: { mode: "read" }): Promise<PermissionState>;
};

type Ctx = {
  folderName: string | null;
  items: MediaItem[];
  scanning: boolean;
  needsReconnect: boolean;
  supportsPicker: boolean;
  connect: () => Promise<void>;
  reconnect: () => Promise<void>;
  loadFromInput: (files: FileList) => void;
  disconnect: () => Promise<void>;
  byPath: (p: string) => MediaItem | undefined;
};

const MediaCtx = createContext<Ctx | null>(null);

function kindOf(name: string): MediaKind | null {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return EXT[ext] ?? null;
}

async function walk(dir: DirHandle, prefix: string, out: { file: File; path: string }[]) {
  for await (const h of dir.values()) {
    if (out.length >= MAX_FILES) return;
    if (h.name.startsWith(".")) continue;
    if (h.kind === "directory") await walk(h as DirHandle, `${prefix}${h.name}/`, out);
    else if (kindOf(h.name)) out.push({ file: await (h as FileSystemFileHandle).getFile(), path: prefix + h.name });
  }
}

function toItems(files: { file: File; path: string }[]): MediaItem[] {
  return files
    .map(({ file, path }) => ({
      path,
      name: file.name,
      kind: kindOf(file.name)!,
      size: file.size,
      modified: file.lastModified,
      url: URL.createObjectURL(file),
    }))
    .sort((a, b) => b.modified - a.modified);
}

/** Reads duration, size and a small thumbnail so Claude can "see" the library. */
async function probe(item: MediaItem): Promise<Partial<MediaItem>> {
  const canvas = document.createElement("canvas");
  const shot = (el: CanvasImageSource, w: number, h: number) => {
    const scale = 240 / Math.max(w, h);
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    canvas.getContext("2d")!.drawImage(el, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.6);
  };
  if (item.kind === "image") {
    const img = new Image();
    img.src = item.url;
    await img.decode();
    return { width: img.naturalWidth, height: img.naturalHeight, thumb: shot(img, img.naturalWidth, img.naturalHeight) };
  }
  const el = document.createElement(item.kind === "video" ? "video" : "audio") as HTMLVideoElement;
  el.muted = true;
  el.preload = "metadata";
  el.src = item.url;
  await new Promise<void>((res, rej) => {
    el.onloadedmetadata = () => res();
    el.onerror = () => rej(new Error("unreadable"));
  });
  const duration = el.duration;
  if (item.kind === "audio") return { duration };
  el.currentTime = Math.min(1, duration / 2);
  await new Promise<void>((res) => {
    el.onseeked = () => res();
    setTimeout(res, 3000);
  });
  return { duration, width: el.videoWidth, height: el.videoHeight, thumb: shot(el, el.videoWidth, el.videoHeight) };
}

export function MediaProvider({ children }: { children: ReactNode }) {
  const [folderName, setFolderName] = useState<string | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [scanning, setScanning] = useState(false);
  const [stored, setStored] = useState<DirHandle | null>(null);
  const supportsPicker = typeof window !== "undefined" && "showDirectoryPicker" in window;

  const ingest = useCallback(async (files: { file: File; path: string }[], name: string) => {
    setItems((old) => {
      old.forEach((i) => URL.revokeObjectURL(i.url));
      return [];
    });
    const list = toItems(files);
    setFolderName(name);
    setItems(list);
    // Probe in small batches so the UI stays responsive.
    for (let i = 0; i < list.length; i += 4) {
      const batch = list.slice(i, i + 4);
      const results = await Promise.all(batch.map((it) => probe(it).catch(() => ({}))));
      setItems((cur) => cur.map((it) => {
        const k = batch.findIndex((b) => b.path === it.path);
        return k >= 0 ? { ...it, ...results[k] } : it;
      }));
    }
  }, []);

  const scan = useCallback(async (dir: DirHandle) => {
    setScanning(true);
    try {
      const out: { file: File; path: string }[] = [];
      await walk(dir, "", out);
      await ingest(out, dir.name);
    } finally {
      setScanning(false);
    }
  }, [ingest]);

  useEffect(() => {
    get<DirHandle>(HANDLE_KEY).then(async (h) => {
      if (!h) return;
      if ((await h.queryPermission({ mode: "read" })) === "granted") scan(h);
      else { setStored(h); setFolderName(h.name); }
    }).catch(() => {});
  }, [scan]);

  const connect = useCallback(async () => {
    const dir = (await (window as unknown as { showDirectoryPicker: (o: object) => Promise<DirHandle> }).showDirectoryPicker({ mode: "read" }));
    await set(HANDLE_KEY, dir).catch(() => {});
    setStored(null);
    await scan(dir);
  }, [scan]);

  const reconnect = useCallback(async () => {
    if (!stored) return;
    if ((await stored.requestPermission({ mode: "read" })) === "granted") {
      setStored(null);
      await scan(stored);
    }
  }, [stored, scan]);

  const loadFromInput = useCallback((files: FileList) => {
    const arr = Array.from(files).filter((f) => kindOf(f.name));
    const name = (arr[0] as File & { webkitRelativePath?: string })?.webkitRelativePath?.split("/")[0] || "Uploaded files";
    ingest(arr.slice(0, MAX_FILES).map((file) => {
      const rel = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
      return { file, path: rel.includes("/") ? rel.split("/").slice(1).join("/") : rel };
    }), name);
  }, [ingest]);

  const disconnect = useCallback(async () => {
    await del(HANDLE_KEY).catch(() => {});
    items.forEach((i) => URL.revokeObjectURL(i.url));
    setItems([]);
    setFolderName(null);
    setStored(null);
  }, [items]);

  const byPath = useCallback((p: string) => items.find((i) => i.path === p), [items]);

  return (
    <MediaCtx.Provider value={{ folderName, items, scanning, needsReconnect: !!stored, supportsPicker, connect, reconnect, loadFromInput, disconnect, byPath }}>
      {children}
    </MediaCtx.Provider>
  );
}

export function useMedia() {
  const c = useContext(MediaCtx);
  if (!c) throw new Error("useMedia outside MediaProvider");
  return c;
}

export const fmtDur = (s?: number) => (s == null || !isFinite(s) ? "" : `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`);
