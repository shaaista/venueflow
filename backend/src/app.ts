import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env.js";
import { openapiSpec } from "./config/openapi.js";
import { logger } from "./lib/logger.js";
import { apiRouter } from "./routes/index.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { stripeWebhookHandler } from "./modules/payments/stripe.webhook.js";

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: [env.WEB_URL],
      credentials: true,
    }),
  );

  // Stripe webhook needs the raw body — must be registered BEFORE json parser.
  app.post("/api/v1/payments/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));

  // Health check (no auth, no rate limit)
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), env: env.NODE_ENV });
  });

  // API docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec, { customSiteTitle: "VenueFlow API" }));
  app.get("/openapi.json", (_req, res) => res.json(openapiSpec));

  // Versioned API
  app.use("/api/v1", apiLimiter, apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
