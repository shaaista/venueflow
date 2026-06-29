import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Clock,
  MapPin,
  Quote,
  Sparkles,
  Star,
  Users,
  Wine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { SectionHeading, Eyebrow } from "@/components/ui/section-heading";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import {
  EVENT_TYPES,
  SPACES,
  PACKAGES,
  TESTIMONIALS,
  GALLERY,
  FAQS,
  UPCOMING_EVENTS,
  STATS,
} from "@/lib/mock/venue";
import { formatCurrency, formatDate } from "@/lib/utils";

const FEATURES = [
  {
    icon: MapPin,
    title: "Five distinct spaces",
    body: "From the glass-roofed Grand Atrium to candlelit private rooms — one address, infinite occasions.",
  },
  {
    icon: Wine,
    title: "In-house culinary craft",
    body: "Seasonal tasting menus and bespoke pairings designed by our executive chef and sommelier.",
  },
  {
    icon: CalendarCheck,
    title: "White-glove planning",
    body: "A dedicated coordinator anticipates every detail, from the first enquiry to the final dance.",
  },
  {
    icon: Sparkles,
    title: "Production at scale",
    body: "Full lighting, sound, and staging — galas, launches, and weddings delivered flawlessly.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-glow-amber" />
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-sage-200/40 blur-[120px]" />

        <div className="container-lux relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <Badge variant="amber" className="mb-6">
                <Star className="h-3 w-3 fill-current" />
                Voted Luxury Venue of the Year 2026
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-[2.75rem] font-medium leading-[1.05] tracking-tight text-cocoa text-balance sm:text-6xl md:text-[4.25rem]">
                Where extraordinary{" "}
                <span className="italic text-amber-500">events</span> begin.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-cocoa-muted">
                A collection of five exceptional event spaces, an in-house
                culinary team, and planners who obsess over every detail. Host
                the occasion they&apos;ll never forget.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/book-event">
                  <Button size="lg" className="w-full sm:w-auto">
                    Book an Event
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/check-availability">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Check Availability
                  </Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[5, 32, 12, 45].map((n) => (
                    <Image
                      key={n}
                      src={`https://i.pravatar.cc/80?img=${n}`}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border-2 border-canvas object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-cocoa-muted">
                    <span className="font-medium text-cocoa">2,400+</span>{" "}
                    unforgettable events hosted
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Hero visual */}
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-4xl border border-line shadow-float">
                <Image
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1100&q=80"
                  alt="The Grand Atrium set for an evening wedding"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/45 via-transparent to-transparent" />
              </div>

              {/* Floating availability card */}
              <div className="absolute -bottom-6 -left-6 hidden w-60 rounded-2xl glass-strong p-4 shadow-float sm:block">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-cocoa-faint">
                    Next available
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-success" />
                </div>
                <p className="mt-2 font-display text-xl text-cocoa">Sat, 12 July</p>
                <p className="text-sm text-cocoa-muted">The Grand Atrium</p>
                <Link
                  href="/check-availability"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-500"
                >
                  View calendar <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Floating rating chip */}
              <div className="absolute -right-4 top-8 hidden rounded-2xl glass-strong px-4 py-3 text-center shadow-float md:block">
                <p className="font-display text-2xl font-semibold text-espresso-600 tnum">
                  4.98
                </p>
                <p className="text-[11px] text-cocoa-muted">Avg. rating</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── Features ───────────────────────── */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="container-lux">
          <SectionHeading
            eyebrow="The experience"
            title="Hospitality, engineered to feel effortless"
            description="Every element under one roof — so your only job is to enjoy the moment."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="group h-full bg-surface p-7 transition-colors hover:bg-panel">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-espresso-50 text-espresso-600 transition-colors group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:text-amber-500">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-xl text-cocoa">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cocoa-muted">
                    {f.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Event Types ───────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container-lux">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Occasions"
              title="An address for every celebration"
              description="Whatever the milestone, we have a setting and a service to match."
            />
            <Reveal>
              <Link href="/event-types">
                <Button variant="ghost" size="sm">
                  All event types <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EVENT_TYPES.slice(0, 6).map((e, i) => (
              <Reveal key={e.slug} delay={i * 0.05}>
                <Link
                  href={`/event-types#${e.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-line"
                >
                  <Image
                    src={e.image}
                    alt={e.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-900 via-espresso-900/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="flex items-center gap-2 text-[11px] text-cream/80">
                      <Users className="h-3 w-3" /> {e.guests}
                    </div>
                    <h3 className="mt-1 font-display text-xl text-cream">
                      {e.name}
                    </h3>
                    <p className="mt-1 max-w-[18rem] text-sm text-cream/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {e.blurb}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Spaces ───────────────────────── */}
      <section className="border-y border-line bg-panel py-20 md:py-28">
        <div className="container-lux">
          <SectionHeading
            eyebrow="The spaces"
            title="Five rooms. One unforgettable address."
            align="center"
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {SPACES.slice(0, 3).map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.07}>
                <div className="card card-hover group h-full overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute left-3 top-3">
                      <Badge
                        variant={
                          s.availability === "High"
                            ? "success"
                            : s.availability === "Limited"
                            ? "warning"
                            : "danger"
                        }
                        dot
                      >
                        {s.availability} availability
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl text-cocoa">{s.name}</h3>
                      <span className="flex items-center gap-1 text-sm text-cocoa-muted">
                        <Users className="h-3.5 w-3.5" /> {s.capacity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-cocoa-muted">
                      {s.tagline}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <div>
                        <span className="text-xs text-cocoa-faint">From</span>
                        <p className="font-display text-lg font-semibold text-espresso-600 tnum">
                          {formatCurrency(s.priceFrom)}
                        </p>
                      </div>
                      <Link href="/event-spaces">
                        <Button variant="subtle" size="sm">
                          Explore
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/event-spaces">
              <Button variant="outline">View all spaces</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Stats ───────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-glow-amber" />
        <div className="container-lux relative">
          <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="text-center">
                <p className="font-display text-5xl font-semibold tracking-tight text-cocoa tnum md:text-6xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-sm uppercase tracking-[0.16em] text-cocoa-muted">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Gallery ───────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container-lux">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="The gallery" title="Moments made here" />
            <Reveal>
              <Link href="/gallery">
                <Button variant="ghost" size="sm">
                  Full gallery <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
            {GALLERY.map((g, i) => (
              <Reveal key={i} delay={(i % 4) * 0.05}>
                <div
                  className={`relative overflow-hidden rounded-2xl border border-line ${
                    g.tall ? "aspect-[3/4]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={g.src}
                    alt={g.label}
                    fill
                    className="object-cover transition-transform duration-700 ease-lux hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Packages ───────────────────────── */}
      <section className="border-y border-line bg-panel py-20 md:py-28">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Packages"
            title="Curated packages, transparent pricing"
            description="Choose a starting point, then tailor every detail with your planner."
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.tier} delay={i * 0.06}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl border bg-surface p-6 ${
                    p.highlight
                      ? "border-espresso-300 shadow-card ring-1 ring-espresso-200"
                      : "border-line shadow-soft"
                  }`}
                >
                  {p.highlight && (
                    <Badge variant="espresso" className="absolute -top-3 right-6">
                      Most chosen
                    </Badge>
                  )}
                  <h3 className="font-display text-2xl text-cocoa">{p.name}</h3>
                  <p className="mt-2 text-sm text-cocoa-muted">{p.description}</p>
                  <div className="mt-5">
                    {p.priceFrom ? (
                      <p className="flex items-baseline gap-1">
                        <span className="font-display text-3xl font-semibold text-cocoa tnum">
                          {formatCurrency(p.priceFrom)}
                        </span>
                        <span className="text-sm text-cocoa-faint">/ guest</span>
                      </p>
                    ) : (
                      <p className="font-display text-3xl font-semibold text-cocoa">
                        Bespoke
                      </p>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3 border-t border-line pt-6">
                    {p.features.slice(0, 5).map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-cocoa-muted"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-2">
                    <Link href="/packages">
                      <Button
                        variant={p.highlight ? "primary" : "outline"}
                        className="w-full"
                        size="sm"
                      >
                        {p.priceFrom ? "Select" : "Enquire"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Testimonials ───────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container-lux">
          <SectionHeading
            eyebrow="In their words"
            title="Trusted with life's biggest moments"
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <figure className="card h-full p-7">
                  <Quote className="h-7 w-7 text-amber-300" />
                  <blockquote className="mt-4 text-lg leading-relaxed text-cocoa">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-cocoa">{t.name}</p>
                      <p className="text-xs text-cocoa-faint">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5 text-amber-400">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Upcoming + FAQ ───────────────────────── */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="container-lux grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="What's on" title="Upcoming events" />
            <div className="mt-10 space-y-4">
              {UPCOMING_EVENTS.map((e, i) => (
                <Reveal key={e.title} delay={i * 0.06}>
                  <div className="card card-hover flex items-center gap-4 p-3">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={e.image}
                        alt={e.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-cocoa-faint">
                        <Clock className="h-3 w-3" />
                        {formatDate(e.date, "long")}
                      </div>
                      <h3 className="mt-1 truncate font-display text-lg text-cocoa">
                        {e.title}
                      </h3>
                      <p className="text-sm text-cocoa-muted">{e.type}</p>
                    </div>
                    <Badge variant="amber">{e.status}</Badge>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Good to know" title="Frequently asked" />
            <Reveal delay={0.1}>
              <FaqAccordion items={FAQS.slice(0, 5)} className="mt-8" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA / Newsletter ───────────────────────── */}
      <section className="pb-24">
        <div className="container-lux">
          <Reveal>
            <div className="aurora relative overflow-hidden rounded-4xl border border-line bg-surface p-10 text-center shadow-card md:p-16">
              <Eyebrow className="justify-center">Begin the conversation</Eyebrow>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-medium leading-tight text-cocoa text-balance md:text-5xl">
                Let&apos;s plan something unforgettable
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-cocoa-muted">
                Tell us about your occasion and a planner will craft a tailored
                proposal within 24 hours.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/request-quote">
                  <Button size="lg" className="w-full sm:w-auto">
                    Request a Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Contact the team
                  </Button>
                </Link>
              </div>

              <div className="mx-auto mt-12 max-w-md border-t border-line pt-8">
                <p className="text-sm text-cocoa-muted">
                  Or join our list for seasonal menus & open evenings
                </p>
                <form className="mt-4 flex gap-2">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="h-11 flex-1 rounded-full border border-line-strong bg-canvas px-4 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300"
                  />
                  <Button type="submit" size="md">
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
