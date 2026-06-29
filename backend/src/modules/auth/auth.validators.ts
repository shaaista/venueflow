import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  organizationName: z.string().min(2).max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  code: z.string().optional(), // 2FA code
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(100),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(10),
});

export const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

export const twoFactorVerifySchema = z.object({
  code: z.string().length(6),
});

export const magicLinkSchema = z.object({
  email: z.string().email(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
