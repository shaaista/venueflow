import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MY_EVENTS = [
  { id: "E-5012", title: "Eleanor & James Wedding", date: "September 14, 2026", guests: 220, space: "The Grand Atrium", status: "Confirmed", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80", upcoming: true },
  { id: "E-4980", title: "Engagement Party", date: "February 2, 2026", guests: 60, space: "The Reserve", status: "Completed", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80", upcoming: false },
];

export default function PortalEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-cocoa">My Events</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Your upcoming and past celebrations with us.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {MY_EVENTS.map((e) => (
          <Link key={e.id} href={`/portal/events/${e.id}`} className="card card-hover group overflow-hidden">
            <div className="relative aspect-[16/9]">
              <Image src={e.image} alt={e.title} fill className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105" sizes="(max-width:768px) 100vw, 50vw" />
              <div className="absolute left-3 top-3">
                <Badge variant={e.upcoming ? "success" : "default"} dot>{e.status}</Badge>
              </div>
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl text-cocoa">{e.title}</h2>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-cocoa-muted">
                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {e.date}</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {e.guests}</span>
              </div>
              <p className="mt-1 text-sm text-cocoa-faint">{e.space}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-espresso-600">
                View details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
