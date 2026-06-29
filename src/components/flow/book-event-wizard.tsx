"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateLead } from "@/hooks/use-workflows";
import { EVENT_TYPES, SPACES } from "@/lib/mock/venue";
import { cn } from "@/lib/utils";

const STEPS = [
  "Event Type",
  "Date",
  "Guests",
  "Venue",
  "Food & Drinks",
  "Add-ons",
  "Contact",
  "Review",
];

const inputCls = "h-11 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300";
const labelCls = "mb-1.5 block text-xs font-medium text-cocoa-muted";

const ADDONS = ["Live entertainment", "Premium florals", "Photography", "Valet parking", "Late bar extension", "Overnight suites"];
const CATERING = ["Three-course plated", "Five-course tasting", "Sharing feast", "Cocktail & canapés"];

export function BookEventWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ type: "", space: "", catering: "", addons: [] as string[], firstName: "", lastName: "", email: "", phone: "", date: "", guests: "" });
  const isLast = step === STEPS.length - 1;
  const done = step === STEPS.length;
  const createLead = useCreateLead();
  const setField = (k: keyof typeof data) => (e: { target: { value: string } }) => setData((d) => ({ ...d, [k]: e.target.value }));

  const next = () => {
    if (isLast) {
      // Workflow A — submitting the public enquiry creates a real lead (+ notification + activity).
      createLead.mutate({
        contactName: `${data.firstName} ${data.lastName}`.trim() || "Website visitor",
        email: data.email || "guest@email.com",
        phone: data.phone || undefined,
        eventType: data.type || undefined,
        eventDate: data.date || undefined,
        guests: data.guests ? Number(data.guests) : undefined,
        source: "Website Booking",
      });
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const toggleAddon = (a: string) =>
    setData((d) => ({ ...d, addons: d.addons.includes(a) ? d.addons.filter((x) => x !== a) : [...d.addons, a] }));

  if (done) {
    return (
      <div className="container-lux flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-sage-50 text-sage-600">
          <PartyPopper className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-cocoa">Enquiry received!</h1>
        <p className="mt-3 text-cocoa-muted">
          Thank you — a member of our events team will be in touch within 24 hours with a tailored proposal for your celebration.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/"><Button variant="outline">Back to home</Button></Link>
          <Link href="/portal/dashboard"><Button>View in portal</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-lux max-w-2xl py-10 md:py-14">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-cocoa">{STEPS[step]}</span>
          <span className="text-cocoa-faint">Step {step + 1} of {STEPS.length}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas-deep">
          <motion.div className="h-full rounded-full bg-espresso-600" animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ ease: [0.22, 1, 0.36, 1] }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 && (
            <Step title="What are you celebrating?" desc="Choose the type of event you're planning.">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {EVENT_TYPES.slice(0, 9).map((e) => (
                  <button key={e.slug} onClick={() => setData((d) => ({ ...d, type: e.name }))}
                    className={cn("rounded-xl border p-4 text-left text-sm transition-all", data.type === e.name ? "border-espresso-400 bg-espresso-50 text-espresso-700" : "border-line bg-surface text-cocoa-muted hover:border-line-strong")}>
                    {e.name}
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step title="When's the big day?" desc="Pick a preferred date — we'll confirm availability.">
              <div><label className={labelCls}>Preferred date</label><input type="date" className={inputCls} value={data.date} onChange={setField("date")} /></div>
              <div className="mt-4"><label className={labelCls}>Flexibility</label>
                <select className={inputCls} defaultValue=""><option value="" disabled>Select…</option><option>Exact date only</option><option>±1 week</option><option>Flexible — any weekend</option></select>
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step title="How many guests?" desc="An estimate is fine — you can refine this later.">
              <div><label className={labelCls}>Estimated guest count</label><input type="number" placeholder="e.g. 180" className={inputCls} value={data.guests} onChange={setField("guests")} /></div>
            </Step>
          )}

          {step === 3 && (
            <Step title="Choose your space" desc="Which of our spaces feels right?">
              <div className="space-y-2">
                {SPACES.map((s) => (
                  <button key={s.slug} onClick={() => setData((d) => ({ ...d, space: s.name }))}
                    className={cn("flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all", data.space === s.name ? "border-espresso-400 bg-espresso-50" : "border-line bg-surface hover:border-line-strong")}>
                    <div>
                      <p className="text-sm font-medium text-cocoa">{s.name}</p>
                      <p className="text-xs text-cocoa-faint">Up to {s.capacity} guests · {s.size}</p>
                    </div>
                    {data.space === s.name && <Check className="h-5 w-5 text-espresso-600" />}
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step title="Food & drinks" desc="Select a catering style — bespoke menus available.">
              <div className="grid grid-cols-2 gap-3">
                {CATERING.map((c) => (
                  <button key={c} onClick={() => setData((d) => ({ ...d, catering: c }))}
                    className={cn("rounded-xl border p-4 text-left text-sm transition-all", data.catering === c ? "border-espresso-400 bg-espresso-50 text-espresso-700" : "border-line bg-surface text-cocoa-muted hover:border-line-strong")}>
                    {c}
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 5 && (
            <Step title="Any add-ons?" desc="Enhance your event (optional).">
              <div className="grid grid-cols-2 gap-3">
                {ADDONS.map((a) => (
                  <button key={a} onClick={() => toggleAddon(a)}
                    className={cn("flex items-center gap-2 rounded-xl border p-3.5 text-left text-sm transition-all", data.addons.includes(a) ? "border-espresso-400 bg-espresso-50 text-espresso-700" : "border-line bg-surface text-cocoa-muted hover:border-line-strong")}>
                    <span className={cn("grid h-4 w-4 place-items-center rounded border", data.addons.includes(a) ? "border-espresso-500 bg-espresso-500 text-cream" : "border-line-strong")}>
                      {data.addons.includes(a) && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    {a}
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 6 && (
            <Step title="Your details" desc="So we can send your tailored proposal.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>First name</label><input className={inputCls} placeholder="Eleanor" value={data.firstName} onChange={setField("firstName")} /></div>
                <div><label className={labelCls}>Last name</label><input className={inputCls} placeholder="Vance" value={data.lastName} onChange={setField("lastName")} /></div>
                <div><label className={labelCls}>Email</label><input className={inputCls} placeholder="you@email.com" value={data.email} onChange={setField("email")} /></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} placeholder="+1 (555) 000-0000" value={data.phone} onChange={setField("phone")} /></div>
              </div>
            </Step>
          )}

          {step === 7 && (
            <Step title="Review your enquiry" desc="Everything look right?">
              <dl className="divide-y divide-line rounded-xl border border-line">
                {[
                  ["Event type", data.type || "—"],
                  ["Venue", data.space || "—"],
                  ["Catering", data.catering || "—"],
                  ["Add-ons", data.addons.length ? data.addons.join(", ") : "None"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-6 px-4 py-3 text-sm">
                    <dt className="text-cocoa-faint">{k}</dt>
                    <dd className="text-right font-medium text-cocoa">{v}</dd>
                  </div>
                ))}
              </dl>
            </Step>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={next}>
          {isLast ? "Submit enquiry" : "Continue"} {!isLast && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

function Step({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-2xl text-cocoa md:text-3xl">{title}</h1>
      <p className="mt-1.5 text-cocoa-muted">{desc}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
