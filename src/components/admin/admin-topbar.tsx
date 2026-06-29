"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, Search, Bell, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { NotificationsDrawer } from "@/components/admin/notifications-drawer";
import { notificationsResource } from "@/hooks/resources";
import { CURRENT_USER } from "@/lib/mock/crm";

export function AdminTopbar({
  onOpenSidebar,
  onOpenCommand,
  title,
}: {
  onOpenSidebar: () => void;
  onOpenCommand: () => void;
  title?: string;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { items: notifications } = notificationsResource.useList();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={onOpenSidebar}
        className="grid h-9 w-9 place-items-center rounded-lg text-cocoa-muted hover:bg-espresso-50 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {title && (
        <h1 className="hidden font-display text-lg text-cocoa md:block">
          {title}
        </h1>
      )}

      {/* Command / search trigger */}
      <button
        onClick={onOpenCommand}
        className="group ml-auto flex h-9 w-full max-w-xs items-center gap-2.5 rounded-lg border border-line bg-surface px-3 text-sm text-cocoa-faint transition-colors hover:border-line-strong md:ml-6 md:mr-auto"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search enquiries…</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-line bg-panel px-1.5 py-0.5 text-[10px] font-medium text-cocoa-faint sm:flex">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1.5">
        <Link
          href="/admin/leads/new"
          className="hidden h-9 items-center gap-1.5 rounded-lg bg-espresso-600 px-3 text-sm font-medium text-cream transition-colors hover:bg-espresso-700 sm:flex"
        >
          <Plus className="h-4 w-4" /> New
        </Link>

        <button
          onClick={() => setNotifOpen(true)}
          className="relative grid h-9 w-9 place-items-center rounded-lg text-cocoa-muted transition-colors hover:bg-espresso-50"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-semibold text-cream ring-2 ring-canvas">
              {unread}
            </span>
          )}
        </button>

        <button className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-espresso-50">
          <Image
            src={CURRENT_USER.avatar}
            alt={CURRENT_USER.name}
            width={30}
            height={30}
            className="h-[30px] w-[30px] rounded-full object-cover"
          />
          <ChevronDown className="hidden h-4 w-4 text-cocoa-faint sm:block" />
        </button>
      </div>

      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
}
