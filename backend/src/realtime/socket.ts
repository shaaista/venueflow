import type { Server as HttpServer } from "node:http";
import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

let io: SocketServer | null = null;

type TokenPayload = { sub: string; orgId?: string };

/**
 * Initialise Socket.IO. Clients authenticate with their access token and are
 * joined to per-user and per-organization rooms for targeted real-time events.
 */
export function initWebsockets(server: HttpServer): SocketServer {
  io = new SocketServer(server, {
    cors: { origin: [env.WEB_URL], credentials: true },
    path: "/realtime",
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error("unauthorized"));
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
      socket.data.userId = payload.sub;
      socket.data.orgId = payload.orgId;
      next();
    } catch {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, orgId } = socket.data as { userId: string; orgId?: string };
    socket.join(`user:${userId}`);
    if (orgId) socket.join(`org:${orgId}`);
    logger.debug({ userId, orgId }, "socket connected");
  });

  return io;
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  io?.to(`user:${userId}`).emit(event, payload);
}

export function emitToOrg(orgId: string, event: string, payload: unknown) {
  io?.to(`org:${orgId}`).emit(event, payload);
}
