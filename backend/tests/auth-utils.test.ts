import { describe, it, expect } from "vitest";
import { roleHasPermission, ROLE_RANK } from "../src/config/permissions.js";
import { signAccessToken, verifyAccessToken, randomToken, sixDigitCode } from "../src/lib/tokens.js";

describe("RBAC permission matrix", () => {
  it("grants owners every permission", () => {
    expect(roleHasPermission("OWNER", "manage_billing")).toBe(true);
    expect(roleHasPermission("OWNER", "delete")).toBe(true);
  });
  it("limits viewers to read", () => {
    expect(roleHasPermission("VIEWER", "read")).toBe(true);
    expect(roleHasPermission("VIEWER", "create")).toBe(false);
    expect(roleHasPermission("VIEWER", "delete")).toBe(false);
  });
  it("ranks roles correctly", () => {
    expect(ROLE_RANK.OWNER).toBeGreaterThan(ROLE_RANK.MANAGER);
    expect(ROLE_RANK.MANAGER).toBeGreaterThan(ROLE_RANK.VIEWER);
  });
});

describe("JWT tokens", () => {
  it("round-trips an access token", () => {
    const token = signAccessToken({ sub: "u1", email: "a@b.com", orgId: "o1", role: "ADMIN", isSuperAdmin: false });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe("u1");
    expect(payload.orgId).toBe("o1");
    expect(payload.role).toBe("ADMIN");
  });
  it("rejects a tampered token", () => {
    expect(() => verifyAccessToken("not.a.jwt")).toThrow();
  });
});

describe("random tokens", () => {
  it("generates unique opaque tokens", () => {
    expect(randomToken()).not.toBe(randomToken());
    expect(randomToken().length).toBe(48);
  });
  it("generates 6-digit codes", () => {
    expect(sixDigitCode()).toMatch(/^\d{6}$/);
  });
});
