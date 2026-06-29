"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, X, Download, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentView } from "@/components/admin/finance/document-view";
import { quotesResource } from "@/hooks/resources";
import { useAcceptQuote } from "@/hooks/use-workflows";
import { useToast } from "@/components/providers/toast-provider";
import { QUOTE_STATUS_VARIANT } from "@/lib/mock/finance";
import { formatDate } from "@/lib/utils";

export default function PortalQuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { data: quote, isLoading } = quotesResource.useItem(id);
  const update = quotesResource.useUpdate();
  const accept = useAcceptQuote();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-40" /><Skeleton className="h-96" /></div>;
  if (!quote) return <EmptyState icon={FileText} title="Quote not found" action={<Link href="/portal/quotes"><Button variant="outline">Back to quotes</Button></Link>} />;

  const accepted = quote.status === "Accepted";

  return (
    <div className="space-y-5">
      <Link href="/portal/quotes" className="inline-flex items-center gap-1.5 text-sm text-cocoa-muted hover:text-cocoa">
        <ArrowLeft className="h-4 w-4" /> Back to quotes
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <DocumentView
          kind="Quote"
          number={quote.id}
          client={quote.client}
          event={quote.event}
          statusLabel={accepted ? "Accepted" : "Awaiting your approval"}
          statusVariant={accepted ? "success" : QUOTE_STATUS_VARIANT[quote.status]}
          dateLabel="Issued"
          dateValue={formatDate(quote.created, "long")}
          dueLabel="Valid until"
          dueValue={formatDate(quote.validUntil, "long")}
        />

        <div className="space-y-5">
          <div className="card overflow-hidden">
            <div className="bg-espresso-50 p-5">
              <h2 className="font-display text-lg text-cocoa">{accepted ? "Thank you!" : "Ready to confirm?"}</h2>
              <p className="mt-1 text-sm text-cocoa-muted">
                {accepted ? "Your proposal is accepted. We'll send your deposit invoice shortly." : "Accept this proposal to secure your date. A 25% deposit will follow."}
              </p>
              {!accepted && (
                <>
                  <Button size="sm" className="mt-4 w-full" onClick={() => accept.mutate(quote)} disabled={accept.isPending}>
                    {accept.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Accept proposal</>}
                  </Button>
                  <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => toast({ kind: "info", title: "Request sent", description: "Your planner will be in touch." })}>Request changes</Button>
                </>
              )}
              {accepted && <Link href="/portal/invoices" className="mt-4 block"><Button size="sm" className="w-full">View invoices</Button></Link>}
            </div>
          </div>
          <div className="card p-5">
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => toast({ kind: "info", title: "PDF downloaded (demo)" })}><Download className="h-4 w-4" /> Download PDF</Button>
            {!accepted && <Button variant="ghost" size="sm" className="w-full justify-start text-cocoa-muted" onClick={() => update.mutate({ id: quote.id, patch: { status: "Declined" } }, { onSuccess: () => { toast({ kind: "warning", title: "Quote declined" }); router.push("/portal/quotes"); } })}><X className="h-4 w-4" /> Decline</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
