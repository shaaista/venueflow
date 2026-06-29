"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, Download, CreditCard, Loader2, ReceiptText, RotateCcw, Printer } from "lucide-react";
import { downloadPdfPlaceholder } from "@/lib/demo/export";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Field, TextInput } from "@/components/ui/form";
import { DocumentView } from "@/components/admin/finance/document-view";
import { EntityTimeline } from "@/components/admin/entity-timeline";
import { invoicesResource } from "@/hooks/resources";
import { useRecordPayment } from "@/hooks/use-workflows";
import { useToast } from "@/components/providers/toast-provider";
import { useCan } from "@/components/providers/tenant-provider";
import { INVOICE_STATUS_VARIANT } from "@/lib/mock/finance";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: invoice, isLoading } = invoicesResource.useItem(id);
  const recordPayment = useRecordPayment();
  const canUpdate = useCan("update");
  const [payOpen, setPayOpen] = useState(false);
  const [amount, setAmount] = useState("");

  if (isLoading) return <div className="container-lux space-y-4 py-7"><Skeleton className="h-8 w-40" /><Skeleton className="h-96" /></div>;
  if (!invoice) return <div className="container-lux py-7"><EmptyState icon={ReceiptText} title="Invoice not found" action={<Link href="/admin/invoices"><Button variant="outline">Back to invoices</Button></Link>} /></div>;

  const balance = invoice.amount - invoice.paid;
  const openPay = () => { setAmount(String(balance)); setPayOpen(true); };
  const submitPayment = () => {
    const amt = Math.min(Number(amount) || 0, balance);
    if (amt <= 0) return;
    recordPayment.mutate({ invoice, amount: amt }, { onSuccess: () => setPayOpen(false) });
  };

  return (
    <div className="container-lux space-y-5 py-7">
      <Link href="/admin/invoices" className="inline-flex items-center gap-1.5 text-sm text-cocoa-muted transition-colors hover:text-cocoa">
        <ArrowLeft className="h-4 w-4" /> Back to invoices
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <DocumentView
          kind="Invoice"
          number={invoice.id}
          client={invoice.client}
          event={invoice.event}
          statusLabel={invoice.status}
          statusVariant={INVOICE_STATUS_VARIANT[invoice.status]}
          dateLabel="Issued"
          dateValue={formatDate(invoice.issued, "long")}
          dueLabel="Due"
          dueValue={formatDate(invoice.due, "long")}
          paid={invoice.paid}
        />

        <div className="no-print space-y-5">
          {canUpdate && (
            <div className="card p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Actions</h2>
              <div className="space-y-2">
                {balance > 0 ? (
                  <Button className="w-full" onClick={openPay}><CreditCard className="h-4 w-4" /> Record payment</Button>
                ) : (
                  <Button variant="subtle" className="w-full" disabled><CreditCard className="h-4 w-4" /> Fully paid</Button>
                )}
                <Button variant="outline" className="w-full" onClick={() => toast({ kind: "info", title: "Reminder sent (demo)", description: invoice.client })}><Send className="h-4 w-4" /> Send reminder</Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadPdfPlaceholder(invoice.id, `Invoice ${invoice.id}`, [`Client: ${invoice.client}`, `Event: ${invoice.event}`, `Total: $${invoice.amount.toLocaleString()}`, `Paid: $${invoice.paid.toLocaleString()}`, `Status: ${invoice.status}`])}><Download className="h-4 w-4" /> PDF</Button>
                  <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
                </div>
                {invoice.paid > 0 && (
                  <Button variant="ghost" className="w-full text-cocoa-muted" onClick={() => toast({ kind: "warning", title: "Refund initiated (demo)" })}><RotateCcw className="h-4 w-4" /> Refund</Button>
                )}
              </div>
            </div>
          )}

          <div className="card p-5">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Paid to date</h2>
            <p className="font-display text-2xl font-semibold text-cocoa tnum">{formatCurrency(invoice.paid)}</p>
            <p className="text-xs text-cocoa-faint">of {formatCurrency(invoice.amount)} total</p>
            {balance > 0 && <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-600">{formatCurrency(balance)} outstanding</p>}
          </div>

          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Timeline</h2>
            <EntityTimeline entityId={invoice.id} limit={5} empty="Payments and updates appear here." />
          </div>
        </div>
      </div>

      <Modal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title="Record a payment"
        description={`Outstanding balance: ${formatCurrency(balance)}`}
        size="sm"
        footer={<>
          <Button variant="outline" size="sm" onClick={() => setPayOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={submitPayment} disabled={recordPayment.isPending}>{recordPayment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Record payment"}</Button>
        </>}
      >
        <Field label="Amount" required>
          <TextInput type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
      </Modal>
    </div>
  );
}
