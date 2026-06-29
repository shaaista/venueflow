"use client";

import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { quotesResource } from "@/hooks/resources";
import { QUOTE_STATUS_VARIANT } from "@/lib/mock/finance";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PortalQuotesPage() {
  const { items: quotes, isLoading } = quotesResource.useList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cocoa">Quotes</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Proposals we've prepared for your events.</p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : quotes.length === 0 ? (
        <EmptyState icon={FileText} title="No quotes yet" description="Your proposals will appear here." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-line bg-panel/50 text-left">
                {["Quote", "Event", "Amount", "Date", "Valid until", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {quotes.map((q) => (
                <tr key={q.id} className="group hover:bg-panel/60">
                  <td className="px-4 py-3"><Link href={`/portal/quotes/${q.id}`} className="flex items-center gap-2 font-medium text-cocoa hover:text-espresso-600"><FileText className="h-4 w-4 text-cocoa-faint" /> {q.id}</Link></td>
                  <td className="px-4 py-3 text-cocoa-muted">{q.event}</td>
                  <td className="px-4 py-3 font-medium text-cocoa tnum">{formatCurrency(q.amount)}</td>
                  <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(q.created)}</td>
                  <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(q.validUntil)}</td>
                  <td className="px-4 py-3"><Badge variant={QUOTE_STATUS_VARIANT[q.status]} dot>{q.status}</Badge></td>
                  <td className="px-4 py-3"><Link href={`/portal/quotes/${q.id}`} className="grid h-7 w-7 place-items-center rounded-md text-cocoa-faint opacity-0 transition-all hover:bg-espresso-50 hover:text-cocoa group-hover:opacity-100"><ChevronRight className="h-4 w-4" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
