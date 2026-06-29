import { Button } from "@/components/ui/button";
import { SettingsSection, Field, settingsInput, Toggle } from "@/components/admin/settings/settings-ui";

export default function SecuritySettings() {
  return (
    <>
      <SettingsSection
        title="Password"
        description="Update the password for your account."
        footer={<Button size="sm">Update password</Button>}
      >
        <Field label="Current password">
          <input type="password" className={settingsInput} defaultValue="••••••••••" />
        </Field>
        <Field label="New password">
          <input type="password" className={settingsInput} placeholder="Enter new password" />
        </Field>
        <Field label="Confirm password">
          <input type="password" className={settingsInput} placeholder="Re-enter new password" />
        </Field>
      </SettingsSection>

      <SettingsSection title="Two-factor authentication" description="Add an extra layer of security to your account.">
        <Toggle label="Authenticator app" description="Use an app like 1Password or Authy." defaultOn />
        <Toggle label="SMS backup codes" description="Receive a code by text as a fallback." />
        <Toggle label="Require 2FA for all team members" description="Enforce 2FA across your workspace." />
      </SettingsSection>
    </>
  );
}
