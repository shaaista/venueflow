import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes.js";
import { leadsRouter } from "../modules/leads/leads.routes.js";
import { customersRouter } from "../modules/customers/customers.module.js";
import { eventsRouter } from "../modules/events/events.module.js";
import { venuesRouter } from "../modules/venues/venues.module.js";
import { bookingsRouter } from "../modules/bookings/bookings.module.js";
import { quotesRouter } from "../modules/quotes/quotes.module.js";
import { invoicesRouter } from "../modules/invoices/invoices.module.js";
import { paymentsRouter } from "../modules/payments/payments.module.js";
import { tasksRouter } from "../modules/tasks/tasks.module.js";
import { dashboardRouter } from "../modules/dashboard/dashboard.module.js";
import { notificationsRouter } from "../modules/notifications/notifications.module.js";
import { messagingRouter } from "../modules/messaging/messaging.module.js";
import { filesRouter } from "../modules/files/files.module.js";
import { formsRouter, publicFormsRouter } from "../modules/forms/forms.module.js";
import { automationsRouter } from "../modules/automations/automations.module.js";
import { campaignsRouter } from "../modules/campaigns/campaigns.module.js";
import { orgRouter } from "../modules/organizations/organizations.module.js";
import { billingRouter } from "../modules/billing/billing.module.js";
import { auditRouter } from "../modules/audit/audit.module.js";
import { superAdminRouter } from "../modules/super-admin/super-admin.module.js";

/**
 * API v1 aggregator. Feature module routers are mounted here as they are built.
 * Keeping this central makes the surface area easy to audit.
 */
export const apiRouter: Router = Router();

apiRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      name: "VenueFlow API",
      version: "1.0.0",
      docs: "/docs",
    },
  });
});

// Module routers (added incrementally)
apiRouter.use("/auth", authRouter);
apiRouter.use("/leads", leadsRouter);
apiRouter.use("/customers", customersRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.use("/venues", venuesRouter);
apiRouter.use("/bookings", bookingsRouter);
apiRouter.use("/quotes", quotesRouter);
apiRouter.use("/invoices", invoicesRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/tasks", tasksRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/analytics", dashboardRouter);
apiRouter.use("/notifications", notificationsRouter);
apiRouter.use("/messages", messagingRouter);
apiRouter.use("/files", filesRouter);
apiRouter.use("/forms", formsRouter);
apiRouter.use("/public/forms", publicFormsRouter);
apiRouter.use("/automations", automationsRouter);
apiRouter.use("/email-campaigns", campaignsRouter);
apiRouter.use("/organizations", orgRouter);
apiRouter.use("/billing", billingRouter);
apiRouter.use("/audit-logs", auditRouter);
apiRouter.use("/super-admin", superAdminRouter);
