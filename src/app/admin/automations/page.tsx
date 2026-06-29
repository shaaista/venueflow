import { Plus, Zap, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/admin/settings/settings-ui";

const AUTOMATIONS = [
  { name: "Welcome new enquiry", trigger: "New lead created", action: "Send welcome email + assign owner", runs: 184, on: true },
  { name: "Quote follow-up", trigger: "Quote sent · no reply in 3 days", action: "Send reminder email", runs: 92, on: true },
  { name: "Deposit reminder", trigger: "Invoice due in 7 days", action: "Send SMS + email reminder", runs: 64, on: true },
  { name: "Post-event thank you", trigger: "Event completed", action: "Send thank-you + review request", runs: 38, on: true },
  { name: "Cold lead nudge", trigger: "No activity in 14 days", action: "Send re-engagement email", runs: 21, on: false },
];

export default function AutomationsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Engage"
        title="Automations"
        description="Put your follow-ups and reminders on autopilot."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> New automation</Button>}
      />
      <div className="space-y-3">
        {AUTOMATIONS.map((a) => (
          <div key={a.name} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Zap className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-cocoa">{a.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-cocoa-muted">
                <span className="rounded-md bg-panel px-2 py-0.5">{a.trigger}</span>
                <ArrowRight className="h-3 w-3 text-cocoa-faint" />
                <span className="rounded-md bg-panel px-2 py-0.5">{a.action}</span>
              </div>
            </div>
            <span className="text-xs text-cocoa-faint tnum">{a.runs} runs</span>
            <Toggle label="" defaultOn={a.on} />
          </div>
        ))}
      </div>
    </div>
  );
}
