"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const SETTINGS_LINKS = [
  { label: "General", href: "/admin/settings/general" },
  { label: "Business", href: "/admin/settings/business" },
  { label: "Branding", href: "/admin/settings/branding" },
  { label: "Event Types", href: "/admin/settings/event-types" },
  { label: "Notifications", href: "/admin/settings/notifications" },
  { label: "Security", href: "/admin/settings/security" },
  { label: "API & Webhooks", href: "/admin/settings/api" },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {SETTINGS_LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "shrink-0 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-surface font-medium text-espresso-700 shadow-soft lg:border lg:border-line"
                : "text-cocoa-muted hover:bg-espresso-50 hover:text-cocoa"
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
