// Mock data powering the Admin CRM screens.

export const CURRENT_USER = {
  name: "Alex Rivera",
  role: "Owner",
  email: "alex@theatrium.co",
  avatar: "https://i.pravatar.cc/120?img=15",
  business: "The Atrium Collection",
};

export const KPIS = [
  {
    key: "revenue",
    label: "Revenue (MTD)",
    value: 184500,
    format: "currency",
    delta: 12.4,
    trend: "up",
    spark: [42, 48, 45, 53, 60, 58, 67, 72, 70, 78, 84, 92],
    foot: "vs. $164k last month",
  },
  {
    key: "leads",
    label: "New Enquiries",
    value: 48,
    format: "number",
    delta: 8.0,
    trend: "up",
    spark: [3, 5, 4, 6, 5, 7, 6, 8, 7, 9, 8, 10],
    foot: "12 awaiting first reply",
  },
  {
    key: "bookings",
    label: "Confirmed Bookings",
    value: 21,
    format: "number",
    delta: 5.0,
    trend: "up",
    spark: [1, 2, 2, 3, 2, 4, 3, 4, 5, 4, 5, 6],
    foot: "$248k contracted value",
  },
  {
    key: "conversion",
    label: "Conversion Rate",
    value: 24.2,
    format: "percent",
    delta: -2.1,
    trend: "down",
    spark: [28, 27, 26, 27, 25, 26, 24, 25, 24, 23, 24, 24],
    foot: "Enquiry → booking",
  },
];

export const REVENUE_SERIES = [
  { month: "Jul", revenue: 124, target: 120 },
  { month: "Aug", revenue: 138, target: 130 },
  { month: "Sep", revenue: 119, target: 135 },
  { month: "Oct", revenue: 156, target: 145 },
  { month: "Nov", revenue: 168, target: 155 },
  { month: "Dec", revenue: 212, target: 180 },
  { month: "Jan", revenue: 158, target: 165 },
  { month: "Feb", revenue: 172, target: 170 },
  { month: "Mar", revenue: 185, target: 178 },
  { month: "Apr", revenue: 196, target: 188 },
  { month: "May", revenue: 204, target: 195 },
  { month: "Jun", revenue: 184, target: 200 },
];

export const PIPELINE = [
  { stage: "New Enquiry", count: 12, value: 142000, color: "amber" },
  { stage: "Qualified", count: 9, value: 198000, color: "sage" },
  { stage: "Proposal Sent", count: 7, value: 224000, color: "espresso" },
  { stage: "Negotiation", count: 4, value: 156000, color: "amber" },
  { stage: "Won", count: 6, value: 312000, color: "sage" },
];

export type LeadStatus = "New" | "Contacted" | "Proposal" | "Won" | "Lost";

export const RECENT_LEADS: {
  id: string;
  name: string;
  contact: string;
  eventType: string;
  date: string;
  value: number;
  status: LeadStatus;
  avatar: string;
}[] = [
  { id: "L-2041", name: "Eleanor & James Wedding", contact: "Eleanor Vance", eventType: "Wedding Reception", date: "2026-09-14", value: 28500, status: "Proposal", avatar: "https://i.pravatar.cc/80?img=5" },
  { id: "L-2040", name: "Lumen Capital Annual Gala", contact: "Priya Raman", eventType: "Corporate Gala", date: "2026-11-02", value: 64000, status: "Won", avatar: "https://i.pravatar.cc/80?img=32" },
  { id: "L-2039", name: "Northwind Launch Party", contact: "Marcus Webb", eventType: "Product Launch", date: "2026-07-29", value: 18200, status: "Contacted", avatar: "https://i.pravatar.cc/80?img=12" },
  { id: "L-2038", name: "Almeida 50th Anniversary", contact: "Sofia Almeida", eventType: "Anniversary", date: "2026-08-16", value: 12400, status: "New", avatar: "https://i.pravatar.cc/80?img=45" },
  { id: "L-2037", name: "Harlow Graduation Dinner", contact: "Daniel Harlow", eventType: "Graduation", date: "2026-06-30", value: 9600, status: "Lost", avatar: "https://i.pravatar.cc/80?img=20" },
  { id: "L-2036", name: "Bloom & Co Networking Night", contact: "Grace Bloom", eventType: "Networking", date: "2026-08-05", value: 14800, status: "New", avatar: "https://i.pravatar.cc/80?img=9" },
];

export const ACTIVITY: {
  id: string;
  who: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  type: "lead" | "payment" | "quote" | "event" | "message";
}[] = [
  { id: "a1", who: "Priya Raman", avatar: "https://i.pravatar.cc/80?img=32", action: "signed the proposal for", target: "Annual Gala", time: "12m ago", type: "quote" },
  { id: "a2", who: "System", avatar: "", action: "received a deposit of $14,250 for", target: "Eleanor & James Wedding", time: "1h ago", type: "payment" },
  { id: "a3", who: "Marcus Webb", avatar: "https://i.pravatar.cc/80?img=12", action: "replied to your message about", target: "Northwind Launch", time: "2h ago", type: "message" },
  { id: "a4", who: "Sofia Almeida", avatar: "https://i.pravatar.cc/80?img=45", action: "submitted a new enquiry for", target: "50th Anniversary", time: "3h ago", type: "lead" },
  { id: "a5", who: "Grace Bloom", avatar: "https://i.pravatar.cc/80?img=9", action: "booked a site visit for", target: "Networking Night", time: "5h ago", type: "event" },
];

export const PENDING_TASKS: {
  id: string;
  title: string;
  meta: string;
  due: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}[] = [
  { id: "t1", title: "Send revised quote to Eleanor Vance", meta: "Wedding · $28.5k", due: "Today, 3:00 PM", priority: "high", done: false },
  { id: "t2", title: "Confirm catering numbers — Lumen Gala", meta: "Corporate · 320 guests", due: "Today, 5:30 PM", priority: "high", done: false },
  { id: "t3", title: "Call back Marcus Webb", meta: "Northwind Launch", due: "Tomorrow, 10:00 AM", priority: "medium", done: false },
  { id: "t4", title: "Approve monthly vendor ledger", meta: "Finance", due: "In 2 days", priority: "low", done: false },
  { id: "t5", title: "Schedule tasting — Almeida party", meta: "Anniversary", due: "This week", priority: "medium", done: true },
];

export const UPCOMING_ADMIN_EVENTS: {
  id: string;
  title: string;
  space: string;
  date: string;
  start: string;
  guests: number;
  status: "Confirmed" | "Tentative" | "Setup";
}[] = [
  { id: "e1", title: "Eleanor & James Wedding", space: "The Grand Atrium", date: "2026-09-14", start: "4:00 PM", guests: 220, status: "Confirmed" },
  { id: "e2", title: "Lumen Capital Gala", space: "The Entire Collection", date: "2026-11-02", start: "7:00 PM", guests: 320, status: "Confirmed" },
  { id: "e3", title: "Northwind Launch Party", space: "The Cellar Lounge", date: "2026-07-29", start: "6:30 PM", guests: 140, status: "Tentative" },
  { id: "e4", title: "Founders Dinner", space: "The Reserve", date: "2026-08-02", start: "7:30 PM", guests: 36, status: "Setup" },
];

export const LEAD_STATUS_VARIANT: Record<LeadStatus, "amber" | "sage" | "espresso" | "success" | "danger"> = {
  New: "amber",
  Contacted: "espresso",
  Proposal: "sage",
  Won: "success",
  Lost: "danger",
};
