import { Plus, FileInput, ExternalLink, Code2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FORMS = [
  { name: "General Enquiry", submissions: 184, status: "Live", updated: "2 days ago" },
  { name: "Wedding Enquiry", submissions: 96, status: "Live", updated: "1 week ago" },
  { name: "Corporate Event Request", submissions: 71, status: "Live", updated: "3 days ago" },
  { name: "Quote Request", submissions: 142, status: "Live", updated: "Yesterday" },
  { name: "Newsletter Signup", submissions: 503, status: "Live", updated: "1 month ago" },
  { name: "Vendor Application", submissions: 12, status: "Draft", updated: "2 weeks ago" },
];

export default function FormsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Engage"
        title="Forms"
        description="Capture enquiries from your website and landing pages."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> New form</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FORMS.map((f) => (
          <div key={f.name} className="card card-hover flex flex-col p-5">
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-espresso-50 text-espresso-600">
                <FileInput className="h-5 w-5" />
              </div>
              <Badge variant={f.status === "Live" ? "success" : "default"} dot>{f.status}</Badge>
            </div>
            <h3 className="mt-4 font-display text-lg text-cocoa">{f.name}</h3>
            <p className="mt-1 text-sm text-cocoa-muted">
              <span className="font-medium text-cocoa tnum">{f.submissions}</span> submissions
            </p>
            <p className="text-xs text-cocoa-faint">Updated {f.updated}</p>
            <div className="mt-4 flex gap-2 border-t border-line pt-4">
              <Button variant="outline" size="sm" className="flex-1"><Code2 className="h-4 w-4" /> Embed</Button>
              <Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
