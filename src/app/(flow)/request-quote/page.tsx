import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-heading";
import { EVENT_TYPES, SPACES } from "@/lib/mock/venue";

const inputCls = "h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300";
const labelCls = "mb-1.5 block text-xs font-medium text-cocoa-muted";

export default function RequestQuotePage() {
  return (
    <div className="container-lux max-w-2xl py-12 md:py-16">
      <Eyebrow>Request a Quote</Eyebrow>
      <h1 className="mt-4 font-display text-3xl text-cocoa md:text-4xl">Get a tailored proposal</h1>
      <p className="mt-2 text-cocoa-muted">Tell us a little about your event and we'll prepare a personalised quote within 24 hours.</p>

      <div className="card mt-8 p-6 md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className={labelCls}>Full name</label><input className={inputCls} placeholder="Eleanor Vance" /></div>
          <div><label className={labelCls}>Email</label><input className={inputCls} placeholder="you@email.com" /></div>
          <div><label className={labelCls}>Phone</label><input className={inputCls} placeholder="+1 (555) 000-0000" /></div>
          <div><label className={labelCls}>Preferred date</label><input type="date" className={inputCls} /></div>
          <div><label className={labelCls}>Event type</label>
            <select className={inputCls} defaultValue=""><option value="" disabled>Select…</option>{EVENT_TYPES.map((e) => <option key={e.slug}>{e.name}</option>)}</select>
          </div>
          <div><label className={labelCls}>Preferred space</label>
            <select className={inputCls} defaultValue=""><option value="" disabled>Select…</option>{SPACES.map((s) => <option key={s.slug}>{s.name}</option>)}</select>
          </div>
          <div><label className={labelCls}>Guest count</label><input type="number" className={inputCls} placeholder="e.g. 180" /></div>
          <div><label className={labelCls}>Budget range</label>
            <select className={inputCls} defaultValue=""><option value="" disabled>Select…</option><option>Under $10k</option><option>$10k – $25k</option><option>$25k – $50k</option><option>$50k+</option></select>
          </div>
          <div className="sm:col-span-2"><label className={labelCls}>Tell us more</label>
            <textarea rows={4} className="w-full resize-none rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-cocoa outline-none focus:border-espresso-300" placeholder="Share your vision, must-haves, or any questions…" />
          </div>
        </div>
        <Link href="/request-quote/success" className="mt-6 inline-block">
          <Button size="lg">Request my quote <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
    </div>
  );
}
