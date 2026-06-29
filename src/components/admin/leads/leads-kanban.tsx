"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Users, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  STAGES,
  STAGE_VARIANT,
  TEMP_VARIANT,
  type Lead,
  type LeadStage,
} from "@/lib/mock/leads";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

const STAGE_ACCENT: Record<LeadStage, string> = {
  New: "bg-amber-400",
  Contacted: "bg-espresso-500",
  Proposal: "bg-sage-500",
  Negotiation: "bg-cocoa-faint",
  Won: "bg-success",
  Lost: "bg-danger",
};

export function LeadsKanban({
  leads,
  onMove,
}: {
  leads: Lead[];
  onMove: (id: string, stage: LeadStage) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<LeadStage | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const items = leads.filter((l) => l.stage === stage);
        const total = items.reduce((s, l) => s + l.value, 0);
        return (
          <div
            key={stage}
            onDragOver={(e) => {
              e.preventDefault();
              setOverStage(stage);
            }}
            onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
            onDrop={() => {
              if (dragId) onMove(dragId, stage);
              setDragId(null);
              setOverStage(null);
            }}
            className={cn(
              "flex w-[280px] shrink-0 flex-col rounded-2xl border bg-panel/60 transition-colors",
              overStage === stage
                ? "border-espresso-300 bg-espresso-50/50"
                : "border-line"
            )}
          >
            <div className="flex items-center justify-between px-3.5 py-3">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", STAGE_ACCENT[stage])} />
                <span className="text-sm font-medium text-cocoa">{stage}</span>
                <span className="rounded-full bg-surface px-1.5 text-xs text-cocoa-faint">
                  {items.length}
                </span>
              </div>
              <span className="text-xs text-cocoa-faint tnum">
                {formatCurrency(total, { compact: true })}
              </span>
            </div>

            <div className="flex-1 space-y-2.5 px-2.5 pb-3">
              {items.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => setDragId(lead.id)}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverStage(null);
                  }}
                  className={cn(
                    "group rounded-xl border border-line bg-surface p-3 shadow-soft transition-all",
                    dragId === lead.id ? "opacity-40" : "hover:shadow-card"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-cocoa-ghost opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="block truncate text-sm font-medium text-cocoa hover:text-espresso-600"
                      >
                        {lead.name}
                      </Link>
                      <p className="mt-0.5 truncate text-xs text-cocoa-faint">
                        {lead.eventType}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant={TEMP_VARIANT[lead.temperature]} dot>
                      {lead.temperature}
                    </Badge>
                    <span className="text-xs font-medium text-cocoa tnum">
                      {formatCurrency(lead.value, { compact: true })}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5 text-xs text-cocoa-faint">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(lead.eventDate, "short")}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {lead.guests}
                      </span>
                      <Image
                        src={lead.owner.avatar}
                        alt={lead.owner.name}
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                    </span>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-line py-8 text-center text-xs text-cocoa-ghost">
                  Drop here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
