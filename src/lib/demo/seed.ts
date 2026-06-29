import { TENANTS, type Tenant } from "./tenants";
import { avatarUri } from "./avatar";
import type {
  Collections, DemoLead, DemoCustomer, DemoEvent, DemoQuote, DemoInvoice, DemoPayment, DemoTask, DemoNotification, DemoConversation, DemoTeamMember,
} from "./types";
import type { LeadStage, Temperature } from "@/lib/mock/leads";
import type { CustomerStatus } from "@/lib/mock/customers";
import type { EventStatus } from "@/lib/mock/events";
import type { QuoteStatus, InvoiceStatus, PaymentStatus } from "@/lib/mock/finance";
import type { TaskColumn, TaskPriority } from "@/lib/mock/tasks";

// ── deterministic RNG ──────────────────────────────────────────────
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Eleanor", "James", "Priya", "Marcus", "Sofia", "Daniel", "Grace", "Yuki", "Olivia", "Sam", "Camila", "Nina", "Theo", "Mara", "Jade", "Otis", "Nora", "Liam", "Aisha", "Noah", "Maya", "Ethan", "Zara", "Hugo", "Ivy", "Leo", "Ruby", "Felix", "Iris", "Owen", "Lena", "Caleb", "Anya", "Rory", "Tara", "Dev", "Mia", "Jonah", "Elise", "Kai"];
const LAST = ["Vance", "Whitfield", "Raman", "Webb", "Almeida", "Harlow", "Bloom", "Tanaka", "Park", "Okafor", "Rivera", "Cole", "Quinn", "Lin", "Bell", "Hayes", "Mills", "Reed", "Frost", "Soto", "Bauer", "Nash", "Dunn", "Page", "Cross", "Vega", "Wren", "Hale", "Ford", "Kerr"];
const COMPANIES = ["Lumen Capital", "Northwind Studios", "Cedar Foundation", "Aster Records", "Brightline", "Harbor & Vine", "Maison Belle", "Lantern Group", "Orchard Labs", "Vela Partners", "Marigold Co", "Driftwood Inc", ""];
const SOURCES = ["Website Form", "Referral", "Instagram", "Phone", "Wedding Fair", "Google", "Walk-in"];
const COORDINATORS = ["Alex Rivera", "Mara Quinn", "Theo Sandoval", "Jade Lin", "Nora Hayes"];

const EVENT_TYPES: Record<string, string[]> = {
  Hotel: ["Corporate Gala", "Conference", "Wedding Reception", "Product Launch", "Awards Dinner", "Networking Event", "Charity Gala"],
  Cafe: ["Birthday Party", "Private Dining", "Baby Shower", "Networking Event", "Book Launch", "Coffee Tasting", "Anniversary"],
  "Wedding Venue": ["Wedding Reception", "Engagement Party", "Anniversary", "Vow Renewal", "Bridal Shower", "Rehearsal Dinner"],
  Resort: ["Wedding Reception", "Corporate Retreat", "Birthday Party", "Family Reunion", "Wellness Retreat", "Anniversary", "Gala"],
};
const SPACES: Record<string, string[]> = {
  Hotel: ["The Grand Atrium", "The Ballroom", "Rooftop Terrace", "The Boardroom", "Garden Pavilion"],
  Cafe: ["Main Floor", "The Mezzanine", "Private Nook", "Courtyard", "The Roastery"],
  "Wedding Venue": ["The Oak Barn", "Orchard Lawn", "The Chapel", "Riverside Marquee", "The Conservatory"],
  Resort: ["Beach Pavilion", "The Vineyard", "Cliff Terrace", "Palm Courtyard", "The Solarium"],
};

const STAGES: LeadStage[] = ["New", "Contacted", "Proposal", "Negotiation", "Won", "Lost"];
const TEMPS: Temperature[] = ["Hot", "Warm", "Cold"];
const CUST_STATUS: CustomerStatus[] = ["VIP", "Active", "Active", "Prospect", "Inactive"];
const EVENT_STATUS: EventStatus[] = ["Confirmed", "Confirmed", "Tentative", "In Progress", "Completed"];
const TASK_COLS: TaskColumn[] = ["To Do", "In Progress", "Review", "Done"];
const TASK_PRI: TaskPriority[] = ["High", "Medium", "Low"];
const METHODS = ["Visa •• 4242", "Mastercard •• 5588", "Amex •• 0091", "Bank transfer", "Visa •• 1190"];

export function generateDemoData(): Collections {
  const c: Collections = { leads: [], customers: [], events: [], quotes: [], invoices: [], payments: [], tasks: [], notifications: [], activities: [], conversations: [], team: [] };

  TENANTS.forEach((t, ti) => {
    const rnd = mulberry32(1000 + ti * 97);
    const pick = <T>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
    const int = (min: number, max: number) => Math.floor(rnd() * (max - min + 1)) + min;
    const av = (s: string) => avatarUri(s);
    const name = () => `${pick(FIRST)} ${pick(LAST)}`;
    const types = EVENT_TYPES[t.industry];
    const spaces = SPACES[t.industry];
    const orgId = t.id;
    // date helpers around 2026-06-29
    const dateStr = (offsetDays: number) => {
      const d = new Date(2026, 5, 29); d.setDate(d.getDate() + offsetDays);
      return d.toISOString().slice(0, 10);
    };

    // Team
    const teamNames = ["Alex Rivera", ...Array.from({ length: 4 }, () => name())];
    teamNames.forEach((nm, i) => {
      c.team.push({ id: `${orgId}_team_${i}`, organizationId: orgId, name: nm, role: i === 0 ? t.role : pick(["Event Manager", "Coordinator", "Sales", "Finance"]), email: `${nm.split(" ")[0].toLowerCase()}@${t.slug}.com`, avatar: av(nm), events: int(0, 30), status: i === 4 ? "Invited" : "Active" });
    });

    // Customers (32 each)
    const custCount = 32;
    for (let i = 0; i < custCount; i++) {
      const nm = name();
      const events = int(0, 5);
      const cust: DemoCustomer = {
        id: `C-${100 + ti * 1000 + i}`, organizationId: orgId, name: nm, company: pick(COMPANIES) || undefined,
        email: `${nm.split(" ")[0].toLowerCase()}.${nm.split(" ")[1].toLowerCase()}@mail.com`, phone: `+1 (555) ${int(100, 999)}-${int(1000, 9999)}`,
        location: pick(["Portland, OR", "Seattle, WA", "Bend, OR", "Vancouver, WA", "Salem, OR"]),
        avatar: av(nm),
        status: pick(CUST_STATUS), totalSpent: events * int(8, 60) * 1000, events, since: dateStr(-int(30, 900)), lastEvent: events ? pick(types) : "—", tags: [pick(["Wedding", "Corporate", "Private", "VIP", "Repeat"])],
      };
      c.customers.push(cust);
    }

    // Leads (30 each)
    for (let i = 0; i < 30; i++) {
      const contact = name();
      const stage = pick(STAGES);
      const ownerName = pick(teamNames);
      c.leads.push({
        id: `L-${2000 + ti * 1000 + i}`, organizationId: orgId, name: `${contact.split(" ")[1]} ${pick(types)}`, contactName: contact,
        email: `${contact.split(" ")[0].toLowerCase()}@mail.com`, phone: `+1 (555) ${int(100, 999)}-${int(1000, 9999)}`, location: pick(["Portland, OR", "Seattle, WA", "Bend, OR"]),
        eventType: pick(types), eventDate: dateStr(int(10, 220)), guests: int(20, 400), value: int(6, 70) * 1000,
        stage, temperature: pick(TEMPS), source: pick(SOURCES), owner: { name: ownerName, avatar: av(ownerName) },
        tags: [pick(["Wedding", "Corporate", "Private", "New", "VIP"])], createdAt: dateStr(-int(1, 60)), lastActivity: pick(["2h ago", "1d ago", "3d ago", "1w ago"]), avatar: av(contact),
      });
    }

    // Events (14 each)
    for (let i = 0; i < 14; i++) {
      const client = name();
      const value = int(8, 64) * 1000;
      const status = pick(EVENT_STATUS);
      const paid = status === "Completed" ? value : status === "Tentative" ? Math.round(value * 0.25) : Math.round(value * (rnd() * 0.6 + 0.2));
      c.events.push({
        id: `E-${5000 + ti * 1000 + i}`, organizationId: orgId, title: `${client.split(" ")[1]} ${pick(types)}`, client, clientAvatar: av(client),
        type: pick(types), space: pick(spaces), date: dateStr(int(-40, 200)), start: pick(["4:00 PM", "6:00 PM", "7:00 PM", "10:00 AM", "5:30 PM"]), end: pick(["11:00 PM", "10:00 PM", "1:00 AM", "4:00 PM"]),
        guests: int(20, 400), value, paid, status, coordinator: pick(COORDINATORS),
      });
    }

    // Quotes (10), Invoices (10), Payments (12)
    for (let i = 0; i < 10; i++) {
      const client = name();
      c.quotes.push({ id: `Q-${1100 + ti * 1000 + i}`, organizationId: orgId, client, clientAvatar: av(client), event: pick(types), amount: int(8, 64) * 1000, status: pick(["Draft", "Sent", "Viewed", "Accepted", "Declined"] as QuoteStatus[]), created: dateStr(-int(1, 30)), validUntil: dateStr(int(5, 20)) });
    }
    for (let i = 0; i < 10; i++) {
      const client = name();
      const amount = int(8, 60) * 1000;
      const status = pick(["Sent", "Paid", "Paid", "Overdue"] as InvoiceStatus[]);
      c.invoices.push({ id: `INV-${1100 + ti * 1000 + i}`, organizationId: orgId, client, clientAvatar: av(client), event: pick(types), amount, paid: status === "Paid" ? amount : Math.round(amount * (rnd() * 0.6)), status, issued: dateStr(-int(5, 40)), due: dateStr(int(-5, 30)) });
    }
    for (let i = 0; i < 12; i++) {
      const payClient = name();
      c.payments.push({ id: `PAY-${3100 + ti * 1000 + i}`, organizationId: orgId, client: payClient, clientAvatar: av(payClient), method: pick(METHODS), amount: int(2, 40) * 1000, date: dateStr(-int(1, 40)), status: pick(["Succeeded", "Succeeded", "Succeeded", "Pending", "Refunded"] as PaymentStatus[]), invoice: `INV-${1100 + ti * 1000 + int(0, 9)}` });
    }

    // Tasks (12)
    for (let i = 0; i < 12; i++) {
      const taskAssignee = pick(teamNames);
      c.tasks.push({ id: `T-${1000 + ti * 1000 + i}`, organizationId: orgId, title: pick(["Send revised quote", "Confirm catering numbers", "Book entertainment", "Draft floor plan", "Schedule tasting", "Approve vendor ledger", "Final guest count", "Coordinate load-in"]), event: pick(types), column: pick(TASK_COLS), priority: pick(TASK_PRI), due: pick(["Today", "Tomorrow", "This week", dateStr(int(1, 10))]), assignee: { name: taskAssignee, avatar: av(taskAssignee) } });
    }

    // Notifications (8)
    const notifTypes: DemoNotification["type"][] = ["ENQUIRY", "PAYMENT", "QUOTE", "EVENT", "MESSAGE", "TASK"];
    for (let i = 0; i < 8; i++) {
      const nt = pick(notifTypes);
      c.notifications.push({ id: `${orgId}_N${i}`, organizationId: orgId, type: nt, title: { ENQUIRY: "New enquiry received", PAYMENT: "Payment received", QUOTE: "Proposal viewed", EVENT: "Event confirmed", MESSAGE: "New message", TASK: "Task due soon", SYSTEM: "Update" }[nt], body: `${name()} · ${pick(types)}`, time: pick(["12m ago", "1h ago", "2h ago", "Yesterday", "3d ago"]), read: i > 2 });
    }

    // Activities (8) — the feed of recent things that happened
    const actKinds = [
      { kind: "payment" as const, title: () => `${name()} made a payment of $${int(2, 40)}k` },
      { kind: "quote" as const, title: () => `Proposal sent to ${name()}` },
      { kind: "lead" as const, title: () => `New enquiry from ${name()}` },
      { kind: "event" as const, title: () => `${name()} confirmed their ${pick(types)}` },
      { kind: "customer" as const, title: () => `${name()} was added as a customer` },
      { kind: "invoice" as const, title: () => `Invoice issued for ${pick(types)}` },
    ];
    for (let i = 0; i < 8; i++) {
      const a = pick(actKinds);
      c.activities.push({ id: `${orgId}_A${i}`, organizationId: orgId, kind: a.kind, title: a.title(), actor: pick(teamNames), time: pick(["12m ago", "1h ago", "3h ago", "Yesterday", "2d ago"]), createdAt: dateStr(-int(0, 6)) });
    }

    // Conversations (6)
    for (let i = 0; i < 6; i++) {
      const nm = name();
      c.conversations.push({
        id: `${orgId}_M${i}`, organizationId: orgId, name: nm, avatar: av(nm), channel: pick(["email", "sms", "whatsapp"] as const), event: pick(types),
        preview: pick(["Thanks so much, that's perfect!", "Could you send the catering options?", "Can we move the date?", "We'd love to book a tasting."]), time: pick(["10:12 AM", "Yesterday", "Mon", "2d ago"]), unread: i < 2 ? int(1, 3) : 0,
        messages: [
          { from: "them", name: nm, time: "Jun 22 · 2:30 PM", body: "Hi! We're interested in hosting our event with you. Is the date available?" },
          { from: "us", time: "Jun 22 · 4:10 PM", body: "Hi — congratulations! Yes, that date is open. Would you like to arrange a visit?" },
          { from: "them", name: nm, time: "Jun 23 · 9:02 AM", body: "That would be wonderful, thank you." },
        ],
      });
    }
  });

  return c;
}
