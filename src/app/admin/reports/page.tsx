import { FileBarChart, TrendingUp, Users, CalendarHeart, DollarSign, Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";

const TEMPLATES = [
  { name: "Revenue Report", desc: "Income by month, space, and event type.", icon: DollarSign, tint: "sage" },
  { name: "Leads Report", desc: "Pipeline, sources, and conversion.", icon: TrendingUp, tint: "amber" },
  { name: "Customer Report", desc: "Lifetime value and retention.", icon: Users, tint: "espresso" },
  { name: "Events Report", desc: "Occupancy, capacity, and utilisation.", icon: CalendarHeart, tint: "sage" },
];

const RECENT = [
  { name: "June Revenue Summary", date: "Jun 28, 2026", by: "Alex Rivera" },
  { name: "Q2 Lead Performance", date: "Jun 20, 2026", by: "Mara Quinn" },
  { name: "Wedding Bookings 2026", date: "Jun 14, 2026", by: "Alex Rivera" },
];

const TINT: Record<string, string> = {
  sage: "bg-sage-50 text-sage-600",
  amber: "bg-amber-50 text-amber-600",
  espresso: "bg-espresso-50 text-espresso-600",
};

export default function ReportsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Insights"
        title="Reports"
        description="Generate and export detailed business reports."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> Custom report</Button>}
      />

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Templates</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <div key={t.name} className="card card-hover flex flex-col p-5">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${TINT[t.tint]}`}>
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg text-cocoa">{t.name}</h3>
              <p className="mt-1 flex-1 text-sm text-cocoa-muted">{t.desc}</p>
              <Button variant="outline" size="sm" className="mt-4">Generate</Button>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line p-4">
          <h2 className="font-display text-lg text-cocoa">Recent reports</h2>
        </div>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-line">
            {RECENT.map((r) => (
              <tr key={r.name} className="hover:bg-panel/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileBarChart className="h-4 w-4 text-cocoa-faint" />
                    <span className="font-medium text-cocoa">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-cocoa-muted">{r.date}</td>
                <td className="px-4 py-3 text-cocoa-muted">{r.by}</td>
                <td className="px-4 py-3 text-right">
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
  );
}
