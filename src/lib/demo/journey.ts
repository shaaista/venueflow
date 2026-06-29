import * as wf from "./workflows";

export type Journey = {
  leadId: string;
  customerId: string;
  eventId: string;
  quoteId: string;
  invoiceId: string;
  amount: number;
  createdAt: number;
};

const KEY = "vf_demo_journey";

/**
 * Runs the start of the lifecycle automatically — public enquiry → lead →
 * customer → event → quote → invoice — then hands off to the user to accept the
 * quote, pay the invoice, and complete the event.
 */
export async function runDemoJourney(orgId: string): Promise<Journey> {
  const amount = 32000;
  const lead = await wf.createLead(orgId, {
    contactName: "Olivia & Tom Hartley",
    email: "olivia.hartley@email.com",
    phone: "+1 (555) 612-0099",
    eventType: "Wedding Reception",
    eventDate: plusDays(90),
    guests: 160,
    value: amount,
    source: "Guided Demo",
  });
  const customer = await wf.convertLeadToCustomer(orgId, lead);
  const event = await wf.createEvent(orgId, {
    title: "Olivia & Tom Wedding",
    type: "Wedding Reception",
    client: customer.name,
    date: plusDays(90),
    guests: 160,
    value: amount,
  });
  const quote = await wf.generateQuote(orgId, { client: customer.name, event: event.title, amount });
  const invoice = await wf.generateInvoice(orgId, { client: customer.name, event: event.title, amount });

  const journey: Journey = {
    leadId: lead.id,
    customerId: customer.id,
    eventId: event.id,
    quoteId: quote.id,
    invoiceId: invoice.id,
    amount,
    createdAt: Date.now(),
  };
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(journey));
  return journey;
}

export function getJourney(): Journey | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Journey) : null;
  } catch {
    return null;
  }
}

export function clearJourney() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

function plusDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
