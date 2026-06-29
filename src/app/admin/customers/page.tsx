"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, ChevronRight, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { customersResource } from "@/hooks/resources";
import { useCan } from "@/components/providers/tenant-provider";
import { CUSTOMER_STATUS_VARIANT } from "@/lib/mock/customers";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomersPage() {
  const { items: customers, isLoading, isError, refetch } = customersResource.useList();
  const canCreate = useCan("create");

  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const vip = customers.filter((c) => c.status === "VIP").length;
  const stats = [
    { label: "Total customers", value: String(customers.length) },
    { label: "Lifetime revenue", value: formatCurrency(totalSpent, { compact: true }) },
    { label: "VIP clients", value: String(vip) },
    { label: "Avg. per customer", value: formatCurrency(customers.length ? totalSpent / customers.length : 0, { compact: true }) },
  ];

  return (
    <div className="container-lux space-y-6 py-7">
      <PageHeader
        eyebrow="Sales"
        title="Customers"
        description="Your full client directory and relationship history."
        actions={
          canCreate && (
            <Link href="/admin/customers/new">
              <Button size="sm"><Plus className="h-4 w-4" /> Add Customer</Button>
            </Link>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="font-display text-2xl font-semibold text-cocoa tnum">{s.value}</p>
            <p className="text-xs text-cocoa-faint">{s.label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : isError ? (
        <ErrorState title="Couldn't load customers" onRetry={() => refetch()} />
      ) : customers.length === 0 ? (
        <EmptyState icon={Users} title="No customers yet" description="Customers you add or convert from leads will appear here." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-line bg-panel/50 text-left">
                  {["Customer", "Status", "Events", "Lifetime value", "Last event", "Since", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {customers.map((c) => (
                  <tr key={c.id} className="group transition-colors hover:bg-panel/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Image src={c.avatar} alt={c.name} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                        <div className="min-w-0">
                          <Link href={`/admin/customers/${c.id}`} className="block truncate font-medium text-cocoa hover:text-espresso-600">{c.name}</Link>
                          <p className="truncate text-xs text-cocoa-faint">{c.company || c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={CUSTOMER_STATUS_VARIANT[c.status]} dot>{c.status}</Badge></td>
                    <td className="px-4 py-3 text-cocoa-muted tnum">{c.events}</td>
                    <td className="px-4 py-3 font-medium text-cocoa tnum">{formatCurrency(c.totalSpent, { compact: true })}</td>
                    <td className="px-4 py-3 text-cocoa-muted">{c.lastEvent}</td>
                    <td className="px-4 py-3 text-cocoa-muted tnum">{formatDate(c.since)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/customers/${c.id}`} className="grid h-7 w-7 place-items-center rounded-md text-cocoa-faint opacity-0 transition-all hover:bg-espresso-50 hover:text-cocoa group-hover:opacity-100">
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-cocoa-faint">
            <span>{customers.length} customers in this venue</span>
          </div>
        </div>
      )}
    </div>
  );
}
