import type { AutomationTrigger } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";

type ActionDef = {
  type:
    | "send_email"
    | "send_sms"
    | "send_whatsapp"
    | "create_task"
    | "update_status"
    | "assign_staff"
    | "add_tags"
    | "create_notification"
    | "create_event";
  [key: string]: unknown;
};

/**
 * Central automation dispatcher. Called by feature services when a domain
 * event occurs. Finds enabled automations for the trigger and runs their
 * actions. Best-effort — failures are logged, never thrown into the caller.
 */
export async function emitTrigger(
  organizationId: string,
  trigger: AutomationTrigger,
  context: Record<string, unknown> = {},
): Promise<void> {
  try {
    const automations = await prisma.automation.findMany({
      where: { organizationId, trigger, enabled: true },
    });
    for (const automation of automations) {
      const actions = (automation.actions as unknown as ActionDef[]) ?? [];
      for (const action of actions) {
        await runAction(organizationId, action, context).catch((err) =>
          logger.warn({ err: (err as Error).message, action: action.type }, "automation action failed"),
        );
      }
      await prisma.automation.update({ where: { id: automation.id }, data: { runCount: { increment: 1 } } });
      await prisma.automationRun.create({
        data: { automationId: automation.id, status: "success", context: context as object },
      });
    }
  } catch (err) {
    logger.warn({ err: (err as Error).message, trigger }, "emitTrigger failed");
  }
}

async function runAction(orgId: string, action: ActionDef, context: Record<string, unknown>) {
  const { enqueueEmail, enqueueSms } = await import("../../queues/index.js");
  switch (action.type) {
    case "send_email":
      await enqueueEmail({ to: String(action.to ?? ""), subject: String(action.subject ?? "Update"), html: String(action.body ?? "") });
      break;
    case "send_sms":
    case "send_whatsapp":
      await enqueueSms({ to: String(action.to ?? ""), body: String(action.body ?? "") });
      break;
    case "create_task":
      await prisma.task.create({
        data: { organizationId: orgId, title: String(action.title ?? "Follow up"), priority: "MEDIUM" },
      });
      break;
    case "create_notification":
      if (action.userId) {
        await prisma.notification.create({
          data: {
            organizationId: orgId,
            userId: String(action.userId),
            type: "SYSTEM",
            title: String(action.title ?? "Automation"),
            body: String(action.body ?? ""),
          },
        });
      }
      break;
    default:
      logger.debug({ type: action.type, context }, "automation action noop");
  }
}
