import { demoStore } from "./store";
import { logEvent } from "./activity";
import { avatarUri } from "./avatar";
import type { DemoLead, DemoCustomer, DemoEvent, DemoQuote, DemoInvoice, DemoPayment } from "./types";

const rid = (prefix: string) => `${prefix}-${Math.floor(Date.now() % 100000)}`;
const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

/** Workflow A entry — create a lead (from admin form or public enquiry) + notify. */
export async function createLead(
  orgId: string,
  input: { contactName: string; name?: string; email: string; phone?: string; eventType?: string; eventDate?: string; guests?: number; value?: number; source?: string; location?: string; notes?: string },
): Promise<DemoLead> {
  const lead: DemoLead = {
    id: rid("L"),
    organizationId: orgId,
    name: input.name || `${input.contactName.split(" ").slice(-1)[0]} ${input.eventType ?? "Enquiry"}`,
    contactName: input.contactName,
    email: input.email,
    phone: input.phone ?? "",
    location: input.location ?? "",
    eventType: input.eventType ?? "General Enquiry",
    eventDate: input.eventDate || plusDays(60),
    guests: input.guests ?? 0,
    value: input.value ?? 0,
    stage: "New",
    temperature: "Warm",
    source: input.source ?? "Website Form",
    owner: { name: "Alex Rivera", avatar: avatarUri("Alex Rivera") },
    tags: ["New"],
    createdAt: today(),
    lastActivity: "just now",
    avatar: avatarUri(input.contactName),
  };
  const created = (await demoStore.create("leads", lead)) as DemoLead;
  await logEvent(orgId, {
    kind: "lead",
    title: `New enquiry from ${input.contactName}`,
    detail: input.eventType,
    entityType: "lead",
    entityId: created.id,
    notify: { type: "ENQUIRY", title: "New enquiry received", body: `${input.contactName} · ${input.eventType ?? "General"}` },
  });
  return created;
}

/** Workflow B step 1 — convert a lead into a customer and link them. */
export async function convertLeadToCustomer(orgId: string, lead: DemoLead): Promise<DemoCustomer> {
  const customer: DemoCustomer = {
    id: rid("C"),
    organizationId: orgId,
    name: lead.contactName,
    email: lead.email,
    phone: lead.phone,
    location: lead.location,
    avatar: avatarUri(lead.contactName),
    status: "Active",
    totalSpent: 0,
    events: 0,
    since: today(),
    lastEvent: "—",
    tags: lead.tags,
  };
  const created = (await demoStore.create("customers", customer)) as DemoCustomer;
  await demoStore.update("leads", lead.id, { stage: "Contacted", tags: [...lead.tags, "Converted"] });
  await logEvent(orgId, {
    kind: "customer",
    title: `${lead.contactName} converted to a customer`,
    entityType: "customer",
    entityId: created.id,
    notify: { type: "SYSTEM", title: "Lead converted", body: `${lead.contactName} is now a customer` },
  });
  return created;
}

/** Workflow B step 2 — create an event for a customer. */
export async function createEvent(
  orgId: string,
  input: { title: string; type: string; client: string; date: string; guests: number; value: number; space?: string },
): Promise<DemoEvent> {
  const event: DemoEvent = {
    id: rid("E"),
    organizationId: orgId,
    title: input.title,
    client: input.client,
    clientAvatar: avatarUri(input.client),
    type: input.type,
    space: input.space ?? "Main Hall",
    date: input.date,
    start: "5:00 PM",
    end: "11:00 PM",
    guests: input.guests,
    value: input.value,
    paid: 0,
    status: "Tentative",
    coordinator: "Alex Rivera",
  };
  const created = (await demoStore.create("events", event)) as DemoEvent;
  await logEvent(orgId, { kind: "event", title: `Event created: ${input.title}`, entityType: "event", entityId: created.id });
  return created;
}

/** Workflow B step 3 — generate a quote. */
export async function generateQuote(orgId: string, input: { client: string; event: string; amount: number }): Promise<DemoQuote> {
  const quote: DemoQuote = {
    id: rid("Q"),
    organizationId: orgId,
    client: input.client,
    clientAvatar: avatarUri(input.client),
    event: input.event,
    amount: input.amount,
    status: "Sent",
    created: today(),
    validUntil: plusDays(14),
  };
  const created = (await demoStore.create("quotes", quote)) as DemoQuote;
  await logEvent(orgId, { kind: "quote", title: `Quote ${created.id} sent to ${input.client}`, entityType: "quote", entityId: created.id, notify: { type: "QUOTE", title: "Quote sent", body: `${created.id} · ${input.client}` } });
  return created;
}

/** Workflow B step 4 — accept a quote. */
export async function acceptQuote(orgId: string, quote: DemoQuote) {
  await demoStore.update("quotes", quote.id, { status: "Accepted" });
  await logEvent(orgId, { kind: "quote", title: `${quote.client} accepted quote ${quote.id}`, entityType: "quote", entityId: quote.id, notify: { type: "QUOTE", title: "Quote accepted 🎉", body: `${quote.client} accepted ${quote.id}` } });
}

/** Workflow B step 5 — generate an invoice (optionally from a quote). */
export async function generateInvoice(orgId: string, input: { client: string; event: string; amount: number }): Promise<DemoInvoice> {
  const invoice: DemoInvoice = {
    id: rid("INV"),
    organizationId: orgId,
    client: input.client,
    clientAvatar: avatarUri(input.client),
    event: input.event,
    amount: input.amount,
    paid: 0,
    status: "Sent",
    issued: today(),
    due: plusDays(30),
  };
  const created = (await demoStore.create("invoices", invoice)) as DemoInvoice;
  await logEvent(orgId, { kind: "invoice", title: `Invoice ${created.id} issued to ${input.client}`, entityType: "invoice", entityId: created.id });
  return created;
}

/** Workflow B step 6 — record a payment against an invoice. */
export async function recordPayment(orgId: string, invoice: DemoInvoice, amount: number): Promise<DemoPayment> {
  const payment: DemoPayment = {
    id: rid("PAY"),
    organizationId: orgId,
    client: invoice.client,
    clientAvatar: avatarUri(invoice.client),
    method: "Visa •• 4242",
    amount,
    date: today(),
    status: "Succeeded",
    invoice: invoice.id,
  };
  const created = (await demoStore.create("payments", payment)) as DemoPayment;
  const newPaid = invoice.paid + amount;
  await demoStore.update("invoices", invoice.id, { paid: newPaid, status: newPaid >= invoice.amount ? "Paid" : "Sent" });
  await logEvent(orgId, {
    kind: "payment",
    title: `Payment of $${(amount / 1000).toFixed(1)}k received from ${invoice.client}`,
    entityType: "invoice",
    entityId: invoice.id,
    notify: { type: "PAYMENT", title: "Payment received", body: `$${amount.toLocaleString()} · ${invoice.client}` },
  });
  return created;
}

/** Workflow B step 7 — mark an event complete. */
export async function completeEvent(orgId: string, event: DemoEvent) {
  await demoStore.update("events", event.id, { status: "Completed", paid: event.value });
  await logEvent(orgId, { kind: "event", title: `${event.title} completed`, entityType: "event", entityId: event.id, notify: { type: "EVENT", title: "Event completed", body: event.title } });
}
