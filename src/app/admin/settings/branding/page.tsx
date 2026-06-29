import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { SettingsSection, Field, settingsInput } from "@/components/admin/settings/settings-ui";

const SWATCHES = ["#4A3728", "#5E7153", "#D97706", "#0F766E", "#1E3A5F", "#7C3AED"];

export default function BrandingSettings() {
  return (
    <SettingsSection
      title="Branding"
      description="Customise how your booking pages and emails look."
      footer={<Button size="sm">Save changes</Button>}
    >
      <Field label="Logo">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-xl border border-line bg-panel">
            <BrandMark withName={false} />
          </div>
          <Button variant="outline" size="sm"><Upload className="h-4 w-4" /> Upload</Button>
        </div>
      </Field>
      <Field label="Brand colour" hint="Used for buttons and accents.">
        <div className="flex flex-wrap gap-2">
          {SWATCHES.map((c, i) => (
            <button
              key={c}
              className={`h-9 w-9 rounded-lg border-2 ${i === 0 ? "border-cocoa" : "border-transparent"}`}
              style={{ background: c }}
            />
          ))}
        </div>
      </Field>
      <Field label="Accent font">
        <select className={settingsInput} defaultValue="Literata">
          <option>Literata</option>
          <option>Playfair Display</option>
          <option>Cormorant</option>
        </select>
      </Field>
      <Field label="Custom domain" hint="Point your own domain to your booking site.">
        <input className={settingsInput} defaultValue="events.theatrium.co" />
      </Field>
    </SettingsSection>
  );
}
