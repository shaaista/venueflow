"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, MapPin, Building2, Calendar, CreditCard, TrendingUp,
  CalendarPlus, FileSignature, Users, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Field, TextInput } from "@/components/ui/form";
import { EntityTimeline } from "@/components/admin/entity-timeline";
import { customersResource, eventsResource } from "@/hooks/resources";
import { useCreateEvent, useGenerateQuote } from "@/hooks/use-workflows";
import { useCan } from "@/components/providers/tenant-provider";
import { CUSTOMER_STATUS_VARIANT } from "@/lib/mock/customers";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: customer, isLoading } = customersResource.useItem(id);
  const { items: allEvents } = eventsResource.useList();
  const createEvent = useCreateEvent();
  const genQuote = useGenerateQuote();
  const canCreate = useCan("create");

  const [eventOpen, setEventOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [evForm, setEvForm] = useState({ title: "", type: "Wedding Reception", date: "", guests: "120", value: "25000" });
  const [qForm, setQForm] = useState({ event: "Event package", amount: "25000" });

  if (isLoading) return <div className="container-lux space-y-4 py-7"><Skeleton className="h-8 w-40" /><Skeleton className="h-64" /></div>;
  if (!customer) return <div className="container-lux py-7"><EmptyState icon={Users} title="Customer not found" action={<Link href="/admin/customers"><Button variant="outline">Back to customers</Button></Link>} /></div>;

  const customerEvents = allEvents.filter((e) => e.client === customer.name).slice(0, 5);
  const stats = [
    { icon: TrendingUp, label: "Lifetime value", value: formatCurrency(customer.totalSpent) },
    { icon: Calendar, label: "Events hosted", value: String(customer.events) },
    { icon: CreditCard, label: "Avg. event", value: formatCurrency(customer.events ? customer.totalSpent / customer.events : 0) },
    { icon: Calendar, label: "Customer since", value: formatDate(customer.since) },
  ];

  const submitEvent = () => createEvent.mutate(
    { title: evForm.title || `${customer.name} Event`, type: evForm.type, client: customer.name, date: evForm.date || new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10), guests: Number(evForm.guests) || 100, value: Number(evForm.value) || 25000 },
    { onSuccess: () => { setEventOpen(false); router.push("/admin/events"); } },
  );
  const submitQuote = () => genQuote.mutate(
    { client: customer.name, event: qForm.event, amount: Number(qForm.amount) || 25000 },
    { onSuccess: () => { setQuoteOpen(false); router.push("/admin/quotes"); } },
  );

  return (
    <div className="container-lux space-y-5 py-7">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-cocoa-muted transition-colors hover:text-cocoa">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-5">
          <div className="card p-5 text-center">
            <Image src={customer.avatar} alt={customer.name} width={80} height={80} className="mx-auto h-20 w-20 rounded-full object-cover" />
            <h1 className="mt-3 font-display text-xl text-cocoa">{customer.name}</h1>
            {customer.company && <p className="text-sm text-cocoa-muted">{customer.company}</p>}
            <div className="mt-3 flex justify-center"><Badge variant={CUSTOMER_STATUS_VARIANT[customer.status]} dot>{customer.status}</Badge></div>
            {canCreate && (
              <div className="mt-4 grid gap-2">
                <Button size="sm" onClick={() => { setEvForm((f) => ({ ...f, title: `${customer.name} Event` })); setEventOpen(true); }}><CalendarPlus className="h-4 w-4" /> Create Event</Button>
                <Button variant="outline" size="sm" onClick={() => setQuoteOpen(true)}><FileSignature className="h-4 w-4" /> Create Quote</Button>
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Contact</h2>
            <dl className="space-y-3.5 text-sm">
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-cocoa-faint" /><span className="truncate text-cocoa">{customer.email}</span></div>
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-cocoa-faint" /><span className="text-cocoa">{customer.phone}</span></div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4 shrink-0 text-cocoa-faint" /><span className="text-cocoa">{customer.location}</span></div>
              {customer.company && <div className="flex items-center gap-3"><Building2 className="h-4 w-4 shrink-0 text-cocoa-faint" /><span className="text-cocoa">{customer.company}</span></div>}
            </dl>
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">{customer.tags.map((t) => <Badge key={t} variant="default">{t}</Badge>)}</div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="card p-4">
                <s.icon className="h-4 w-4 text-cocoa-faint" />
                <p className="mt-2 font-display text-lg font-semibold text-cocoa tnum">{s.value}</p>
                <p className="text-xs text-cocoa-faint">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg text-cocoa">Event history</h2>
              <Link href="/admin/events" className="text-xs font-medium text-espresso-600 hover:underline">View all</Link>
            </div>
            {customerEvents.length > 0 ? (
              <div className="space-y-2.5">
                {customerEvents.map((e) => (
                  <Link key={e.id} href={`/admin/events/${e.id}`} className="flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:bg-panel/60">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-espresso-50 text-espresso-600"><Calendar className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-cocoa">{e.title}</p><p className="text-xs text-cocoa-faint">{e.type} · {formatDate(e.date)}</p></div>
                    <span className="text-sm font-medium text-cocoa tnum">{formatCurrency(e.value, { compact: true })}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-cocoa-faint">No events yet — create one to get started.</p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="mb-4 font-display text-lg text-cocoa">Activity</h2>
            <EntityTimeline entityId={customer.id} empty="Activity for this customer will appear here." />
          </div>
        </div>
      </div>

      <Modal open={eventOpen} onClose={() => setEventOpen(false)} title="Create event" description={`For ${customer.name}`} size="md"
        footer={<><Button variant="outline" size="sm" onClick={() => setEventOpen(false)}>Cancel</Button><Button size="sm" onClick={submitEvent} disabled={createEvent.isPending}>{createEvent.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create event"}</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Event title" className="sm:col-span-2"><TextInput value={evForm.title} onChange={(e) => setEvForm((f) => ({ ...f, title: e.target.value }))} /></Field>
          <Field label="Type"><TextInput value={evForm.type} onChange={(e) => setEvForm((f) => ({ ...f, type: e.target.value }))} /></Field>
          <Field label="Date"><TextInput type="date" value={evForm.date} onChange={(e) => setEvForm((f) => ({ ...f, date: e.target.value }))} /></Field>
          <Field label="Guests"><TextInput type="number" value={evForm.guests} onChange={(e) => setEvForm((f) => ({ ...f, guests: e.target.value }))} /></Field>
          <Field label="Value"><TextInput type="number" value={evForm.value} onChange={(e) => setEvForm((f) => ({ ...f, value: e.target.value }))} /></Field>
        </div>
      </Modal>

      <Modal open={quoteOpen} onClose={() => setQuoteOpen(false)} title="Create quote" description={`For ${customer.name}`} size="sm"
        footer={<><Button variant="outline" size="sm" onClick={() => setQuoteOpen(false)}>Cancel</Button><Button size="sm" onClick={submitQuote} disabled={genQuote.isPending}>{genQuote.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate quote"}</Button></>}>
        <div className="space-y-4">
          <Field label="Event / package"><TextInput value={qForm.event} onChange={(e) => setQForm((f) => ({ ...f, event: e.target.value }))} /></Field>
          <Field label="Amount"><TextInput type="number" value={qForm.amount} onChange={(e) => setQForm((f) => ({ ...f, amount: e.target.value }))} /></Field>
        </div>
      </Modal>
    </div>
  );
}
