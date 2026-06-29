"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles, Check, ArrowRight, Loader2, RotateCcw, PartyPopper } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/components/providers/tenant-provider";
import { useToast } from "@/components/providers/toast-provider";
import { quotesResource, invoicesResource, eventsResource } from "@/hooks/resources";
import { runDemoJourney, getJourney, clearJourney, type Journey } from "@/lib/demo/journey";

export function GuidedDemo() {
  const { orgId } = useTenant();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [journey, setJourney] = useState<Journey | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => setJourney(getJourney()), []);

  const quote = quotesResource.useItem(journey?.quoteId);
  const invoice = invoicesResource.useItem(journey?.invoiceId);
  const event = eventsResource.useItem(journey?.eventId);

  const quoteAccepted = quote.data?.status === "Accepted";
  const invoicePaid = Boolean(invoice.data && invoice.data.paid >= invoice.data.amount);
  const eventDone = event.data?.status === "Completed";
  const allDone = quoteAccepted && invoicePaid && eventDone;

  const start = async () => {
    setRunning(true);
    const j = await runDemoJourney(orgId);
    setJourney(j);
    await qc.invalidateQueries();
    setRunning(false);
    toast({ kind: "success", title: "Demo journey started", description: "Lead → Customer → Event → Quote → Invoice created" });
  };

  const reset = () => {
    clearJourney();
    setJourney(null);
  };

  const created = journey
    ? [
        { label: "Enquiry created", href: `/admin/leads/${journey.leadId}` },
        { label: "Converted to customer", href: `/admin/customers/${journey.customerId}` },
        { label: "Event created", href: `/admin/events/${journey.eventId}` },
        { label: "Quote sent", href: `/admin/quotes/${journey.quoteId}` },
        { label: "Invoice issued", href: `/admin/invoices/${journey.invoiceId}` },
      ]
    : [];

  const steps = journey
    ? [
        { done: quoteAccepted, label: "Accept the quote", desc: "As the customer, approve the proposal", href: `/portal/quotes/${journey.quoteId}`, cta: "Open quote" },
        { done: invoicePaid, label: "Pay the invoice", desc: "Settle the balance in the portal", href: `/portal/payments`, cta: "Pay now" },
        { done: eventDone, label: "Complete the event", desc: "Mark the event as delivered", href: `/admin/events/${journey.eventId}`, cta: "Open event" },
      ]
    : [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-[90] flex items-center gap-2 rounded-full bg-espresso-600 px-4 py-2.5 text-sm font-medium text-cream shadow-float transition-transform hover:scale-105"
        style={{ background: "var(--brand-color, #4A3728)" }}
      >
        <Sparkles className="h-4 w-4" /> Demo Journey
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Guided Demo Journey" description="Run the full event lifecycle in a few clicks." size="md"
        footer={journey ? <Button variant="ghost" size="sm" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset journey</Button> : undefined}
      >
        {!journey ? (
          <div className="space-y-4">
            <p className="text-sm text-cocoa-muted">
              This creates a complete sample booking and walks you through the lifecycle —
              perfect for a live client demo.
            </p>
            <ul className="space-y-2">
              {["Public enquiry → Lead", "Convert to Customer", "Create Event", "Generate Quote", "Generate Invoice"].map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-cocoa">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-espresso-50 text-espresso-600"><Check className="h-3 w-3" /></span>{s}
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={start} disabled={running}>
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4" /> Run Demo Journey</>}
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {allDone && (
              <div className="flex items-center gap-3 rounded-xl border border-sage-200 bg-sage-50 p-4">
                <PartyPopper className="h-6 w-6 text-sage-600" />
                <div><p className="font-medium text-cocoa">Lifecycle complete! 🎉</p><p className="text-sm text-cocoa-muted">Enquiry → payment → delivered. Check the dashboard.</p></div>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Created for Olivia &amp; Tom</p>
              <div className="grid grid-cols-1 gap-1">
                {created.map((c) => (
                  <Link key={c.label} href={c.href} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-cocoa-muted hover:bg-panel">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-sage-500 text-cream"><Check className="h-2.5 w-2.5" strokeWidth={3} /></span>
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Now try these</p>
              <div className="space-y-2">
                {steps.map((s, i) => (
                  <div key={s.label} className={`flex items-center gap-3 rounded-xl border p-3 ${s.done ? "border-sage-200 bg-sage-50" : "border-line"}`}>
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${s.done ? "bg-sage-500 text-cream" : "bg-espresso-100 text-espresso-700"}`}>
                      {s.done ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${s.done ? "text-cocoa-muted line-through" : "text-cocoa"}`}>{s.label}</p>
                      {!s.done && <p className="text-xs text-cocoa-faint">{s.desc}</p>}
                    </div>
                    {!s.done && (
                      <Link href={s.href} onClick={() => setOpen(false)}>
                        <Button size="sm" variant="outline">{s.cta} <ArrowRight className="h-3.5 w-3.5" /></Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
