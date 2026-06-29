import type { Request } from "express";
import { prisma } from "./prisma.js";
import { logger } from "./logger.js";

type AuditInput = {
  action: string;
  organizationId?: string | null;
  actorId?: string | null;
  entity?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
  ip?: string;
};

/** Fire-and-forget audit log write. Never throws into the request path. */
export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        organizationId: input.organizationId ?? null,
        actorId: input.actorId ?? null,
        entity: input.entity,
        entityId: input.entityId,
        meta: input.meta as object,
        ip: input.ip,
      },
    });
  } catch (err) {
    logger.warn({ err: (err as Error).message, action: input.action }, "Failed to write audit log");
  }
}

/** Convenience wrapper that pulls actor/org/ip from the request context. */
export function auditFromReq(
  req: Request,
  action: string,
  extra: Partial<Omit<AuditInput, "action">> = {},
): void {
  void recordAudit({
    action,
    organizationId: req.auth?.organizationId ?? null,
    actorId: req.auth?.userId ?? null,
    ip: req.ip,
    ...extra,
  });
}
