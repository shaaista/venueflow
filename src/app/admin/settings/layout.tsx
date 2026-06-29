import { PageHeader } from "@/components/admin/page-header";
import { SettingsNav } from "@/components/admin/settings/settings-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Manage"
        title="Settings"
        description="Configure your workspace, brand, and preferences."
      />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <SettingsNav />
        </aside>
        <div className="min-w-0 space-y-5">{children}</div>
      </div>
    </div>
  );
}
