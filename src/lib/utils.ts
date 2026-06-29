import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  opts: { compact?: boolean; currency?: string } = {}
) {
  const { compact = false, currency = "USD" } = opts;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}

export function formatNumber(value: number, compact = false) {
  return new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(
  date: Date | string,
  style: "short" | "medium" | "long" = "medium"
) {
  const d = typeof date === "string" ? new Date(date) : date;
  const opts: Intl.DateTimeFormatOptions =
    style === "short"
      ? { month: "short", day: "numeric" }
      : style === "long"
      ? { weekday: "long", month: "long", day: "numeric", year: "numeric" }
      : { month: "short", day: "numeric", year: "numeric" };
  return new Intl.DateTimeFormat("en-US", opts).format(d);
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
