import { Button } from "@/components/ui/button";
import { SettingsSection, Field, settingsInput } from "@/components/admin/settings/settings-ui";

export default function BusinessSettings() {
  return (
    <SettingsSection
      title="Business details"
      description="Address and contact info shown on quotes and invoices."
      footer={<Button size="sm">Save changes</Button>}
    >
      <Field label="Legal name">
        <input className={settingsInput} defaultValue="Atrium Hospitality LLC" />
      </Field>
      <Field label="Email">
        <input className={settingsInput} defaultValue="events@theatrium.co" />
      </Field>
      <Field label="Phone">
        <input className={settingsInput} defaultValue="+1 (555) 120-8800" />
      </Field>
      <Field label="Address">
        <textarea
          rows={3}
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-cocoa outline-none focus:border-espresso-300"
          defaultValue={"1200 Riverside Ave\nPortland, OR 97201"}
        />
      </Field>
      <Field label="Tax ID">
        <input className={settingsInput} defaultValue="93-1820045" />
      </Field>
    </SettingsSection>
  );
}
