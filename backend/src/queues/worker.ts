import { Worker } from "bullmq";
import { connectRedis } from "../lib/redis.js";
import { bullConnection } from "./connection.js";
import { logger } from "../lib/logger.js";
import { sendEmail } from "../lib/mailer.js";
import { sendSms } from "../lib/sms.js";
import { prisma } from "../lib/prisma.js";
import { QUEUE_NAMES, type EmailJob, type SmsJob, type CampaignJob } from "./index.js";

/**
 * Background worker process. Registers BullMQ workers for each queue.
 * Run separately from the API: `npm run worker`.
 */
async function start() {
  const up = await connectRedis();
  if (!up) {
    logger.warn("Worker requires Redis — exiting. Start Redis and retry.");
    process.exit(1);
  }

  const connection = bullConnection;

  new Worker<EmailJob>(
    QUEUE_NAMES.email,
    async (job) => {
      await sendEmail(job.data);
    },
    { connection },
  );

  new Worker<SmsJob>(
    QUEUE_NAMES.sms,
    async (job) => {
      await sendSms(job.data.to, job.data.body);
    },
    { connection },
  );

  new Worker(
    QUEUE_NAMES.reports,
    async (job) => {
      logger.info({ data: job.data }, "Generating report");
      // Report generation would aggregate analytics and persist/email the result.
    },
    { connection },
  );

  new Worker<CampaignJob>(
    QUEUE_NAMES.campaigns,
    async (job) => {
      const campaign = await prisma.campaign.findUnique({ where: { id: job.data.campaignId } });
      if (!campaign) return;
      // A real send would fan out to the audience; here we mark it sent.
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: "SENT", sentCount: { increment: 0 } },
      });
    },
    { connection },
  );

  logger.info("👷 VenueFlow worker ready — processing email, sms, reports, campaigns");
}

start().catch((err) => {
  logger.error({ err }, "Worker failed to start");
  process.exit(1);
});
