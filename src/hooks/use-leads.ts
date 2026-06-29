"use client";

import { leadsResource } from "./resources";
import type { LeadStage } from "@/lib/mock/leads";

/** Tenant-scoped leads list (loading/error/empty + mock store data). */
export const useLeadsData = leadsResource.useList;

/** Optimistic stage change used by the kanban + table. */
export function useUpdateLeadStage() {
  const update = leadsResource.useUpdate();
  return {
    ...update,
    mutate: ({ id, stage }: { id: string; stage: LeadStage }) => update.mutate({ id, patch: { stage } }),
  };
}

export const useCreateLead = leadsResource.useCreate;
export const useUpdateLead = leadsResource.useUpdate;
export const useRemoveLead = leadsResource.useRemove;
export const useLead = leadsResource.useItem;
