export type QuoteStatus = "Draft" | "Sent" | "Viewed" | "Accepted" | "Declined" | "Expired";
export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";
export type PaymentStatus = "Succeeded" | "Pending" | "Refunded" | "Failed";

export const QUOTE_STATUS_VARIANT: Record<QuoteStatus, "default" | "espresso" | "amber" | "success" | "danger"> = {
  Draft: "default",
  Sent: "espresso",
  Viewed: "amber",
  Accepted: "success",
  Declined: "danger",
  Expired: "default",
};

export const INVOICE_STATUS_VARIANT: Record<InvoiceStatus, "default" | "espresso" | "success" | "danger"> = {
  Draft: "default",
  Sent: "espresso",
  Paid: "success",
  Overdue: "danger",
};

export const PAYMENT_STATUS_VARIANT: Record<PaymentStatus, "success" | "amber" | "default" | "danger"> = {
  Succeeded: "success",
  Pending: "amber",
  Refunded: "default",
  Failed: "danger",
};

export type LineItem = { label: string; detail: string; qty: number; unit: number };

export const SAMPLE_LINE_ITEMS: LineItem[] = [
  { label: "Venue hire — The Grand Atrium", detail: "Full-day exclusive use", qty: 1, unit: 8500 },
  { label: "Five-course tasting menu", detail: "Per guest", qty: 220, unit: 145 },
  { label: "Premium bar package", detail: "Per guest", qty: 220, unit: 38 },
  { label: "Floral & styling", detail: "Full installation", qty: 1, unit: 6400 },
  { label: "Live entertainment", detail: "String quartet + DJ", qty: 1, unit: 3200 },
];

export type Quote = {
  id: string;
  client: string;
  clientAvatar: string;
  event: string;
  amount: number;
  status: QuoteStatus;
  created: string;
  validUntil: string;
};

export const QUOTES: Quote[] = [
  { id: "Q-1182", client: "Eleanor Vance", clientAvatar: "https://i.pravatar.cc/80?img=5", event: "Wedding Reception", amount: 28500, status: "Viewed", created: "2026-06-26", validUntil: "2026-07-10" },
  { id: "Q-1181", client: "Priya Raman", clientAvatar: "https://i.pravatar.cc/80?img=32", event: "Annual Gala", amount: 64000, status: "Accepted", created: "2026-06-20", validUntil: "2026-07-04" },
  { id: "Q-1180", client: "Olivia Park", clientAvatar: "https://i.pravatar.cc/80?img=16", event: "Charity Fundraiser", amount: 42000, status: "Sent", created: "2026-06-22", validUntil: "2026-07-06" },
  { id: "Q-1179", client: "Marcus Webb", clientAvatar: "https://i.pravatar.cc/80?img=12", event: "Product Launch", amount: 18200, status: "Draft", created: "2026-06-25", validUntil: "2026-07-09" },
  { id: "Q-1178", client: "Nina Cole", clientAvatar: "https://i.pravatar.cc/80?img=44", event: "Live Showcase", amount: 38000, status: "Declined", created: "2026-06-10", validUntil: "2026-06-24" },
  { id: "Q-1177", client: "Sam Okafor", clientAvatar: "https://i.pravatar.cc/80?img=33", event: "Team Offsite", amount: 11200, status: "Accepted", created: "2026-05-30", validUntil: "2026-06-13" },
];

export type Invoice = {
  id: string;
  client: string;
  clientAvatar: string;
  event: string;
  amount: number;
  paid: number;
  status: InvoiceStatus;
  issued: string;
  due: string;
};

export const INVOICES: Invoice[] = [
  { id: "INV-1182", client: "Priya Raman", clientAvatar: "https://i.pravatar.cc/80?img=32", event: "Annual Gala", amount: 64000, paid: 32000, status: "Sent", issued: "2026-06-21", due: "2026-08-31" },
  { id: "INV-1181", client: "Eleanor Vance", clientAvatar: "https://i.pravatar.cc/80?img=5", event: "Wedding Reception", amount: 28500, paid: 14250, status: "Sent", issued: "2026-06-26", due: "2026-08-31" },
  { id: "INV-1180", client: "Sam Okafor", clientAvatar: "https://i.pravatar.cc/80?img=33", event: "Team Offsite", amount: 11200, paid: 11200, status: "Paid", issued: "2026-05-30", due: "2026-07-01" },
  { id: "INV-1179", client: "Camila Rivera", clientAvatar: "https://i.pravatar.cc/80?img=31", event: "Quinceañera", amount: 16500, paid: 16500, status: "Paid", issued: "2026-05-12", due: "2026-06-12" },
  { id: "INV-1178", client: "Daniel Harlow", clientAvatar: "https://i.pravatar.cc/80?img=20", event: "Graduation", amount: 9600, paid: 4800, status: "Overdue", issued: "2026-05-20", due: "2026-06-20" },
];

export type Payment = {
  id: string;
  client: string;
  clientAvatar: string;
  method: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  invoice: string;
};

export const PAYMENTS: Payment[] = [
  { id: "PAY-3201", client: "Priya Raman", clientAvatar: "https://i.pravatar.cc/80?img=32", method: "Visa •• 4242", amount: 32000, date: "2026-06-26", status: "Succeeded", invoice: "INV-1182" },
  { id: "PAY-3200", client: "Eleanor Vance", clientAvatar: "https://i.pravatar.cc/80?img=5", method: "Mastercard •• 5588", amount: 14250, date: "2026-06-26", status: "Succeeded", invoice: "INV-1181" },
  { id: "PAY-3199", client: "Sam Okafor", clientAvatar: "https://i.pravatar.cc/80?img=33", method: "Bank transfer", amount: 11200, date: "2026-06-12", status: "Succeeded", invoice: "INV-1180" },
  { id: "PAY-3198", client: "Marcus Webb", clientAvatar: "https://i.pravatar.cc/80?img=12", method: "Visa •• 1190", amount: 4550, date: "2026-06-24", status: "Pending", invoice: "INV-1183" },
  { id: "PAY-3197", client: "Camila Rivera", clientAvatar: "https://i.pravatar.cc/80?img=31", method: "Amex •• 0091", amount: 16500, date: "2026-06-01", status: "Succeeded", invoice: "INV-1179" },
  { id: "PAY-3196", client: "Daniel Harlow", clientAvatar: "https://i.pravatar.cc/80?img=20", method: "Visa •• 3349", amount: 4800, date: "2026-05-28", status: "Refunded", invoice: "INV-1178" },
];
