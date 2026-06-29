import type { Request, Response } from "express";
import { leadsService } from "./leads.service.js";
import { getOrgId } from "../../lib/tenant.js";
import { sendSuccess, getPagination, getListQuery, paginatedMeta } from "../../lib/http.js";
import { auditFromReq } from "../../lib/audit.js";

export const leadsController = {
  async list(req: Request, res: Response) {
    const orgId = getOrgId(req);
    const pg = getPagination(req);
    const lq = getListQuery(req);
    const { items, total } = await leadsService.list(orgId, {
      status: req.query.status as never,
      temperature: req.query.temperature as string,
      assignedToId: req.query.assignedToId as string,
      search: lq.search,
      skip: pg.skip,
      take: pg.take,
      sortBy: lq.sortBy,
      sortDir: lq.sortDir,
    });
    sendSuccess(res, items, 200, paginatedMeta(total, pg));
  },

  async stats(req: Request, res: Response) {
    sendSuccess(res, await leadsService.stats(getOrgId(req)));
  },

  async get(req: Request, res: Response) {
    sendSuccess(res, await leadsService.get(getOrgId(req), req.params.id));
  },

  async create(req: Request, res: Response) {
    const lead = await leadsService.create(getOrgId(req), req.body);
    auditFromReq(req, "lead.create", { entity: "Lead", entityId: lead.id });
    sendSuccess(res, lead, 201);
  },

  async update(req: Request, res: Response) {
    const lead = await leadsService.update(getOrgId(req), req.params.id, req.body);
    auditFromReq(req, "lead.update", { entity: "Lead", entityId: lead.id });
    sendSuccess(res, lead);
  },

  async remove(req: Request, res: Response) {
    await leadsService.remove(getOrgId(req), req.params.id);
    auditFromReq(req, "lead.delete", { entity: "Lead", entityId: req.params.id });
    sendSuccess(res, { ok: true });
  },

  async updateStatus(req: Request, res: Response) {
    const lead = await leadsService.updateStatus(getOrgId(req), req.params.id, req.body.status);
    auditFromReq(req, "lead.status", { entity: "Lead", entityId: lead.id, meta: { status: req.body.status } });
    sendSuccess(res, lead);
  },

  async assign(req: Request, res: Response) {
    sendSuccess(res, await leadsService.assign(getOrgId(req), req.params.id, req.body.assignedToId));
  },

  async addNote(req: Request, res: Response) {
    sendSuccess(res, await leadsService.addNote(getOrgId(req), req.params.id, req.body.body, req.auth?.userId), 201);
  },

  async convert(req: Request, res: Response) {
    const result = await leadsService.convertToCustomer(getOrgId(req), req.params.id);
    auditFromReq(req, "lead.convert", { entity: "Lead", entityId: req.params.id });
    sendSuccess(res, result);
  },

  async bulk(req: Request, res: Response) {
    sendSuccess(res, await leadsService.bulk(getOrgId(req), req.body));
  },

  async importRows(req: Request, res: Response) {
    sendSuccess(res, await leadsService.importRows(getOrgId(req), req.body.rows), 201);
  },

  async exportCsv(req: Request, res: Response) {
    const csv = await leadsService.exportCsv(getOrgId(req));
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="leads.csv"');
    res.send(csv);
  },
};
