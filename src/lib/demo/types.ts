import type { Lead } from "@/lib/mock/leads";
import type { Customer } from "@/lib/mock/customers";
import type { VenueEvent } from "@/lib/mock/events";
import type { Quote, Invoice, Payment } from "@/lib/mock/finance";
import type { Task } from "@/lib/mock/tasks";

/** Every demo entity carries `organizationId` — the exact shape a Postgres row will. */
export type WithOrg<T> = T & { organizationId: string };

export type DemoLead = WithOrg<Lead>;
export type DemoCustomer = WithOrg<Customer>;
export type DemoEvent = WithOrg<VenueEvent>;
export type DemoQuote = WithOrg<Quote>;
export type DemoInvoice = WithOrg<Invoice>;
export type DemoPayment = WithOrg<Payment>;
export type DemoTask = WithOrg<Task>;

export type DemoActivity = {
  id: string;
  organizationId: string;
  kind: "lead" | "customer" | "event" | "quote" | "invoice" | "payment" | "task" | "system";
  title: string;
  detail?: string;
  actor: string;
  time: string;
  createdAt: string;
  entityType?: string;
  entityId?: string;
};

export type DemoNotification = {
  id: string;
  organizationId: string;
  type: "ENQUIRY" | "PAYMENT" | "QUOTE" | "EVENT" | "MESSAGE" | "TASK" | "SYSTEM";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type DemoMessage = { from: "us" | "them"; name?: string; time: string; body: string };
export type DemoConversation = {
  id: string;
  organizationId: string;
  name: string;
  avatar: string;
  channel: "email" | "sms" | "whatsapp";
  event: string;
  preview: string;
  time: string;
  unread: number;
  messages: DemoMessage[];
};

export type DemoTeamMember = {
  id: string;
  organizationId: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  events: number;
  status: "Active" | "Invited";
};

export type Collections = {
  leads: DemoLead[];
  customers: DemoCustomer[];
  events: DemoEvent[];
  quotes: DemoQuote[];
  invoices: DemoInvoice[];
  payments: DemoPayment[];
  tasks: DemoTask[];
  notifications: DemoNotification[];
  activities: DemoActivity[];
  conversations: DemoConversation[];
  team: DemoTeamMember[];
};
