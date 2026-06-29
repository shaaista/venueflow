import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { STATS } from "@/lib/mock/venue";

const VALUES = [
  { title: "Hospitality first", body: "Every decision begins with the guest experience. We anticipate, we don't react." },
  { title: "Craft over scale", body: "We host fewer events, exceptionally — never more events, adequately." },
  { title: "Quiet luxury", body: "True elegance whispers. Our spaces and service let the moment speak." },
];

const TEAM = [
  { name: "Alex Rivera", role: "Founder & Owner", avatar: "https://i.pravatar.cc/200?img=15" },
  { name: "Mara Quinn", role: "Head of Events", avatar: "https://i.pravatar.cc/200?img=47" },
  { name: "Theo Sandoval", role: "Executive Chef", avatar: "https://i.pravatar.cc/200?img=51" },
  { name: "Jade Lin", role: "Guest Relations", avatar: "https://i.pravatar.cc/200?img=40" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Eighteen years of unforgettable occasions"
        description="The Atrium Collection began with a single glass-roofed hall and a belief that hospitality is an art form."
      />

      <section className="py-16 md:py-24">
        <div className="container-lux grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line">
              <Image src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80" alt="The Atrium" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Since 2008" title="Built for life's most important moments" />
            <div className="mt-5 space-y-4 text-cocoa-muted">
              <p>What started as a restored Victorian atrium has grown into a collection of five distinct spaces — but our philosophy has never changed. We exist to make the extraordinary feel effortless.</p>
              <p>From weddings beneath the glass to product launches that command a room, our team brings the precision of a five-star hotel and the warmth of a family business to every occasion.</p>
            </div>
            <Link href="/contact" className="mt-7 inline-block"><Button>Get in touch <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-panel py-16 md:py-20">
        <div className="container-lux grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-4xl font-semibold text-cocoa tnum md:text-5xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.14em] text-cocoa-faint">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="What we believe" title="Our values" align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="card h-full p-7">
                  <span className="font-display text-3xl text-amber-400">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-xl text-cocoa">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cocoa-muted">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="The team" title="The people behind the magic" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.05}>
                <div className="text-center">
                  <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl border border-line">
                    <Image src={m.avatar} alt={m.name} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-cocoa">{m.name}</h3>
                  <p className="text-sm text-cocoa-faint">{m.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
