"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

const PORTAL_NAV = [
  { label: "Dashboard", href: "/portal/dashboard" },
  { label: "My Events", href: "/portal/events" },
  { label: "Quotes", href: "/portal/quotes" },
  { label: "Invoices", href: "/portal/invoices" },
  { label: "Payments", href: "/portal/payments" },
  { label: "Messages", href: "/portal/messages" },
  { label: "Files", href: "/portal/files" },
];

export function PortalNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="container-lux flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/portal/dashboard"><BrandMark /></Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {PORTAL_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-espresso-50 font-medium text-espresso-700"
                    : "text-cocoa-muted hover:text-cocoa"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative grid h-9 w-9 place-items-center rounded-full text-cocoa-muted hover:bg-espresso-50">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-canvas" />
          </button>
          <Link href="/portal/profile" className="flex items-center gap-2">
            <Image src="https://i.pravatar.cc/80?img=5" alt="Eleanor Vance" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
            <span className="hidden text-sm font-medium text-cocoa sm:block">Eleanor</span>
          </Link>
          <button onClick={() => setOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-full text-cocoa lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-canvas px-4 py-2 lg:hidden">
          {PORTAL_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm",
                isActive(item.href) ? "bg-espresso-50 font-medium text-espresso-700" : "text-cocoa-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
