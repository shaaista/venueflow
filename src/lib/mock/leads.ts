export type LeadStage =
  | "New"
  | "Contacted"
  | "Proposal"
  | "Negotiation"
  | "Won"
  | "Lost";

export type Temperature = "Hot" | "Warm" | "Cold";

export type Lead = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  eventType: string;
  eventDate: string;
  guests: number;
  value: number;
  stage: LeadStage;
  temperature: Temperature;
  source: string;
  owner: { name: string; avatar: string };
  tags: string[];
  createdAt: string;
  lastActivity: string;
  avatar: string;
};

export const STAGES: LeadStage[] = [
  "New",
  "Contacted",
  "Proposal",
  "Negotiation",
  "Won",
  "Lost",
];

export const STAGE_VARIANT: Record<
  LeadStage,
  "amber" | "espresso" | "sage" | "success" | "danger" | "default"
> = {
  New: "amber",
  Contacted: "espresso",
  Proposal: "sage",
  Negotiation: "default",
  Won: "success",
  Lost: "danger",
};

export const TEMP_VARIANT: Record<Temperature, "danger" | "amber" | "default"> = {
  Hot: "danger",
  Warm: "amber",
  Cold: "default",
};

const OWNERS = [
  { name: "Alex Rivera", avatar: "https://i.pravatar.cc/80?img=15" },
  { name: "Mara Quinn", avatar: "https://i.pravatar.cc/80?img=47" },
  { name: "Theo Sandoval", avatar: "https://i.pravatar.cc/80?img=51" },
];

export const LEADS: Lead[] = [
  { id: "L-2041", name: "Eleanor & James Wedding", contactName: "Eleanor Vance", email: "eleanor@vancemail.com", phone: "+1 (555) 234-8901", location: "Portland, OR", eventType: "Wedding Reception", eventDate: "2026-09-14", guests: 220, value: 28500, stage: "Proposal", temperature: "Hot", source: "Website Form", owner: OWNERS[0], tags: ["Wedding", "VIP"], createdAt: "2026-06-12", lastActivity: "2h ago", avatar: "https://i.pravatar.cc/80?img=5" },
  { id: "L-2040", name: "Lumen Capital Annual Gala", contactName: "Priya Raman", email: "priya@lumencap.com", phone: "+1 (555) 901-2245", location: "Seattle, WA", eventType: "Corporate Gala", eventDate: "2026-11-02", guests: 320, value: 64000, stage: "Won", temperature: "Hot", source: "Referral", owner: OWNERS[1], tags: ["Corporate", "Repeat"], createdAt: "2026-05-28", lastActivity: "12m ago", avatar: "https://i.pravatar.cc/80?img=32" },
  { id: "L-2039", name: "Northwind Launch Party", contactName: "Marcus Webb", email: "marcus@northwind.io", phone: "+1 (555) 778-1190", location: "Portland, OR", eventType: "Product Launch", eventDate: "2026-07-29", guests: 140, value: 18200, stage: "Contacted", temperature: "Warm", source: "Instagram", owner: OWNERS[2], tags: ["Corporate"], createdAt: "2026-06-18", lastActivity: "2h ago", avatar: "https://i.pravatar.cc/80?img=12" },
  { id: "L-2038", name: "Almeida 50th Anniversary", contactName: "Sofia Almeida", email: "sofia.almeida@gmail.com", phone: "+1 (555) 332-6612", location: "Bend, OR", eventType: "Anniversary", eventDate: "2026-08-16", guests: 90, value: 12400, stage: "New", temperature: "Warm", source: "Website Form", owner: OWNERS[0], tags: ["Private"], createdAt: "2026-06-25", lastActivity: "3h ago", avatar: "https://i.pravatar.cc/80?img=45" },
  { id: "L-2037", name: "Harlow Graduation Dinner", contactName: "Daniel Harlow", email: "dharlow@pdxschools.org", phone: "+1 (555) 220-3349", location: "Portland, OR", eventType: "Graduation", eventDate: "2026-06-30", guests: 60, value: 9600, stage: "Lost", temperature: "Cold", source: "Phone", owner: OWNERS[1], tags: ["Private"], createdAt: "2026-05-10", lastActivity: "5d ago", avatar: "https://i.pravatar.cc/80?img=20" },
  { id: "L-2036", name: "Bloom & Co Networking Night", contactName: "Grace Bloom", email: "grace@bloomandco.com", phone: "+1 (555) 887-4410", location: "Seattle, WA", eventType: "Networking", eventDate: "2026-08-05", guests: 120, value: 14800, stage: "New", temperature: "Hot", source: "Referral", owner: OWNERS[2], tags: ["Corporate", "New"], createdAt: "2026-06-26", lastActivity: "5h ago", avatar: "https://i.pravatar.cc/80?img=9" },
  { id: "L-2035", name: "Tanaka Wedding Reception", contactName: "Yuki Tanaka", email: "yuki.tanaka@mail.com", phone: "+1 (555) 660-7782", location: "Vancouver, WA", eventType: "Wedding Reception", eventDate: "2026-10-11", guests: 180, value: 31200, stage: "Negotiation", temperature: "Hot", source: "Website Form", owner: OWNERS[0], tags: ["Wedding", "VIP"], createdAt: "2026-06-08", lastActivity: "1d ago", avatar: "https://i.pravatar.cc/80?img=25" },
  { id: "L-2034", name: "Cedar Foundation Fundraiser", contactName: "Olivia Park", email: "opark@cedarfound.org", phone: "+1 (555) 145-9923", location: "Portland, OR", eventType: "Charity Gala", eventDate: "2026-09-27", guests: 260, value: 42000, stage: "Proposal", temperature: "Warm", source: "Referral", owner: OWNERS[1], tags: ["Corporate"], createdAt: "2026-06-14", lastActivity: "1d ago", avatar: "https://i.pravatar.cc/80?img=16" },
  { id: "L-2033", name: "Rivera Quinceañera", contactName: "Camila Rivera", email: "camila.r@gmail.com", phone: "+1 (555) 509-2231", location: "Hillsboro, OR", eventType: "Birthday Party", eventDate: "2026-08-23", guests: 150, value: 16500, stage: "Contacted", temperature: "Warm", source: "Instagram", owner: OWNERS[2], tags: ["Private"], createdAt: "2026-06-20", lastActivity: "8h ago", avatar: "https://i.pravatar.cc/80?img=31" },
  { id: "L-2032", name: "Brightline Team Offsite", contactName: "Sam Okafor", email: "sam@brightline.dev", phone: "+1 (555) 712-0098", location: "Seattle, WA", eventType: "Team Building", eventDate: "2026-07-19", guests: 80, value: 11200, stage: "Won", temperature: "Hot", source: "Website Form", owner: OWNERS[0], tags: ["Corporate", "Repeat"], createdAt: "2026-05-30", lastActivity: "2d ago", avatar: "https://i.pravatar.cc/80?img=33" },
  { id: "L-2031", name: "Devlin Retirement Dinner", contactName: "Patrick Devlin", email: "pdevlin@mail.com", phone: "+1 (555) 401-5567", location: "Salem, OR", eventType: "Private Dining", eventDate: "2026-09-05", guests: 40, value: 7800, stage: "New", temperature: "Cold", source: "Phone", owner: OWNERS[1], tags: ["Private"], createdAt: "2026-06-27", lastActivity: "6h ago", avatar: "https://i.pravatar.cc/80?img=68" },
  { id: "L-2030", name: "Aster Records Showcase", contactName: "Nina Cole", email: "nina@asterrecords.com", phone: "+1 (555) 330-1148", location: "Portland, OR", eventType: "Live Music", eventDate: "2026-10-25", guests: 400, value: 38000, stage: "Negotiation", temperature: "Warm", source: "Referral", owner: OWNERS[2], tags: ["Corporate"], createdAt: "2026-06-05", lastActivity: "3d ago", avatar: "https://i.pravatar.cc/80?img=44" },
];

export const LEAD_SOURCES = [
  "Website Form",
  "Referral",
  "Instagram",
  "Phone",
];

// ── Lead detail enrichment ──────────────────────────────────────────────
export type TimelineEntry = {
  id: string;
  kind: "note" | "email" | "call" | "stage" | "quote" | "visit";
  title: string;
  body?: string;
  who: string;
  time: string;
};

export function getLeadTimeline(): TimelineEntry[] {
  return [
    { id: "tl1", kind: "stage", title: "Stage changed to Proposal", who: "Alex Rivera", time: "Jun 26 · 9:12 AM" },
    { id: "tl2", kind: "quote", title: "Proposal #Q-1182 sent", body: "Gold package · 220 guests · $28,500 estimate, valid for 14 days.", who: "Alex Rivera", time: "Jun 26 · 9:05 AM" },
    { id: "tl3", kind: "visit", title: "Site visit completed", body: "Toured The Grand Atrium and the Terrace Gardens. Loved the glass ceiling for the ceremony.", who: "Mara Quinn", time: "Jun 22 · 2:30 PM" },
    { id: "tl4", kind: "call", title: "Discovery call", body: "Discussed budget range ($25–32k), Sept dates, and a preference for an in-house tasting menu.", who: "Alex Rivera", time: "Jun 18 · 11:00 AM" },
    { id: "tl5", kind: "email", title: "Replied to initial enquiry", body: "Thanks for reaching out! We'd love to host your wedding. Here's some availability…", who: "Alex Rivera", time: "Jun 13 · 4:40 PM" },
    { id: "tl6", kind: "note", title: "New enquiry received", body: "Submitted via the website wedding form for a September reception, ~220 guests.", who: "System", time: "Jun 12 · 8:10 AM" },
  ];
}

export const LEAD_NOTES = [
  { id: "n1", who: "Alex Rivera", avatar: "https://i.pravatar.cc/80?img=15", time: "2 days ago", body: "Eleanor is very detail-oriented and cares about sustainability. Mentioned wanting locally-sourced florals and a plated dinner over buffet." },
  { id: "n2", who: "Mara Quinn", avatar: "https://i.pravatar.cc/80?img=47", time: "5 days ago", body: "Great potential for a long-term relationship — her sister is also engaged and considering us for 2027." },
];
