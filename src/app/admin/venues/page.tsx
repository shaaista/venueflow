import Image from "next/image";
import { Plus, Users, Maximize, Check } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SPACES } from "@/lib/mock/venue";
import { formatCurrency } from "@/lib/utils";

export default function VenuesPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Operations"
        title="Venues & Spaces"
        description="The rooms and areas guests can book across your property."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> Add space</Button>}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {SPACES.map((s) => (
          <div key={s.slug} className="card card-hover overflow-hidden">
            <div className="relative aspect-[16/10]">
              <Image src={s.image} alt={s.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              <div className="absolute left-3 top-3">
                <Badge variant={s.availability === "High" ? "success" : s.availability === "Limited" ? "amber" : "danger"} dot>
                  {s.availability}
                </Badge>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg text-cocoa">{s.name}</h3>
                <p className="font-display text-base font-semibold text-espresso-600 tnum">
                  {formatCurrency(s.priceFrom, { compact: true })}
                </p>
              </div>
              <p className="mt-1 text-sm text-cocoa-muted">{s.tagline}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-cocoa-faint">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {s.capacity} guests</span>
                <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> {s.size}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3">
                {s.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 text-xs text-cocoa-muted">
                    <Check className="h-3 w-3 text-sage-500" /> {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
