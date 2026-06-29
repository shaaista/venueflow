import IORedis from "ioredis";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

/**
 * Shared Redis connection used for caching, rate-limiting and BullMQ.
 * `maxRetriesPerRequest: null` is required by BullMQ.
 */
export const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
});

redis.on("error", (err) => {
  logger.warn({ err: err.message }, "Redis connection error");
});

let connected = false;
export async function connectRedis(): Promise<boolean> {
  try {
    await redis.connect();
    connected = true;
    logger.info("✓ Redis connected");
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Redis unavailable — queues/cache disabled");
  }
  return connected;
}

export const isRedisUp = () => connected;
