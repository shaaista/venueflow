import Image from "next/image";
import { Download, LogIn, FileText, CreditCard, Settings, UserPlus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";

const LOGS = [
  { who: "Alex Rivera", avatar: "https://i.pravatar.cc/80?img=15", action: "sent quote", target: "Q-1182 to Eleanor Vance", time: "Today · 9:05 AM", icon: FileText, ip: "73.42.11.8" },
  { who: "System", avatar: "", action: "recorded payment", target: "$32,000 on INV-1182", time: "Today · 8:40 AM", icon: CreditCard, ip: "—" },
  { who: "Mara Quinn", avatar: "https://i.pravatar.cc/80?img=47", action: "updated event", target: "E-5012 schedule", time: "Yesterday · 4:20 PM", icon: Settings, ip: "73.42.11.9" },
  { who: "Theo Sandoval", avatar: "https://i.pravatar.cc/80?img=51", action: "logged in", target: "from Portland, OR", time: "Yesterday · 9:02 AM", icon: LogIn, ip: "98.12.44.2" },
  { who: "Alex Rivera", avatar: "https://i.pravatar.cc/80?img=15", action: "invited member", target: "nora@theatrium.co", time: "Jun 26 · 2:14 PM", icon: UserPlus, ip: "73.42.11.8" },
  { who: "Jade Lin", avatar: "https://i.pravatar.cc/80?img=40", action: "deleted lead", target: "L-2029 (duplicate)", time: "Jun 25 · 11:30 AM", icon: Trash2, ip: "61.20.88.1" },
];

export default function AuditLogsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Manage"
        title="Audit Logs"
        description="A complete record of everything happening in your workspace."
        actions={<Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export</Button>}
      />
      <div className="card overflow-hidden">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line bg-panel/50 text-left">
              {["User", "Activity", "IP address", "Time"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {LOGS.map((l, i) => (
              <tr key={i} className="hover:bg-panel/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    {l.avatar ? (
                      <Image src={l.avatar} alt={l.who} width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
                    ) : (
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-panel text-cocoa-faint text-xs">SYS</div>
                    )}
                    <span className="font-medium text-cocoa">{l.who}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 text-cocoa-muted">
                    <l.icon className="h-4 w-4 text-cocoa-faint" />
                    {l.action} <span className="text-cocoa">{l.target}</span>
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-cocoa-faint">{l.ip}</td>
                <td className="px-4 py-3 text-cocoa-muted">{l.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
