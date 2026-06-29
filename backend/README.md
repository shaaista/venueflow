# VenueFlow API

Multi-tenant backend for the VenueFlow Venue & Event Enquiry CRM.

**Stack:** Node.js · Express · PostgreSQL · Prisma · Redis · BullMQ · JWT · Socket.IO · Stripe · Resend · Twilio · Supabase Storage

## Quick start (local, no Docker)

The API boots **standalone** — it degrades gracefully without a database, Redis,
Stripe, etc. (those are placeholders until you configure them).

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev                 # API with hot reload → http://localhost:4000  ·  docs at /docs
```

### Enabling persistence later (optional)

When you want real data, point `DATABASE_URL` at any PostgreSQL instance and run:

```bash
npm run prisma:migrate      # create the schema
npm run db:seed             # demo tenant + sample data
npm run worker              # background jobs (separate terminal, needs Redis)
```

> **Docker is optional.** A `docker-compose.yml` is included if you'd like Postgres +
> Redis + API + worker in one command (`docker compose up --build`), but it is **not
> required** — everything runs locally without it.

## Seed accounts

| Role        | Email                  | Password      |
| ----------- | ---------------------- | ------------- |
| Super Admin | ops@venueflow.app      | password123   |
| Org Owner   | alex@theatrium.co      | password123   |

## Architecture

```
src/
  config/        env, permissions, openapi
  lib/           prisma, redis, logger, tokens, password, mailer, stripe, audit, http helpers
  middleware/    authenticate, rbac, tenant guard, validate, rate-limit, error handler
  modules/       feature modules — <name>.routes / .controller / .service / .validators
  realtime/      Socket.IO server
  queues/        BullMQ queues + workers
  routes/        /api/v1 aggregator
  server.ts      bootstrap
prisma/
  schema.prisma  multi-tenant data model
  seed.ts        demo data
```

### Multi-tenancy & auth

- Every tenant-scoped table carries `organizationId`. The `authenticate`
  middleware resolves the active organization from the JWT (or
  `X-Organization-Id` header) and validates membership.
- `requirePermission()` / `requireRole()` enforce RBAC per organization.
- Refresh tokens are stored as rotating `Session` rows (revocable, device-aware).

## Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | API with hot reload (tsx) |
| `npm run build` | Typecheck (tsc) |
| `npm run start` | Run the API |
| `npm run worker` | Background job worker |
| `npm run prisma:migrate` | Create/apply a migration |
| `npm run db:seed` | Seed demo data |
| `npm test` | Vitest |
