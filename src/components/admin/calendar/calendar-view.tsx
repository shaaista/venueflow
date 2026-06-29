"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type CalEvent = {
  date: string;
  title: string;
  time: string;
  space: string;
  guests: number;
  color: "espresso" | "sage" | "amber";
};

const CAL_EVENTS: CalEvent[] = [
  { date: "2026-06-05", title: "Tasting — Almeida party", time: "2:00 PM", space: "The Reserve", guests: 8, color: "amber" },
  { date: "2026-06-12", title: "Site visit — Vance wedding", time: "11:00 AM", space: "Grand Atrium", guests: 4, color: "sage" },
  { date: "2026-06-18", title: "Discovery call — Aster Records", time: "10:00 AM", space: "—", guests: 2, color: "espresso" },
  { date: "2026-06-21", title: "Rivera Quinceañera", time: "5:00 PM", space: "Cellar Lounge", guests: 150, color: "espresso" },
  { date: "2026-06-24", title: "Vendor walkthrough", time: "3:00 PM", space: "Grand Atrium", guests: 6, color: "amber" },
  { date: "2026-06-28", title: "Founders Dinner prep", time: "1:00 PM", space: "The Reserve", guests: 5, color: "sage" },
  { date: "2026-06-28", title: "Bloom networking call", time: "4:00 PM", space: "—", guests: 2, color: "amber" },
  { date: "2026-06-30", title: "Harlow graduation", time: "6:00 PM", space: "Terrace Gardens", guests: 60, color: "sage" },
  { date: "2026-07-19", title: "Brightline Offsite", time: "10:00 AM", space: "Terrace Gardens", guests: 80, color: "sage" },
  { date: "2026-07-29", title: "Northwind Launch", time: "6:30 PM", space: "Cellar Lounge", guests: 140, color: "espresso" },
];

const PILL: Record<CalEvent["color"], string> = {
  espresso: "bg-espresso-100 text-espresso-700",
  sage: "bg-sage-100 text-sage-700",
  amber: "bg-amber-100 text-amber-700",
};
const DOT: Record<CalEvent["color"], string> = {
  espresso: "bg-espresso-500",
  sage: "bg-sage-500",
  amber: "bg-amber-400",
};

const VIEWS = ["Month", "Week", "Day", "Agenda"] as const;
type ViewMode = (typeof VIEWS)[number];

export function CalendarView() {
  const [cursor, setCursor] = useState(new Date(2026, 5, 28));
  const [view, setView] = useState<ViewMode>("Month");

  const eventsByDay = useMemo(() => {
    const m: Record<string, CalEvent[]> = {};
    for (const e of CAL_EVENTS) (m[e.date] ??= []).push(e);
    return m;
  }, []);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [cursor]);

  const title =
    view === "Day"
      ? format(cursor, "EEEE, MMMM d, yyyy")
      : view === "Week"
      ? `${format(weekDays[0], "MMM d")} – ${format(weekDays[6], "MMM d, yyyy")}`
      : format(cursor, "MMMM yyyy");

  const step = (dir: number) => {
    if (view === "Day") setCursor((c) => addDays(c, dir));
    else if (view === "Week") setCursor((c) => addDays(c, dir * 7));
    else setCursor((c) => addMonths(c, dir));
  };

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => step(-1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-line text-cocoa-muted hover:bg-panel"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => step(1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-line text-cocoa-muted hover:bg-panel"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <h2 className="font-display text-lg text-cocoa">{title}</h2>
          <button
            onClick={() => setCursor(new Date(2026, 5, 28))}
            className="rounded-lg border border-line px-2.5 py-1 text-xs text-cocoa-muted hover:bg-panel"
          >
            Today
          </button>
        </div>
        <div className="flex items-center rounded-lg border border-line bg-surface p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                view === v
                  ? "bg-espresso-600 text-cream"
                  : "text-cocoa-faint hover:text-cocoa"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Month */}
      {view === "Month" && (
        <div>
          <div className="grid grid-cols-7 border-b border-line">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-cocoa-ghost"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const key = format(day, "yyyy-MM-dd");
              const items = eventsByDay[key] ?? [];
              const inMonth = isSameMonth(day, cursor);
              const isToday = isSameDay(day, new Date(2026, 5, 28));
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[112px] border-b border-r border-line p-1.5",
                    i % 7 === 6 && "border-r-0",
                    !inMonth && "bg-panel/40"
                  )}
                >
                  <div className="flex justify-end">
                    <span
                      className={cn(
                        "grid h-6 w-6 place-items-center rounded-full text-xs",
                        isToday
                          ? "bg-espresso-600 font-semibold text-cream"
                          : inMonth
                          ? "text-cocoa-muted"
                          : "text-cocoa-ghost"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {items.slice(0, 3).map((e, j) => (
                      <div
                        key={j}
                        className={cn(
                          "truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                          PILL[e.color]
                        )}
                        title={`${e.time} · ${e.title}`}
                      >
                        {e.time} {e.title}
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="px-1.5 text-[11px] text-cocoa-faint">
                        +{items.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week */}
      {view === "Week" && (
        <div className="grid grid-cols-7">
          {weekDays.map((day, i) => {
            const key = format(day, "yyyy-MM-dd");
            const items = eventsByDay[key] ?? [];
            const isToday = isSameDay(day, new Date(2026, 5, 28));
            return (
              <div key={i} className={cn("min-h-[420px] border-r border-line p-2", i === 6 && "border-r-0")}>
                <div className="mb-2 text-center">
                  <p className="text-[11px] uppercase tracking-wider text-cocoa-ghost">
                    {format(day, "EEE")}
                  </p>
                  <span
                    className={cn(
                      "mt-0.5 inline-grid h-7 w-7 place-items-center rounded-full text-sm",
                      isToday ? "bg-espresso-600 font-semibold text-cream" : "text-cocoa"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {items.map((e, j) => (
                    <div key={j} className={cn("rounded-lg p-2 text-xs", PILL[e.color])}>
                      <p className="font-semibold">{e.time}</p>
                      <p className="truncate">{e.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day */}
      {view === "Day" && (
        <div className="max-h-[560px] overflow-y-auto">
          {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => {
            const label = `${((hour + 11) % 12) + 1}:00 ${hour < 12 ? "AM" : "PM"}`;
            const key = format(cursor, "yyyy-MM-dd");
            const items = (eventsByDay[key] ?? []).filter(
              (e) => parseInt(e.time) === ((hour + 11) % 12) + 1
            );
            return (
              <div key={hour} className="flex gap-3 border-b border-line px-4 py-2">
                <div className="w-16 shrink-0 pt-1 text-right text-xs text-cocoa-faint">
                  {label}
                </div>
                <div className="flex-1 space-y-1.5 py-1">
                  {items.map((e, j) => (
                    <div key={j} className={cn("rounded-lg p-2.5 text-sm", PILL[e.color])}>
                      <p className="font-semibold">{e.title}</p>
                      <p className="text-xs opacity-80">
                        {e.space} · {e.guests} guests
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Agenda */}
      {view === "Agenda" && (
        <div className="divide-y divide-line">
          {[...CAL_EVENTS]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((e, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-panel/60">
                <div className="w-14 shrink-0 text-center">
                  <p className="text-[11px] uppercase text-cocoa-ghost">
                    {format(parseISO(e.date), "MMM")}
                  </p>
                  <p className="font-display text-lg font-semibold text-cocoa">
                    {format(parseISO(e.date), "d")}
                  </p>
                </div>
                <span className={cn("h-10 w-1 rounded-full", DOT[e.color])} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-cocoa">{e.title}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-cocoa-faint">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {e.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {e.space}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {e.guests}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
