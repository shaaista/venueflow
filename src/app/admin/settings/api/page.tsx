import { Copy, Plus, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SettingsSection } from "@/components/admin/settings/settings-ui";

const KEYS = [
  { name: "Production", key: "vf_live_••••••••••••8a21", created: "Mar 2026" },
  { name: "Development", key: "vf_test_••••••••••••4c09", created: "Jan 2026" },
];

const HOOKS = [
  { url: "https://api.theatrium.co/hooks/booking", events: "booking.created", status: "Active" },
  { url: "https://zapier.com/hooks/catch/8821", events: "lead.created", status: "Active" },
];

export default function ApiSettings() {
  return (
    <>
      <SettingsSection
        title="API keys"
        description="Use these to integrate VenueFlow with your own systems."
        footer={<Button size="sm"><Plus className="h-4 w-4" /> Create key</Button>}
      >
        <div className="space-y-2">
          {KEYS.map((k) => (
            <div key={k.name} className="flex items-center gap-3 rounded-xl border border-line p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-cocoa">{k.name}</p>
                <p className="truncate font-mono text-xs text-cocoa-faint">{k.key}</p>
              </div>
              <span className="text-xs text-cocoa-faint">{k.created}</span>
              <button className="grid h-8 w-8 place-items-center rounded-lg text-cocoa-faint hover:bg-espresso-50 hover:text-cocoa">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Webhooks"
        description="Send real-time events to your endpoints."
        footer={<Button variant="outline" size="sm"><Webhook className="h-4 w-4" /> Add endpoint</Button>}
      >
        <div className="space-y-2">
          {HOOKS.map((h) => (
            <div key={h.url} className="flex items-center gap-3 rounded-xl border border-line p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs text-cocoa">{h.url}</p>
                <p className="text-xs text-cocoa-faint">{h.events}</p>
              </div>
              <Badge variant="success" dot>{h.status}</Badge>
            </div>
          ))}
        </div>
      </SettingsSection>
    </>
  );
}
