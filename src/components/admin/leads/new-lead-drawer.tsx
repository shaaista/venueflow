"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Drawer } from "@/components/ui/modal";
import { Field, TextInput, SelectInput, TextArea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreateLead } from "@/hooks/use-workflows";
import { EVENT_TYPES } from "@/lib/mock/venue";

const SOURCES = ["Website Form", "Referral", "Instagram", "Phone", "Wedding Fair", "Walk-in"];

const empty = { contactName: "", email: "", phone: "", eventType: "", eventDate: "", guests: "", value: "", source: "Website Form", notes: "" };

export function NewLeadDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateLead();
  const [form, setForm] = useState(empty);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contactName || !form.email) return;
    create.mutate(
      {
        contactName: form.contactName,
        email: form.email,
        phone: form.phone || undefined,
        eventType: form.eventType || undefined,
        eventDate: form.eventDate || undefined,
        guests: form.guests ? Number(form.guests) : undefined,
        value: form.value ? Number(form.value) : undefined,
        source: form.source,
        notes: form.notes || undefined,
      },
      {
        onSuccess: () => {
          setForm(empty);
          onClose();
        },
      },
    );
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="New Enquiry"
      description="Capture a new lead — it lands in your pipeline instantly."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={submit} disabled={create.isPending}>
            {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create enquiry"}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contact name" required><TextInput value={form.contactName} onChange={set("contactName")} placeholder="Eleanor Vance" /></Field>
          <Field label="Email" required><TextInput type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" /></Field>
          <Field label="Phone"><TextInput value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" /></Field>
          <Field label="Event type">
            <SelectInput value={form.eventType} onChange={set("eventType")}>
              <option value="">Select…</option>
              {EVENT_TYPES.map((e) => <option key={e.slug}>{e.name}</option>)}
            </SelectInput>
          </Field>
          <Field label="Preferred date"><TextInput type="date" value={form.eventDate} onChange={set("eventDate")} /></Field>
          <Field label="Guests"><TextInput type="number" value={form.guests} onChange={set("guests")} placeholder="120" /></Field>
          <Field label="Estimated value"><TextInput type="number" value={form.value} onChange={set("value")} placeholder="20000" /></Field>
          <Field label="Source">
            <SelectInput value={form.source} onChange={set("source")}>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </SelectInput>
          </Field>
        </div>
        <Field label="Notes"><TextArea rows={3} value={form.notes} onChange={set("notes")} placeholder="Any context or special requests…" /></Field>
      </form>
    </Drawer>
  );
}
