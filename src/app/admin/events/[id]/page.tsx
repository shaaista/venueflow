"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, CalendarDays, Clock, Users, MapPin, FileSignature, CheckCircle2, XCircle, Loader2, CalendarHeart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { EventTabs } from "@/components/admin/events/event-tabs";
import { EntityTimeline } from "@/components/admin/entity-timeline";
import { eventsResource } from "@/hooks/resources";
import { useGenerateQuote, useCompleteEvent } from "@/hooks/use-workflows";
import { useToast } from "@/components/providers/toast-provider";
import { useCan } from "@/components/providers/tenant-provider";
import { EVENT_STATUS_VARIANT } from "@/lib/mock/events";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { data: event, isLoading } = eventsResource.useItem(id);
  const update = eventsResource.useUpdate();
  const genQuote = useGenerateQuote();
  const complete = useCompleteEvent();
  const canUpdate = useCan("update");

  if (isLoading) return <div className="container-lux space-y-4 py-7"><Skeleton className="h-8 w-40" /><Skeleton className="h-40" /><Skeleton className="h-64" /></div>;
  if (!event) return <div className="container-lux py-7"><EmptyState icon={CalendarHeart} title="Event not found" action={<Link href="/admin/events"><Button variant="outline">Back to events</Button></Link>} /></div>;

  const pct = event.value ? Math.round((event.paid / event.value) * 100) : 0;
  const facts = [
    { icon: CalendarDays, label: "Date", value: formatDate(event.date, "long") },
    { icon: Clock, label: "Time", value: `${event.start} – ${event.end}` },
    { icon: MapPin, label: "Space", value: event.space },
    { icon: Users, label: "Guests", value: String(event.guests) },
  ];

  const onGenerateQuote = () => genQuote.mutate({ client: event.client, event: event.title, amount: event.value }, { onSuccess: () => router.push("/admin/quotes") });
  const onComplete = () => complete.mutate(event);
  const onCancel = () => update.mutate({ id: event.id, patch: { status: "Tentative" } }, { onSuccess: () => toast({ kind: "warning", title: "Event set to tentative" }) });

  return (
    <div className="container-lux space-y-5 py-7">
      <Link href="/admin/events" className="inline-flex items-center gap-1.5 text-sm text-cocoa-muted transition-colors hover:text-cocoa">
        <ArrowLeft className="h-4 w-4" /> Back to events
      </Link>

      <div className="card overflow-hidden">
        <div className="relative h-32 bg-espresso-600"><div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_20%_0%,rgba(217,119,6,0.25),transparent)]" /></div>
        <div className="px-5 pb-5">
          <div className="-mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4">
              <Image src={event.clientAvatar} alt={event.client} width={64} height={64} className="h-16 w-16 rounded-2xl border-4 border-surface object-cover" />
              <div className="mb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-medium text-cocoa">{event.title}</h1>
                  <Badge variant={EVENT_STATUS_VARIANT[event.status]} dot>{event.status}</Badge>
                </div>
                <p className="text-sm text-cocoa-muted">{event.type} · {event.client} · {event.id}</p>
              </div>
            </div>
            {canUpdate && (
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={onGenerateQuote} disabled={genQuote.isPending}>
                  {genQuote.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><FileSignature className="h-4 w-4" /> Generate Quote</>}
                </Button>
                {event.status !== "Completed" ? (
                  <Button size="sm" onClick={onComplete} disabled={complete.isPending}>
                    {complete.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4" /> Complete Event</>}
                  </Button>
                ) : (
                  <Badge variant="success" dot>Completed</Badge>
                )}
                <button onClick={onCancel} title="Set tentative" className="grid h-9 w-9 place-items-center rounded-lg border border-line text-cocoa-faint hover:bg-panel"><XCircle className="h-4 w-4" /></button>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 bg-surface p-3.5">
                <f.icon className="h-4 w-4 text-cocoa-faint" />
                <div><p className="text-xs text-cocoa-faint">{f.label}</p><p className="text-sm font-medium text-cocoa">{f.value}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <EventTabs event={event} />
          <section className="card p-5">
            <h2 className="mb-4 font-display text-lg text-cocoa">Timeline</h2>
            <EntityTimeline entityId={event.id} empty="No activity recorded for this event yet." />
          </section>
        </div>

        <div className="space-y-5">
          <section className="card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Payment summary</h2>
            <div className="flex items-end justify-between">
              <div><p className="text-xs text-cocoa-faint">Collected</p><p className="font-display text-2xl font-semibold text-cocoa tnum">{formatCurrency(event.paid)}</p></div>
              <p className="text-sm text-cocoa-faint tnum">of {formatCurrency(event.value)}</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-canvas-deep"><div className="h-full rounded-full bg-sage-500" style={{ width: `${pct}%` }} /></div>
            <p className="mt-2 text-xs text-cocoa-faint">{pct}% paid</p>
          </section>

          <section className="card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Coordinator</h2>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-espresso-100 font-medium text-espresso-700">{event.coordinator.split(" ").map((n) => n[0]).join("")}</div>
              <div><p className="text-sm font-medium text-cocoa">{event.coordinator}</p><p className="text-xs text-cocoa-faint">Event coordinator</p></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
