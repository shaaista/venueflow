"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Download, Check, X, ReceiptText, Loader2, FileText, Printer } from "lucide-react";
import { downloadPdfPlaceholder } from "@/lib/demo/export";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentView } from "@/components/admin/finance/document-view";
import { EntityTimeline } from "@/components/admin/entity-timeline";
import { quotesResource } from "@/hooks/resources";
import { useAcceptQuote, useGenerateInvoice } from "@/hooks/use-workflows";
import { useToast } from "@/components/providers/toast-provider";
import { useCan } from "@/components/providers/tenant-provider";
import { QUOTE_STATUS_VARIANT } from "@/lib/mock/finance";
import { formatDate } from "@/lib/utils";

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { data: quote, isLoading } = quotesResource.useItem(id);
  const update = quotesResource.useUpdate();
  const accept = useAcceptQuote();
  const genInvoice = useGenerateInvoice();
  const canUpdate = useCan("update");

  if (isLoading) return <div className="container-lux space-y-4 py-7"><Skeleton className="h-8 w-40" /><Skeleton className="h-96" /></div>;
  if (!quote) return <div className="container-lux py-7"><EmptyState icon={FileText} title="Quote not found" action={<Link href="/admin/quotes"><Button variant="outline">Back to quotes</Button></Link>} /></div>;

  const accepted = quote.status === "Accepted";

  return (
    <div className="container-lux space-y-5 py-7">
      <Link href="/admin/quotes" className="inline-flex items-center gap-1.5 text-sm text-cocoa-muted transition-colors hover:text-cocoa">
        <ArrowLeft className="h-4 w-4" /> Back to quotes
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <DocumentView
          kind="Quote"
          number={quote.id}
          client={quote.client}
          event={quote.event}
          statusLabel={quote.status}
          statusVariant={QUOTE_STATUS_VARIANT[quote.status]}
          dateLabel="Issued"
          dateValue={formatDate(quote.created, "long")}
          dueLabel="Valid until"
          dueValue={formatDate(quote.validUntil, "long")}
        />

        <div className="no-print space-y-5">
          {canUpdate && (
            <div className="card p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Actions</h2>
              <div className="space-y-2">
                <Button className="w-full" onClick={() => update.mutate({ id: quote.id, patch: { status: "Sent" } }, { onSuccess: () => toast({ kind: "success", title: "Quote sent to client" }) })}>
                  <Send className="h-4 w-4" /> Send to client
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadPdfPlaceholder(quote.id, `Quote ${quote.id}`, [`Client: ${quote.client}`, `Event: ${quote.event}`, `Amount: $${quote.amount.toLocaleString()}`, `Status: ${quote.status}`])}>
                    <Download className="h-4 w-4" /> PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
                </div>
                {accepted ? (
                  <Button className="w-full" onClick={() => genInvoice.mutate({ client: quote.client, event: quote.event, amount: quote.amount }, { onSuccess: () => router.push("/admin/invoices") })} disabled={genInvoice.isPending}>
                    {genInvoice.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ReceiptText className="h-4 w-4" /> Generate Invoice</>}
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-2 border-t border-line pt-3">
                    <Button variant="subtle" size="sm" className="text-success" onClick={() => accept.mutate(quote)} disabled={accept.isPending}><Check className="h-4 w-4" /> Accept</Button>
                    <Button variant="subtle" size="sm" className="text-danger" onClick={() => update.mutate({ id: quote.id, patch: { status: "Declined" } }, { onSuccess: () => toast({ kind: "warning", title: "Quote declined" }) })}><X className="h-4 w-4" /> Decline</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Timeline</h2>
            <EntityTimeline entityId={quote.id} limit={5} empty="Activity will appear here." />
          </div>
        </div>
      </div>
    </div>
  );
}
