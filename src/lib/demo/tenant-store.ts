import { TENANTS as DEFAULT_TENANTS, type Tenant } from "./tenants";
import { generateTenantData, type Industry } from "./templates";
import { demoStore } from "./store";

const KEY = "vf_tenants_v1";

function load(): Tenant[] {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw) as Tenant[];
    } catch {
      /* fall through */
    }
  }
  return [...DEFAULT_TENANTS];
}

let tenants: Tenant[] = load();
const listeners = new Set<() => void>();

function save() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(tenants));
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((fn) => fn());
}

export function getAllTenants(): Tenant[] {
  return tenants;
}

export function findTenant(id: string): Tenant {
  return tenants.find((t) => t.id === id) ?? tenants[0];
}

export function subscribeTenants(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Creates a new tenant from an industry template + generates its demo data. */
export function createTenant(input: { name: string; industry: Industry; brandColor: string }): Tenant {
  const slug = slugify(input.name) || "venue";
  const tenant: Tenant = {
    id: `org_${slug}_${Math.floor(Date.now() % 100000)}`,
    name: input.name,
    slug,
    industry: input.industry,
    brandColor: input.brandColor,
    initials: input.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "VF",
    tagline: "Welcome to your new venue.",
    address: "—",
    role: "OWNER",
  };
  tenants = [...tenants, tenant];
  save();
  demoStore.addTenantData(generateTenantData(tenant));
  return tenant;
}
