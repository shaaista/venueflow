export type Plan = "Starter" | "Professional" | "Enterprise";
export type TenantStatus = "Active" | "Trial" | "Past Due" | "Churned";

export const PLAN_VARIANT: Record<Plan, "default" | "espresso" | "amber"> = {
  Starter: "default",
  Professional: "espresso",
  Enterprise: "amber",
};
export const TENANT_STATUS_VARIANT: Record<TenantStatus, "success" | "amber" | "danger" | "default"> = {
  Active: "success",
  Trial: "amber",
  "Past Due": "danger",
  Churned: "default",
};

export type Tenant = {
  id: string;
  name: string;
  domain: string;
  plan: Plan;
  status: TenantStatus;
  mrr: number;
  users: number;
  events: number;
  since: string;
  logoColor: string;
};

export const TENANTS: Tenant[] = [
  { id: "T-001", name: "The Atrium Collection", domain: "atrium.venueflow.app", plan: "Professional", status: "Active", mrr: 149, users: 6, events: 21, since: "2024-03-12", logoColor: "#4A3728" },
  { id: "T-002", name: "Maison Belle Events", domain: "maisonbelle.com", plan: "Enterprise", status: "Active", mrr: 499, users: 18, events: 64, since: "2023-09-01", logoColor: "#5E7153" },
  { id: "T-003", name: "Harbor & Vine", domain: "harborvine.venueflow.app", plan: "Professional", status: "Active", mrr: 149, users: 8, events: 33, since: "2024-11-20", logoColor: "#D97706" },
  { id: "T-004", name: "The Glasshouse", domain: "glasshouse.events", plan: "Starter", status: "Trial", mrr: 0, users: 2, events: 1, since: "2026-06-10", logoColor: "#0F766E" },
  { id: "T-005", name: "Cedar & Sage Venues", domain: "cedarsage.venueflow.app", plan: "Professional", status: "Past Due", mrr: 149, users: 5, events: 12, since: "2025-02-14", logoColor: "#8C6B52" },
  { id: "T-006", name: "Lantern Hall", domain: "lanternhall.co", plan: "Enterprise", status: "Active", mrr: 499, users: 24, events: 88, since: "2023-05-30", logoColor: "#1E3A5F" },
  { id: "T-007", name: "The Orangery", domain: "orangery.venueflow.app", plan: "Starter", status: "Active", mrr: 49, users: 3, events: 7, since: "2025-08-19", logoColor: "#7C3AED" },
  { id: "T-008", name: "Rooftop Republic", domain: "rooftoprepublic.com", plan: "Professional", status: "Churned", mrr: 0, users: 0, events: 0, since: "2024-01-08", logoColor: "#B5462E" },
];

export const PLATFORM_KPIS = [
  { label: "Total tenants", value: "248", delta: "+12", trend: "up" },
  { label: "Monthly recurring", value: "$48.2k", delta: "+8.4%", trend: "up" },
  { label: "Active users", value: "3,914", delta: "+216", trend: "up" },
  { label: "Churn rate", value: "1.8%", delta: "-0.3%", trend: "up" },
];

export const FEATURE_FLAGS = [
  { key: "ai-assistant", name: "AI Enquiry Assistant", desc: "Auto-draft replies to new enquiries.", rollout: "Beta · 12%", on: true },
  { key: "whatsapp", name: "WhatsApp Channel", desc: "Two-way WhatsApp messaging.", rollout: "GA · 100%", on: true },
  { key: "new-calendar", name: "New Calendar Engine", desc: "Faster, drag-to-reschedule calendar.", rollout: "Beta · 30%", on: true },
  { key: "multi-currency", name: "Multi-currency Billing", desc: "Charge customers in local currency.", rollout: "Internal · 2%", on: false },
  { key: "white-label-app", name: "White-label Mobile App", desc: "Branded iOS/Android apps per tenant.", rollout: "Off", on: false },
];

export const PLATFORM_USERS = [
  { name: "Alex Rivera", email: "alex@theatrium.co", tenant: "The Atrium Collection", role: "Owner", lastSeen: "2m ago", avatar: "https://i.pravatar.cc/80?img=15" },
  { name: "Camille Roux", email: "camille@maisonbelle.com", tenant: "Maison Belle Events", role: "Admin", lastSeen: "1h ago", avatar: "https://i.pravatar.cc/80?img=24" },
  { name: "Devon Mills", email: "devon@harborvine.com", tenant: "Harbor & Vine", role: "Manager", lastSeen: "3h ago", avatar: "https://i.pravatar.cc/80?img=52" },
  { name: "Aisha Bello", email: "aisha@lanternhall.co", tenant: "Lantern Hall", role: "Owner", lastSeen: "Yesterday", avatar: "https://i.pravatar.cc/80?img=27" },
  { name: "Tom Hayes", email: "tom@glasshouse.events", tenant: "The Glasshouse", role: "Owner", lastSeen: "5 days ago", avatar: "https://i.pravatar.cc/80?img=58" },
];
