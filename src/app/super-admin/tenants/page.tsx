import { Plus, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TENANTS, PLAN_VARIANT, TENANT_STATUS_VARIANT } from "@/lib/mock/platform";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function TenantsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow mb-2 text-amber-500">Platform</p>
          <h1 className="font-display text-2xl font-medium tracking-tight text-cocoa">Tenants</h1>
          <p className="mt-1 text-sm text-cocoa-muted">Every business running on VenueFlow.</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" /> Add tenant</Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-faint" />
        <input placeholder="Search tenants…" className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-cocoa outline-none placeholder:text-cocoa-faint focus:border-espresso-300" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-line bg-panel/50 text-left">
                {["Tenant", "Plan", "MRR", "Users", "Events", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {TENANTS.map((t) => (
                <tr key={t.id} className="group hover:bg-panel/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-lg text-xs font-semibold text-cream" style={{ background: t.logoColor }}>
                        {t.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-medium text-cocoa">{t.name}</p>
                        <p className="text-xs text-cocoa-faint">{t.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={PLAN_VARIANT[t.plan]}>{t.plan}</Badge></td>
                  <td className="px-4 py-3 font-medium text-cocoa tnum">{formatCurrency(t.mrr)}</td>
                  <td className="px-4 py-3 text-cocoa-muted tnum">{t.users}</td>
                  <td className="px-4 py-3 text-cocoa-muted tnum">{t.events}</td>
                  <td className="px-4 py-3"><Badge variant={TENANT_STATUS_VARIANT[t.status]} dot>{t.status}</Badge></td>
                  <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(t.since)}</td>
                  <td className="px-4 py-3">
                    <span className="grid h-7 w-7 place-items-center rounded-md text-cocoa-faint opacity-0 transition-all group-hover:opacity-100"><ChevronRight className="h-4 w-4" /></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
