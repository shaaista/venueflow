// Demo tenants — the multi-tenant fabric of the demo. Each org has its own
// branding, users, and (generated) data. The signed-in demo user belongs to all
// four with different roles so permission-scoping is visible when switching.

export type Role = "OWNER" | "ADMIN" | "MANAGER" | "COORDINATOR" | "STAFF" | "VIEWER";

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  industry: "Hotel" | "Cafe" | "Wedding Venue" | "Resort" | "Banquet Hall";
  brandColor: string;
  initials: string;
  tagline: string;
  address: string;
  /** The current demo user's role within this tenant. */
  role: Role;
};

export const TENANTS: Tenant[] = [
  {
    id: "org_atrium",
    name: "The Atrium Hotel",
    slug: "the-atrium-hotel",
    industry: "Hotel",
    brandColor: "#4A3728",
    initials: "AH",
    tagline: "Grand events beneath the glass.",
    address: "1200 Riverside Ave, Portland, OR",
    role: "OWNER",
  },
  {
    id: "org_market",
    name: "Cafe @ Market Street",
    slug: "cafe-market-street",
    industry: "Cafe",
    brandColor: "#B5552E",
    initials: "MS",
    tagline: "Intimate gatherings, great coffee.",
    address: "48 Market Street, Seattle, WA",
    role: "ADMIN",
  },
  {
    id: "org_oakwood",
    name: "Oakwood Weddings",
    slug: "oakwood-weddings",
    industry: "Wedding Venue",
    brandColor: "#4F6F52",
    initials: "OW",
    tagline: "Where forever begins.",
    address: "9 Oakwood Lane, Hood River, OR",
    role: "MANAGER",
  },
  {
    id: "org_garden",
    name: "The Garden Resort",
    slug: "the-garden-resort",
    industry: "Resort",
    brandColor: "#2C6E63",
    initials: "GR",
    tagline: "Celebrations in bloom.",
    address: "Coastline Drive, Cannon Beach, OR",
    role: "VIEWER",
  },
];

export const DEMO_USER = {
  id: "user_alex",
  name: "Alex Rivera",
  email: "alex@venueflow.app",
  avatarUrl: "https://i.pravatar.cc/120?img=15",
};

export const getTenant = (id: string) => TENANTS.find((t) => t.id === id) ?? TENANTS[0];
