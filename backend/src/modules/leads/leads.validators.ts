import { z } from "zod";

const LeadStatus = z.enum([
  "NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "DEPOSIT_PAID", "CONFIRMED", "COMPLETED", "LOST",
]);
const Temperature = z.enum(["HOT", "WARM", "COLD"]);

export const createLeadSchema = z.object({
  name: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  source: z.string().optional(),
  status: LeadStatus.optional(),
  temperature: Temperature.optional(),
  eventType: z.string().optional(),
  eventDate: z.coerce.date().optional(),
  guests: z.coerce.number().int().nonnegative().optional(),
  value: z.coerce.number().nonnegative().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  assignedToId: z.string().optional(),
  customerId: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const listLeadsQuery = z.object({
  status: LeadStatus.optional(),
  temperature: Temperature.optional(),
  assignedToId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
});

export const updateStatusSchema = z.object({ status: LeadStatus });
export const assignSchema = z.object({ assignedToId: z.string().nullable() });
export const noteSchema = z.object({ body: z.string().min(1) });
export const bulkSchema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(["delete", "status", "assign", "tag"]),
  status: LeadStatus.optional(),
  assignedToId: z.string().nullable().optional(),
  tag: z.string().optional(),
});
export const importSchema = z.object({
  rows: z.array(z.object({
    name: z.string().optional(),
    contactName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    eventType: z.string().optional(),
    value: z.coerce.number().optional(),
  })).min(1),
});
