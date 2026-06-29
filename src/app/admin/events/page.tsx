"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, CalendarHeart, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { eventsResource } from "@/hooks/resources";
import { useCan } from "@/components/providers/tenant-provider";
import { EVENT_STATUS_VARIANT } from "@/lib/mock/events";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function EventsPage() {
  const { items: events, isLoading, isError, refetch } = eventsResource.useList();
  const canCreate = useCan("create");

  const upcoming = events.filter((e) => e.status !== "Completed").length;
  const totalValue = events.reduce((s, e) => s + e.value, 0);
  const collected = events.reduce((s, e) => s + e.paid, 0);
  const stats = [
    { label: "Upcoming events", value: String(upcoming) },
    { label: "Contracted value", value: formatCurrency(totalValue, { compact: true }) },
    { label: "Collected", value: formatCurrency(collected, { compact: true }) },
    { label: "Avg. guests", value: String(events.length ? Math.round(events.reduce((s, e) => s + e.guests, 0) / events.length) : 0) },
  ];

  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Operations"
        title="Events"
        description="Manage every confirmed and tentative event on the calendar."
        actions={canCreate && (
          <Link href="/admin/events/new"><Button size="sm"><Plus className="h-4 w-4" /> New Event</Button></Link>
        )}
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
        <TableSkeleton rows={8} cols={7} />
      ) : isError ? (
        <ErrorState title="Couldn't load events" onRetry={() => refetch()} />
      ) : events.length === 0 ? (
        <EmptyState icon={CalendarHeart} title="No events yet" description="Confirmed bookings will show up here as events." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-line bg-panel/50 text-left">
                  {["Event", "Type", "Space", "Date", "Guests", "Value", "Paid", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {events.map((e) => {
                  const pct = e.value ? Math.round((e.paid / e.value) * 100) : 0;
                  return (
                    <tr key={e.id} className="group transition-colors hover:bg-panel/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Image src={e.clientAvatar} alt={e.client} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                          <div className="min-w-0">
                            <Link href={`/admin/events/${e.id}`} className="block truncate font-medium text-cocoa hover:text-espresso-600">{e.title}</Link>
                            <p className="truncate text-xs text-cocoa-faint">{e.client}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-cocoa-muted">{e.type}</td>
                      <td className="px-4 py-3 text-cocoa-muted">{e.space}</td>
                      <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(e.date)}</td>
                      <td className="px-4 py-3 text-cocoa-muted tnum">{e.guests}</td>
                      <td className="px-4 py-3 font-medium text-cocoa tnum">{formatCurrency(e.value, { compact: true })}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-canvas-deep">
                            <div className="h-full rounded-full bg-sage-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-cocoa-faint tnum">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant={EVENT_STATUS_VARIANT[e.status]} dot>{e.status}</Badge></td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/events/${e.id}`} className="grid h-7 w-7 place-items-center rounded-md text-cocoa-faint opacity-0 transition-all hover:bg-espresso-50 hover:text-cocoa group-hover:opacity-100">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
