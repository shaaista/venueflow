import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SPACES } from "@/lib/mock/venue";
import { formatCurrency } from "@/lib/utils";

export default function AvailabilityResults() {
  return (
    <div className="container-lux max-w-4xl py-12 md:py-16">
      <Link href="/check-availability" className="inline-flex items-center gap-1.5 text-sm text-cocoa-muted hover:text-cocoa">
        <ArrowLeft className="h-4 w-4" /> Modify search
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-sage-200 bg-sage-50 p-5">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-sage-500 text-cream">
          <Check className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-lg text-cocoa">Great news — Saturday, September 14 is available!</p>
          <p className="text-sm text-cocoa-muted">3 of our spaces can host your event on this date.</p>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl text-cocoa">Available spaces</h2>
      <div className="mt-5 space-y-4">
        {SPACES.filter((s) => s.availability !== "Booked").slice(0, 3).map((s) => (
          <div key={s.slug} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-44">
              <Image src={s.image} alt={s.name} fill className="object-cover" sizes="176px" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg text-cocoa">{s.name}</h3>
                <Badge variant="success" dot>Available</Badge>
              </div>
              <p className="mt-1 text-sm text-cocoa-muted">{s.tagline}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-cocoa-faint"><Users className="h-3 w-3" /> Up to {s.capacity} guests</p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
              <div className="text-right">
                <span className="text-xs text-cocoa-faint">From</span>
                <p className="font-display text-lg font-semibold text-espresso-600 tnum">{formatCurrency(s.priceFrom)}</p>
              </div>
              <Link href="/book-event"><Button size="sm">Book <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
