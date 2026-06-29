"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  value,
  onChange,
  className,
  size = "md",
}: {
  tabs: { label: string; value: string; count?: number }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-line", className)}>
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "relative font-medium transition-colors",
            size === "sm" ? "px-3 py-2.5 text-sm" : "px-3.5 py-3 text-sm",
            value === t.value
              ? "text-cocoa"
              : "text-cocoa-faint hover:text-cocoa-muted"
          )}
        >
          <span className="flex items-center gap-1.5">
            {t.label}
            {t.count != null && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  value === t.value
                    ? "bg-espresso-100 text-espresso-700"
                    : "bg-panel text-cocoa-faint"
                )}
              >
                {t.count}
              </span>
            )}
          </span>
          {value === t.value && (
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-espresso-600" />
          )}
        </button>
      ))}
    </div>
  );
}

export function useTabs(initial: string) {
  return useState(initial);
}
