import { Download } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { BookingsBar, SourcesBar, TypesDonut } from "@/components/admin/analytics-charts";

const KPI = [
  { label: "Total revenue", value: "$1.84M", delta: "+18%" },
  { label: "Avg. event value", value: "$24.3k", delta: "+6%" },
  { label: "Conversion rate", value: "24.2%", delta: "-2%" },
  { label: "Repeat clients", value: "38%", delta: "+9%" },
];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 font-display text-lg text-cocoa">{title}</h2>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Performance across revenue, leads, events, and marketing."
        actions={<Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI.map((k) => (
          <div key={k.label} className="card p-5">
            <p className="text-sm text-cocoa-muted">{k.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="font-display text-2xl font-semibold text-cocoa tnum">{k.value}</p>
              <span className={`text-xs font-medium ${k.delta.startsWith("-") ? "text-danger" : "text-success"}`}>
                {k.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ChartCard title="Revenue vs. target">
        <RevenueChart />
      </ChartCard>

      <div className="grid gap-5 lg:grid-cols-3">
        <ChartCard title="Bookings per month">
          <BookingsBar />
        </ChartCard>
        <ChartCard title="Leads by source">
          <SourcesBar />
        </ChartCard>
        <ChartCard title="Event types">
          <TypesDonut />
        </ChartCard>
      </div>
    </div>
  );
}
