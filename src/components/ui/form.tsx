"use client";

import { cn } from "@/lib/utils";

export const fieldInput =
  "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300";

export function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1 text-xs font-medium text-cocoa-muted">
        {label}
        {required && <span className="text-amber-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-cocoa-faint">{hint}</p>}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldInput, props.className)} />;
}

export function SelectInput({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(fieldInput, props.className)}>
      {children}
    </select>
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn("w-full resize-none rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-cocoa outline-none transition-colors placeholder:text-cocoa-faint focus:border-espresso-300", props.className)}
    />
  );
}
