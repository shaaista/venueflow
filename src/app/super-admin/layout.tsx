import { SuperAdminShell } from "@/components/superadmin/superadmin-shell";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminShell>{children}</SuperAdminShell>;
}
