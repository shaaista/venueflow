"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, CalendarHeart, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EVENT_TYPES, SPACES } from "@/lib/mock/venue";
import { LEAD_SOURCES } from "@/lib/mock/leads";

const inputCls =
  "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300";
const labelCls = "mb-1.5 block text-xs font-medium text-cocoa-muted";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof User;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-espresso-50 text-espresso-600">
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div>
          <h2 className="font-display text-lg text-cocoa">{title}</h2>
          <p className="text-xs text-cocoa-faint">{desc}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function NewLeadPage() {
  const [form, setForm] = useState({
    name: "",
    eventType: "",
    date: "",
    guests: "",
    budget: "",
  });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="container-lux space-y-5 py-7">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm text-cocoa-muted transition-colors hover:text-cocoa"
      >
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </Link>

      <div>
        <p className="label-eyebrow mb-2 text-amber-500">Sales</p>
        <h1 className="font-display text-2xl font-medium tracking-tight text-cocoa">
          New Enquiry
        </h1>
        <p className="mt-1 text-sm text-cocoa-muted">
          Capture a new event enquiry and add it to your pipeline.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <SectionCard
            icon={User}
            title="Contact"
            desc="Who is making the enquiry?"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact name">
                <input
                  className={inputCls}
                  placeholder="e.g. Eleanor Vance"
                  onChange={set("name")}
                />
              </Field>
              <Field label="Company (optional)">
                <input className={inputCls} placeholder="e.g. Lumen Capital" />
              </Field>
              <Field label="Email">
                <input
                  className={inputCls}
                  type="email"
                  placeholder="name@email.com"
                />
              </Field>
              <Field label="Phone">
                <input className={inputCls} placeholder="+1 (555) 000-0000" />
              </Field>
              <Field label="Location" className="sm:col-span-2">
                <input className={inputCls} placeholder="City, State" />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            icon={CalendarHeart}
            title="Event details"
            desc="What are they planning?"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Event type">
                <select className={inputCls} onChange={set("eventType")} defaultValue="">
                  <option value="" disabled>
                    Select type
                  </option>
                  {EVENT_TYPES.map((e) => (
                    <option key={e.slug} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Preferred space">
                <select className={inputCls} defaultValue="">
                  <option value="" disabled>
                    Select space
                  </option>
                  {SPACES.map((s) => (
                    <option key={s.slug} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Preferred date">
                <input className={inputCls} type="date" onChange={set("date")} />
              </Field>
              <Field label="Guest count">
                <input
                  className={inputCls}
                  type="number"
                  placeholder="e.g. 180"
                  onChange={set("guests")}
                />
              </Field>
              <Field label="Estimated budget" className="sm:col-span-2">
                <input
                  className={inputCls}
                  placeholder="e.g. $25,000"
                  onChange={set("budget")}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            icon={FileText}
            title="Details & assignment"
            desc="Source, owner, and notes."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Source">
                <select className={inputCls} defaultValue="">
                  <option value="" disabled>
                    Select source
                  </option>
                  {LEAD_SOURCES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Assign to">
                <select className={inputCls} defaultValue="Alex Rivera">
                  <option>Alex Rivera</option>
                  <option>Mara Quinn</option>
                  <option>Theo Sandoval</option>
                </select>
              </Field>
              <Field label="Notes" className="sm:col-span-2">
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300"
                  placeholder="Any context, preferences, or special requests…"
                />
              </Field>
            </div>
          </SectionCard>
        </div>

        {/* Live summary */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="card overflow-hidden">
            <div className="border-b border-line bg-panel/60 p-5">
              <div className="flex items-center gap-2 text-amber-500">
                <Sparkles className="h-4 w-4" />
                <span className="label-eyebrow text-amber-500">Summary</span>
              </div>
              <p className="mt-3 font-display text-lg text-cocoa">
                {form.name || "New enquiry"}
              </p>
              <p className="text-sm text-cocoa-faint">
                {form.eventType || "Event type not set"}
              </p>
            </div>
            <dl className="space-y-3 p-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-cocoa-faint">Date</dt>
                <dd className="text-cocoa">{form.date || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cocoa-faint">Guests</dt>
                <dd className="text-cocoa tnum">{form.guests || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cocoa-faint">Budget</dt>
                <dd className="text-cocoa">{form.budget || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-cocoa-faint">Stage</dt>
                <dd className="text-cocoa">New</dd>
              </div>
            </dl>
            <div className="space-y-2 border-t border-line p-4">
              <Button className="w-full">Create Enquiry</Button>
              <Button variant="outline" className="w-full">
                Save as draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
