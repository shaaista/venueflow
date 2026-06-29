import pino from "pino";
import { isProd } from "../config/env.js";

export const logger = pino({
  level: isProd ? "info" : "debug",
  base: { app: "venueflow-api" },
  redact: ["req.headers.authorization", "req.headers.cookie", "*.passwordHash"],
});
