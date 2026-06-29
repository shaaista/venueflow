"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Flag,
  BarChart3,
  Settings,
  ScrollText,
  Shield,
  Search,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/super-admin", icon: LayoutDashboard },
  { label: "Tenants", href: "/super-admin/tenants", icon: Building2 },
  { label: "Users", href: "/super-admin/users", icon: Users },
  { label: "Subscriptions", href: "/super-admin/subscriptions", icon: CreditCard },
  { label: "Feature Flags", href: "/super-admin/feature-flags", icon: Flag },
  { label: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
  { label: "System Settings", href: "/super-admin/system-settings", icon: Settings },
  { label: "Audit Logs", href: "/super-admin/audit-logs", icon: ScrollText },
];

export function SuperAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/super-admin" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-line bg-espresso-900 lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <BrandMark withName={false} />
          <div>
            <span className="font-display text-sm font-semibold text-cream">VenueFlow</span>
            <span className="ml-1.5 rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">PLATFORM</span>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-white/10 text-cream" : "text-cream/60 hover:bg-white/5 hover:text-cream"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-400/20 text-amber-300">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-cream">Super Admin</p>
              <p className="text-xs text-cream/50">ops@venueflow.app</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/80 px-6 backdrop-blur-xl">
          <div className="flex h-9 w-full max-w-xs items-center gap-2.5 rounded-lg border border-line bg-surface px-3 text-sm text-cocoa-faint">
            <Search className="h-4 w-4" />
            <span>Search tenants, users…</span>
          </div>
          <div className="ml-auto">
            <Image src="https://i.pravatar.cc/80?img=60" alt="Super admin" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
