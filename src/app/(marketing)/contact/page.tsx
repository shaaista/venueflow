import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/page-hero";

const inputCls = "h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300";
const labelCls = "mb-1.5 block text-xs font-medium text-cocoa-muted";

const INFO = [
  { icon: MapPin, label: "Visit us", value: "1200 Riverside Ave, Portland, OR 97201" },
  { icon: Phone, label: "Call us", value: "+1 (555) 120-8800" },
  { icon: Mail, label: "Email us", value: "events@theatrium.co" },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 9am – 6pm" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact Us" title="Let's start a conversation" description="Tell us about your occasion and we'll be in touch within 24 hours." />
      <section className="py-16 md:py-24">
        <div className="container-lux grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            {INFO.map((i) => (
              <div key={i.label} className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-espresso-50 text-espresso-600">
                  <i.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-cocoa-faint">{i.label}</p>
                  <p className="mt-0.5 text-cocoa">{i.value}</p>
                </div>
              </div>
            ))}
            <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-panel">
              <div className="absolute inset-0 grid place-items-center text-cocoa-faint">
                <span className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" /> Map view</span>
              </div>
            </div>
          </div>

          <div className="card p-7">
            <h2 className="font-display text-2xl text-cocoa">Send us a message</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div><label className={labelCls}>First name</label><input className={inputCls} placeholder="Eleanor" /></div>
              <div><label className={labelCls}>Last name</label><input className={inputCls} placeholder="Vance" /></div>
              <div><label className={labelCls}>Email</label><input className={inputCls} placeholder="you@email.com" /></div>
              <div><label className={labelCls}>Phone</label><input className={inputCls} placeholder="+1 (555) 000-0000" /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Event type</label>
                <select className={inputCls} defaultValue=""><option value="" disabled>Select…</option><option>Wedding</option><option>Corporate</option><option>Private</option></select>
              </div>
              <div className="sm:col-span-2"><label className={labelCls}>Message</label>
                <textarea rows={4} className="w-full resize-none rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-cocoa outline-none focus:border-espresso-300" placeholder="Tell us about your occasion…" />
              </div>
            </div>
            <Button className="mt-5 w-full sm:w-auto">Send message</Button>
          </div>
        </div>
      </section>
    </>
  );
}
