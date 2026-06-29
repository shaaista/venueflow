"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useTenant } from "@/components/providers/tenant-provider";
import { OnboardingWizard } from "@/components/admin/onboarding-wizard";
import { cn } from "@/lib/utils";

export function TenantSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const { tenant, tenants, orgId, switchTenant } = useTenant();
  const [open, setOpen] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const Swatch = ({ t, size = 8 }: { t: typeof tenant; size?: number }) => (
    <span
      className="grid shrink-0 place-items-center rounded-lg font-semibold text-cream"
      style={{ background: t.brandColor, width: size * 4, height: size * 4, fontSize: size * 1.4 }}
    >
      {t.initials}
    </span>
  );

  if (collapsed) {
    return (
      <button onClick={() => switchTenant(tenants[(tenants.findIndex((t) => t.id === orgId) + 1) % tenants.length].id)} title={`${tenant.name} — click to switch`}>
        <Swatch t={tenant} size={8} />
      </button>
    );
  }

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-surface px-2.5 py-2 text-left transition-colors hover:bg-panel"
      >
        <Swatch t={tenant} size={9} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-cocoa">{tenant.name}</span>
          <span className="block truncate text-[11px] text-cocoa-faint">{tenant.industry} · {tenant.role}</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-cocoa-faint" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-line bg-surface shadow-float">
          <p className="px-3 pb-1.5 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cocoa-ghost">
            Your venues
          </p>
          {tenants.map((t) => (
            <button
              key={t.id}
              onClick={() => { switchTenant(t.id); setOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-panel"
            >
              <Swatch t={t} size={8} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-cocoa">{t.name}</span>
                <span className="block text-[11px] text-cocoa-faint">{t.role}</span>
              </span>
              {t.id === orgId && <Check className="h-4 w-4 text-espresso-600" />}
            </button>
          ))}
          <button onClick={() => { setOnboardOpen(true); setOpen(false); }} className="flex w-full items-center gap-2 border-t border-line px-3 py-2.5 text-sm font-medium text-espresso-600 transition-colors hover:bg-panel">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-dashed border-line-strong"><Plus className="h-4 w-4" /></span>
            Create a venue
          </button>
        </div>
      )}

      <OnboardingWizard open={onboardOpen} onClose={() => setOnboardOpen(false)} />
    </div>
  );
}
