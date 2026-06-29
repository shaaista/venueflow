import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { UPCOMING_EVENTS } from "@/lib/mock/venue";
import { formatDate } from "@/lib/utils";

const MORE = [
  ...UPCOMING_EVENTS,
  { date: "2026-08-16", title: "Late Summer Wine Dinner", type: "Private Dining", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80", status: "On sale" },
  { date: "2026-09-05", title: "Autumn Craft Market", type: "Community", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80", status: "Free entry" },
];

export default function UpcomingEventsPage() {
  return (
    <>
      <PageHero eyebrow="What's On" title="Upcoming events" description="Public events, open evenings, and ticketed experiences at The Atrium." />
      <section className="py-16 md:py-24">
        <div className="container-lux grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MORE.map((e, i) => (
            <Reveal key={i} delay={(i % 3) * 0.05}>
              <div className="card card-hover group overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={e.image} alt={e.title} fill className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                  <div className="absolute left-3 top-3"><Badge variant="amber">{e.status}</Badge></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-cocoa-faint">
                    <Clock className="h-3 w-3" /> {formatDate(e.date, "long")}
                  </div>
                  <h3 className="mt-1.5 font-display text-xl text-cocoa">{e.title}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-cocoa-muted"><MapPin className="h-3.5 w-3.5" /> {e.type}</p>
                  <Link href="/book-event" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-espresso-600">
                    Reserve a place <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="container-lux mt-12 text-center">
          <Link href="/contact"><Button variant="outline">Host your own event</Button></Link>
        </div>
      </section>
    </>
  );
}
