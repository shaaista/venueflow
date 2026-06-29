"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ArrowRight, ArrowLeft, Sparkles, Loader2, Building2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/form";
import { useTenant } from "@/components/providers/tenant-provider";
import { useToast } from "@/components/providers/toast-provider";
import { INDUSTRY_TEMPLATES, type Industry } from "@/lib/demo/templates";
import { createTenant } from "@/lib/demo/tenant-store";
import { cn } from "@/lib/utils";

const SWATCHES = ["#4A3728", "#B5552E", "#4F6F52", "#2C6E63", "#7C3AED", "#1E3A5F", "#9C6B70", "#3A6EA5"];
const STEPS = ["Venue", "Industry", "Branding", "Review"];

export function OnboardingWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const qc = useQueryClient();
  const { switchTenant } = useTenant();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState<Industry>("Hotel");
  const [color, setColor] = useState("#4A3728");
  const [team, setTeam] = useState("");
  const [creating, setCreating] = useState(false);

  const tpl = INDUSTRY_TEMPLATES[industry];
  const reset = () => { setStep(0); setName(""); setIndustry("Hotel"); setColor("#4A3728"); setTeam(""); };

  const create = async () => {
    setCreating(true);
    const tenant = createTenant({ name: name || "New Venue", industry, brandColor: color });
    switchTenant(tenant.id);
    await qc.invalidateQueries();
    setCreating(false);
    toast({ kind: "success", title: "Venue created 🎉", description: `${tenant.name} is ready with sample data` });
    onClose();
    reset();
    router.push("/admin/dashboard");
  };

  const canNext = step === 0 ? name.trim().length > 0 : true;

  return (
    <Modal open={open} onClose={onClose} title="Create a venue" description="Spin up a fully-branded venue with sample data in seconds." size="lg"
      footer={
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-cocoa-faint">Step {step + 1} of {STEPS.length} · {STEPS[step]}</span>
          <div className="flex gap-2">
            {step > 0 && <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}><ArrowLeft className="h-4 w-4" /> Back</Button>}
            {step < STEPS.length - 1 ? (
              <Button size="sm" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>Continue <ArrowRight className="h-4 w-4" /></Button>
            ) : (
              <Button size="sm" onClick={create} disabled={creating}>{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4" /> Create venue</>}</Button>
            )}
          </div>
        </div>
      }
    >
      {step === 0 && (
        <div className="space-y-4">
          <Field label="Venue name" required><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. The Grand Pavilion" autoFocus /></Field>
          <p className="text-sm text-cocoa-muted">Give your venue a name. You can change it anytime in settings.</p>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="mb-4 text-sm text-cocoa-muted">Pick an industry template — we&apos;ll pre-fill event types, packages, forms, and automations.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(INDUSTRY_TEMPLATES) as Industry[]).map((key) => {
              const t = INDUSTRY_TEMPLATES[key];
              const active = industry === key;
              return (
                <button key={key} onClick={() => { setIndustry(key); setColor(t.brandColor); }}
                  className={cn("rounded-xl border p-4 text-left transition-all", active ? "border-espresso-400 bg-espresso-50" : "border-line bg-surface hover:border-line-strong")}>
                  <div className="flex items-center justify-between">
                    <span className="grid h-8 w-8 place-items-center rounded-lg text-cream" style={{ background: t.brandColor }}><Building2 className="h-4 w-4" /></span>
                    {active && <Check className="h-4 w-4 text-espresso-600" />}
                  </div>
                  <p className="mt-2.5 text-sm font-medium text-cocoa">{t.label}</p>
                  <p className="text-xs text-cocoa-faint">{t.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-medium text-cocoa-muted">Brand colour</p>
            <div className="flex flex-wrap gap-2">
              {SWATCHES.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={cn("h-9 w-9 rounded-lg border-2", color === c ? "border-cocoa" : "border-transparent")} style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-panel/50 p-5">
            <p className="mb-3 text-xs font-medium text-cocoa-faint">Preview</p>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg font-semibold text-cream" style={{ background: color }}>{(name || "New Venue").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}</span>
              <div><p className="font-display text-lg text-cocoa">{name || "New Venue"}</p><p className="text-xs text-cocoa-faint">{tpl.label}</p></div>
            </div>
            <button className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium text-cream" style={{ background: color }}>New Enquiry</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-line p-4">
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-cocoa-faint">Venue</dt><dd className="font-medium text-cocoa">{name || "New Venue"}</dd></div>
              <div className="flex justify-between"><dt className="text-cocoa-faint">Industry</dt><dd className="text-cocoa">{tpl.label}</dd></div>
              <div className="flex justify-between"><dt className="text-cocoa-faint">Event types</dt><dd className="text-cocoa">{tpl.eventTypes.length}</dd></div>
              <div className="flex justify-between"><dt className="text-cocoa-faint">Packages</dt><dd className="text-cocoa">{tpl.packages.length}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-cocoa-faint">Brand</dt><dd><span className="inline-block h-4 w-4 rounded" style={{ background: color }} /></dd></div>
            </dl>
          </div>
          <Field label="Invite team (optional)" hint="Comma-separated emails — cosmetic in demo mode."><TextInput value={team} onChange={(e) => setTeam(e.target.value)} placeholder="mara@venue.com, theo@venue.com" /></Field>
          <p className="text-sm text-cocoa-muted">We&apos;ll generate sample customers, leads, events, quotes, and invoices so it feels live immediately.</p>
        </div>
      )}
    </Modal>
  );
}
