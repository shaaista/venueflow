import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { PLATFORM_KPIS, TENANTS, PLAN_VARIANT, TENANT_STATUS_VARIANT } from "@/lib/mock/platform";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SuperAdminOverview() {
  return (
    <div className="container-lux space-y-6 py-7">
      <div>
        <p className="label-eyebrow mb-2 text-amber-500">Platform</p>
        <h1 className="font-display text-2xl font-medium tracking-tight text-cocoa">Platform Overview</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Health and growth across all VenueFlow tenants.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_KPIS.map((k) => (
          <div key={k.label} className="card p-5">
            <p className="text-sm text-cocoa-muted">{k.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="font-display text-2xl font-semibold text-cocoa tnum">{k.value}</p>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-sage-50 px-1.5 py-0.5 text-xs font-medium text-success">
                <ArrowUpRight className="h-3 w-3" /> {k.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="mb-4 font-display text-lg text-cocoa">Platform revenue (MRR)</h2>
        <RevenueChart />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="font-display text-lg text-cocoa">Recent tenants</h2>
          <Link href="/super-admin/tenants" className="flex items-center gap-1 text-xs font-medium text-espresso-600 hover:underline">
            All tenants <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line bg-panel/50 text-left">
              {["Tenant", "Plan", "MRR", "Users", "Status", "Joined"].map((h) => (
                <th key={h} className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {TENANTS.slice(0, 5).map((t) => (
              <tr key={t.id} className="hover:bg-panel/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold text-cream" style={{ background: t.logoColor }}>
                      {t.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-medium text-cocoa">{t.name}</p>
                      <p className="text-xs text-cocoa-faint">{t.domain}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3"><Badge variant={PLAN_VARIANT[t.plan]}>{t.plan}</Badge></td>
                <td className="px-5 py-3 font-medium text-cocoa tnum">{formatCurrency(t.mrr)}</td>
                <td className="px-5 py-3 text-cocoa-muted tnum">{t.users}</td>
                <td className="px-5 py-3"><Badge variant={TENANT_STATUS_VARIANT[t.status]} dot>{t.status}</Badge></td>
                <td className="px-5 py-3 text-cocoa-muted tnum">{formatDate(t.since)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
