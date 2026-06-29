import { api } from "./client";
import { tokenStore } from "./token";
import type { LoginResult, MeResult } from "./types";

export const authApi = {
  async login(email: string, password: string, code?: string): Promise<LoginResult> {
    const result = await api.post<LoginResult>("/auth/login", { email, password, code }, { auth: false });
    if ("accessToken" in result) tokenStore.set(result.accessToken);
    return result;
  },

  async register(name: string, email: string, password: string, organizationName?: string) {
    const result = await api.post<{ accessToken: string }>(
      "/auth/register",
      { name, email, password, organizationName },
      { auth: false },
    );
    if (result.accessToken) tokenStore.set(result.accessToken);
    return result;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      tokenStore.clear();
    }
  },

  me: () => api.get<MeResult>("/auth/me"),
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }, { auth: false }),
  resetPassword: (token: string, password: string) => api.post("/auth/reset-password", { token, password }, { auth: false }),
  verifyEmail: (token: string) => api.post("/auth/verify-email", { token }, { auth: false }),
  start2FA: () => api.post<{ qrDataUrl: string; secret: string }>("/auth/2fa/start"),
  confirm2FA: (code: string) => api.post("/auth/2fa/confirm", { code }),
};
