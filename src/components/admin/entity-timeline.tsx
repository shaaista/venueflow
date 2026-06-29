"use client";

import { UserPlus, Users, CalendarPlus, FileSignature, ReceiptText, CreditCard, ListChecks, Bell } from "lucide-react";
import { activitiesResource } from "@/hooks/resources";
import type { DemoActivity } from "@/lib/demo/types";

const ICON: Record<DemoActivity["kind"], typeof Bell> = {
  lead: UserPlus, customer: Users, event: CalendarPlus, quote: FileSignature, invoice: ReceiptText, payment: CreditCard, task: ListChecks, system: Bell,
};

/** Vertical activity timeline. Filters by entityId when provided, else shows recent. */
export function EntityTimeline({ entityId, limit = 8, empty = "No activity yet." }: { entityId?: string; limit?: number; empty?: string }) {
  const { items } = activitiesResource.useList();
  const filtered = (entityId ? items.filter((a) => a.entityId === entityId) : items)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, limit);

  if (filtered.length === 0) return <p className="py-6 text-center text-sm text-cocoa-faint">{empty}</p>;

  return (
    <ol className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-line">
      {filtered.map((a) => {
        const Icon = ICON[a.kind] ?? Bell;
        return (
          <li key={a.id} className="relative flex gap-4">
            <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-surface text-espresso-600">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1 pb-1">
              <p className="text-sm font-medium text-cocoa">{a.title}</p>
              {a.detail && <p className="text-sm text-cocoa-muted">{a.detail}</p>}
              <p className="mt-0.5 text-xs text-cocoa-faint">{a.actor} · {a.time}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
