import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.js";
import { authLimiter } from "../../middleware/rateLimit.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../lib/http.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  twoFactorVerifySchema,
  magicLinkSchema,
} from "./auth.validators.js";

export const authRouter: Router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user and create their first organization
 *     security: []
 *     responses:
 *       201: { description: Created }
 */
authRouter.post("/register", authLimiter, validate({ body: registerSchema }), asyncHandler(authController.register));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate with email + password (and 2FA code if enabled)
 *     security: []
 */
authRouter.post("/login", authLimiter, validate({ body: loginSchema }), asyncHandler(authController.login));

authRouter.post("/refresh", asyncHandler(authController.refresh));
authRouter.post("/logout", asyncHandler(authController.logout));
authRouter.post("/forgot-password", authLimiter, validate({ body: forgotPasswordSchema }), asyncHandler(authController.forgotPassword));
authRouter.post("/reset-password", authLimiter, validate({ body: resetPasswordSchema }), asyncHandler(authController.resetPassword));
authRouter.post("/verify-email", validate({ body: verifyEmailSchema }), asyncHandler(authController.verifyEmail));
authRouter.post("/magic-link", authLimiter, validate({ body: magicLinkSchema }), asyncHandler(authController.magicLink));

// Authenticated
authRouter.get("/me", authenticate, asyncHandler(authController.me));
authRouter.post("/2fa/start", authenticate, asyncHandler(authController.start2FA));
authRouter.post("/2fa/confirm", authenticate, validate({ body: twoFactorVerifySchema }), asyncHandler(authController.confirm2FA));
authRouter.post("/2fa/disable", authenticate, asyncHandler(authController.disable2FA));
authRouter.get("/sessions", authenticate, asyncHandler(authController.listSessions));
authRouter.delete("/sessions/:id", authenticate, asyncHandler(authController.revokeSession));
