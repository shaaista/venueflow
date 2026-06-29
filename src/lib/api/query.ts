"use client";

import { useQuery, keepPreviousData, type UseQueryOptions } from "@tanstack/react-query";
import { API_ENABLED } from "./config";

export type PageMeta = { total: number; page: number; pageSize: number; totalPages: number };

/**
 * Live-or-mock list query. When the API is disabled (demo mode) it resolves the
 * provided `mock` immediately; otherwise it fetches and maps the API rows.
 * Returns React Query state plus convenience `items` / `meta`.
 */
export function useApiList<TApi, TUi>(opts: {
  key: readonly unknown[];
  fetcher: () => Promise<{ data: TApi[]; meta?: PageMeta }>;
  map: (row: TApi) => TUi;
  mock: TUi[];
  enabled?: boolean;
}) {
  const query = useQuery({
    queryKey: opts.key,
    enabled: opts.enabled ?? true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      if (!API_ENABLED) return { items: opts.mock, meta: undefined as PageMeta | undefined };
      const res = await opts.fetcher();
      return { items: res.data.map(opts.map), meta: res.meta };
    },
  });
  return {
    items: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}

/** Live-or-mock single-object query. */
export function useApiObject<TApi, TUi>(opts: {
  key: readonly unknown[];
  fetcher: () => Promise<TApi>;
  map: (row: TApi) => TUi;
  mock: TUi;
  enabled?: boolean;
}) {
  const query = useQuery<TUi>({
    queryKey: opts.key,
    enabled: opts.enabled ?? true,
    queryFn: async () => {
      if (!API_ENABLED) return opts.mock;
      return opts.map(await opts.fetcher());
    },
  } as UseQueryOptions<TUi>);
  return { data: query.data, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}
