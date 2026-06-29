import { RevenueChart } from "@/components/admin/revenue-chart";
import { BookingsBar, SourcesBar, TypesDonut } from "@/components/admin/analytics-charts";

const KPI = [
  { label: "Net revenue retention", value: "112%" },
  { label: "Avg. revenue per tenant", value: "$194" },
  { label: "Trial → paid", value: "34%" },
  { label: "Lifetime value", value: "$6.4k" },
];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 font-display text-lg text-cocoa">{title}</h2>
      {children}
    </div>
  );
}

export default function PlatformAnalyticsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <div>
        <p className="label-eyebrow mb-2 text-amber-500">Platform</p>
        <h1 className="font-display text-2xl font-medium tracking-tight text-cocoa">Analytics</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Growth, retention, and usage across the platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI.map((k) => (
          <div key={k.label} className="card p-5">
            <p className="text-sm text-cocoa-muted">{k.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-cocoa tnum">{k.value}</p>
          </div>
        ))}
      </div>

      <ChartCard title="Platform MRR growth"><RevenueChart /></ChartCard>
      <div className="grid gap-5 lg:grid-cols-3">
        <ChartCard title="New tenants / month"><BookingsBar /></ChartCard>
        <ChartCard title="Signups by channel"><SourcesBar /></ChartCard>
        <ChartCard title="Plan mix"><TypesDonut /></ChartCard>
      </div>
    </div>
  );
}
