import { Button } from "@/components/ui/button";
import { SettingsSection, Toggle } from "@/components/admin/settings/settings-ui";

export default function NotificationsSettings() {
  return (
    <SettingsSection
      title="Notifications"
      description="Choose what you'd like to be notified about."
      footer={<Button size="sm">Save preferences</Button>}
    >
      <div className="divide-y divide-line">
        <div className="pb-3">
          <Toggle label="New enquiry received" description="Get notified the moment a new lead comes in." defaultOn />
        </div>
        <div className="py-3">
          <Toggle label="Quote accepted" description="When a client signs a proposal." defaultOn />
        </div>
        <div className="py-3">
          <Toggle label="Payment received" description="For every successful payment." defaultOn />
        </div>
        <div className="py-3">
          <Toggle label="Upcoming event reminders" description="24 hours before each event." defaultOn />
        </div>
        <div className="py-3">
          <Toggle label="Daily summary email" description="A morning digest of your day." />
        </div>
        <div className="pt-3">
          <Toggle label="Product updates" description="Occasional news about VenueFlow." />
        </div>
      </div>
    </SettingsSection>
  );
}
