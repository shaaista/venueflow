import { Resend } from "resend";
import { env, integrations } from "../config/env.js";
import { logger } from "./logger.js";

const resend = integrations.resend ? new Resend(env.RESEND_API_KEY as string) : null;

type Mail = { to: string; subject: string; html: string };

/** Sends an email via Resend, or logs it in development when unconfigured. */
export async function sendEmail({ to, subject, html }: Mail): Promise<void> {
  if (!resend) {
    logger.info({ to, subject }, "📧 [dev] email (Resend not configured)");
    logger.debug({ html }, "email body");
    return;
  }
  try {
    await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
  } catch (err) {
    logger.error({ err: (err as Error).message, to }, "Failed to send email");
  }
}

export function emailTemplate(title: string, body: string, cta?: { label: string; url: string }) {
  return `
  <div style="font-family:Inter,system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px;color:#2B2521">
    <h1 style="font-family:Georgia,serif;font-size:22px;color:#4A3728">${title}</h1>
    <p style="font-size:15px;line-height:1.6;color:#6E6557">${body}</p>
    ${
      cta
        ? `<a href="${cta.url}" style="display:inline-block;margin-top:16px;background:#4A3728;color:#FDFCF8;padding:11px 22px;border-radius:999px;text-decoration:none;font-size:14px">${cta.label}</a>`
        : ""
    }
    <p style="margin-top:32px;font-size:12px;color:#968C7C">VenueFlow · The enterprise CRM for luxury hospitality</p>
  </div>`;
}
