import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

describe("API surface (no DB required)", () => {
  it("health check responds ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("returns API info at root", async () => {
    const res = await request(app).get("/api/v1/");
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("VenueFlow API");
  });

  it("rejects unauthenticated access to tenant routes", async () => {
    const res = await request(app).get("/api/v1/leads");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("validates request bodies", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "nope" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("404s unknown routes", async () => {
    const res = await request(app).get("/api/v1/does-not-exist");
    expect(res.status).toBe(404);
  });
});
