"use client";

import { useState } from "react";
import Image from "next/image";
import {
  StickyNote,
  Mail,
  Phone,
  ArrowRightLeft,
  FileText,
  MapPin,
  Paperclip,
  Download,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLeadTimeline, LEAD_NOTES, type TimelineEntry } from "@/lib/mock/leads";
import { cn } from "@/lib/utils";

const TABS = ["Timeline", "Notes", "Files", "Messages"] as const;
type Tab = (typeof TABS)[number];

const KIND_META: Record<
  TimelineEntry["kind"],
  { icon: typeof Mail; tint: string }
> = {
  note: { icon: StickyNote, tint: "bg-amber-50 text-amber-600 border-amber-200" },
  email: { icon: Mail, tint: "bg-espresso-50 text-espresso-600 border-espresso-200" },
  call: { icon: Phone, tint: "bg-sage-50 text-sage-600 border-sage-200" },
  stage: { icon: ArrowRightLeft, tint: "bg-espresso-50 text-espresso-600 border-espresso-200" },
  quote: { icon: FileText, tint: "bg-sage-50 text-sage-600 border-sage-200" },
  visit: { icon: MapPin, tint: "bg-amber-50 text-amber-600 border-amber-200" },
};

const FILES = [
  { name: "Proposal_Q-1182.pdf", size: "248 KB", date: "Jun 26", type: "PDF" },
  { name: "Floor_plan_atrium.png", size: "1.2 MB", date: "Jun 22", type: "PNG" },
  { name: "Tasting_menu_draft.pdf", size: "180 KB", date: "Jun 18", type: "PDF" },
];

const MESSAGES = [
  { from: "them", name: "Eleanor Vance", time: "Jun 18 · 10:12 AM", body: "Hi! We're looking to host our wedding reception in mid-September for around 220 guests. Is the Grand Atrium available?" },
  { from: "us", name: "Alex Rivera", time: "Jun 18 · 11:30 AM", body: "Hi Eleanor — congratulations! Yes, Sept 14 is currently open. I'd love to set up a site visit. Would next week work?" },
  { from: "them", name: "Eleanor Vance", time: "Jun 19 · 9:02 AM", body: "That's wonderful. Tuesday afternoon would be perfect for us both." },
];

export function LeadDetailTabs() {
  const [tab, setTab] = useState<Tab>("Timeline");
  const timeline = getLeadTimeline();

  return (
    <div className="card overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-line px-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative px-3.5 py-3 text-sm font-medium transition-colors",
              tab === t ? "text-cocoa" : "text-cocoa-faint hover:text-cocoa-muted"
            )}
          >
            {t}
            {tab === t && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-espresso-600" />
            )}
          </button>
        ))}
      </div>

      <div className="p-5">
        {tab === "Timeline" && (
          <ol className="relative space-y-5 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-line">
            {timeline.map((e) => {
              const meta = KIND_META[e.kind];
              return (
                <li key={e.id} className="relative flex gap-4">
                  <span
                    className={cn(
                      "z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-surface",
                      meta.tint
                    )}
                  >
                    <meta.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <p className="text-sm font-medium text-cocoa">{e.title}</p>
                      <span className="text-xs text-cocoa-faint">{e.time}</span>
                    </div>
                    {e.body && (
                      <p className="mt-1 text-sm leading-relaxed text-cocoa-muted">
                        {e.body}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-cocoa-faint">by {e.who}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {tab === "Notes" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-panel/60 p-3">
              <textarea
                rows={3}
                placeholder="Add an internal note…"
                className="w-full resize-none bg-transparent text-sm text-cocoa outline-none placeholder:text-cocoa-faint"
              />
              <div className="flex justify-end">
                <Button size="sm">Add note</Button>
              </div>
            </div>
            {LEAD_NOTES.map((n) => (
              <div key={n.id} className="flex gap-3">
                <Image
                  src={n.avatar}
                  alt={n.who}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1 rounded-xl border border-line bg-surface p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-cocoa">{n.who}</p>
                    <span className="text-xs text-cocoa-faint">{n.time}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-cocoa-muted">
                    {n.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Files" && (
          <div className="space-y-2">
            <button className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line py-6 text-sm text-cocoa-muted transition-colors hover:border-espresso-300 hover:bg-panel/50">
              <Paperclip className="h-4 w-4" /> Drop files here or click to upload
            </button>
            {FILES.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:bg-panel/60"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-espresso-50 text-[10px] font-semibold text-espresso-600">
                  {f.type}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-cocoa">{f.name}</p>
                  <p className="text-xs text-cocoa-faint">
                    {f.size} · {f.date}
                  </p>
                </div>
                <button className="grid h-8 w-8 place-items-center rounded-lg text-cocoa-faint hover:bg-espresso-50 hover:text-cocoa">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "Messages" && (
          <div className="space-y-4">
            {MESSAGES.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.from === "us" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5",
                    m.from === "us"
                      ? "bg-espresso-600 text-cream"
                      : "border border-line bg-surface text-cocoa"
                  )}
                >
                  <p className="text-sm leading-relaxed">{m.body}</p>
                  <p
                    className={cn(
                      "mt-1 text-[11px]",
                      m.from === "us" ? "text-cream/60" : "text-cocoa-faint"
                    )}
                  >
                    {m.name} · {m.time}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-xl border border-line bg-panel/60 p-1.5 pl-3">
              <input
                placeholder="Write a reply…"
                className="flex-1 bg-transparent text-sm text-cocoa outline-none placeholder:text-cocoa-faint"
              />
              <Button size="sm">
                <Send className="h-4 w-4" /> Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
