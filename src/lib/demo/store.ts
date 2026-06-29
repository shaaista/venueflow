import { generateDemoData } from "./seed";
import type { Collections } from "./types";

const STORAGE_KEY = "vf_demo_db_v5";

type Entity = { id: string; organizationId: string; [k: string]: unknown };

function load(): Collections {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Collections;
    } catch {
      /* fall through to fresh seed */
    }
  }
  const seeded = generateDemoData();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    } catch {
      /* ignore quota */
    }
  }
  return seeded;
}

let db: Collections = load();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* ignore */
  }
}

/** Simulated network latency so loading skeletons are visible — feels real. */
const delay = (ms = 160) => new Promise<void>((r) => setTimeout(r, ms));

let counter = Date.now();
function genId(prefix: string) {
  counter += 1;
  return `${prefix}_${counter.toString(36)}`;
}

type Key = keyof Collections;

/**
 * In-memory, tenant-scoped mock store with the same CRUD surface the real API
 * exposes. Async on purpose. Swappable for a Postgres-backed client later.
 */
export const demoStore = {
  async list<K extends Key>(key: K, orgId: string): Promise<Collections[K]> {
    await delay();
    return (db[key] as Entity[]).filter((x) => x.organizationId === orgId && !x["deletedAt"]) as Collections[K];
  },

  async get<K extends Key>(key: K, orgId: string, id: string): Promise<Collections[K][number] | null> {
    await delay(120);
    return ((db[key] as Entity[]).find((x) => x.organizationId === orgId && x.id === id) ?? null) as Collections[K][number] | null;
  },

  async create<K extends Key>(key: K, item: Collections[K][number]): Promise<Collections[K][number]> {
    await delay(140);
    const withId = { ...(item as Entity), id: (item as Entity).id || genId(String(key).slice(0, 3).toUpperCase()) };
    (db[key] as Entity[]).unshift(withId);
    persist();
    return withId as Collections[K][number];
  },

  async update<K extends Key>(key: K, id: string, patch: Partial<Collections[K][number]>): Promise<Collections[K][number] | undefined> {
    await delay(120);
    const arr = db[key] as Entity[];
    const idx = arr.findIndex((x) => x.id === id);
    if (idx === -1) return undefined;
    arr[idx] = { ...arr[idx], ...(patch as Entity) };
    persist();
    return arr[idx] as Collections[K][number];
  },

  async remove<K extends Key>(key: K, id: string): Promise<void> {
    await delay(120);
    const arr = db[key] as Entity[];
    const idx = arr.findIndex((x) => x.id === id);
    if (idx !== -1) {
      arr.splice(idx, 1);
      persist();
    }
  },

  /** Synchronous tenant-scoped read (for non-React contexts). */
  peek<K extends Key>(key: K, orgId: string): Collections[K] {
    return (db[key] as Entity[]).filter((x) => x.organizationId === orgId) as Collections[K];
  },

  newId: genId,

  /** Bulk-insert a new tenant's generated dataset (used by onboarding). */
  addTenantData(data: Collections) {
    (Object.keys(data) as (keyof Collections)[]).forEach((key) => {
      (db[key] as Entity[]).push(...(data[key] as unknown as Entity[]));
    });
    persist();
  },

  /** Re-seed everything (used by the onboarding "reset demo" action). */
  reset() {
    db = generateDemoData();
    persist();
  },
};
