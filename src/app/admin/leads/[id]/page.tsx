"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, MapPin, CalendarDays, Users, Tag, Globe,
  CheckCircle2, Loader2, UserCheck, CalendarPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { LeadDetailTabs } from "@/components/admin/leads/lead-detail-tabs";
import { leadsResource } from "@/hooks/resources";
import { useConvertLead, useCreateEvent } from "@/hooks/use-workflows";
import { useToast } from "@/components/providers/toast-provider";
import { useCan } from "@/components/providers/tenant-provider";
import { STAGE_VARIANT, TEMP_VARIANT, STAGES, type LeadStage } from "@/lib/mock/leads";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { data: lead, isLoading } = leadsResource.useItem(id);
  const update = leadsResource.useUpdate();
  const convert = useConvertLead();
  const createEvent = useCreateEvent();
  const canUpdate = useCan("update");
  const [converted, setConverted] = useState(false);

  if (isLoading) {
    return <div className="container-lux space-y-4 py-7"><Skeleton className="h-8 w-40" /><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;
  }
  if (!lead) {
    return (
      <div className="container-lux py-7">
        <EmptyState icon={UserCheck} title="Lead not found" description="This enquiry may have been removed." action={<Link href="/admin/leads"><Button variant="outline">Back to leads</Button></Link>} />
      </div>
    );
  }

  const facts = [
    { icon: CalendarDays, label: "Event date", value: formatDate(lead.eventDate, "long") },
    { icon: Users, label: "Guests", value: String(lead.guests) },
    { icon: MapPin, label: "Location", value: lead.location || "—" },
    { icon: Globe, label: "Source", value: lead.source },
  ];

  const onConvert = () => convert.mutate(lead, { onSuccess: () => setConverted(true) });
  const onCreateEvent = () =>
    createEvent.mutate(
      { title: lead.name, type: lead.eventType, client: lead.contactName, date: lead.eventDate, guests: lead.guests, value: lead.value },
      { onSuccess: () => router.push("/admin/events") },
    );

  return (
    <div className="container-lux space-y-5 py-7">
      <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-cocoa-muted transition-colors hover:text-cocoa">
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </Link>

      {/* Header */}
      <div className="card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Image src={lead.avatar} alt={lead.contactName} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-medium text-cocoa">{lead.name}</h1>
                <Badge variant={STAGE_VARIANT[lead.stage]}>{lead.stage}</Badge>
                <Badge variant={TEMP_VARIANT[lead.temperature]} dot>{lead.temperature}</Badge>
              </div>
              <p className="mt-0.5 text-sm text-cocoa-muted">{lead.eventType} · {lead.contactName} · {lead.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canUpdate && (
              <SelectInput
                value={lead.stage}
                onChange={(e) => update.mutate({ id: lead.id, patch: { stage: e.target.value as LeadStage } })}
                className="h-9 w-auto"
              >
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </SelectInput>
            )}
            <Button size="sm" onClick={() => toast({ kind: "info", title: "Email composer", description: "Opens in the messages module (demo)" })}>
              <Mail className="h-4 w-4" /> Send Email
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          <div className="bg-surface p-3">
            <p className="text-xs text-cocoa-faint">Estimated value</p>
            <p className="mt-0.5 font-display text-lg font-semibold text-espresso-600 tnum">{formatCurrency(lead.value)}</p>
          </div>
          {facts.slice(0, 3).map((f) => (
            <div key={f.label} className="bg-surface p-3">
              <p className="text-xs text-cocoa-faint">{f.label}</p>
              <p className="mt-0.5 truncate text-sm font-medium text-cocoa">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-5">
          <section className="card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Contact details</h2>
            <dl className="space-y-3.5 text-sm">
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-cocoa-faint" /><a href={`mailto:${lead.email}`} className="truncate text-espresso-600 hover:underline">{lead.email}</a></div>
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-cocoa-faint" /><span className="text-cocoa">{lead.phone || "—"}</span></div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4 shrink-0 text-cocoa-faint" /><span className="text-cocoa">{lead.location || "—"}</span></div>
            </dl>
          </section>

          <section className="card p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-cocoa-ghost">Lead details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><dt className="text-cocoa-faint">Owner</dt><dd className="flex items-center gap-2 text-cocoa"><Image src={lead.owner.avatar} alt={lead.owner.name} width={20} height={20} className="h-5 w-5 rounded-full object-cover" />{lead.owner.name}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-cocoa-faint">Source</dt><dd className="text-cocoa">{lead.source}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-cocoa-faint">Created</dt><dd className="text-cocoa tnum">{formatDate(lead.createdAt)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-cocoa-faint">Last activity</dt><dd className="text-cocoa">{lead.lastActivity}</dd></div>
            </dl>
            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs text-cocoa-faint"><Tag className="h-3 w-3" /> Tags</p>
              <div className="flex flex-wrap gap-1.5">{lead.tags.map((t) => <Badge key={t} variant="default">{t}</Badge>)}</div>
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="bg-espresso-50 p-5">
              <CheckCircle2 className="h-6 w-6 text-espresso-600" />
              <h3 className="mt-2 font-display text-lg text-cocoa">{converted ? "Customer created" : "Ready to confirm?"}</h3>
              <p className="mt-1 text-sm text-cocoa-muted">
                {converted ? "Now spin up the event to continue the booking." : "Convert this enquiry into a customer, then create the event."}
              </p>
              {canUpdate && !converted && (
                <Button size="sm" className="mt-4 w-full" onClick={onConvert} disabled={convert.isPending}>
                  {convert.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserCheck className="h-4 w-4" /> Convert to Customer</>}
                </Button>
              )}
              {canUpdate && converted && (
                <Button size="sm" className="mt-4 w-full" onClick={onCreateEvent} disabled={createEvent.isPending}>
                  {createEvent.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CalendarPlus className="h-4 w-4" /> Create Event</>}
                </Button>
              )}
            </div>
          </section>
        </div>

        <LeadDetailTabs />
      </div>
    </div>
  );
}
