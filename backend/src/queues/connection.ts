import { env } from "../config/env.js";

/**
 * Connection options for BullMQ. We pass plain options (not a shared ioredis
 * instance) so BullMQ manages its own connections and avoids the dual-package
 * type clash with the top-level ioredis used for caching/rate-limiting.
 */
const url = new URL(env.REDIS_URL);

export const bullConnection = {
  host: url.hostname,
  port: Number(url.port || 6379),
  username: url.username || undefined,
  password: url.password || undefined,
  maxRetriesPerRequest: null,
};
