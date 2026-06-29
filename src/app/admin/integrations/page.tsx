import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Calendar,
  Mail,
  MessageSquare,
  Zap,
  Cloud,
  BarChart3,
  Phone,
} from "lucide-react";

const INTEGRATIONS = [
  { name: "Stripe", desc: "Collect deposits and payments online.", icon: CreditCard, connected: true, tint: "espresso" },
  { name: "Google Calendar", desc: "Two-way sync for all your events.", icon: Calendar, connected: true, tint: "sage" },
  { name: "Resend", desc: "Send transactional and campaign email.", icon: Mail, connected: true, tint: "amber" },
  { name: "Twilio SMS", desc: "Text reminders and confirmations.", icon: MessageSquare, connected: false, tint: "espresso" },
  { name: "WhatsApp Business", desc: "Message customers on WhatsApp.", icon: Phone, connected: false, tint: "sage" },
  { name: "Zapier", desc: "Connect to 6,000+ other apps.", icon: Zap, connected: false, tint: "amber" },
  { name: "Outlook Calendar", desc: "Sync events with Microsoft 365.", icon: Cloud, connected: false, tint: "espresso" },
  { name: "Mailchimp", desc: "Sync contacts to your audience.", icon: BarChart3, connected: false, tint: "sage" },
];

const TINT: Record<string, string> = {
  espresso: "bg-espresso-50 text-espresso-600",
  sage: "bg-sage-50 text-sage-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function IntegrationsPage() {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Manage"
        title="Integrations"
        description="Connect VenueFlow to the tools you already use."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {INTEGRATIONS.map((i) => (
          <div key={i.name} className="card card-hover flex flex-col p-5">
            <div className="flex items-start justify-between">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${TINT[i.tint]}`}>
                <i.icon className="h-5 w-5" />
              </div>
              {i.connected && <Badge variant="success" dot>Connected</Badge>}
            </div>
            <h3 className="mt-4 font-display text-lg text-cocoa">{i.name}</h3>
            <p className="mt-1 flex-1 text-sm text-cocoa-muted">{i.desc}</p>
            <Button variant={i.connected ? "outline" : "primary"} size="sm" className="mt-4">
              {i.connected ? "Manage" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
