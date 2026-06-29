"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight, CalendarDays, Download, Plus, MoreHorizontal,
  CreditCard, FileSignature, UserPlus, CalendarPlus, Users, ReceiptText, ListChecks, Bell,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { MetricCard } from "@/components/admin/metric-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { TasksWidget } from "@/components/admin/tasks-widget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardGridSkeleton, Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";
import { useTenant } from "@/components/providers/tenant-provider";
import { STAGE_VARIANT } from "@/lib/mock/leads";
import { formatCurrency, formatDate } from "@/lib/utils";

const ACTIVITY_ICON = { payment: CreditCard, quote: FileSignature, lead: UserPlus, event: CalendarPlus, customer: Users, invoice: ReceiptText, task: ListChecks, system: Bell } as const;
const PIPE_COLOR: Record<string, string> = { amber: "bg-amber-400", sage: "bg-sage-500", espresso: "bg-espresso-500" };

function Panel({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card p-5 ${className ?? ""}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg text-cocoa">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function DashboardPage() {
  const { tenant } = useTenant();
  const { isLoading, kpis, revenueSeries, pipeline, recentLeads, upcoming, activity } = useDashboard();
  const maxPipe = Math.max(1, ...pipeline.map((p) => p.value));

  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow={`${tenant.name}`}
        title="Daily Overview"
        description="Here's what's happening across your venue today."
        actions={
          <>
            <span className="hidden items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-cocoa-muted sm:flex">
              <CalendarDays className="h-4 w-4 text-cocoa-faint" /> June 29, 2026
            </span>
            <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export</Button>
            <Link href="/admin/leads/new"><Button size="sm"><Plus className="h-4 w-4" /> New Enquiry</Button></Link>
          </>
        }
      />

      {/* KPIs */}
      {isLoading ? (
        <CardGridSkeleton count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((m) => <MetricCard key={m.key} metric={m} />)}
        </div>
      )}

      {/* Revenue + Tasks */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel
          title="Revenue performance"
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-3 text-xs text-cocoa-muted sm:flex">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-espresso-600" /> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sage-500" /> Target</span>
              </div>
              <button className="text-cocoa-faint hover:text-cocoa"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          }
        >
          {isLoading ? <Skeleton className="h-[260px]" /> : <RevenueChart data={revenueSeries} />}
        </Panel>

        <Panel title="Pending tasks" action={<Link href="/admin/tasks" className="text-xs font-medium text-espresso-600 hover:underline">View all</Link>}>
          <TasksWidget />
        </Panel>
      </div>

      {/* Pipeline + Activity */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Event pipeline" className="lg:col-span-2" action={<Link href="/admin/leads/pipeline" className="text-xs font-medium text-espresso-600 hover:underline">Open board</Link>}>
          <div className="space-y-4">
            {pipeline.map((stage) => (
              <div key={stage.stage}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-cocoa">
                    <span className={`h-2 w-2 rounded-full ${PIPE_COLOR[stage.color]}`} />
                    {stage.stage}
                    <span className="text-cocoa-faint">· {stage.count}</span>
                  </span>
                  <span className="font-medium text-cocoa tnum">{formatCurrency(stage.value, { compact: true })}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-canvas-deep">
                  <div className={`h-full rounded-full ${PIPE_COLOR[stage.color]}`} style={{ width: `${(stage.value / maxPipe) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Activity" action={<Link href="/admin/messages" className="text-xs font-medium text-espresso-600 hover:underline">View all</Link>}>
          <ul className="space-y-4">
            {activity.map((a) => {
              const Icon = ACTIVITY_ICON[a.kind] ?? Bell;
              return (
                <li key={a.id} className="flex gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-espresso-50 text-espresso-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-cocoa">{a.title}</p>
                    <p className="mt-0.5 text-xs text-cocoa-faint">{a.actor} · {a.time}</p>
                  </div>
                </li>
              );
            })}
            {activity.length === 0 && <li className="py-4 text-center text-sm text-cocoa-faint">No recent activity.</li>}
          </ul>
        </Panel>
      </div>

      {/* Recent enquiries + Upcoming events */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Recent enquiries" className="lg:col-span-2" action={<Link href="/admin/leads" className="flex items-center gap-1 text-xs font-medium text-espresso-600 hover:underline">All leads <ArrowUpRight className="h-3 w-3" /></Link>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  {["Enquiry", "Event", "Date", "Value", "Stage"].map((h) => (
                    <th key={h} className="pb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="group transition-colors hover:bg-panel">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <Image src={lead.avatar} alt={lead.contactName} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                        <div className="min-w-0">
                          <Link href={`/admin/leads/${lead.id}`} className="truncate font-medium text-cocoa hover:text-espresso-600">{lead.name}</Link>
                          <p className="truncate text-xs text-cocoa-faint">{lead.contactName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-cocoa-muted">{lead.eventType}</td>
                    <td className="py-3 pr-3 text-cocoa-muted tnum">{formatDate(lead.eventDate)}</td>
                    <td className="py-3 pr-3 font-medium text-cocoa tnum">{formatCurrency(lead.value, { compact: true })}</td>
                    <td className="py-3"><Badge variant={STAGE_VARIANT[lead.stage]} dot>{lead.stage}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Upcoming events" action={<Link href="/admin/calendar" className="text-xs font-medium text-espresso-600 hover:underline">Calendar</Link>}>
          <ul className="space-y-3">
            {upcoming.map((e) => {
              const d = new Date(e.date);
              return (
                <li key={e.id} className="flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:bg-panel">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-espresso-50 text-center">
                    <span className="text-[10px] font-semibold uppercase text-espresso-500">{d.toLocaleString("en-US", { month: "short" })}</span>
                    <span className="-mt-0.5 font-display text-lg font-semibold leading-none text-espresso-700">{d.getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-cocoa">{e.title}</p>
                    <p className="truncate text-xs text-cocoa-faint">{e.start} · {e.guests} guests · {e.space}</p>
                  </div>
                  <Badge variant={e.status === "Confirmed" ? "success" : e.status === "Tentative" ? "amber" : "espresso"}>{e.status}</Badge>
                </li>
              );
            })}
            {upcoming.length === 0 && <p className="py-4 text-center text-sm text-cocoa-faint">No upcoming events.</p>}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
