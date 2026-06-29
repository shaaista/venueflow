import jwt, { type SignOptions } from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import { env } from "../config/env.js";

export type AccessPayload = {
  sub: string; // userId
  email: string;
  orgId?: string; // active organization
  role?: string;
  isSuperAdmin?: boolean;
};

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL } as SignOptions);
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL } as SignOptions);
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
}

const tokenAlphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nano = customAlphabet(tokenAlphabet, 48);

/** Opaque random token for email verification, password reset, invitations, magic links. */
export const randomToken = () => nano();

const digits = customAlphabet("0123456789", 6);
export const sixDigitCode = () => digits();
