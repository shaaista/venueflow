"use client";

import { createResource } from "./use-resource";

// Tenant-scoped resource hooks for every module. Each exposes
// useList / useItem / useCreate / useUpdate / useRemove.
export const leadsResource = createResource("leads");
export const customersResource = createResource("customers");
export const eventsResource = createResource("events");
export const quotesResource = createResource("quotes");
export const invoicesResource = createResource("invoices");
export const paymentsResource = createResource("payments");
export const tasksResource = createResource("tasks");
export const conversationsResource = createResource("conversations");
export const notificationsResource = createResource("notifications");
export const activitiesResource = createResource("activities");
export const teamResource = createResource("team");
