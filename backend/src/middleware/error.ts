import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { isProd } from "../config/env.js";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: `Route ${req.method} ${req.originalUrl} not found` },
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Validation failed", details: err.flatten() },
    });
  }

  // Known Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: { code: "CONFLICT", message: "A record with these details already exists" },
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Record not found" },
      });
    }
  }

  // Our typed application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, ...(err.details ? { details: err.details } : {}) },
    });
  }

  const e = err as Error;
  logger.error({ err: e.message, stack: e.stack }, "Unhandled error");
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: isProd ? "Something went wrong" : e.message,
    },
  });
}
