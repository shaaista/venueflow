import { Button } from "@/components/ui/button";
import { SettingsSection, Field, settingsInput } from "@/components/admin/settings/settings-ui";

export default function GeneralSettings() {
  return (
    <SettingsSection
      title="Workspace"
      description="Basic information about your venue business."
      footer={
        <>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Save changes</Button>
        </>
      }
    >
      <Field label="Business name">
        <input className={settingsInput} defaultValue="The Atrium Collection" />
      </Field>
      <Field label="Workspace URL" hint="Used for your hosted booking pages.">
        <div className="flex items-center gap-2">
          <span className="text-sm text-cocoa-faint">venueflow.app/</span>
          <input className={settingsInput} defaultValue="the-atrium" />
        </div>
      </Field>
      <Field label="Timezone">
        <select className={settingsInput} defaultValue="America/Los_Angeles">
          <option>America/Los_Angeles</option>
          <option>America/New_York</option>
          <option>Europe/London</option>
        </select>
      </Field>
      <Field label="Currency">
        <select className={settingsInput} defaultValue="USD">
          <option>USD — US Dollar</option>
          <option>GBP — British Pound</option>
          <option>EUR — Euro</option>
        </select>
      </Field>
    </SettingsSection>
  );
}
