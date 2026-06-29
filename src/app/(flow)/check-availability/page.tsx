import Link from "next/link";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-heading";
import { SPACES } from "@/lib/mock/venue";

const inputCls = "h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300";
const labelCls = "mb-1.5 block text-xs font-medium text-cocoa-muted";

export default function CheckAvailabilityPage() {
  return (
    <div className="container-lux max-w-2xl py-12 md:py-20">
      <div className="text-center">
        <Eyebrow className="justify-center">Check Availability</Eyebrow>
        <h1 className="mt-4 font-display text-3xl text-cocoa md:text-4xl">Is your date available?</h1>
        <p className="mt-2 text-cocoa-muted">Search our live calendar to see what's open.</p>
      </div>

      <div className="card mt-8 p-6 md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className={labelCls}>Event date</label>
            <div className="relative">
              <input type="date" className={inputCls} />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-faint" />
            </div>
          </div>
          <div><label className={labelCls}>Guests</label><input type="number" className={inputCls} placeholder="e.g. 180" /></div>
          <div className="sm:col-span-2"><label className={labelCls}>Space</label>
            <select className={inputCls} defaultValue="any">
              <option value="any">Any space</option>
              {SPACES.map((s) => <option key={s.slug}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <Link href="/check-availability/results" className="mt-6 block">
          <Button size="lg" className="w-full"><Search className="h-4 w-4" /> Check availability</Button>
        </Link>
      </div>
    </div>
  );
}
