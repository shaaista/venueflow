import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";
import { connectRedis } from "./lib/redis.js";
import { initWebsockets } from "./realtime/socket.js";

async function bootstrap() {
  const app = createApp();
  const httpServer = createServer(app);

  // Real-time notifications (Socket.IO)
  initWebsockets(httpServer);

  // Best-effort infra connections — the API still boots if they're down.
  await connectRedis();
  try {
    await prisma.$connect();
    logger.info("✓ Database connected");
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Database unavailable at boot — will retry on first query");
  }

  httpServer.listen(env.PORT, () => {
    logger.info(`🚀 VenueFlow API running at ${env.APP_URL} (env: ${env.NODE_ENV})`);
    logger.info(`📚 API docs at ${env.APP_URL}/docs`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down`);
    httpServer.close();
    await prisma.$disconnect().catch(() => {});
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap().catch((err) => {
  logger.error({ err }, "Fatal boot error");
  process.exit(1);
});
