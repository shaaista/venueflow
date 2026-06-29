import type { Request, Response, NextFunction, RequestHandler } from "express";

/** Wraps an async route handler so thrown errors reach the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export function sendSuccess(res: Response, data: unknown, status = 200, meta?: unknown) {
  return res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });
}

export type PageParams = { skip: number; take: number; page: number; pageSize: number };

/** Parse `?page=&pageSize=` query params with sane bounds. */
export function getPagination(req: Request, defaultSize = 20, maxSize = 100): PageParams {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(maxSize, Math.max(1, Number(req.query.pageSize) || defaultSize));
  return { skip: (page - 1) * pageSize, take: pageSize, page, pageSize };
}

export function paginatedMeta(total: number, p: PageParams) {
  return { total, page: p.page, pageSize: p.pageSize, totalPages: Math.ceil(total / p.pageSize) };
}

/** Build common list query helpers (search term + sort) from the request. */
export function getListQuery(req: Request) {
  const search = (req.query.search as string)?.trim() || undefined;
  const sortBy = (req.query.sortBy as string) || "createdAt";
  const sortDir = (req.query.sortDir as string) === "asc" ? "asc" : "desc";
  return { search, sortBy, sortDir: sortDir as "asc" | "desc" };
}
