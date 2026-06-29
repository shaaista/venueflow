import Link from "next/link";
import Image from "next/image";
import { Plus, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EVENTS, EVENT_STATUS_VARIANT } from "@/lib/mock/events";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BookingsPage() {
  const bookings = EVENTS.filter((e) => e.status !== "Tentative");
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Operations"
        title="Bookings"
        description="Confirmed events with signed contracts and deposits."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> New booking</Button>}
      />
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line bg-panel/50 text-left">
                {["Booking", "Space", "Date", "Guests", "Contract", "Deposit", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {bookings.map((e) => (
                <tr key={e.id} className="group transition-colors hover:bg-panel/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Image src={e.clientAvatar} alt={e.client} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <Link href={`/admin/events/${e.id}`} className="font-medium text-cocoa hover:text-espresso-600">{e.title}</Link>
                        <p className="text-xs text-cocoa-faint">{e.client}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cocoa-muted">{e.space}</td>
                  <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(e.date)}</td>
                  <td className="px-4 py-3 text-cocoa-muted tnum">{e.guests}</td>
                  <td className="px-4 py-3 font-medium text-cocoa tnum">{formatCurrency(e.value, { compact: true })}</td>
                  <td className="px-4 py-3 text-cocoa-muted tnum">{formatCurrency(e.paid, { compact: true })}</td>
                  <td className="px-4 py-3"><Badge variant={EVENT_STATUS_VARIANT[e.status]} dot>{e.status}</Badge></td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/events/${e.id}`} className="grid h-7 w-7 place-items-center rounded-md text-cocoa-faint opacity-0 transition-all hover:bg-espresso-50 hover:text-cocoa group-hover:opacity-100">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
