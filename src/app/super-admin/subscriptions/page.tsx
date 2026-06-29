import { Badge } from "@/components/ui/badge";
import { TENANTS, PLAN_VARIANT } from "@/lib/mock/platform";
import { formatCurrency } from "@/lib/utils";

const PLANS = [
  { name: "Starter", price: 49, tenants: 84, color: "#8C6B52" },
  { name: "Professional", price: 149, tenants: 132, color: "#4A3728" },
  { name: "Enterprise", price: 499, tenants: 32, color: "#D97706" },
];

export default function SubscriptionsPage() {
  const paying = TENANTS.filter((t) => t.mrr > 0);
  return (
    <div className="container-lux space-y-6 py-7">
      <div>
        <p className="label-eyebrow mb-2 text-amber-500">Platform</p>
        <h1 className="font-display text-2xl font-medium tracking-tight text-cocoa">Subscriptions</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Plan distribution and recurring revenue.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.name} className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-cocoa">{p.name}</h3>
              <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
            </div>
            <p className="mt-3 font-display text-2xl font-semibold text-cocoa tnum">{p.tenants} <span className="text-sm font-normal text-cocoa-faint">tenants</span></p>
            <p className="text-sm text-cocoa-muted">{formatCurrency(p.price)}/mo · {formatCurrency(p.price * p.tenants, { compact: true })} MRR</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line p-5"><h2 className="font-display text-lg text-cocoa">Active subscriptions</h2></div>
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-line bg-panel/50 text-left">
              {["Tenant", "Plan", "MRR", "Billing", "Next invoice"].map((h) => (
                <th key={h} className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paying.map((t) => (
              <tr key={t.id} className="hover:bg-panel/60">
                <td className="px-5 py-3 font-medium text-cocoa">{t.name}</td>
                <td className="px-5 py-3"><Badge variant={PLAN_VARIANT[t.plan]}>{t.plan}</Badge></td>
                <td className="px-5 py-3 text-cocoa tnum">{formatCurrency(t.mrr)}</td>
                <td className="px-5 py-3 text-cocoa-muted">Monthly</td>
                <td className="px-5 py-3 text-cocoa-muted">Jul 1, 2026</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
