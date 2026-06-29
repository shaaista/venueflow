"use client";

import { leadsResource, eventsResource, paymentsResource, activitiesResource } from "./resources";
import { STAGES } from "@/lib/mock/leads";

const DEMO_NOW = new Date(2026, 5, 29);

function monthKey(d: Date) {
  return d.toLocaleString("en-US", { month: "short" });
}

/** Aggregates the current tenant's store data into everything the dashboard renders. */
export function useDashboard() {
  const leads = leadsResource.useList();
  const events = eventsResource.useList();
  const payments = paymentsResource.useList();
  const activities = activitiesResource.useList();

  const isLoading = leads.isLoading || events.isLoading || payments.isLoading;

  const L = leads.items;
  const E = events.items;
  const P = payments.items;

  // ── Monthly revenue trend (last 8 months) ──
  // Distribute the tenant's total collected revenue across months on a gently
  // rising curve so the chart reads like a real, growing business.
  const totalCollected = E.reduce((s, e) => s + e.paid, 0) + P.filter((p) => p.status === "Succeeded").reduce((s, p) => s + p.amount, 0);
  const weights = [0.72, 0.8, 0.78, 0.9, 0.98, 1.08, 1.15, 1.22];
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const months: { month: string; revenue: number; target: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(DEMO_NOW.getFullYear(), DEMO_NOW.getMonth() - i, 1);
    const w = weights[7 - i];
    const revenue = Math.round(((totalCollected * w) / weightSum / 8) / 1000);
    months.push({ month: monthKey(d), revenue, target: Math.round(revenue * 1.08) });
  }

  // ── KPIs ──
  const monthStart = new Date(DEMO_NOW.getFullYear(), DEMO_NOW.getMonth(), 1);
  const revenueMtd = P.filter((p) => p.status === "Succeeded" && new Date(p.date) >= monthStart).reduce((s, p) => s + p.amount, 0);
  const newLeads = L.filter((l) => new Date(l.createdAt) >= monthStart).length;
  const confirmed = E.filter((e) => e.status === "Confirmed").length;
  const won = L.filter((l) => l.stage === "Won").length;
  const conversion = L.length ? Math.round((won / L.length) * 1000) / 10 : 0;
  const contracted = E.reduce((s, e) => s + e.value, 0);

  const spark = (vals: number[]) => (vals.length ? vals : [1, 2, 3, 4, 5, 6]);
  const monthlyRev = months.map((m) => m.revenue);

  const kpis = [
    { key: "revenue", label: "Revenue (MTD)", value: revenueMtd, format: "currency", delta: 12.4, trend: "up", spark: spark(monthlyRev), foot: `${P.filter((p) => p.status === "Succeeded").length} payments collected` },
    { key: "leads", label: "New Enquiries", value: newLeads, format: "number", delta: 8, trend: "up", spark: spark(monthlyRev.map((v) => Math.max(1, Math.round(v / 10)))), foot: `${L.filter((l) => l.stage === "New").length} awaiting first reply` },
    { key: "bookings", label: "Confirmed Bookings", value: confirmed, format: "number", delta: 5, trend: "up", spark: spark([2, 3, 4, 3, 5, 4, 6, confirmed]), foot: `${(contracted / 1000).toFixed(0)}k contracted value` },
    { key: "conversion", label: "Conversion Rate", value: conversion, format: "percent", delta: -2.1, trend: "down", spark: spark([28, 27, 26, 27, 25, 24, conversion]), foot: "Enquiry → booking" },
  ];

  // ── Pipeline (leads by stage) ──
  const STAGE_COLOR: Record<string, string> = { New: "amber", Contacted: "espresso", Proposal: "sage", Negotiation: "amber", Won: "sage", Lost: "espresso" };
  const pipeline = STAGES.filter((s) => s !== "Lost").map((stage) => {
    const items = L.filter((l) => l.stage === stage);
    return { stage, count: items.length, value: items.reduce((s, l) => s + l.value, 0), color: STAGE_COLOR[stage] };
  });

  // ── Recent enquiries + upcoming events ──
  const recentLeads = [...L].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const upcoming = E.filter((e) => new Date(e.date) >= DEMO_NOW).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);

  // ── Activity feed (from the activity engine) ──
  const activity = [...activities.items]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 6);

  return { isLoading, kpis, revenueSeries: months, pipeline, recentLeads, upcoming, activity, refetch: () => { void leads.refetch(); void events.refetch(); void payments.refetch(); } };
}
