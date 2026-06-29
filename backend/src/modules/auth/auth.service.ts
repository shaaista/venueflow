import { authenticator } from "otplib";
import QRCode from "qrcode";
import dayjs from "dayjs";
import { prisma } from "../../lib/prisma.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  randomToken,
} from "../../lib/tokens.js";
import { sendEmail, emailTemplate } from "../../lib/mailer.js";
import { recordAudit } from "../../lib/audit.js";
import { env } from "../../config/env.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../lib/errors.js";
import type { RegisterInput, LoginInput } from "./auth.validators.js";

type ReqMeta = { ip?: string; userAgent?: string };

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 32) + "-" + randomToken().slice(0, 6).toLowerCase()
  );
}

async function activeOrgFor(userId: string) {
  return prisma.membership.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
  });
}

async function issueSession(userId: string, meta: ReqMeta) {
  const refreshToken = signRefreshToken(userId);
  const expiresAt = dayjs().add(30, "day").toDate();
  await prisma.session.create({
    data: {
      userId,
      refreshToken,
      ip: meta.ip,
      userAgent: meta.userAgent,
      device: meta.userAgent?.slice(0, 80),
      expiresAt,
    },
  });
  return refreshToken;
}

async function buildAccessToken(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const membership = await activeOrgFor(userId);
  return signAccessToken({
    sub: user.id,
    email: user.email,
    isSuperAdmin: user.isSuperAdmin,
    orgId: membership?.organizationId,
    role: membership?.role,
  });
}

function publicUser(u: {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isSuperAdmin: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    avatarUrl: u.avatarUrl,
    isSuperAdmin: u.isSuperAdmin,
    emailVerified: u.emailVerified,
    twoFactorEnabled: u.twoFactorEnabled,
  };
}

export const authService = {
  async register(input: RegisterInput, meta: ReqMeta) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ConflictError("An account with this email already exists");

    const passwordHash = await hashPassword(input.password);
    const emailVerifyToken = randomToken();

    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash, emailVerifyToken },
    });

    // Create the user's first organization (they become OWNER).
    const orgName = input.organizationName || `${input.name}'s Venue`;
    const organization = await prisma.organization.create({
      data: {
        name: orgName,
        slug: slugify(orgName),
        status: "TRIAL",
        memberships: { create: { userId: user.id, role: "OWNER", status: "ACTIVE" } },
      },
    });

    // Attach a trial subscription if a Starter plan exists.
    const plan = await prisma.plan.findUnique({ where: { tier: "STARTER" } });
    if (plan) {
      await prisma.subscription.create({
        data: {
          organizationId: organization.id,
          planId: plan.id,
          status: "TRIALING",
          trialEndsAt: dayjs().add(14, "day").toDate(),
        },
      });
    }

    await sendEmail({
      to: user.email,
      subject: "Verify your VenueFlow account",
      html: emailTemplate(
        "Welcome to VenueFlow",
        "Confirm your email address to activate your account.",
        { label: "Verify email", url: `${env.WEB_URL}/verify-email?token=${emailVerifyToken}` },
      ),
    });

    const accessToken = await buildAccessToken(user.id);
    const refreshToken = await issueSession(user.id, meta);
    await recordAudit({ action: "auth.register", actorId: user.id, organizationId: organization.id, ip: meta.ip });

    return { user: publicUser(user), organization, accessToken, refreshToken };
  },

  async login(input: LoginInput, meta: ReqMeta) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedError("Invalid email or password");

    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new UnauthorizedError("Invalid email or password");

    if (user.twoFactorEnabled) {
      if (!input.code) {
        return { twoFactorRequired: true as const };
      }
      const valid = authenticator.verify({ token: input.code, secret: user.twoFactorSecret ?? "" });
      if (!valid) throw new UnauthorizedError("Invalid two-factor code");
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const accessToken = await buildAccessToken(user.id);
    const refreshToken = await issueSession(user.id, meta);
    await recordAudit({ action: "auth.login", actorId: user.id, ip: meta.ip });

    return { user: publicUser(user), accessToken, refreshToken };
  },

  async refresh(token: string, meta: ReqMeta) {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }
    const session = await prisma.session.findUnique({ where: { refreshToken: token } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedError("Session expired");
    }

    // Rotate the refresh token.
    await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
    const accessToken = await buildAccessToken(payload.sub);
    const refreshToken = await issueSession(payload.sub, meta);
    return { accessToken, refreshToken };
  },

  async logout(token?: string) {
    if (token) {
      await prisma.session.updateMany({ where: { refreshToken: token }, data: { revokedAt: new Date() } });
    }
    return { ok: true };
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    // Always behave the same to avoid account enumeration.
    if (user) {
      const resetToken = randomToken();
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExp: dayjs().add(1, "hour").toDate() },
      });
      await sendEmail({
        to: email,
        subject: "Reset your VenueFlow password",
        html: emailTemplate("Password reset", "Click below to choose a new password. This link expires in 1 hour.", {
          label: "Reset password",
          url: `${env.WEB_URL}/reset-password?token=${resetToken}`,
        }),
      });
    }
    return { ok: true };
  },

  async resetPassword(token: string, password: string) {
    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExp: { gt: new Date() } },
    });
    if (!user) throw new BadRequestError("Invalid or expired reset token");
    const passwordHash = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExp: null },
    });
    await prisma.session.updateMany({ where: { userId: user.id }, data: { revokedAt: new Date() } });
    await recordAudit({ action: "auth.password_reset", actorId: user.id });
    return { ok: true };
  },

  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
    if (!user) throw new BadRequestError("Invalid verification token");
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null },
    });
    return { ok: true };
  },

  async start2FA(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const secret = authenticator.generateSecret();
    await prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });
    const otpauth = authenticator.keyuri(user.email, "VenueFlow", secret);
    const qrDataUrl = await QRCode.toDataURL(otpauth);
    return { secret, otpauth, qrDataUrl };
  },

  async confirm2FA(userId: string, code: string) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.twoFactorSecret) throw new BadRequestError("Start 2FA setup first");
    const valid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!valid) throw new BadRequestError("Invalid code");
    await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
    return { ok: true };
  },

  async disable2FA(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });
    return { ok: true };
  },

  async listSessions(userId: string) {
    return prisma.session.findMany({
      where: { userId, revokedAt: null },
      orderBy: { createdAt: "desc" },
      select: { id: true, ip: true, device: true, userAgent: true, createdAt: true, expiresAt: true },
    });
  },

  async revokeSession(userId: string, sessionId: string) {
    const session = await prisma.session.findFirst({ where: { id: sessionId, userId } });
    if (!session) throw new NotFoundError("Session not found");
    await prisma.session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
    return { ok: true };
  },

  async me(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const memberships = await prisma.membership.findMany({
      where: { userId, status: "ACTIVE" },
      include: { organization: { select: { id: true, name: true, slug: true, logoUrl: true, brandColor: true } } },
    });
    return {
      user: publicUser(user),
      organizations: memberships.map((m) => ({ ...m.organization, role: m.role })),
    };
  },

  async magicLink(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = randomToken();
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: token, resetTokenExp: dayjs().add(15, "minute").toDate() },
      });
      await sendEmail({
        to: email,
        subject: "Your VenueFlow sign-in link",
        html: emailTemplate("Sign in to VenueFlow", "Click below to sign in. This link expires in 15 minutes.", {
          label: "Sign in",
          url: `${env.WEB_URL}/magic?token=${token}`,
        }),
      });
    }
    return { ok: true };
  },
};
