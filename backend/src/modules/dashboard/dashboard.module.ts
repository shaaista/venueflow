import { Router } from "express";
import dayjs from "dayjs";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { sendSuccess, asyncHandler } from "../../lib/http.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";

async function monthlyRevenue(orgId: string, months = 12) {
  const series: { month: string; revenue: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const start = dayjs().subtract(i, "month").startOf("month").toDate();
    const end = dayjs().subtract(i, "month").endOf("month").toDate();
    const agg = await prisma.payment.aggregate({
      where: { ...tenantWhere(orgId), status: "SUCCEEDED", paidAt: { gte: start, lte: end } },
      _sum: { amount: true },
    });
    series.push({ month: dayjs(start).format("MMM"), revenue: Number(agg._sum.amount ?? 0) });
  }
  return series;
}

export const dashboardService = {
  async kpis(orgId: string) {
    const monthStart = dayjs().startOf("month").toDate();
    const [revenue, newLeads, bookings, openLeads, pendingTasks, upcoming] = await Promise.all([
      prisma.payment.aggregate({ where: { ...tenantWhere(orgId), status: "SUCCEEDED", paidAt: { gte: monthStart } }, _sum: { amount: true } }),
      prisma.lead.count({ where: { ...tenantWhere(orgId), createdAt: { gte: monthStart } } }),
      prisma.event.count({ where: { ...tenantWhere(orgId), status: "CONFIRMED" } }),
      prisma.lead.count({ where: { ...tenantWhere(orgId), status: { notIn: ["COMPLETED", "LOST"] } } }),
      prisma.task.count({ where: { ...tenantWhere(orgId), status: { not: "DONE" } } }),
      prisma.event.count({ where: { ...tenantWhere(orgId), date: { gte: new Date() } } }),
    ]);
    const wonLeads = await prisma.lead.count({ where: { ...tenantWhere(orgId), status: { in: ["CONFIRMED", "COMPLETED"] } } });
    const totalLeads = await prisma.lead.count({ where: tenantWhere(orgId) });
    return {
      revenueMtd: Number(revenue._sum.amount ?? 0),
      newLeads,
      confirmedBookings: bookings,
      openPipeline: openLeads,
      pendingTasks,
      upcomingEvents: upcoming,
      conversionRate: totalLeads ? Math.round((wonLeads / totalLeads) * 1000) / 10 : 0,
    };
  },
  revenueTrend: (orgId: string) => monthlyRevenue(orgId),
  async pipeline(orgId: string) {
    const grouped = await prisma.lead.groupBy({ by: ["status"], where: tenantWhere(orgId), _count: true, _sum: { value: true } });
    return grouped.map((g) => ({ stage: g.status, count: g._count, value: Number(g._sum.value ?? 0) }));
  },
  async leadsBySource(orgId: string) {
    const grouped = await prisma.lead.groupBy({ by: ["source"], where: tenantWhere(orgId), _count: true });
    return grouped.map((g) => ({ source: g.source ?? "Unknown", leads: g._count }));
  },
  upcoming: (orgId: string) =>
    prisma.event.findMany({ where: { ...tenantWhere(orgId), date: { gte: new Date() } }, include: { space: { select: { name: true } }, customer: { select: { name: true } } }, orderBy: { date: "asc" }, take: 6 }),
  activity: (orgId: string) =>
    prisma.auditLog.findMany({ where: { organizationId: orgId }, include: { actor: { select: { name: true, avatarUrl: true } } }, orderBy: { createdAt: "desc" }, take: 12 }),
};

export const dashboardRouter: Router = Router();
dashboardRouter.use(authenticate, requireOrg);

dashboardRouter.get("/", asyncHandler(async (req, res) => sendSuccess(res, await dashboardService.kpis(getOrgId(req)))));
dashboardRouter.get("/revenue-trend", asyncHandler(async (req, res) => sendSuccess(res, await dashboardService.revenueTrend(getOrgId(req)))));
dashboardRouter.get("/pipeline", asyncHandler(async (req, res) => sendSuccess(res, await dashboardService.pipeline(getOrgId(req)))));
dashboardRouter.get("/leads-by-source", asyncHandler(async (req, res) => sendSuccess(res, await dashboardService.leadsBySource(getOrgId(req)))));
dashboardRouter.get("/upcoming", asyncHandler(async (req, res) => sendSuccess(res, await dashboardService.upcoming(getOrgId(req)))));
dashboardRouter.get("/activity", asyncHandler(async (req, res) => sendSuccess(res, await dashboardService.activity(getOrgId(req)))));
