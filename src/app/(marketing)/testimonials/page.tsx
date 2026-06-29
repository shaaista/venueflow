import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { TESTIMONIALS } from "@/lib/mock/venue";

const ALL = [...TESTIMONIALS, ...TESTIMONIALS.map((t) => ({ ...t, name: t.name + " " }))];

export default function TestimonialsPage() {
  return (
    <>
      <PageHero eyebrow="In Their Words" title="Trusted with life's biggest moments" description="We're honoured to be part of so many unforgettable occasions." />
      <section className="py-16 md:py-24">
        <div className="container-lux columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6">
          {ALL.map((t, i) => (
            <Reveal key={i} delay={(i % 3) * 0.05}>
              <figure className="card break-inside-avoid p-7">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <Quote className="mt-4 h-6 w-6 text-amber-300" />
                <blockquote className="mt-3 text-cocoa leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <Image src={t.avatar} alt={t.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-cocoa">{t.name}</p>
                    <p className="text-xs text-cocoa-ghost">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
