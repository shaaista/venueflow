import twilio from "twilio";
import { env, integrations } from "../config/env.js";
import { logger } from "./logger.js";

const client = integrations.twilio
  ? twilio(env.TWILIO_ACCOUNT_SID as string, env.TWILIO_AUTH_TOKEN as string)
  : null;

/** Sends an SMS via Twilio, or logs it in development when unconfigured. */
export async function sendSms(to: string, body: string): Promise<void> {
  if (!client || !env.TWILIO_FROM_NUMBER) {
    logger.info({ to, body }, "📱 [dev] SMS (Twilio not configured)");
    return;
  }
  try {
    await client.messages.create({ to, from: env.TWILIO_FROM_NUMBER, body });
  } catch (err) {
    logger.error({ err: (err as Error).message, to }, "Failed to send SMS");
  }
}
