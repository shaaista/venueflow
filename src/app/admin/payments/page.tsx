"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, ArrowDownLeft, ArrowUpRight, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { paymentsResource } from "@/hooks/resources";
import { exportCsv } from "@/lib/demo/export";
import { PAYMENT_STATUS_VARIANT } from "@/lib/mock/finance";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PaymentsPage() {
  const { items: payments, isLoading, isError, refetch } = paymentsResource.useList();

  const collected = payments.filter((p) => p.status === "Succeeded").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const refunded = payments.filter((p) => p.status === "Refunded").reduce((s, p) => s + p.amount, 0);
  const stats = [
    { label: "Collected", value: formatCurrency(collected, { compact: true }), icon: ArrowDownLeft, tint: "sage" },
    { label: "Pending", value: formatCurrency(pending, { compact: true }), icon: ArrowUpRight, tint: "amber" },
    { label: "Refunded", value: formatCurrency(refunded, { compact: true }), icon: ArrowUpRight, tint: "espresso" },
    { label: "Transactions", value: String(payments.length), icon: CreditCard, tint: "sage" },
  ];
  const TINT: Record<string, string> = { sage: "bg-sage-50 text-sage-600", amber: "bg-amber-50 text-amber-600", espresso: "bg-espresso-50 text-espresso-600" };

  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Sales"
        title="Payments"
        description="Every transaction across cards, transfers, and refunds."
        actions={<Button variant="outline" size="sm" onClick={() => exportCsv("payments", payments.map((p) => ({ id: p.id, client: p.client, method: p.method, invoice: p.invoice, date: p.date, amount: p.amount, status: p.status })))}><Download className="h-4 w-4" /> Export</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-3 p-4">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${TINT[s.tint]}`}><s.icon className="h-5 w-5" /></div>
            <div>
              <p className="font-display text-xl font-semibold text-cocoa tnum">{s.value}</p>
              <p className="text-xs text-cocoa-faint">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : isError ? (
        <ErrorState title="Couldn't load payments" onRetry={() => refetch()} />
      ) : payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments yet" description="Payments you record will appear here." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-line bg-panel/50 text-left">
                  {["Transaction", "Client", "Method", "Invoice", "Date", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {payments.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-panel/60">
                    <td className="px-4 py-3 font-medium text-cocoa">{p.id}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-cocoa-muted">
                        <Image src={p.clientAvatar} alt={p.client} width={24} height={24} className="h-6 w-6 rounded-full object-cover" />{p.client}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-cocoa-muted">{p.method}</td>
                    <td className="px-4 py-3"><Link href={`/admin/invoices/${p.invoice}`} className="text-espresso-600 hover:underline">{p.invoice}</Link></td>
                    <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(p.date)}</td>
                    <td className="px-4 py-3 font-medium text-cocoa tnum">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3"><Badge variant={PAYMENT_STATUS_VARIANT[p.status]} dot>{p.status}</Badge></td>
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
