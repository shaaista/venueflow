import { avatarUri } from "./avatar";
import type { Tenant } from "./tenants";
import type { Collections } from "./types";

export type Industry = Tenant["industry"];

export type IndustryTemplate = {
  industry: Industry;
  label: string;
  brandColor: string;
  description: string;
  eventTypes: string[];
  spaces: string[];
  packages: { name: string; price: number; features: string[] }[];
  forms: string[];
  automations: { name: string; trigger: string }[];
};

export const INDUSTRY_TEMPLATES: Record<Industry, IndustryTemplate> = {
  Hotel: {
    industry: "Hotel", label: "Hotel", brandColor: "#4A3728",
    description: "Conferences, galas, and weddings at scale.",
    eventTypes: ["Corporate Gala", "Conference", "Wedding Reception", "Product Launch", "Awards Dinner", "Networking Event"],
    spaces: ["Grand Ballroom", "Rooftop Terrace", "The Boardroom", "Garden Pavilion"],
    packages: [
      { name: "Day Delegate", price: 95, features: ["Room hire", "Catering", "AV"] },
      { name: "Gala Package", price: 185, features: ["Ballroom", "Three-course dinner", "Premium bar"] },
      { name: "Conference Plus", price: 145, features: ["Multiple rooms", "Tech support", "Lunch"] },
    ],
    forms: ["Corporate Enquiry", "Wedding Enquiry", "Conference Request"],
    automations: [{ name: "Welcome enquiry", trigger: "NEW_ENQUIRY" }, { name: "Deposit reminder", trigger: "INVOICE_OVERDUE" }],
  },
  Cafe: {
    industry: "Cafe", label: "Cafe", brandColor: "#B5552E",
    description: "Intimate gatherings, tastings, and private dining.",
    eventTypes: ["Birthday Party", "Private Dining", "Baby Shower", "Networking Event", "Coffee Tasting", "Book Launch"],
    spaces: ["Main Floor", "The Mezzanine", "Private Nook", "Courtyard"],
    packages: [
      { name: "Brunch Gathering", price: 45, features: ["2-hour hire", "Brunch menu", "Coffee bar"] },
      { name: "Private Dinner", price: 85, features: ["Exclusive use", "Set menu", "Wine pairing"] },
    ],
    forms: ["General Enquiry", "Private Hire Request"],
    automations: [{ name: "Thank-you note", trigger: "EVENT_COMPLETED" }],
  },
  "Wedding Venue": {
    industry: "Wedding Venue", label: "Wedding Venue", brandColor: "#4F6F52",
    description: "Weddings, ceremonies, and celebrations.",
    eventTypes: ["Wedding Reception", "Engagement Party", "Anniversary", "Vow Renewal", "Bridal Shower", "Rehearsal Dinner"],
    spaces: ["The Oak Barn", "Orchard Lawn", "The Chapel", "Riverside Marquee"],
    packages: [
      { name: "Intimate", price: 120, features: ["Up to 60 guests", "Ceremony + reception", "Coordinator"] },
      { name: "Signature Wedding", price: 225, features: ["Full estate", "Tasting menu", "Florals", "Suite"] },
    ],
    forms: ["Wedding Enquiry", "Book a Tour"],
    automations: [{ name: "Tour follow-up", trigger: "LEAD_CREATED" }, { name: "Final balance", trigger: "INVOICE_OVERDUE" }],
  },
  Resort: {
    industry: "Resort", label: "Resort", brandColor: "#2C6E63",
    description: "Retreats, destination weddings, and celebrations.",
    eventTypes: ["Wedding Reception", "Corporate Retreat", "Family Reunion", "Wellness Retreat", "Anniversary", "Gala"],
    spaces: ["Beach Pavilion", "The Vineyard", "Cliff Terrace", "Palm Courtyard"],
    packages: [
      { name: "Weekend Retreat", price: 160, features: ["2-night stay", "Meals", "Activities"] },
      { name: "Destination Wedding", price: 280, features: ["Beach ceremony", "Reception", "Guest suites"] },
    ],
    forms: ["Retreat Enquiry", "Destination Wedding"],
    automations: [{ name: "Welcome pack", trigger: "EVENT_CONFIRMED" }],
  },
  "Banquet Hall": {
    industry: "Banquet Hall", label: "Banquet Hall", brandColor: "#7C3AED",
    description: "Large-format weddings, galas, and community events.",
    eventTypes: ["Wedding Reception", "Quinceañera", "Corporate Gala", "Community Event", "Graduation", "Charity Gala"],
    spaces: ["Grand Hall", "Crystal Room", "The Atrium", "Mezzanine Suite"],
    packages: [
      { name: "Classic", price: 75, features: ["Hall hire", "Buffet", "Staffing"] },
      { name: "Platinum", price: 165, features: ["Full hall", "Plated dinner", "Open bar", "Stage"] },
    ],
    forms: ["Event Enquiry", "Catering Request"],
    automations: [{ name: "Enquiry auto-reply", trigger: "NEW_ENQUIRY" }],
  },
};

const FIRST = ["Eleanor", "James", "Priya", "Marcus", "Sofia", "Grace", "Yuki", "Olivia", "Sam", "Camila", "Nina", "Leo", "Ruby", "Iris", "Owen", "Maya", "Ethan", "Aisha", "Noah", "Tara"];
const LAST = ["Vance", "Raman", "Webb", "Almeida", "Bloom", "Tanaka", "Park", "Okafor", "Cole", "Quinn", "Reed", "Frost", "Nash", "Vega", "Hale", "Ford"];

/** Generates a realistic starter dataset for a brand-new tenant from its industry template. */
export function generateTenantData(tenant: Tenant): Collections {
  const tpl = INDUSTRY_TEMPLATES[tenant.industry];
  const orgId = tenant.id;
  let s = 0;
  for (const ch of tenant.id) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const pick = <T>(a: T[]): T => a[Math.floor(rnd() * a.length)];
  const int = (min: number, max: number) => Math.floor(rnd() * (max - min + 1)) + min;
  const name = () => `${pick(FIRST)} ${pick(LAST)}`;
  const dateStr = (off: number) => { const d = new Date(2026, 5, 29); d.setDate(d.getDate() + off); return d.toISOString().slice(0, 10); };

  const c: Collections = { leads: [], customers: [], events: [], quotes: [], invoices: [], payments: [], tasks: [], notifications: [], activities: [], conversations: [], team: [] };
  const teamNames = ["Alex Rivera", name(), name()];
  teamNames.forEach((nm, i) => c.team.push({ id: `${orgId}_team_${i}`, organizationId: orgId, name: nm, role: i === 0 ? "OWNER" : pick(["Event Manager", "Coordinator"]), email: `${nm.split(" ")[0].toLowerCase()}@${tenant.slug}.com`, avatar: avatarUri(nm), events: int(0, 20), status: "Active" }));

  for (let i = 0; i < 16; i++) {
    const nm = name(); const ev = int(0, 4);
    c.customers.push({ id: `C-${i}`, organizationId: orgId, name: nm, email: `${nm.split(" ")[0].toLowerCase()}@mail.com`, phone: `+1 (555) ${int(100, 999)}-${int(1000, 9999)}`, location: "Portland, OR", avatar: avatarUri(nm), status: pick(["VIP", "Active", "Active", "Prospect"]), totalSpent: ev * int(8, 50) * 1000, events: ev, since: dateStr(-int(30, 600)), lastEvent: ev ? pick(tpl.eventTypes) : "—", tags: [pick(["Wedding", "Corporate", "Private"])] });
  }
  for (let i = 0; i < 18; i++) {
    const ct = name();
    c.leads.push({ id: `L-${i}`, organizationId: orgId, name: `${ct.split(" ")[1]} ${pick(tpl.eventTypes)}`, contactName: ct, email: `${ct.split(" ")[0].toLowerCase()}@mail.com`, phone: `+1 (555) ${int(100, 999)}-${int(1000, 9999)}`, location: "Portland, OR", eventType: pick(tpl.eventTypes), eventDate: dateStr(int(10, 200)), guests: int(20, 350), value: int(6, 60) * 1000, stage: pick(["New", "Contacted", "Proposal", "Negotiation", "Won", "Lost"]), temperature: pick(["Hot", "Warm", "Cold"]), source: pick(["Website Form", "Referral", "Instagram"]), owner: { name: pick(teamNames), avatar: avatarUri(pick(teamNames)) }, tags: ["New"], createdAt: dateStr(-int(1, 40)), lastActivity: pick(["2h ago", "1d ago", "3d ago"]), avatar: avatarUri(ct) });
  }
  for (let i = 0; i < 8; i++) {
    const cl = name(); const val = int(8, 50) * 1000; const st = pick(["Confirmed", "Confirmed", "Tentative", "Completed"] as const);
    c.events.push({ id: `E-${i}`, organizationId: orgId, title: `${cl.split(" ")[1]} ${pick(tpl.eventTypes)}`, client: cl, clientAvatar: avatarUri(cl), type: pick(tpl.eventTypes), space: pick(tpl.spaces), date: dateStr(int(-30, 160)), start: "5:00 PM", end: "11:00 PM", guests: int(40, 300), value: val, paid: st === "Completed" ? val : Math.round(val * rnd() * 0.6), status: st, coordinator: pick(teamNames) });
  }
  for (let i = 0; i < 6; i++) { const cl = name(); c.quotes.push({ id: `Q-${i}`, organizationId: orgId, client: cl, clientAvatar: avatarUri(cl), event: pick(tpl.eventTypes), amount: int(8, 50) * 1000, status: pick(["Sent", "Viewed", "Accepted", "Draft"]), created: dateStr(-int(1, 20)), validUntil: dateStr(int(5, 18)) }); }
  for (let i = 0; i < 6; i++) { const cl = name(); const amt = int(8, 48) * 1000; const st = pick(["Sent", "Paid", "Overdue"] as const); c.invoices.push({ id: `INV-${i}`, organizationId: orgId, client: cl, clientAvatar: avatarUri(cl), event: pick(tpl.eventTypes), amount: amt, paid: st === "Paid" ? amt : Math.round(amt * rnd() * 0.5), status: st, issued: dateStr(-int(5, 30)), due: dateStr(int(-3, 25)) }); }
  for (let i = 0; i < 8; i++) { const cl = name(); c.payments.push({ id: `PAY-${i}`, organizationId: orgId, client: cl, clientAvatar: avatarUri(cl), method: pick(["Visa •• 4242", "Bank transfer", "Amex •• 0091"]), amount: int(3, 30) * 1000, date: dateStr(-int(1, 30)), status: "Succeeded", invoice: `INV-${int(0, 5)}` }); }
  for (let i = 0; i < 8; i++) { const an = pick(teamNames); c.tasks.push({ id: `T-${i}`, organizationId: orgId, title: pick(["Send quote", "Confirm catering", "Book entertainment", "Final guest count", "Schedule tasting"]), event: pick(tpl.eventTypes), column: pick(["To Do", "In Progress", "Review", "Done"]), priority: pick(["High", "Medium", "Low"]), due: pick(["Today", "Tomorrow", "This week"]), assignee: { name: an, avatar: avatarUri(an) } }); }
  for (let i = 0; i < 5; i++) c.activities.push({ id: `${orgId}_A${i}`, organizationId: orgId, kind: pick(["lead", "quote", "payment", "event"]), title: `New ${pick(tpl.eventTypes)} enquiry from ${name()}`, actor: pick(teamNames), time: pick(["1h ago", "Yesterday", "2d ago"]), createdAt: dateStr(-int(0, 5)) });
  for (let i = 0; i < 4; i++) { const nm = name(); c.notifications.push({ id: `${orgId}_N${i}`, organizationId: orgId, type: pick(["ENQUIRY", "PAYMENT", "QUOTE"]), title: "New enquiry received", body: `${nm} · ${pick(tpl.eventTypes)}`, time: pick(["12m ago", "1h ago", "Yesterday"]), read: i > 1 }); }
  for (let i = 0; i < 4; i++) { const nm = name(); c.conversations.push({ id: `${orgId}_M${i}`, organizationId: orgId, name: nm, avatar: avatarUri(nm), channel: pick(["email", "sms", "whatsapp"] as const), event: pick(tpl.eventTypes), preview: "Thanks, that's perfect!", time: pick(["10:12 AM", "Yesterday"]), unread: i < 1 ? 1 : 0, messages: [{ from: "them", name: nm, time: "Jun 22 · 2:30 PM", body: "Hi! Is the date available for our event?" }, { from: "us", time: "Jun 22 · 4:10 PM", body: "Yes — we'd love to host you. Shall we arrange a visit?" }] }); }

  return c;
}
