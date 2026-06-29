import type { Request, Response } from "express";
import type Stripe from "stripe";
import { stripe } from "../../lib/stripe.js";
import { env, integrations } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";

/**
 * Stripe webhook receiver. Registered with a raw-body parser in app.ts.
 * Handles payment + subscription lifecycle events and reconciles our records.
 */
export async function stripeWebhookHandler(req: Request, res: Response) {
  if (!stripe || !integrations.stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ success: false, error: { code: "STRIPE_DISABLED", message: "Stripe not configured" } });
  }

  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig as string, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Stripe signature verification failed");
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await prisma.payment.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { status: "SUCCEEDED", paidAt: new Date() },
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await prisma.payment.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { status: "FAILED" },
        });
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status: sub.status === "active" ? "ACTIVE" : sub.status === "past_due" ? "PAST_DUE" : "CANCELLED",
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }
      default:
        logger.debug({ type: event.type }, "Unhandled Stripe event");
    }
  } catch (err) {
    logger.error({ err: (err as Error).message }, "Error processing Stripe event");
  }

  res.json({ received: true });
}
