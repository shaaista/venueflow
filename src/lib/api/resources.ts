import { api, apiList } from "./client";

/** Build a querystring from a params object, skipping empty values. */
function qs(params: Record<string, unknown> = {}) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const dashboardApi = {
  kpis: () => api.get<Record<string, number>>("/dashboard"),
  revenueTrend: () => api.get<{ month: string; revenue: number }[]>("/dashboard/revenue-trend"),
  pipeline: () => api.get<{ stage: string; count: number; value: number }[]>("/dashboard/pipeline"),
  upcoming: () => api.get<unknown[]>("/dashboard/upcoming"),
  activity: () => api.get<unknown[]>("/dashboard/activity"),
};

export const leadsApi = {
  list: (params?: Record<string, unknown>) => apiList<Record<string, unknown>>(`/leads${qs(params)}`),
  stats: () => api.get<Record<string, unknown>>("/leads/stats"),
  get: (id: string) => api.get<Record<string, unknown>>(`/leads/${id}`),
  create: (body: unknown) => api.post("/leads", body),
  update: (id: string, body: unknown) => api.patch(`/leads/${id}`, body),
  remove: (id: string) => api.del(`/leads/${id}`),
  setStatus: (id: string, status: string) => api.patch(`/leads/${id}/status`, { status }),
  convert: (id: string) => api.post(`/leads/${id}/convert`),
};

export const customersApi = {
  list: (params?: Record<string, unknown>) => apiList<Record<string, unknown>>(`/customers${qs(params)}`),
  get: (id: string) => api.get<Record<string, unknown>>(`/customers/${id}`),
  create: (body: unknown) => api.post("/customers", body),
};

export const eventsApi = {
  list: (params?: Record<string, unknown>) => apiList<Record<string, unknown>>(`/events${qs(params)}`),
  get: (id: string) => api.get<Record<string, unknown>>(`/events/${id}`),
};

export const quotesApi = {
  list: (params?: Record<string, unknown>) => apiList<Record<string, unknown>>(`/quotes${qs(params)}`),
  get: (id: string) => api.get<Record<string, unknown>>(`/quotes/${id}`),
};

export const invoicesApi = {
  list: (params?: Record<string, unknown>) => apiList<Record<string, unknown>>(`/invoices${qs(params)}`),
  get: (id: string) => api.get<Record<string, unknown>>(`/invoices/${id}`),
};

export const tasksApi = {
  board: () => api.get<Record<string, unknown[]>>("/tasks/board"),
  list: (params?: Record<string, unknown>) => apiList<Record<string, unknown>>(`/tasks${qs(params)}`),
};

export const notificationsApi = {
  list: () => apiList<Record<string, unknown>>("/notifications"),
  unreadCount: () => api.get<{ count: number }>("/notifications/unread-count"),
  markRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post("/notifications/read-all"),
};
