import { API_BASE } from "./config";
import { tokenStore } from "./token";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type Options = Omit<RequestInit, "body"> & { body?: unknown; auth?: boolean };

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, { method: "POST", credentials: "include" });
        if (!res.ok) return false;
        const json = await res.json();
        if (json?.data?.accessToken) {
          tokenStore.set(json.data.accessToken);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setTimeout(() => (refreshPromise = null), 0);
      }
    })();
  }
  return refreshPromise;
}

async function raw<T>(path: string, opts: Options, retry = true): Promise<T> {
  const { body, auth = true, headers, ...rest } = opts;
  const token = auth ? tokenStore.get() : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && retry) {
    const ok = await refreshAccessToken();
    if (ok) return raw<T>(path, opts, false);
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = json?.error ?? {};
    throw new ApiError(res.status, err.code ?? "ERROR", err.message ?? res.statusText, err.details);
  }
  return (json?.data ?? json) as T;
}

/** Typed REST helpers returning the unwrapped `data` payload. */
export const api = {
  get: <T>(path: string, opts: Options = {}) => raw<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts: Options = {}) => raw<T>(path, { ...opts, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, opts: Options = {}) => raw<T>(path, { ...opts, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, opts: Options = {}) => raw<T>(path, { ...opts, method: "PUT", body }),
  del: <T>(path: string, opts: Options = {}) => raw<T>(path, { ...opts, method: "DELETE" }),
};

/** Like `api` but returns the full envelope including pagination `meta`. */
export async function apiList<T>(path: string): Promise<{ data: T[]; meta?: { total: number; page: number; pageSize: number; totalPages: number } }> {
  const token = tokenStore.get();
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (res.status === 401) {
    const ok = await refreshAccessToken();
    if (ok) return apiList<T>(path);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json?.error?.code ?? "ERROR", json?.error?.message ?? res.statusText);
  return { data: json.data ?? [], meta: json.meta };
}
