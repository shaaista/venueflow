"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "@/lib/api/auth";
import { tokenStore } from "@/lib/api/token";
import { API_ENABLED } from "@/lib/api/config";
import type { ApiUser, ApiOrg, LoginResult } from "@/lib/api/types";

// Demo session used when the backend/database isn't connected (API disabled).
const DEMO_USER: ApiUser = {
  id: "demo-user",
  email: "alex@theatrium.co",
  name: "Alex Rivera",
  avatarUrl: "https://i.pravatar.cc/120?img=15",
  isSuperAdmin: false,
  emailVerified: true,
  twoFactorEnabled: false,
};
const DEMO_ORGS: ApiOrg[] = [
  { id: "demo-org", name: "The Atrium Collection", slug: "the-atrium-collection", logoUrl: null, brandColor: "#4A3728", role: "OWNER" },
];

type AuthState = {
  user: ApiUser | null;
  organizations: ApiOrg[];
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string, code?: string) => Promise<LoginResult>;
  register: (name: string, email: string, password: string, organizationName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [organizations, setOrganizations] = useState<ApiOrg[]>([]);
  const [status, setStatus] = useState<AuthState["status"]>("loading");

  const loadMe = useCallback(async () => {
    // Demo mode — no backend. Treat a stored marker as a signed-in demo session.
    if (!API_ENABLED) {
      if (tokenStore.get()) {
        setUser(DEMO_USER);
        setOrganizations(DEMO_ORGS);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
      return;
    }
    if (!tokenStore.get()) {
      setStatus("unauthenticated");
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me.user);
      setOrganizations(me.organizations);
      setStatus("authenticated");
    } catch {
      tokenStore.clear();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  const login = useCallback(
    async (email: string, password: string, code?: string): Promise<LoginResult> => {
      if (!API_ENABLED) {
        tokenStore.set("demo");
        setUser({ ...DEMO_USER, email });
        setOrganizations(DEMO_ORGS);
        setStatus("authenticated");
        return { user: { ...DEMO_USER, email }, accessToken: "demo", refreshToken: "demo" };
      }
      const result = await authApi.login(email, password, code);
      if ("accessToken" in result) await loadMe();
      return result;
    },
    [loadMe],
  );

  const register = useCallback(
    async (name: string, email: string, password: string, organizationName?: string) => {
      if (!API_ENABLED) {
        tokenStore.set("demo");
        setUser({ ...DEMO_USER, name, email });
        setOrganizations(organizationName ? [{ ...DEMO_ORGS[0], name: organizationName }] : DEMO_ORGS);
        setStatus("authenticated");
        return;
      }
      await authApi.register(name, email, password, organizationName);
      await loadMe();
    },
    [loadMe],
  );

  const logout = useCallback(async () => {
    if (API_ENABLED) await authApi.logout();
    else tokenStore.clear();
    setUser(null);
    setOrganizations([]);
    setStatus("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ user, organizations, status, login, register, logout, refresh: loadMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
