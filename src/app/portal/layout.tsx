import { PortalNav } from "@/components/portal/portal-nav";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <PortalNav />
      <main className="container-lux py-8">{children}</main>
    </div>
  );
}
