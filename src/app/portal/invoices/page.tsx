"use client";

import Link from "next/link";
import { ReceiptText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { invoicesResource } from "@/hooks/resources";
import { INVOICE_STATUS_VARIANT } from "@/lib/mock/finance";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PortalInvoicesPage() {
  const { items: invoices, isLoading } = invoicesResource.useList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cocoa">Invoices</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Your billing history and outstanding balances.</p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : invoices.length === 0 ? (
        <EmptyState icon={ReceiptText} title="No invoices yet" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-line bg-panel/50 text-left">
                {["Invoice", "Event", "Total", "Balance", "Due", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-panel/60">
                  <td className="px-4 py-3"><span className="flex items-center gap-2 font-medium text-cocoa"><ReceiptText className="h-4 w-4 text-cocoa-faint" /> {inv.id}</span></td>
                  <td className="px-4 py-3 text-cocoa-muted">{inv.event}</td>
                  <td className="px-4 py-3 font-medium text-cocoa tnum">{formatCurrency(inv.amount)}</td>
                  <td className="px-4 py-3 text-cocoa-muted tnum">{formatCurrency(inv.amount - inv.paid)}</td>
                  <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(inv.due)}</td>
                  <td className="px-4 py-3"><Badge variant={INVOICE_STATUS_VARIANT[inv.status]} dot>{inv.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    {inv.amount - inv.paid > 0 ? (
                      <Link href="/portal/payments"><Button size="sm">Pay</Button></Link>
                    ) : (
                      <button className="inline-grid h-8 w-8 place-items-center rounded-lg text-cocoa-faint hover:bg-espresso-50 hover:text-cocoa"><Download className="h-4 w-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
