"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { CommandPalette } from "@/components/admin/command-palette";
import { GuidedDemo } from "@/components/admin/guided-demo";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-lux",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]"
        )}
      >
        <AdminTopbar
          onOpenSidebar={() => setMobileOpen(true)}
          onOpenCommand={() => setCmdOpen(true)}
        />
        <main className="flex-1">{children}</main>
      </div>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      <GuidedDemo />
    </div>
  );
}
