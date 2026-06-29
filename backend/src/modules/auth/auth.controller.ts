import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { sendSuccess } from "../../lib/http.js";
import { isProd } from "../../config/env.js";

const REFRESH_COOKIE = "refreshToken";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/api/v1/auth",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

function meta(req: Request) {
  return { ip: req.ip, userAgent: req.headers["user-agent"] };
}

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body, meta(req));
    setRefreshCookie(res, result.refreshToken);
    sendSuccess(res, result, 201);
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body, meta(req));
    if ("twoFactorRequired" in result) return sendSuccess(res, result);
    setRefreshCookie(res, result.refreshToken);
    sendSuccess(res, result);
  },

  async refresh(req: Request, res: Response) {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await authService.refresh(token, meta(req));
    setRefreshCookie(res, result.refreshToken);
    sendSuccess(res, result);
  },

  async logout(req: Request, res: Response) {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    await authService.logout(token);
    res.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });
    sendSuccess(res, { ok: true });
  },

  async forgotPassword(req: Request, res: Response) {
    sendSuccess(res, await authService.forgotPassword(req.body.email));
  },

  async resetPassword(req: Request, res: Response) {
    sendSuccess(res, await authService.resetPassword(req.body.token, req.body.password));
  },

  async verifyEmail(req: Request, res: Response) {
    sendSuccess(res, await authService.verifyEmail(req.body.token));
  },

  async magicLink(req: Request, res: Response) {
    sendSuccess(res, await authService.magicLink(req.body.email));
  },

  async me(req: Request, res: Response) {
    sendSuccess(res, await authService.me(req.auth!.userId));
  },

  async start2FA(req: Request, res: Response) {
    sendSuccess(res, await authService.start2FA(req.auth!.userId));
  },

  async confirm2FA(req: Request, res: Response) {
    sendSuccess(res, await authService.confirm2FA(req.auth!.userId, req.body.code));
  },

  async disable2FA(req: Request, res: Response) {
    sendSuccess(res, await authService.disable2FA(req.auth!.userId));
  },

  async listSessions(req: Request, res: Response) {
    sendSuccess(res, await authService.listSessions(req.auth!.userId));
  },

  async revokeSession(req: Request, res: Response) {
    sendSuccess(res, await authService.revokeSession(req.auth!.userId, req.params.id));
  },
};
