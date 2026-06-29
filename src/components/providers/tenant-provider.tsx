"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Tenant } from "@/lib/demo/tenants";
import { getAllTenants, findTenant, subscribeTenants } from "@/lib/demo/tenant-store";
import { can, type Permission } from "@/lib/demo/permissions";

const STORAGE_KEY = "vf_current_org";

type TenantState = {
  tenant: Tenant;
  tenants: Tenant[];
  orgId: string;
  switchTenant: (id: string) => void;
  can: (permission: Permission) => boolean;
};

const TenantContext = createContext<TenantState | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const [tenants, setTenants] = useState<Tenant[]>(getAllTenants());
  const [orgId, setOrgId] = useState<string>(tenants[0].id);

  // Restore the last-selected tenant + subscribe to tenant-list changes.
  useEffect(() => {
    setTenants(getAllTenants());
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved && getAllTenants().some((t) => t.id === saved)) setOrgId(saved);
    return subscribeTenants(() => setTenants(getAllTenants()));
  }, []);

  const tenant = findTenant(orgId);

  // Apply per-tenant brand colour as a CSS variable.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--brand-color", tenant.brandColor);
    }
  }, [tenant.brandColor]);

  const switchTenant = useCallback(
    (id: string) => {
      setOrgId(id);
      if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, id);
      // Invalidate all tenant-scoped queries so data reloads for the new org.
      void qc.invalidateQueries();
    },
    [qc],
  );

  return (
    <TenantContext.Provider value={{ tenant, tenants, orgId, switchTenant, can: (p) => can(tenant.role, p) }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}

/** Convenience permission hook scoped to the current tenant. */
export function useCan(permission: Permission) {
  return useTenant().can(permission);
}
