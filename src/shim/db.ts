import { createStore, entries, set, del } from "idb-keyval";

/**
 * A small local database with the same surface the board uses on claude.ai
 * (collection → doc → set/update/replace/delete, onSnapshot). Everything lives
 * in this browser's IndexedDB.
 */
type Data = Record<string, unknown>;
type Snap = { docs: { id: string; exists: boolean; data: () => Data }[] };
type Listener = (snap: Snap) => void;

const store = createStore("hyperdistribution", "docs");
const cols = new Map<string, Map<string, Data>>();
const listeners = new Map<string, Set<Listener>>();
/** Extra read-only docs merged into a collection (e.g. files from the connected folder). */
const virtual = new Map<string, () => Map<string, Data>>();
let loaded: Promise<void> | null = null;

const col = (name: string) => {
  if (!cols.has(name)) cols.set(name, new Map());
  return cols.get(name)!;
};

function load() {
  loaded ??= entries<string, Data>(store).then((all) => {
    for (const [key, data] of all) {
      const i = key.indexOf("/");
      col(key.slice(0, i)).set(key.slice(i + 1), data);
    }
  });
  return loaded;
}

function snapshot(name: string): Snap {
  const merged = new Map(virtual.get(name)?.() ?? []);
  for (const [id, d] of col(name)) merged.set(id, d);
  return { docs: [...merged].map(([id, d]) => ({ id, exists: true, data: () => structuredClone(d) })) };
}

function emit(name: string) {
  const snap = snapshot(name);
  listeners.get(name)?.forEach((l) => {
    try { l(snap); } catch (e) { console.error(e); }
  });
}

const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const clean = (d: Data) => JSON.parse(JSON.stringify(d)) as Data;

function docRef(name: string, id: string) {
  const write = async (data: Data | null) => {
    await load();
    if (data === null) {
      col(name).delete(id);
      await del(`${name}/${id}`, store);
    } else {
      col(name).set(id, data);
      await set(`${name}/${id}`, data, store);
    }
    emit(name);
  };
  return {
    id,
    set: (data: Data) => write(clean(data)),
    replace: (data: Data) => write(clean(data)),
    update: async (patch: Data) => {
      await load();
      const cur = col(name).get(id) ?? virtual.get(name)?.().get(id);
      if (!cur) throw Object.assign(new Error("not found"), { code: "not_found" });
      return write(clean({ ...cur, ...patch }));
    },
    delete: () => write(null),
    get: async () => {
      await load();
      const d = col(name).get(id);
      return { id, exists: !!d, data: () => (d ? structuredClone(d) : undefined) };
    },
  };
}

export const db = {
  collection(name: string) {
    return {
      doc: (id?: string) => docRef(name, id || newId()),
      onSnapshot(cb: Listener, _onErr?: (e: unknown) => void) {
        if (!listeners.has(name)) listeners.set(name, new Set());
        listeners.get(name)!.add(cb);
        load().then(() => cb(snapshot(name)));
        return () => listeners.get(name)?.delete(cb);
      },
    };
  },
};

export function setVirtual(name: string, fn: () => Map<string, Data>) {
  virtual.set(name, fn);
  emit(name);
}
export const refresh = emit;
export const docsOf = async (name: string) => { await load(); return snapshot(name).docs.map((d) => ({ ...d.data(), id: d.id })); };
