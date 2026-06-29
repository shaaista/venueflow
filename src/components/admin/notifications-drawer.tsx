"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, CreditCard, FileSignature, MessageSquare, CalendarPlus, UserPlus, ListChecks, Bell } from "lucide-react";
import { notificationsResource } from "@/hooks/resources";
import type { DemoNotification } from "@/lib/demo/types";

const META: Record<DemoNotification["type"], { icon: typeof Bell; tint: string }> = {
  ENQUIRY: { icon: UserPlus, tint: "bg-amber-50 text-amber-600 border-amber-200" },
  PAYMENT: { icon: CreditCard, tint: "bg-sage-50 text-sage-600 border-sage-200" },
  QUOTE: { icon: FileSignature, tint: "bg-sage-50 text-sage-600 border-sage-200" },
  EVENT: { icon: CalendarPlus, tint: "bg-espresso-50 text-espresso-600 border-espresso-200" },
  MESSAGE: { icon: MessageSquare, tint: "bg-amber-50 text-amber-600 border-amber-200" },
  TASK: { icon: ListChecks, tint: "bg-espresso-50 text-espresso-600 border-espresso-200" },
  SYSTEM: { icon: Bell, tint: "bg-panel text-cocoa-faint border-line" },
};

export function NotificationsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items } = notificationsResource.useList();
  const update = notificationsResource.useUpdate();
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => items.filter((n) => !n.read).forEach((n) => update.mutate({ id: n.id, patch: { read: true } }));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[60] bg-espresso-900/30 backdrop-blur-sm" />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l border-line bg-canvas shadow-float"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg text-cocoa">Notifications</h2>
                {unread > 0 && <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">{unread} new</span>}
              </div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-cocoa-faint hover:bg-espresso-50 hover:text-cocoa"><X className="h-4 w-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {items.map((n) => {
                const meta = META[n.type];
                return (
                  <button key={n.id} onClick={() => update.mutate({ id: n.id, patch: { read: true } })} className="flex w-full gap-3 rounded-xl p-3 text-left transition-colors hover:bg-panel">
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${meta.tint}`}><meta.icon className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-cocoa">{n.title}</p>
                        {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />}
                      </div>
                      <p className="mt-0.5 text-sm leading-snug text-cocoa-muted">{n.body}</p>
                      <p className="mt-1 text-xs text-cocoa-faint">{n.time}</p>
                    </div>
                  </button>
                );
              })}
              {items.length === 0 && <p className="py-12 text-center text-sm text-cocoa-faint">You're all caught up.</p>}
            </div>

            <div className="border-t border-line p-3">
              <button onClick={markAllRead} className="w-full rounded-lg py-2 text-sm font-medium text-espresso-600 transition-colors hover:bg-espresso-50">Mark all as read</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
