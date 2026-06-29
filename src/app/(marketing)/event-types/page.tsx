import Image from "next/image";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { EVENT_TYPES } from "@/lib/mock/venue";

export default function EventTypesPage() {
  return (
    <>
      <PageHero
        eyebrow="Occasions"
        title="An address for every celebration"
        description="From intimate dinners to grand galas, we have the setting and the service to match."
      />
      <section className="py-16 md:py-24">
        <div className="container-lux grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_TYPES.map((e, i) => (
            <Reveal key={e.slug} delay={(i % 3) * 0.05}>
              <Link id={e.slug} href="/book-event" className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                <Image src={e.image} alt={e.name} fill className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-900 via-espresso-900/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex items-center gap-2 text-[11px] text-cream/80"><Users className="h-3 w-3" /> {e.guests}</div>
                  <h3 className="mt-1 font-display text-xl text-cream">{e.name}</h3>
                  <p className="mt-1 text-sm text-cream/70">{e.blurb}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-300 opacity-0 transition-opacity group-hover:opacity-100">
                    Plan this <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
