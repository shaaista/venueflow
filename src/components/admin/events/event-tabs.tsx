"use client";

import { useState } from "react";
import { Clock, CheckCircle2, CircleDot, XCircle } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  EVENT_SCHEDULE,
  EVENT_GUESTS,
  EVENT_CATERING,
  EVENT_PAYMENTS,
  type VenueEvent,
} from "@/lib/mock/events";
import { formatCurrency, cn } from "@/lib/utils";

export function EventTabs({ event }: { event: VenueEvent }) {
  const [tab, setTab] = useState("overview");

  const rsvpIcon = (s: string) =>
    s === "Confirmed" ? (
      <CheckCircle2 className="h-4 w-4 text-success" />
    ) : s === "Declined" ? (
      <XCircle className="h-4 w-4 text-danger" />
    ) : (
      <CircleDot className="h-4 w-4 text-amber-400" />
    );

  return (
    <div className="card overflow-hidden">
      <Tabs
        value={tab}
        onChange={setTab}
        className="px-2"
        tabs={[
          { label: "Overview", value: "overview" },
          { label: "Schedule", value: "schedule" },
          { label: "Guests", value: "guests", count: event.guests },
          { label: "Catering", value: "catering" },
          { label: "Payments", value: "payments" },
        ]}
      />

      <div className="p-5">
        {tab === "overview" && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-cocoa-muted">
              {event.title} is a {event.type.toLowerCase()} for {event.guests}{" "}
              guests in {event.space}, hosted by {event.client}. Coordinated by{" "}
              {event.coordinator}.
            </p>
            <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {[
                { label: "Type", value: event.type },
                { label: "Space", value: event.space },
                { label: "Coordinator", value: event.coordinator },
                { label: "Doors", value: event.start },
                { label: "Close", value: event.end },
                { label: "Headcount", value: `${event.guests} guests` },
              ].map((f) => (
                <div key={f.label} className="bg-surface p-3.5">
                  <p className="text-xs text-cocoa-faint">{f.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-cocoa">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "schedule" && (
          <ol className="relative space-y-4 before:absolute before:left-[60px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-line">
            {EVENT_SCHEDULE.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-14 shrink-0 pt-0.5 text-right text-xs font-medium text-cocoa-faint tnum">
                  {s.time}
                </span>
                <span className="z-10 mt-1 grid h-3 w-3 shrink-0 place-items-center rounded-full border-2 border-espresso-400 bg-surface" />
                <div className="min-w-0 flex-1 pb-1">
                  <p className="text-sm font-medium text-cocoa">{s.title}</p>
                  <p className="text-sm text-cocoa-muted">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {tab === "guests" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  {["Name", "Role", "RSVP", "Meal"].map((h) => (
                    <th key={h} className="pb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {EVENT_GUESTS.map((g) => (
                  <tr key={g.name}>
                    <td className="py-2.5 font-medium text-cocoa">{g.name}</td>
                    <td className="py-2.5 text-cocoa-muted">{g.role}</td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-1.5 text-cocoa-muted">
                        {rsvpIcon(g.rsvp)} {g.rsvp}
                      </span>
                    </td>
                    <td className="py-2.5 text-cocoa-muted">{g.meal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "catering" && (
          <div className="space-y-2.5">
            {EVENT_CATERING.map((c) => (
              <div
                key={c.course}
                className="flex items-start justify-between gap-4 rounded-xl border border-line p-3.5"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                    {c.course}
                  </p>
                  <p className="mt-1 text-sm text-cocoa">{c.items}</p>
                </div>
                <Badge variant="default">{c.diet}</Badge>
              </div>
            ))}
          </div>
        )}

        {tab === "payments" && (
          <div className="space-y-4">
            <div className="space-y-2">
              {EVENT_PAYMENTS.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-line p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-lg",
                        p.status === "Paid"
                          ? "bg-sage-50 text-sage-600"
                          : "bg-amber-50 text-amber-600"
                      )}
                    >
                      <Clock className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-cocoa">{p.label}</p>
                      <p className="text-xs text-cocoa-faint">Due {p.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-cocoa tnum">
                      {formatCurrency(p.amount)}
                    </p>
                    <Badge variant={p.status === "Paid" ? "success" : "amber"}>
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
