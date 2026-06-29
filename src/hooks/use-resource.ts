"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { demoStore } from "@/lib/demo/store";
import { useTenant } from "@/components/providers/tenant-provider";
import type { Collections } from "@/lib/demo/types";

/**
 * Builds a set of React Query hooks for a tenant-scoped resource backed by the
 * local demo store. The store call is the single seam to swap for a real API
 * client later (keyed off NEXT_PUBLIC_API_ENABLED) — the components don't change.
 */
export function createResource<K extends keyof Collections>(key: K) {
  type Item = Collections[K][number];

  function useList() {
    const { orgId } = useTenant();
    const q = useQuery({
      queryKey: [key, orgId],
      queryFn: () => demoStore.list(key, orgId),
    });
    return {
      items: (q.data ?? []) as Item[],
      isLoading: q.isLoading,
      isError: q.isError,
      isFetching: q.isFetching,
      refetch: q.refetch,
    };
  }

  function useItem(id: string | undefined) {
    const { orgId } = useTenant();
    const q = useQuery({
      queryKey: [key, orgId, id],
      enabled: Boolean(id),
      queryFn: () => demoStore.get(key, orgId, id as string),
    });
    return { data: (q.data ?? undefined) as Item | undefined, isLoading: q.isLoading, isError: q.isError, refetch: q.refetch };
  }

  function useCreate() {
    const { orgId } = useTenant();
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (data: Partial<Item>) => demoStore.create(key, { ...(data as Item), organizationId: orgId }),
      onSuccess: () => void qc.invalidateQueries({ queryKey: [key, orgId] }),
    });
  }

  function useUpdate() {
    const { orgId } = useTenant();
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<Item> }) => demoStore.update(key, id, patch),
      onMutate: async ({ id, patch }) => {
        await qc.cancelQueries({ queryKey: [key, orgId] });
        const prev = qc.getQueryData<Item[]>([key, orgId]);
        if (prev) {
          qc.setQueryData<Item[]>(
            [key, orgId],
            prev.map((x) => ((x as { id: string }).id === id ? { ...x, ...patch } : x)),
          );
        }
        return { prev };
      },
      onError: (_e, _v, ctx) => {
        if (ctx?.prev) qc.setQueryData([key, orgId], ctx.prev);
      },
      onSettled: () => void qc.invalidateQueries({ queryKey: [key, orgId] }),
    });
  }

  function useRemove() {
    const { orgId } = useTenant();
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => demoStore.remove(key, id),
      onMutate: async (id) => {
        await qc.cancelQueries({ queryKey: [key, orgId] });
        const prev = qc.getQueryData<Item[]>([key, orgId]);
        if (prev) qc.setQueryData<Item[]>([key, orgId], prev.filter((x) => (x as { id: string }).id !== id));
        return { prev };
      },
      onError: (_e, _v, ctx) => {
        if (ctx?.prev) qc.setQueryData([key, orgId], ctx.prev);
      },
      onSettled: () => void qc.invalidateQueries({ queryKey: [key, orgId] }),
    });
  }

  return { useList, useItem, useCreate, useUpdate, useRemove };
}
