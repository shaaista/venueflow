import { Queue, type JobsOptions } from "bullmq";
import { isRedisUp } from "../lib/redis.js";
import { bullConnection } from "./connection.js";
import { sendEmail } from "../lib/mailer.js";
import { sendSms } from "../lib/sms.js";
import { logger } from "../lib/logger.js";

export const QUEUE_NAMES = {
  email: "email",
  sms: "sms",
  reports: "reports",
  campaigns: "campaigns",
} as const;

export type EmailJob = { to: string; subject: string; html: string };
export type SmsJob = { to: string; body: string };
export type ReportJob = { organizationId: string; type: string; requestedBy?: string };
export type CampaignJob = { campaignId: string };

const connection = bullConnection;
const defaultJobOpts: JobsOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 2000 },
  removeOnComplete: 500,
  removeOnFail: 1000,
};

// Queues are created lazily so importing this module never requires Redis.
let _email: Queue<EmailJob> | null = null;
let _sms: Queue<SmsJob> | null = null;
let _reports: Queue<ReportJob> | null = null;
let _campaigns: Queue<CampaignJob> | null = null;

const emailQueue = () => (_email ??= new Queue<EmailJob>(QUEUE_NAMES.email, { connection, defaultJobOptions: defaultJobOpts }));
const smsQueue = () => (_sms ??= new Queue<SmsJob>(QUEUE_NAMES.sms, { connection, defaultJobOptions: defaultJobOpts }));
export const reportsQueue = () => (_reports ??= new Queue<ReportJob>(QUEUE_NAMES.reports, { connection, defaultJobOptions: defaultJobOpts }));
export const campaignsQueue = () => (_campaigns ??= new Queue<CampaignJob>(QUEUE_NAMES.campaigns, { connection, defaultJobOptions: defaultJobOpts }));

/**
 * Enqueue helpers. When Redis is unavailable (e.g. local dev) the side-effect
 * runs inline so the feature still works end-to-end.
 */
export async function enqueueEmail(job: EmailJob): Promise<void> {
  if (!isRedisUp()) return void sendEmail(job);
  try {
    await emailQueue().add("send", job);
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "email enqueue failed — sending inline");
    await sendEmail(job);
  }
}

export async function enqueueSms(job: SmsJob): Promise<void> {
  if (!isRedisUp()) return void sendSms(job.to, job.body);
  try {
    await smsQueue().add("send", job);
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "sms enqueue failed — sending inline");
    await sendSms(job.to, job.body);
  }
}

export async function enqueueReport(job: ReportJob): Promise<void> {
  if (!isRedisUp()) return;
  await reportsQueue().add("generate", job);
}

export async function enqueueCampaign(job: CampaignJob): Promise<void> {
  if (!isRedisUp()) return;
  await campaignsQueue().add("send", job);
}
