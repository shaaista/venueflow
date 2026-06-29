"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function SettingsSection({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-line p-5">
        <h2 className="font-display text-lg text-cocoa">{title}</h2>
        {description && <p className="mt-1 text-sm text-cocoa-muted">{description}</p>}
      </div>
      <div className="space-y-5 p-5">{children}</div>
      {footer && (
        <div className="flex justify-end gap-2 border-t border-line bg-panel/40 px-5 py-3.5">
          {footer}
        </div>
      )}
    </section>
  );
}

export const settingsInput =
  "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[220px_1fr] sm:items-start">
      <div>
        <label className="text-sm font-medium text-cocoa">{label}</label>
        {hint && <p className="text-xs text-cocoa-faint">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function Toggle({
  label,
  description,
  defaultOn = false,
}: {
  label: string;
  description?: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-sm font-medium text-cocoa">{label}</p>
        {description && <p className="text-xs text-cocoa-muted">{description}</p>}
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          on ? "bg-espresso-600" : "bg-line-strong"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow-soft transition-transform",
            on ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
