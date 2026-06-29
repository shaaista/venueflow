"use client";

import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { TenantProvider } from "./tenant-provider";
import { ToastProvider } from "./toast-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <TenantProvider>
          <ToastProvider>{children}</ToastProvider>
        </TenantProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
