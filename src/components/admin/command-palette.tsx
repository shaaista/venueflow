"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  UserPlus,
  Users,
  CalendarHeart,
  FileText,
  CreditCard,
  CalendarDays,
  Plus,
  Settings,
  CornerDownLeft,
} from "lucide-react";

const NAV_COMMANDS = [
  { label: "Go to Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Go to Leads", href: "/admin/leads", icon: UserPlus },
  { label: "Go to Customers", href: "/admin/customers", icon: Users },
  { label: "Go to Events", href: "/admin/events", icon: CalendarHeart },
  { label: "Go to Calendar", href: "/admin/calendar", icon: CalendarDays },
  { label: "Go to Quotes", href: "/admin/quotes", icon: FileText },
  { label: "Go to Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Go to Settings", href: "/admin/settings/general", icon: Settings },
];

const ACTION_COMMANDS = [
  { label: "Create new enquiry", href: "/admin/leads/new", icon: Plus },
  { label: "Create new quote", href: "/admin/quotes/new", icon: FileText },
  { label: "Add a customer", href: "/admin/customers/new", icon: Users },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();

  const run = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-espresso-900/30 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-float"
          >
            <Command className="w-full" loop>
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search className="h-4 w-4 text-cocoa-faint" />
                <Command.Input
                  autoFocus
                  placeholder="Search or jump to…"
                  className="w-full bg-transparent py-4 text-sm text-cocoa outline-none placeholder:text-cocoa-faint"
                />
                <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 text-[10px] text-cocoa-faint">
                  ESC
                </kbd>
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-cocoa-faint">
                  No results found.
                </Command.Empty>

                <Command.Group
                  heading="Navigation"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-cocoa-ghost"
                >
                  {NAV_COMMANDS.map((c) => (
                    <Command.Item
                      key={c.href}
                      value={c.label}
                      onSelect={() => run(c.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-cocoa-muted aria-selected:bg-espresso-50 aria-selected:text-cocoa"
                    >
                      <c.icon className="h-4 w-4 text-cocoa-faint" />
                      {c.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Quick actions"
                  className="mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-cocoa-ghost"
                >
                  {ACTION_COMMANDS.map((c) => (
                    <Command.Item
                      key={c.href}
                      value={c.label}
                      onSelect={() => run(c.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-cocoa-muted aria-selected:bg-espresso-50 aria-selected:text-cocoa"
                    >
                      <c.icon className="h-4 w-4 text-cocoa-faint" />
                      {c.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
              <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11px] text-cocoa-faint">
                <span className="flex items-center gap-1">
                  <CornerDownLeft className="h-3 w-3" /> to select
                </span>
                <span>VenueFlow Command</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
