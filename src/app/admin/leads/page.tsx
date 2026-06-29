"use client";

import { useState } from "react";
import { Plus, TrendingUp, Clock, Target, Flame } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { LeadsExplorer } from "@/components/admin/leads/leads-explorer";
import { NewLeadDrawer } from "@/components/admin/leads/new-lead-drawer";
import { leadsResource } from "@/hooks/resources";
import { useCan } from "@/components/providers/tenant-provider";
import { formatCurrency } from "@/lib/utils";

export default function LeadsPage() {
  const { items: leads } = leadsResource.useList();
  const canCreate = useCan("create");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pipelineValue = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost").reduce((s, l) => s + l.value, 0);
  const hot = leads.filter((l) => l.temperature === "Hot").length;
  const won = leads.filter((l) => l.stage === "Won").length;
  const newThisWeek = leads.filter((l) => l.stage === "New").length;

  const stats = [
    { label: "Open pipeline", value: formatCurrency(pipelineValue, { compact: true }), icon: TrendingUp, tint: "sage" },
    { label: "New enquiries", value: String(newThisWeek), icon: Clock, tint: "amber" },
    { label: "Hot leads", value: String(hot), icon: Flame, tint: "espresso" },
    { label: "Win rate", value: `${leads.length ? Math.round((won / leads.length) * 100) : 0}%`, icon: Target, tint: "sage" },
  ];
  const TINT: Record<string, string> = { sage: "bg-sage-50 text-sage-600", amber: "bg-amber-50 text-amber-600", espresso: "bg-espresso-50 text-espresso-600" };

  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Sales"
        title="Leads & Enquiries"
        description="Track every enquiry from first contact to confirmed booking."
        actions={canCreate && <Button size="sm" onClick={() => setDrawerOpen(true)}><Plus className="h-4 w-4" /> New Enquiry</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-3 p-4">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${TINT[s.tint]}`}><s.icon className="h-5 w-5" /></div>
            <div>
              <p className="font-display text-xl font-semibold text-cocoa tnum">{s.value}</p>
              <p className="text-xs text-cocoa-faint">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <LeadsExplorer />
      <NewLeadDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
