import { Button } from "@/components/ui/button";
import { SettingsSection, Field, settingsInput, Toggle } from "@/components/admin/settings/settings-ui";

export default function SystemSettingsPage() {
  return (
    <div className="container-lux max-w-3xl space-y-6 py-7">
      <div>
        <p className="label-eyebrow mb-2 text-amber-500">Platform</p>
        <h1 className="font-display text-2xl font-medium tracking-tight text-cocoa">System Settings</h1>
        <p className="mt-1 text-sm text-cocoa-muted">Global configuration for the VenueFlow platform.</p>
      </div>

      <SettingsSection title="Platform" description="Core platform configuration." footer={<Button size="sm">Save</Button>}>
        <Field label="Platform name"><input className={settingsInput} defaultValue="VenueFlow" /></Field>
        <Field label="Support email"><input className={settingsInput} defaultValue="support@venueflow.app" /></Field>
        <Field label="Default trial length"><select className={settingsInput} defaultValue="14"><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select></Field>
      </SettingsSection>

      <SettingsSection title="Operations" description="Platform-wide switches.">
        <Toggle label="New tenant signups" description="Allow new businesses to register." defaultOn />
        <Toggle label="Maintenance mode" description="Show a maintenance banner to all tenants." />
        <Toggle label="Require 2FA for owners" description="Enforce two-factor for all tenant owners." defaultOn />
        <Toggle label="Usage-based overage billing" description="Charge for usage beyond plan limits." defaultOn />
      </SettingsSection>
    </div>
  );
}
