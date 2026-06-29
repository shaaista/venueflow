import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/admin/calendar/calendar-view";

export default function CalendarPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Overview"
        title="Calendar"
        description="Every event, site visit, and tasting across your venues."
        actions={
          <Link href="/admin/events/new">
            <Button size="sm">
              <Plus className="h-4 w-4" /> New Event
            </Button>
          </Link>
        }
      />
      <CalendarView />
    </div>
  );
}
