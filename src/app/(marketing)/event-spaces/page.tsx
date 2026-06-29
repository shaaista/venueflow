import Image from "next/image";
import Link from "next/link";
import { Users, Maximize, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { SPACES } from "@/lib/mock/venue";
import { formatCurrency } from "@/lib/utils";

export default function EventSpacesPage() {
  return (
    <>
      <PageHero
        eyebrow="The Spaces"
        title="Five rooms, one unforgettable address"
        description="Each space has its own character — choose one, or take the entire collection."
      />
      <section className="py-16 md:py-24">
        <div className="container-lux space-y-10">
          {SPACES.map((s, i) => (
            <Reveal key={s.slug}>
              <div className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line">
                  <Image src={s.image} alt={s.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
                  <div className="absolute left-4 top-4">
                    <Badge variant={s.availability === "High" ? "success" : s.availability === "Limited" ? "amber" : "danger"} dot>
                      {s.availability} availability
                    </Badge>
                  </div>
                </div>
                <div>
                  <h2 className="font-display text-3xl text-cocoa">{s.name}</h2>
                  <p className="mt-3 text-lg leading-relaxed text-cocoa-muted">{s.tagline}</p>
                  <div className="mt-5 flex flex-wrap gap-5 text-sm text-cocoa-muted">
                    <span className="flex items-center gap-2"><Users className="h-4 w-4 text-amber-500" /> Up to {s.capacity} guests</span>
                    <span className="flex items-center gap-2"><Maximize className="h-4 w-4 text-amber-500" /> {s.size}</span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {s.amenities.map((a) => (
                      <span key={a} className="flex items-center gap-2 text-sm text-cocoa-muted">
                        <Check className="h-4 w-4 text-sage-500" /> {a}
                      </span>
                    ))}
                  </div>
                  <div className="mt-7 flex items-center gap-5">
                    <div>
                      <span className="text-xs text-cocoa-faint">From</span>
                      <p className="font-display text-2xl font-semibold text-espresso-600 tnum">{formatCurrency(s.priceFrom)}</p>
                    </div>
                    <Link href="/book-event"><Button>Enquire <ArrowRight className="h-4 w-4" /></Button></Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
