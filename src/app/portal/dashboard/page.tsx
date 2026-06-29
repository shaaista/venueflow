import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Users,
  ArrowRight,
  FileText,
  CreditCard,
  MessageSquare,
  Download,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const EVENT_DATE = new Date("2026-09-14");
const TODAY = new Date("2026-06-28");
const DAYS = Math.round((EVENT_DATE.getTime() - TODAY.getTime()) / 86400000);

const CHECKLIST = [
  { label: "Enquiry submitted", done: true },
  { label: "Site visit completed", done: true },
  { label: "Proposal accepted", done: true },
  { label: "Deposit paid", done: true },
  { label: "Menu tasting", done: false },
  { label: "Final guest count", done: false },
  { label: "Balance payment", done: false },
];

const MESSAGES = [
  { from: "Alex Rivera", text: "I've pencilled you in for the tasting on the 12th!", time: "2h ago" },
  { from: "Mara Quinn", text: "Floor plan draft attached for your review.", time: "Yesterday" },
];

const DOCS = [
  { name: "Proposal Q-1182.pdf", size: "248 KB" },
  { name: "Floor plan — Atrium.pdf", size: "1.2 MB" },
  { name: "Tasting menu.pdf", size: "180 KB" },
];

export default function PortalDashboard() {
  const done = CHECKLIST.filter((c) => c.done).length;
  const progress = Math.round((done / CHECKLIST.length) * 100);

  const stats = [
    { label: "Days to go", value: String(DAYS), icon: Clock },
    { label: "Balance due", value: formatCurrency(14250, { compact: true }), icon: CreditCard },
    { label: "Pending quotes", value: "0", icon: FileText },
    { label: "Guests", value: "220", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-cocoa-muted">Welcome back,</p>
        <h1 className="font-display text-3xl font-medium text-cocoa">Eleanor</h1>
      </div>

      {/* Hero event card */}
      <div className="card overflow-hidden">
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <div className="p-6 md:p-8">
            <Badge variant="success" dot>Confirmed</Badge>
            <h2 className="mt-3 font-display text-2xl text-cocoa md:text-3xl">
              Eleanor &amp; James Wedding
            </h2>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-cocoa-muted">
              <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> September 14, 2026</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> 4:00 PM</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> 220 guests</span>
            </div>
            <p className="mt-2 text-sm text-cocoa-faint">The Grand Atrium</p>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cocoa-muted">Planning progress</span>
                <span className="font-medium text-cocoa">{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas-deep">
                <div className="h-full rounded-full bg-sage-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Link href="/portal/events/E-5012"><Button size="sm">View event <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/portal/messages"><Button variant="outline" size="sm">Message planner</Button></Link>
            </div>
          </div>
          <div className="relative min-h-[200px]">
            <Image
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"
              alt="The Grand Atrium"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-3 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-espresso-50 text-espresso-600">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-cocoa tnum">{s.value}</p>
              <p className="text-xs text-cocoa-faint">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Checklist */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg text-cocoa">Your planning timeline</h2>
          <ol className="relative space-y-1 before:absolute before:left-[11px] before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-line">
            {CHECKLIST.map((c) => (
              <li key={c.label} className="relative flex items-center gap-3 py-1.5">
                {c.done ? (
                  <CheckCircle2 className="z-10 h-[22px] w-[22px] shrink-0 text-sage-500" />
                ) : (
                  <Circle className="z-10 h-[22px] w-[22px] shrink-0 bg-surface text-cocoa-ghost" />
                )}
                <span className={c.done ? "text-sm text-cocoa-muted" : "text-sm font-medium text-cocoa"}>
                  {c.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Outstanding payment */}
        <div className="space-y-5">
          <div className="card overflow-hidden">
            <div className="bg-amber-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Action needed</p>
              <p className="mt-2 font-display text-2xl font-semibold text-cocoa tnum">{formatCurrency(14250)}</p>
              <p className="text-sm text-cocoa-muted">Final balance due Aug 31, 2026</p>
              <Link href="/portal/payments"><Button size="sm" className="mt-4 w-full">Pay balance</Button></Link>
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base text-cocoa">Recent messages</h2>
              <Link href="/portal/messages" className="text-xs font-medium text-espresso-600 hover:underline">All</Link>
            </div>
            <div className="space-y-3">
              {MESSAGES.map((m, i) => (
                <div key={i} className="flex gap-2.5">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-cocoa-faint" />
                  <div>
                    <p className="text-sm text-cocoa"><span className="font-medium">{m.from}</span> · {m.time}</p>
                    <p className="text-sm text-cocoa-muted">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="card p-5">
        <h2 className="mb-3 font-display text-lg text-cocoa">Your documents</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {DOCS.map((d) => (
            <div key={d.name} className="flex items-center gap-3 rounded-xl border border-line p-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-espresso-50 text-espresso-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-cocoa">{d.name}</p>
                <p className="text-xs text-cocoa-faint">{d.size}</p>
              </div>
              <Download className="h-4 w-4 text-cocoa-faint" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
