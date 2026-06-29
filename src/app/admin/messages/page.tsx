"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Send, Phone, Mail, MessageCircle, Paperclip, Star } from "lucide-react";
import { conversationsResource } from "@/hooks/resources";
import { cn } from "@/lib/utils";
import type { DemoConversation } from "@/lib/demo/types";

const CHANNEL_ICON = { email: Mail, sms: MessageCircle, whatsapp: Phone } as const;

export default function MessagesPage() {
  const { items: conversations, isLoading } = conversationsResource.useList();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId && conversations.length) setActiveId(conversations[0].id);
  }, [conversations, activeId]);

  const active: DemoConversation | undefined = conversations.find((c) => c.id === activeId) ?? conversations[0];

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[340px_1fr]">
        {/* Conversation list */}
        <div className="flex flex-col border-r border-line bg-panel/40">
          <div className="border-b border-line p-4">
            <h1 className="font-display text-xl text-cocoa">Inbox</h1>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-faint" />
              <input placeholder="Search messages…" className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-cocoa outline-none placeholder:text-cocoa-faint focus:border-espresso-300" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading && <p className="p-4 text-sm text-cocoa-faint">Loading conversations…</p>}
            {conversations.map((c) => {
              const Icon = CHANNEL_ICON[c.channel];
              return (
                <button key={c.id} onClick={() => setActiveId(c.id)} className={cn("flex w-full gap-3 border-b border-line p-3.5 text-left transition-colors hover:bg-surface", active?.id === c.id && "bg-surface")}>
                  <div className="relative">
                    <Image src={c.avatar} alt={c.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                    <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-surface"><Icon className="h-3 w-3 text-cocoa-faint" /></span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-cocoa">{c.name}</p>
                      <span className="shrink-0 text-[11px] text-cocoa-faint">{c.time}</span>
                    </div>
                    <p className="truncate text-xs text-cocoa-muted">{c.preview}</p>
                  </div>
                  {c.unread > 0 && <span className="mt-1 grid h-4 min-w-4 place-items-center rounded-full bg-espresso-600 px-1 text-[10px] font-semibold text-cream">{c.unread}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Thread */}
        {active && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-line bg-canvas/80 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <Image src={active.avatar} alt={active.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-cocoa">{active.name}</p>
                  <p className="text-xs text-cocoa-faint">{active.event}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="grid h-9 w-9 place-items-center rounded-lg text-cocoa-faint hover:bg-espresso-50"><Star className="h-4 w-4" /></button>
                <button className="grid h-9 w-9 place-items-center rounded-lg text-cocoa-faint hover:bg-espresso-50"><Phone className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {active.messages.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "us" ? "justify-end" : "justify-start")}>
                  <div className="max-w-[70%]">
                    <div className={cn("rounded-2xl px-4 py-2.5 text-sm leading-relaxed", m.from === "us" ? "bg-espresso-600 text-cream" : "border border-line bg-surface text-cocoa")}>{m.body}</div>
                    <p className={cn("mt-1 text-[11px] text-cocoa-faint", m.from === "us" && "text-right")}>{m.from === "them" ? `${m.name} · ` : ""}{m.time}</p>
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
        )}
      </div>
    </div>
  );
}
