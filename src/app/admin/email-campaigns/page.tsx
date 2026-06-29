import { Plus, Mail } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CAMPAIGNS = [
  { name: "Autumn Open Evening", sent: 1240, opens: 58, clicks: 14, status: "Sent", date: "Jun 12" },
  { name: "Summer Wedding Showcase", sent: 980, opens: 62, clicks: 21, status: "Sent", date: "May 28" },
  { name: "Corporate Q3 Packages", sent: 0, opens: 0, clicks: 0, status: "Draft", date: "—" },
  { name: "Festive Season 2026", sent: 0, opens: 0, clicks: 0, status: "Scheduled", date: "Jul 15" },
];

const STATUS: Record<string, "success" | "default" | "amber"> = {
  Sent: "success",
  Draft: "default",
  Scheduled: "amber",
};

export default function EmailCampaignsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Engage"
        title="Email Campaigns"
        description="Broadcast newsletters and announcements to your audience."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> New campaign</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Subscribers", value: "5,420" },
          { label: "Avg. open rate", value: "59.4%" },
          { label: "Avg. click rate", value: "16.8%" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="font-display text-2xl font-semibold text-cocoa tnum">{s.value}</p>
            <p className="text-xs text-cocoa-faint">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-line bg-panel/50 text-left">
              {["Campaign", "Status", "Sent", "Open rate", "Click rate", "Date"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {CAMPAIGNS.map((c) => (
              <tr key={c.name} className="hover:bg-panel/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-espresso-50 text-espresso-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-cocoa">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant={STATUS[c.status]} dot>{c.status}</Badge></td>
                <td className="px-4 py-3 text-cocoa-muted tnum">{c.sent ? c.sent.toLocaleString() : "—"}</td>
                <td className="px-4 py-3 text-cocoa-muted tnum">{c.sent ? `${c.opens}%` : "—"}</td>
                <td className="px-4 py-3 text-cocoa-muted tnum">{c.sent ? `${c.clicks}%` : "—"}</td>
                <td className="px-4 py-3 text-cocoa-muted">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
