import { Building2, CreditCard, Flag, LogIn, Settings, UserCog } from "lucide-react";

const LOGS = [
  { actor: "ops@venueflow.app", action: "enabled feature flag", target: "new-calendar for 30% of tenants", time: "Today · 10:12 AM", icon: Flag },
  { actor: "system", action: "provisioned tenant", target: "The Glasshouse (Trial)", time: "Today · 8:02 AM", icon: Building2 },
  { actor: "billing", action: "processed renewal", target: "Maison Belle Events · $499", time: "Yesterday · 2:00 AM", icon: CreditCard },
  { actor: "ops@venueflow.app", action: "impersonated user", target: "alex@theatrium.co", time: "Jun 27 · 4:30 PM", icon: UserCog },
  { actor: "ops@venueflow.app", action: "updated system setting", target: "default trial length → 14 days", time: "Jun 26 · 11:15 AM", icon: Settings },
  { actor: "aisha@lanternhall.co", action: "signed in", target: "from Lagos, NG", time: "Jun 26 · 9:40 AM", icon: LogIn },
];

export default function PlatformAuditLogsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <div>
        <p className="label-eyebrow mb-2 text-amber-500">Platform</p>
        <h1 className="font-display text-2xl font-medium tracking-tight text-cocoa">Audit Logs</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Every privileged action across the platform.</p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line bg-panel/50 text-left">
              {["Actor", "Action", "Time"].map((h) => (
                <th key={h} className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {LOGS.map((l, i) => (
              <tr key={i} className="hover:bg-panel/60">
                <td className="px-5 py-3 font-mono text-xs text-cocoa">{l.actor}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-2 text-cocoa-muted">
                    <l.icon className="h-4 w-4 text-cocoa-faint" />
                    {l.action} <span className="text-cocoa">{l.target}</span>
                  </span>
                </td>
                <td className="px-5 py-3 text-cocoa-muted">{l.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
