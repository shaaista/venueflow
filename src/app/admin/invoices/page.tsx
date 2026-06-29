"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, ChevronRight, ReceiptText } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { invoicesResource } from "@/hooks/resources";
import { useCan } from "@/components/providers/tenant-provider";
import { INVOICE_STATUS_VARIANT } from "@/lib/mock/finance";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoicesPage() {
  const { items: invoices, isLoading, isError, refetch } = invoicesResource.useList();
  const canCreate = useCan("create");

  const outstanding = invoices.reduce((s, i) => s + (i.amount - i.paid), 0);
  const overdue = invoices.filter((i) => i.status === "Overdue").length;
  const stats = [
    { label: "Outstanding", value: formatCurrency(outstanding, { compact: true }) },
    { label: "Collected", value: formatCurrency(invoices.reduce((s, i) => s + i.paid, 0), { compact: true }) },
    { label: "Overdue", value: String(overdue) },
    { label: "Invoices", value: String(invoices.length) },
  ];

  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Sales"
        title="Invoices"
        description="Issue invoices, track payments, and chase outstanding balances."
        actions={canCreate && <Link href="/admin/invoices/new"><Button size="sm"><Plus className="h-4 w-4" /> New Invoice</Button></Link>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="font-display text-2xl font-semibold text-cocoa tnum">{s.value}</p>
            <p className="text-xs text-cocoa-faint">{s.label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : isError ? (
        <ErrorState title="Couldn't load invoices" onRetry={() => refetch()} />
      ) : invoices.length === 0 ? (
        <EmptyState icon={ReceiptText} title="No invoices yet" description="Invoices you generate will appear here." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-line bg-panel/50 text-left">
                  {["Invoice", "Client", "Event", "Amount", "Balance", "Due", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="group transition-colors hover:bg-panel/60">
                    <td className="px-4 py-3">
                      <Link href={`/admin/invoices/${inv.id}`} className="flex items-center gap-2 font-medium text-cocoa hover:text-espresso-600">
                        <ReceiptText className="h-4 w-4 text-cocoa-faint" /> {inv.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-cocoa-muted">
                        <Image src={inv.clientAvatar} alt={inv.client} width={24} height={24} className="h-6 w-6 rounded-full object-cover" />{inv.client}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-cocoa-muted">{inv.event}</td>
                    <td className="px-4 py-3 font-medium text-cocoa tnum">{formatCurrency(inv.amount, { compact: true })}</td>
                    <td className="px-4 py-3 tnum text-cocoa-muted">{formatCurrency(inv.amount - inv.paid, { compact: true })}</td>
                    <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(inv.due)}</td>
                    <td className="px-4 py-3"><Badge variant={INVOICE_STATUS_VARIANT[inv.status]} dot>{inv.status}</Badge></td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/invoices/${inv.id}`} className="grid h-7 w-7 place-items-center rounded-md text-cocoa-faint opacity-0 transition-all hover:bg-espresso-50 hover:text-cocoa group-hover:opacity-100">
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
