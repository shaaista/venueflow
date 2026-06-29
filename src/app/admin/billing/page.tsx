import { Check, CreditCard, Download } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const USAGE = [
  { label: "Team members", used: 6, total: 10 },
  { label: "Events / month", used: 21, total: 50 },
  { label: "Storage", used: 4.2, total: 25, unit: "GB" },
];

const BILLING_HISTORY = [
  { id: "VF-2026-06", date: "Jun 1, 2026", amount: "$149.00", status: "Paid" },
  { id: "VF-2026-05", date: "May 1, 2026", amount: "$149.00", status: "Paid" },
  { id: "VF-2026-04", date: "Apr 1, 2026", amount: "$149.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader eyebrow="Manage" title="Billing & Plan" description="Manage your VenueFlow subscription and usage." />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-espresso-50 p-5">
              <div>
                <Badge variant="espresso">Professional</Badge>
                <p className="mt-2 font-display text-2xl font-semibold text-cocoa">
                  $149<span className="text-base font-normal text-cocoa-faint">/month</span>
                </p>
                <p className="text-sm text-cocoa-muted">Billed monthly · renews Jul 1, 2026</p>
              </div>
              <Button size="sm">Upgrade plan</Button>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-3">
              {USAGE.map((u) => {
                const pct = Math.round((u.used / u.total) * 100);
                return (
                  <div key={u.label}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm text-cocoa-muted">{u.label}</p>
                    </div>
                    <p className="mt-1 font-display text-lg font-semibold text-cocoa tnum">
                      {u.used}{u.unit ?? ""} <span className="text-sm font-normal text-cocoa-faint">/ {u.total}{u.unit ?? ""}</span>
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas-deep">
                      <div className="h-full rounded-full bg-sage-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line p-5">
              <h2 className="font-display text-lg text-cocoa">Billing history</h2>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {BILLING_HISTORY.map((b) => (
                  <tr key={b.id} className="hover:bg-panel/60">
                    <td className="px-5 py-3 font-medium text-cocoa">{b.id}</td>
                    <td className="px-5 py-3 text-cocoa-muted">{b.date}</td>
                    <td className="px-5 py-3 text-cocoa tnum">{b.amount}</td>
                    <td className="px-5 py-3"><Badge variant="success" dot>{b.status}</Badge></td>
                    <td className="px-5 py-3 text-right">
                      <button className="inline-grid h-8 w-8 place-items-center rounded-lg text-cocoa-faint hover:bg-espresso-50 hover:text-cocoa">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Payment method</h2>
            <div className="flex items-center gap-3 rounded-xl border border-line p-3">
              <div className="grid h-9 w-12 place-items-center rounded-lg bg-espresso-600 text-cream">
                <CreditCard className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-cocoa">Visa •• 4242</p>
                <p className="text-xs text-cocoa-faint">Expires 08 / 28</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full">Update card</Button>
          </div>

          <div className="card p-5">
            <h2 className="mb-3 font-display text-lg text-cocoa">Professional includes</h2>
            <ul className="space-y-2">
              {["Unlimited leads & customers", "Up to 10 team members", "Custom branding & domain", "All integrations", "Priority support"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-cocoa-muted">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-500" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
