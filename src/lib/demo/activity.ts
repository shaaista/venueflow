import { demoStore } from "./store";
import type { DemoActivity, DemoNotification } from "./types";

/**
 * The demo "activity engine". A single action can record an activity-feed item,
 * push a notification, and (implicitly) update the dashboard — the same event a
 * real backend would fan out. Returns immediately; callers invalidate queries.
 */
export async function logEvent(
  organizationId: string,
  opts: {
    kind: DemoActivity["kind"];
    title: string;
    detail?: string;
    actor?: string;
    entityType?: string;
    entityId?: string;
    notify?: { type: DemoNotification["type"]; title: string; body?: string };
  },
) {
  await demoStore.create("activities", {
    id: "",
    organizationId,
    kind: opts.kind,
    title: opts.title,
    detail: opts.detail,
    actor: opts.actor ?? "Alex Rivera",
    time: "just now",
    createdAt: new Date().toISOString(),
    entityType: opts.entityType,
    entityId: opts.entityId,
  });

  if (opts.notify) {
    await demoStore.create("notifications", {
      id: "",
      organizationId,
      type: opts.notify.type,
      title: opts.notify.title,
      body: opts.notify.body ?? "",
      time: "just now",
      read: false,
    });
  }
}
