"use client";

import Image from "next/image";
import { Send, Paperclip } from "lucide-react";

const THREAD = [
  { from: "them", name: "Mara Quinn", time: "Jun 22 · 2:30 PM", body: "Hi Eleanor! Lovely to meet you at the site visit. I've attached a draft floor plan for the Atrium — let me know your thoughts." },
  { from: "us", time: "Jun 22 · 4:10 PM", body: "Thank you Mara! It looks beautiful. Could we add a small lounge area near the bar?" },
  { from: "them", name: "Mara Quinn", time: "Jun 23 · 9:15 AM", body: "Absolutely — I'll update the plan and resend. Also, would you like to book your tasting for the 12th?" },
  { from: "us", time: "Jun 23 · 10:02 AM", body: "Yes please, the 12th works perfectly for us both." },
  { from: "them", name: "Mara Quinn", time: "Jun 23 · 10:20 AM", body: "Wonderful — you're booked in for 2pm on the 12th. Can't wait!" },
];

export default function PortalMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cocoa">Messages</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Chat directly with your event planner.</p>
      </div>

      <div className="card flex h-[60vh] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line p-4">
          <Image src="https://i.pravatar.cc/80?img=47" alt="Mara Quinn" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium text-cocoa">Mara Quinn</p>
            <p className="text-xs text-cocoa-faint">Your event planner · Usually replies within an hour</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {THREAD.map((m, i) => (
            <div key={i} className={`flex ${m.from === "us" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[75%]">
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.from === "us" ? "bg-espresso-600 text-cream" : "border border-line bg-surface text-cocoa"}`}>
                  {m.body}
                </div>
                <p className={`mt-1 text-[11px] text-cocoa-faint ${m.from === "us" ? "text-right" : ""}`}>
                  {m.from === "them" ? `${m.name} · ` : ""}{m.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line p-4">
          <div className="flex items-end gap-2 rounded-xl border border-line bg-surface p-2 pl-3">
            <button className="mb-1 text-cocoa-faint hover:text-cocoa"><Paperclip className="h-5 w-5" /></button>
            <textarea rows={1} placeholder="Write a message…" className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-sm text-cocoa outline-none placeholder:text-cocoa-faint" />
            <button className="grid h-9 w-9 place-items-center rounded-lg bg-espresso-600 text-cream hover:bg-espresso-700"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
