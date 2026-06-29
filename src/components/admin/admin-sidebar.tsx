"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Plus, ChevronsLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandMark } from "@/components/brand-mark";
import { TenantSwitcher } from "@/components/admin/tenant-switcher";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { CURRENT_USER } from "@/lib/mock/crm";
import { cn } from "@/lib/utils";

export function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-espresso-900/30 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-panel transition-all duration-300 ease-lux",
          collapsed ? "w-[76px]" : "w-[264px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-line",
            collapsed ? "justify-center px-2" : "px-5"
          )}
        >
          {collapsed ? (
            <BrandMark withName={false} />
          ) : (
            <Link href="/admin/dashboard">
              <BrandMark />
            </Link>
          )}
        </div>

        {/* Tenant switcher */}
        <div className={cn("pt-3", collapsed ? "flex justify-center px-2" : "px-3")}>
          <TenantSwitcher collapsed={collapsed} />
        </div>

        {/* New enquiry CTA */}
        <div className={cn("px-3 pt-3", collapsed && "px-2")}>
          <Link
            href="/admin/leads/new"
            style={{ background: "var(--brand-color, #4A3728)" }}
            className={cn(
              "flex items-center gap-2 rounded-xl text-sm font-medium text-cream shadow-soft transition-opacity hover:opacity-90",
              collapsed ? "h-11 w-11 justify-center" : "h-11 px-4"
            )}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!collapsed && "New Enquiry"}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {ADMIN_NAV.map((group) => (
            <div key={group.title} className="mb-5">
              {!collapsed && (
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-cocoa-ghost">
                  {group.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                          collapsed && "justify-center",
                          active
                            ? "bg-surface text-espresso-700 shadow-soft"
                            : "text-cocoa-muted hover:bg-espresso-50 hover:text-cocoa"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-espresso-600" />
                        )}
                        <item.icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0",
                            active ? "text-espresso-600" : "text-cocoa-faint"
                          )}
                        />
                        {!collapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                        {!collapsed && item.badge && (
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User + collapse */}
        <div className="border-t border-line p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl p-2",
              collapsed && "justify-center"
            )}
          >
            <Image
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-cocoa">
                  {CURRENT_USER.name}
                </p>
                <p className="truncate text-xs text-cocoa-faint">
                  {CURRENT_USER.role}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={onToggle}
                className="hidden rounded-md p-1 text-cocoa-faint transition-colors hover:bg-espresso-50 hover:text-cocoa lg:block"
                title="Collapse sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={onToggle}
              className="mt-2 hidden w-full justify-center rounded-md py-1.5 text-cocoa-faint transition-colors hover:bg-espresso-50 hover:text-cocoa lg:flex"
              title="Expand sidebar"
            >
              <ChevronsLeft className="h-4 w-4 rotate-180" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
