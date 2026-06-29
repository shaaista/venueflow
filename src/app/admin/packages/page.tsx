import { Plus, Check, Pencil } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PACKAGES } from "@/lib/mock/venue";
import { formatCurrency } from "@/lib/utils";

export default function AdminPackagesPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Operations"
        title="Packages"
        description="Bundled offerings customers can select when booking."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> New package</Button>}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {PACKAGES.map((p) => (
          <div
            key={p.tier}
            className={`relative flex flex-col rounded-2xl border bg-surface p-5 ${p.highlight ? "border-espresso-300 ring-1 ring-espresso-200" : "border-line"}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-cocoa">{p.name}</h3>
              {p.highlight && <Badge variant="espresso">Popular</Badge>}
            </div>
            <p className="mt-1 text-sm text-cocoa-muted">{p.description}</p>
            <div className="mt-4">
              {p.priceFrom ? (
                <p className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-semibold text-cocoa tnum">{formatCurrency(p.priceFrom)}</span>
                  <span className="text-xs text-cocoa-faint">/ guest</span>
                </p>
              ) : (
                <p className="font-display text-2xl font-semibold text-cocoa">Bespoke</p>
              )}
            </div>
            <ul className="mt-4 flex-1 space-y-2 border-t border-line pt-4">
              {p.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-cocoa-muted">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-500" /> {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="mt-4"><Pencil className="h-4 w-4" /> Edit</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
