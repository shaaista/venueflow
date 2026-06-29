"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Download,
  Upload,
  SlidersHorizontal,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadsKanban } from "@/components/admin/leads/leads-kanban";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useLeadsData, useUpdateLeadStage } from "@/hooks/use-leads";
import { exportCsv } from "@/lib/demo/export";
import {
  STAGES,
  STAGE_VARIANT,
  TEMP_VARIANT,
  type LeadStage,
} from "@/lib/mock/leads";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

type View = "table" | "kanban";

export function LeadsExplorer({ initialView = "table" }: { initialView?: View }) {
  const { items: leads, isLoading, isError, refetch } = useLeadsData();
  const updateStage = useUpdateLeadStage();
  const [view, setView] = useState<View>(initialView);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<LeadStage | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      const matchesStage = stageFilter === "All" || l.stage === stageFilter;
      const matchesQuery =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.eventType.toLowerCase().includes(q);
      return matchesStage && matchesQuery;
    });
  }, [leads, query, stageFilter]);

  const move = (id: string, stage: LeadStage) => updateStage.mutate({ id, stage });

  const stageCounts = useMemo(() => {
    const map: Record<string, number> = { All: leads.length };
    for (const s of STAGES) map[s] = leads.filter((l) => l.stage === s).length;
    return map;
  }, [leads]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search enquiries…"
              className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300"
            />
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCsv("leads", filtered.map((l) => ({ id: l.id, name: l.name, contact: l.contactName, email: l.email, phone: l.phone, eventType: l.eventType, eventDate: l.eventDate, guests: l.guests, value: l.value, stage: l.stage, temperature: l.temperature, source: l.source })))}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
          <div className="flex items-center rounded-lg border border-line bg-surface p-0.5">
            <button
              onClick={() => setView("table")}
              className={cn(
                "grid h-7 w-8 place-items-center rounded-md transition-colors",
                view === "table"
                  ? "bg-espresso-600 text-cream"
                  : "text-cocoa-faint hover:text-cocoa"
              )}
              title="Table view"
            >
              <TableIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("kanban")}
              className={cn(
                "grid h-7 w-8 place-items-center rounded-md transition-colors",
                view === "kanban"
                  ? "bg-espresso-600 text-cream"
                  : "text-cocoa-faint hover:text-cocoa"
              )}
              title="Kanban view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stage filter chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(["All", ...STAGES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStageFilter(s)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              stageFilter === s
                ? "border-espresso-300 bg-espresso-50 text-espresso-700"
                : "border-line bg-surface text-cocoa-muted hover:border-line-strong"
            )}
          >
            {s}
            <span className="text-cocoa-faint">{stageCounts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Views */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : isError ? (
        <ErrorState
          title="Couldn't load enquiries"
          description="There was a problem reaching the server."
          onRetry={() => refetch()}
        />
      ) : leads.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No enquiries yet"
          description="New enquiries from your website forms and bookings will appear here."
        />
      ) : view === "kanban" ? (
        <LeadsKanban leads={filtered} onMove={move} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="border-b border-line bg-panel/50 text-left">
                  {["Enquiry", "Event", "Date", "Guests", "Value", "Owner", "Temp", "Stage", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="group transition-colors hover:bg-panel/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Image
                          src={lead.avatar}
                          alt={lead.contactName}
                          width={34}
                          height={34}
                          className="h-[34px] w-[34px] rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="block truncate font-medium text-cocoa hover:text-espresso-600"
                          >
                            {lead.name}
                          </Link>
                          <p className="truncate text-xs text-cocoa-faint">
                            {lead.contactName} · {lead.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-cocoa-muted">{lead.eventType}</td>
                    <td className="px-4 py-3 text-cocoa-muted tnum">
                      {formatDate(lead.eventDate)}
                    </td>
                    <td className="px-4 py-3 text-cocoa-muted tnum">{lead.guests}</td>
                    <td className="px-4 py-3 font-medium text-cocoa tnum">
                      {formatCurrency(lead.value, { compact: true })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <Image
                          src={lead.owner.avatar}
                          alt={lead.owner.name}
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="hidden text-xs text-cocoa-muted xl:inline">
                          {lead.owner.name.split(" ")[0]}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={TEMP_VARIANT[lead.temperature]} dot>
                        {lead.temperature}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STAGE_VARIANT[lead.stage]}>{lead.stage}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="grid h-7 w-7 place-items-center rounded-md text-cocoa-faint opacity-0 transition-all hover:bg-espresso-50 hover:text-cocoa group-hover:opacity-100"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-cocoa-muted">No enquiries match your filters.</p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-cocoa-faint">
            <span>
              Showing {filtered.length} of {leads.length} enquiries
            </span>
            <div className="flex items-center gap-1">
              <button className="rounded-md border border-line px-2 py-1 hover:bg-panel">
                Previous
              </button>
              <button className="rounded-md border border-line bg-espresso-600 px-2.5 py-1 text-cream">
                1
              </button>
              <button className="rounded-md border border-line px-2 py-1 hover:bg-panel">
                2
              </button>
              <button className="rounded-md border border-line px-2 py-1 hover:bg-panel">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
