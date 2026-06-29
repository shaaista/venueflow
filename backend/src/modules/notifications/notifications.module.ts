import { Router } from "express";
import type { NotificationType } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { sendSuccess, getPagination, paginatedMeta, asyncHandler } from "../../lib/http.js";
import { authenticate } from "../../middleware/auth.js";
import { emitToUser } from "../../realtime/socket.js";

type NotifyInput = {
  organizationId: string;
  userId: string;
  type?: NotificationType;
  title: string;
  body?: string;
  link?: string;
};

/** Create a notification and push it to the user in real time. Reusable across modules. */
export async function notify(input: NotifyInput) {
  const n = await prisma.notification.create({
    data: {
      organizationId: input.organizationId,
      userId: input.userId,
      type: input.type ?? "SYSTEM",
      title: input.title,
      body: input.body,
      link: input.link,
    },
  });
  emitToUser(input.userId, "notification", n);
  return n;
}

export const notificationsRouter: Router = Router();
notificationsRouter.use(authenticate);

notificationsRouter.get("/", asyncHandler(async (req, res) => {
  const userId = req.auth!.userId;
  const pg = getPagination(req);
  const where = { userId };
  const [items, total] = await Promise.all([
    prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip: pg.skip, take: pg.take }),
    prisma.notification.count({ where }),
  ]);
  sendSuccess(res, items, 200, paginatedMeta(total, pg));
}));

notificationsRouter.get("/unread-count", asyncHandler(async (req, res) => {
  const count = await prisma.notification.count({ where: { userId: req.auth!.userId, read: false } });
  sendSuccess(res, { count });
}));

notificationsRouter.post("/:id/read", asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({ where: { id: req.params.id, userId: req.auth!.userId }, data: { read: true } });
  sendSuccess(res, { ok: true });
}));

notificationsRouter.post("/read-all", asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({ where: { userId: req.auth!.userId, read: false }, data: { read: true } });
  sendSuccess(res, { ok: true });
}));
