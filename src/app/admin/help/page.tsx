import { Search, BookOpen, Rocket, CreditCard, Plug, MessageCircle, Video } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { name: "Getting started", desc: "Set up your venue and first event.", icon: Rocket, articles: 12 },
  { name: "Managing leads", desc: "Pipeline, stages, and follow-ups.", icon: BookOpen, articles: 18 },
  { name: "Payments & billing", desc: "Deposits, invoices, and refunds.", icon: CreditCard, articles: 9 },
  { name: "Integrations", desc: "Connect Stripe, calendars, and more.", icon: Plug, articles: 14 },
];

export default function HelpPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader eyebrow="Support" title="Help Center" description="Guides, answers, and a team ready to help." />

      <div className="card overflow-hidden">
        <div className="bg-espresso-50 p-8 text-center">
          <h2 className="font-display text-2xl text-cocoa">How can we help?</h2>
          <div className="relative mx-auto mt-4 max-w-lg">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-faint" />
            <input
              placeholder="Search the help center…"
              className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm text-cocoa outline-none focus:border-espresso-300"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <div key={c.name} className="card card-hover flex items-start gap-4 p-5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-espresso-50 text-espresso-600">
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg text-cocoa">{c.name}</h3>
              <p className="mt-0.5 text-sm text-cocoa-muted">{c.desc}</p>
              <p className="mt-2 text-xs text-cocoa-faint">{c.articles} articles</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 p-5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-sage-50 text-sage-600"><MessageCircle className="h-5 w-5" /></div>
          <div className="flex-1">
            <h3 className="font-medium text-cocoa">Chat with support</h3>
            <p className="text-sm text-cocoa-muted">Typical reply in under 2 hours.</p>
          </div>
          <Button size="sm">Start chat</Button>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600"><Video className="h-5 w-5" /></div>
          <div className="flex-1">
            <h3 className="font-medium text-cocoa">Book a demo</h3>
            <p className="text-sm text-cocoa-muted">Walkthrough with our team.</p>
          </div>
          <Button variant="outline" size="sm">Schedule</Button>
        </div>
      </div>
    </div>
  );
}
