"use client";

import { useState } from "react";
import { Lock, CreditCard, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { invoicesResource, paymentsResource } from "@/hooks/resources";
import { useRecordPayment } from "@/hooks/use-workflows";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { DemoInvoice } from "@/lib/demo/types";

const inputCls = "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-cocoa outline-none focus:border-espresso-300";

export default function PortalPaymentsPage() {
  const { items: invoices, isLoading } = invoicesResource.useList();
  const { items: payments } = paymentsResource.useList();
  const recordPayment = useRecordPayment();
  const outstanding = invoices.filter((i) => i.amount - i.paid > 0);
  const [selected, setSelected] = useState<DemoInvoice | null>(null);
  const active = selected ?? outstanding[0];
  const balance = active ? active.amount - active.paid : 0;

  const pay = () => active && recordPayment.mutate({ invoice: active, amount: balance }, { onSuccess: () => setSelected(null) });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cocoa">Payments</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Settle your balance securely online.</p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={3} cols={3} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-cocoa">Pay your balance</h2>
              <span className="flex items-center gap-1 text-xs text-cocoa-faint"><Lock className="h-3 w-3" /> Secured payment</span>
            </div>
            {active ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-line bg-panel/50 p-3">
                  <p className="text-xs text-cocoa-faint">Invoice {active.id} · {active.event}</p>
                  <p className="mt-1 font-display text-xl font-semibold text-cocoa tnum">{formatCurrency(balance)} due</p>
                </div>
                <div><label className="mb-1.5 block text-xs font-medium text-cocoa-muted">Card number</label>
                  <div className="relative"><input className={inputCls} placeholder="1234 1234 1234 1234" /><CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-faint" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="mb-1.5 block text-xs font-medium text-cocoa-muted">Expiry</label><input className={inputCls} placeholder="MM / YY" /></div>
                  <div><label className="mb-1.5 block text-xs font-medium text-cocoa-muted">CVC</label><input className={inputCls} placeholder="123" /></div>
                </div>
                <Button className="w-full" onClick={pay} disabled={recordPayment.isPending}>
                  {recordPayment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Pay {formatCurrency(balance)}</>}
                </Button>
              </div>
            ) : (
              <EmptyState icon={Check} title="You're all paid up" description="No outstanding balances. Thank you!" />
            )}
          </div>

          <div className="space-y-5">
            {outstanding.length > 0 && (
              <div className="card p-5">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Outstanding invoices</h2>
                <div className="space-y-2">
                  {outstanding.map((inv) => (
                    <button key={inv.id} onClick={() => setSelected(inv)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${active?.id === inv.id ? "border-espresso-300 bg-espresso-50" : "border-line hover:bg-panel/60"}`}>
                      <div><p className="text-sm font-medium text-cocoa">{inv.id}</p><p className="text-xs text-cocoa-faint">{inv.event}</p></div>
                      <span className="text-sm font-medium text-cocoa tnum">{formatCurrency(inv.amount - inv.paid)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="card p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Payment history</h2>
              <div className="space-y-2.5">
                {payments.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-sage-50 text-sage-600"><Check className="h-3.5 w-3.5" /></span>
                      <div><p className="text-sm text-cocoa">{p.method}</p><p className="text-xs text-cocoa-faint">{formatDate(p.date)}</p></div>
                    </div>
                    <div className="text-right"><p className="text-sm font-medium text-cocoa tnum">{formatCurrency(p.amount)}</p><Badge variant="success">{p.status}</Badge></div>
                  </div>
                ))}
                {payments.length === 0 && <p className="py-2 text-center text-sm text-cocoa-faint">No payments yet.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
