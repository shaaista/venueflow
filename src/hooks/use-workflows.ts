"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTenant } from "@/components/providers/tenant-provider";
import { useToast } from "@/components/providers/toast-provider";
import * as wf from "@/lib/demo/workflows";
import type { DemoLead, DemoQuote, DemoInvoice, DemoEvent } from "@/lib/demo/types";

/** Wraps a workflow fn: runs it with the current org, invalidates everything, toasts. */
function useWorkflow<TArgs, TResult>(
  fn: (orgId: string, args: TArgs) => Promise<TResult>,
  success: (args: TArgs, result: TResult) => { title: string; description?: string },
) {
  const { orgId } = useTenant();
  const { toast } = useToast();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: TArgs) => fn(orgId, args),
    onSuccess: (result, args) => {
      void qc.invalidateQueries(); // dashboard + every list reflects the cascade
      const msg = success(args, result);
      toast({ kind: "success", ...msg });
    },
  });
}

export const useCreateLead = () =>
  useWorkflow(
    (orgId, input: Parameters<typeof wf.createLead>[1]) => wf.createLead(orgId, input),
    (input) => ({ title: "Enquiry created", description: `${input.contactName} added to your pipeline` }),
  );

export const useConvertLead = () =>
  useWorkflow(
    (orgId, lead: DemoLead) => wf.convertLeadToCustomer(orgId, lead),
    (lead) => ({ title: "Lead converted", description: `${lead.contactName} is now a customer` }),
  );

export const useCreateEvent = () =>
  useWorkflow(
    (orgId, input: Parameters<typeof wf.createEvent>[1]) => wf.createEvent(orgId, input),
    (input) => ({ title: "Event created", description: input.title }),
  );

export const useGenerateQuote = () =>
  useWorkflow(
    (orgId, input: Parameters<typeof wf.generateQuote>[1]) => wf.generateQuote(orgId, input),
    (_input, q) => ({ title: "Quote generated", description: `${q.id} sent to ${q.client}` }),
  );

export const useAcceptQuote = () =>
  useWorkflow(
    (orgId, quote: DemoQuote) => wf.acceptQuote(orgId, quote),
    (quote) => ({ title: "Quote accepted 🎉", description: quote.id }),
  );

export const useGenerateInvoice = () =>
  useWorkflow(
    (orgId, input: Parameters<typeof wf.generateInvoice>[1]) => wf.generateInvoice(orgId, input),
    (_input, inv) => ({ title: "Invoice generated", description: inv.id }),
  );

export const useRecordPayment = () =>
  useWorkflow(
    (orgId, args: { invoice: DemoInvoice; amount: number }) => wf.recordPayment(orgId, args.invoice, args.amount),
    (args) => ({ title: "Payment recorded", description: `$${args.amount.toLocaleString()} from ${args.invoice.client}` }),
  );

export const useCompleteEvent = () =>
  useWorkflow(
    (orgId, event: DemoEvent) => wf.completeEvent(orgId, event),
    (event) => ({ title: "Event completed", description: event.title }),
  );
