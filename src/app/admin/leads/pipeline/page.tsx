import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { LeadsExplorer } from "@/components/admin/leads/leads-explorer";

export default function LeadsPipelinePage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Sales"
        title="Pipeline Board"
        description="Drag enquiries between stages to update their status."
        actions={
          <Link href="/admin/leads/new">
            <Button size="sm">
              <Plus className="h-4 w-4" /> New Enquiry
            </Button>
          </Link>
        }
      />
      <LeadsExplorer initialView="kanban" />
    </div>
  );
}
