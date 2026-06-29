import Stripe from "stripe";
import { env, integrations } from "../config/env.js";

/**
 * Stripe client. Null when no secret key is configured so the API can run
 * in environments without payments enabled.
 */
export const stripe: Stripe | null = integrations.stripe
  ? new Stripe(env.STRIPE_SECRET_KEY as string, { apiVersion: "2025-02-24.acacia" })
  : null;

export function requireStripe(): Stripe {
  if (!stripe) throw new Error("Stripe is not configured (set STRIPE_SECRET_KEY)");
  return stripe;
}
