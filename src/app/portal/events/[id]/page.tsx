import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, Users, MapPin, MessageSquare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EVENT_SCHEDULE } from "@/lib/mock/events";
import { formatCurrency } from "@/lib/utils";

export default async function PortalEventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  const facts = [
    { icon: CalendarDays, label: "Date", value: "September 14, 2026" },
    { icon: Clock, label: "Time", value: "4:00 PM – 11:00 PM" },
    { icon: MapPin, label: "Space", value: "The Grand Atrium" },
    { icon: Users, label: "Guests", value: "220" },
  ];

  return (
    <div className="space-y-5">
      <Link href="/portal/events" className="inline-flex items-center gap-1.5 text-sm text-cocoa-muted hover:text-cocoa">
        <ArrowLeft className="h-4 w-4" /> Back to events
      </Link>

      <div className="card overflow-hidden">
        <div className="relative h-56">
          <Image src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80" alt="The Grand Atrium" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/70 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <Badge variant="success" dot>Confirmed</Badge>
            <h1 className="mt-2 font-display text-3xl text-cream">Eleanor &amp; James Wedding</h1>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex items-center gap-2.5 bg-surface p-4">
              <f.icon className="h-4 w-4 text-cocoa-faint" />
              <div>
                <p className="text-xs text-cocoa-faint">{f.label}</p>
                <p className="text-sm font-medium text-cocoa">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="card p-5">
          <h2 className="mb-4 font-display text-lg text-cocoa">Run of show</h2>
          <ol className="relative space-y-4 before:absolute before:left-[60px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-line">
            {EVENT_SCHEDULE.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-14 shrink-0 pt-0.5 text-right text-xs font-medium text-cocoa-faint tnum">{s.time}</span>
                <span className="z-10 mt-1 grid h-3 w-3 shrink-0 place-items-center rounded-full border-2 border-espresso-400 bg-surface" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-cocoa">{s.title}</p>
                  <p className="text-sm text-cocoa-muted">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Payment</h2>
            <p className="text-xs text-cocoa-faint">Balance remaining</p>
            <p className="font-display text-2xl font-semibold text-cocoa tnum">{formatCurrency(14250)}</p>
            <Link href="/portal/payments"><Button size="sm" className="mt-3 w-full">Pay balance</Button></Link>
          </div>
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Your planner</h2>
            <div className="flex items-center gap-3">
              <Image src="https://i.pravatar.cc/80?img=47" alt="Mara Quinn" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium text-cocoa">Mara Quinn</p>
                <p className="text-xs text-cocoa-faint">Event Manager</p>
              </div>
            </div>
            <Link href="/portal/messages"><Button variant="outline" size="sm" className="mt-3 w-full"><MessageSquare className="h-4 w-4" /> Message</Button></Link>
          </div>
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Documents</h2>
            <div className="space-y-2">
              {["Contract.pdf", "Floor plan.pdf", "Tasting menu.pdf"].map((d) => (
                <button key={d} className="flex w-full items-center gap-2 rounded-lg border border-line p-2.5 text-left text-sm text-cocoa hover:bg-panel">
                  <Download className="h-4 w-4 text-cocoa-faint" /> {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
