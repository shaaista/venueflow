"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, ChevronRight, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { quotesResource } from "@/hooks/resources";
import { useCan } from "@/components/providers/tenant-provider";
import { QUOTE_STATUS_VARIANT } from "@/lib/mock/finance";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function QuotesPage() {
  const { items: quotes, isLoading, isError, refetch } = quotesResource.useList();
  const canCreate = useCan("create");

  const open = quotes.filter((q) => ["Sent", "Viewed", "Draft"].includes(q.status));
  const accepted = quotes.filter((q) => q.status === "Accepted");
  const stats = [
    { label: "Open quotes", value: String(open.length) },
    { label: "Open value", value: formatCurrency(open.reduce((s, q) => s + q.amount, 0), { compact: true }) },
    { label: "Accepted", value: String(accepted.length) },
    { label: "Acceptance rate", value: `${quotes.length ? Math.round((accepted.length / quotes.length) * 100) : 0}%` },
  ];

  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Sales"
        title="Quotes & Proposals"
        description="Build, send, and track proposals from draft to signature."
        actions={canCreate && <Link href="/admin/quotes/new"><Button size="sm"><Plus className="h-4 w-4" /> New Quote</Button></Link>}
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
        <TableSkeleton rows={6} cols={6} />
      ) : isError ? (
        <ErrorState title="Couldn't load quotes" onRetry={() => refetch()} />
      ) : quotes.length === 0 ? (
        <EmptyState icon={FileText} title="No quotes yet" description="Proposals you build will appear here." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-line bg-panel/50 text-left">
                  {["Quote", "Client", "Event", "Amount", "Created", "Valid until", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {quotes.map((q) => (
                  <tr key={q.id} className="group transition-colors hover:bg-panel/60">
                    <td className="px-4 py-3">
                      <Link href={`/admin/quotes/${q.id}`} className="flex items-center gap-2 font-medium text-cocoa hover:text-espresso-600">
                        <FileText className="h-4 w-4 text-cocoa-faint" /> {q.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-cocoa-muted">
                        <Image src={q.clientAvatar} alt={q.client} width={24} height={24} className="h-6 w-6 rounded-full object-cover" />{q.client}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-cocoa-muted">{q.event}</td>
                    <td className="px-4 py-3 font-medium text-cocoa tnum">{formatCurrency(q.amount, { compact: true })}</td>
                    <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(q.created)}</td>
                    <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(q.validUntil)}</td>
                    <td className="px-4 py-3"><Badge variant={QUOTE_STATUS_VARIANT[q.status]} dot>{q.status}</Badge></td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/quotes/${q.id}`} className="grid h-7 w-7 place-items-center rounded-md text-cocoa-faint opacity-0 transition-all hover:bg-espresso-50 hover:text-cocoa group-hover:opacity-100">
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
