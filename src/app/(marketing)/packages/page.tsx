import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { PACKAGES, FAQS } from "@/lib/mock/venue";
import { formatCurrency } from "@/lib/utils";

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Packages & Pricing"
        title="Curated packages, transparent pricing"
        description="Start with a package, then tailor every detail with your dedicated planner."
      />
      <section className="py-16 md:py-20">
        <div className="container-lux grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.tier} delay={i * 0.06}>
              <div className={`relative flex h-full flex-col rounded-2xl border bg-surface p-6 ${p.highlight ? "border-espresso-300 shadow-card ring-1 ring-espresso-200" : "border-line shadow-soft"}`}>
                {p.highlight && <Badge variant="espresso" className="absolute -top-3 right-6">Most chosen</Badge>}
                <h3 className="font-display text-2xl text-cocoa">{p.name}</h3>
                <p className="mt-2 text-sm text-cocoa-muted">{p.description}</p>
                <div className="mt-5">
                  {p.priceFrom ? (
                    <p className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-semibold text-cocoa tnum">{formatCurrency(p.priceFrom)}</span>
                      <span className="text-sm text-cocoa-faint">/ guest</span>
                    </p>
                  ) : (
                    <p className="font-display text-3xl font-semibold text-cocoa">Bespoke</p>
                  )}
                </div>
                <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-cocoa-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/request-quote" className="mt-6">
                  <Button variant={p.highlight ? "primary" : "outline"} className="w-full">
                    {p.priceFrom ? "Select" : "Enquire"}
                  </Button>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-20">
        <div className="container-lux max-w-3xl">
          <h2 className="text-center font-display text-3xl text-cocoa">Pricing questions</h2>
          <FaqAccordion items={FAQS.slice(0, 4)} className="mt-8" />
          <div className="mt-10 text-center">
            <Link href="/contact"><Button variant="outline">Talk to our team <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
