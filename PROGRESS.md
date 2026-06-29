# VenueFlow — Build Progress

Single source of truth for what's built. Newest changelog entries at the top.

> **🚀 LIVE:** **https://venueflow-three.vercel.app** · Repo: **https://github.com/shaaista/venueflow**
> Deployed on Vercel (project `venueflow`, sanas-projects). Pushes to `main` can be
> wired to auto-redeploy via the project's Settings → Git. Runs on Next.js 16.

> **🎉 VenueFlow v1 — DEMO COMPLETE.** The full event lifecycle is clickable end to
> end in demo mode (no database): public enquiry → lead → convert to customer →
> create event → generate quote → accept → generate invoice → pay → complete →
> dashboard updates. One-click **Guided Demo Journey** runs it. Multi-tenant with
> live branding, onboarding, and 5 industry templates. Typecheck clean, responsive.

---

## 1. What VenueFlow is

A **white-label, multi-tenant Venue & Event Enquiry CRM** for luxury hospitality
(cafes, hotels, resorts, banquet halls, wedding & event venues). Three surfaces:

1. **Marketing site + booking flows** — public, lead generation
2. **Customer Portal** — logged-in customers track their events, quotes, payments
3. **Admin CRM** — venue staff manage the whole pipeline
4. **Super Admin** — platform owner manages all tenants

---

## 2. How to run (local, no Docker, no database needed)

```bash
# The app — works standalone on mock data
npm install
npm run dev                 # → http://localhost:3000

# Backend API (optional, for later)
cd backend && npm install && npm run dev   # → http://localhost:4000  (docs at /docs)
```

- The frontend is fully usable **without the backend** (mock data).
- **Login / Register work in demo mode** (local session, no server).
- DB, Redis, Stripe, email, SMS are **placeholders** — switched on later via env.
- Demo logins (when backend + DB are connected): `alex@theatrium.co` /
  `ops@venueflow.app`, both `password123`.

### Flags (`.env.local`)
- `NEXT_PUBLIC_API_ENABLED=false` → pure mock demo (current default)
- `NEXT_PUBLIC_API_ENABLED=true` + `NEXT_PUBLIC_API_URL` → use the real API

---

## 3. Tech stack

**Frontend:** Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS v3 ·
Framer Motion · Recharts · cmdk · @tanstack/react-query
**Backend:** Node · Express · TypeScript (ESM, run via tsx) · Prisma · PostgreSQL ·
Redis + BullMQ · Socket.IO · JWT · Stripe · Resend · Twilio · Supabase Storage · Zod · Vitest

**Design system (warm "editorial roastery"):** cream canvas `#F2EFE8`, espresso
`#4A3728`, sage `#5E7153`, amber `#D97706`; fonts Literata (display) + Inter (body).

---

## 4. Status

### Frontend — ✅ COMPLETE (mock data, ~79 routes, 0 console errors)

| Area | Pages |
| --- | --- |
| **Marketing** | Home, About, Event Spaces, Event Types, Gallery (photos/videos/360/IG), Packages, Testimonials, FAQs, Blog + `[slug]`, Contact, Upcoming Events, Privacy, Terms |
| **Flows** | Book-an-Event wizard (8 steps), Request a Quote (+ success), Check Availability (+ results) |
| **Auth** | Login, Register, Forgot/Reset password, Verify email, 2FA |
| **Customer Portal** | Dashboard, Events (+ detail), Quotes (+ detail), Invoices, Payments, Messages, Files, Profile |
| **Admin CRM** | Dashboard, Calendar (month/week/day/agenda), Leads (table + drag kanban + detail + new), Customers (+ detail), Events (+ detail), Bookings, Venues, Packages, Quotes (+ detail), Invoices (+ detail), Payments, Tasks (drag board), Messages, Forms, Automations, Email Campaigns, Analytics, Reports, Team, Integrations, Billing, Audit Logs, Help, Settings (7 sub-pages) |
| **Super Admin** | Overview, Tenants, Users, Subscriptions, Feature Flags, Analytics, System Settings, Audit Logs |

Shared: collapsible sidebar, frosted topbar, ⌘K command palette, notifications
drawer, charts, reusable UI kit (button, badge, tabs, sparkline, document view, etc.).

### Backend — ✅ BUILT & TYPE-SAFE (DB = placeholder; 12/12 tests pass)

Located in `/backend`. Boots standalone; degrades gracefully without DB/Redis/Stripe.

- **Foundation:** Express + helmet + CORS + rate limiting + structured logging
  (pino) + consistent `{success,error}` envelope + OpenAPI at `/docs` + Socket.IO
  real-time + graceful boot/shutdown
- **Auth:** register (creates org + trial), login (+ 2FA TOTP), refresh-token
  rotation (revocable sessions), logout, forgot/reset password, verify email,
  magic link, `/me`
- **Multi-tenancy + RBAC:** every tenant row scoped by `organizationId`;
  8 roles (Super Admin → Customer) with per-permission guards
- **Feature modules** (each `routes → service → validators`, audit-logged):
  leads (pipeline, convert, bulk, CSV import/export, stats, notes, activity),
  customers, events (schedule/guests/checklist/duplicate), venues + spaces
  (availability, blackout dates, conflict detection), bookings (double-booking
  prevention), quotes (line items, totals, status, duplicate), invoices (payments,
  overdue), payments (Stripe intents/refunds — placeholder), tasks (board +
  comments), dashboard/analytics (KPIs, trends, pipeline), notifications (+ socket
  push), messaging (conversations, templates, email/SMS), files (upload →
  Supabase), forms (+ public submit → auto-creates a lead), automations (CRUD +
  trigger engine wired into leads/events/quotes/invoices/forms), campaigns,
  organizations (members/invites/roles), billing (plans/usage/subscribe), audit
  logs, super-admin (tenants/users/subscriptions/flags/platform analytics)
- **Infra:** BullMQ queues + worker (email/sms/reports/campaigns; inline fallback
  when Redis is down), Stripe webhook, Prisma schema (~40 models), seed, Vitest tests
- **Data model:** `backend/prisma/schema.prisma` — Organizations, Users,
  Memberships, Sessions, Invitations, Plans/Subscriptions/FeatureFlags, Leads,
  Customers, Contacts, Venues, Spaces, Events (+ schedule/guests/checklist),
  Bookings, Quotes, Invoices (+ line items), Payments, Tasks, Conversations,
  Messages, Files, Forms, Automations, Campaigns, Notifications, AuditLogs,
  ApiKeys, Webhooks

### Frontend ↔ Backend integration — 🚧 IN PROGRESS (Phase 1)
- ✅ Typed API client (`src/lib/api/`): fetch wrapper, token store + auto-refresh,
  resource modules (auth, dashboard, leads, customers, events, quotes, invoices,
  tasks, notifications)
- ✅ React Query + Auth providers wired into the root layout
- ✅ Login / Register pages call `useAuth()` — with demo-mode fallback
- ✅ **Reusable data layer**: `useApiList` / `useApiObject` hooks (live-or-mock),
  `TableSkeleton`/`CardGridSkeleton` (loading), `ErrorState` (with retry),
  `EmptyState` — the standard pattern every module reuses
- ✅ **Leads — fully wired** (`useLeadsData` + `useUpdateLeadStage`): live list via
  React Query with pagination/search/filter, loading + error (retry) + empty
  states, and **optimistic** kanban stage moves (cache update + rollback). Falls
  back to mock in demo mode.
- ⏳ **Remaining modules** (same pattern): Dashboard, Customers, Events, Bookings,
  Venues, Quotes, Invoices, Payments, Tasks, Messages, Notifications, Analytics,
  Reports, Forms, Automations, Campaigns, Customer Portal.

### Database — 🚧 migration ready (Phase 2)
- ✅ **Baseline migration generated**: `backend/prisma/migrations/0_init/migration.sql`
  (1088 lines — all enums, tables, FKs, indexes) + `migration_lock.toml`. Apply with
  `prisma migrate deploy` against any Postgres, then `npm run db:seed`.
- ⏳ Needs a live PostgreSQL to apply/verify (none on this machine).

---

## 5. Project layout

```
event enquiry crm/
├── PROGRESS.md                 ← this file
├── src/                        ← FRONTEND
│   ├── app/                    (marketing) (flow) (auth) /portal /admin /super-admin
│   ├── components/             ui/, marketing/, admin/, portal/, superadmin/, providers/
│   └── lib/                    api/ (client, auth, resources), mock/, utils, site config
└── backend/                    ← BACKEND API
    ├── prisma/                 schema.prisma, seed.ts
    ├── src/
    │   ├── config/             env, permissions, openapi
    │   ├── lib/                prisma, redis, logger, tokens, password, mailer, sms, stripe, storage, audit, tenant, http, errors
    │   ├── middleware/         auth, rbac, validate, rateLimit, error
    │   ├── modules/<name>/     <name>.module.ts (routes+service+validators); auth/ is split
    │   ├── queues/             index, worker, connection
    │   ├── realtime/           socket.ts
    │   ├── routes/index.ts     mounts everything at /api/v1
    │   └── server.ts
    └── tests/                  vitest (auth utils + API surface)
```

---

## 6. Decisions & conventions
- **No Docker, no required database for now.** App runs locally on mock data; DB &
  Stripe are placeholders, enabled later. (`docker-compose.yml` exists but is optional.)
- Backend runs via `tsx` (dev + prod) to avoid ESM friction; **relative imports use
  `.js` extensions**.
- API response shape: `{ success, data, meta? }` / `{ success:false, error:{code,message,details?} }`.
- Frontend & backend are **separate TS projects** (root tsconfig excludes `backend/`).

## 7. Deliberately deferred (placeholders / TODO)
- Connect a real PostgreSQL + run migrations/seed (when persistence is wanted)
- Switch frontend data pages from mock → live API, module by module
- PDF generation for quotes/invoices
- Google social login, magic-link consume endpoint
- A/B campaign testing, scheduled-report cron
- DB-backed integration tests (need a live Postgres)

---

## 8. Changelog

### 2026-06-29 (wave 5) — v1 DEMO COMPLETE
- **Guided Demo Journey** (`guided-demo.tsx` + `journey.ts`): floating "Demo Journey"
  button → one click creates lead → customer → event → quote → invoice (linked), then
  a live checklist guides Accept quote → Pay invoice → Complete event. **Verified:**
  created "Olivia & Tom Hartley", appeared in customer list, badges incremented.
- **Onboarding Wizard** (`onboarding-wizard.tsx`): 4-step modal (name → industry →
  branding → review) that **creates a brand-new tenant with generated demo data** and
  switches to it. Triggered from the tenant switcher ("Create a venue").
- **Dynamic tenants** (`tenant-store.ts`): tenants now localStorage-backed + subscribable
  (was a const). `createTenant()` adds tenant + bulk-inserts data via `store.addTenantData`.
- **Industry Templates** (`templates.ts`): Hotel, Cafe, Wedding Venue, Resort, Banquet
  Hall — each defines brand colour, event types, spaces, packages, forms, automations,
  and `generateTenantData()` produces a full starter dataset.
- **Exports** (`export.ts`): CSV export (Leads, Payments), **PDF placeholders** (download
  .txt) on quote/invoice, **Print views** (print CSS + Print buttons; `.print-area` /
  `.no-print`).
- **Responsive verified** at 390px (sidebar → hamburger, cards stack).
- Final typecheck clean.

### 2026-06-29 (wave 4) — Workflow B + C lifecycle (interactive detail pages)
- **All admin detail pages rewritten client + store-backed + interactive:**
  - **Event detail** — Generate Quote, Complete Event, Set Tentative, entity timeline.
  - **Quote detail** — Send, Accept/Reject (→ on accept, **Generate Invoice** appears),
    Download-PDF placeholder, timeline.
  - **Invoice detail** — Record Payment (modal, partial/full), Send Reminder, PDF,
    Refund, balance card, timeline.
  - **Customer detail** — Create Event + Create Quote (modals), event history, timeline.
  - **Lead detail** (prev wave) — Change Stage, Convert to Customer → Create Event.
- **Workflow C — Customer Portal wired to the SAME store**: portal quote detail
  (**Accept** → status flips, admin sees it), quotes/invoices lists, and **Pay an
  outstanding invoice** (records a real payment) — admin & portal now connected.
- New reusable **`EntityTimeline`** (filters activity-engine items by entityId).
- **Bug fixes:** (1) seed IDs were colliding across tenants (every org had `Q-1100`),
  so store CRUD-by-id hit the wrong tenant — now **globally unique per tenant**
  (`+ ti*1000`). (2) `store.get` returned `undefined` → React Query error; now returns
  `null`. Store bumped to v5.
- **VERIFIED in browser:** accept quote → status → "Accepted", Accept buttons replaced
  by "Generate Invoice", timeline entry + notification badge increment. Full lifecycle
  is clickable: lead → convert → event → quote → accept → invoice → payment.

### 2026-06-29 (wave 3) — CRUD foundation + workflows + activity engine
- **CRUD UI kit**: `Modal` + `Drawer` (`ui/modal.tsx`), form fields (`ui/form.tsx`),
  **toast system** (`toast-provider.tsx`).
- **Activity engine**: added `activities` collection + `logEvent()` (`demo/activity.ts`)
  — one action records an activity-feed item **and** pushes a notification. Dashboard
  activity feed + notification badge are now driven by it.
- **Workflow engine** (`demo/workflows.ts` + `use-workflows.ts`): createLead,
  convertLeadToCustomer, createEvent, generateQuote, acceptQuote, generateInvoice,
  recordPayment, completeEvent — each mutates the store, cascades related entities,
  logs activity + notification, invalidates queries (live dashboard), and toasts.
- **Workflow A wired & VERIFIED**: public **Book-Event wizard** + admin **New Enquiry
  drawer** create a real lead → notification badge increments → activity feed → lead
  list + dashboard update, all persisted in localStorage, tenant-scoped.
- **Lead detail page** rewritten as client + store-backed: viewable for newly-created
  leads, **Change Stage** dropdown, **Convert to Customer** + **Create Event** actions
  (Workflow B steps 1–2), graceful not-found state.
- Store bumped to v4 (activities). Typecheck clean.

### 2026-06-29 (wiring wave 2) — live dashboard + finance/ops modules
- **Live dashboard** (`use-dashboard.ts`): KPIs, revenue trend (smooth growth curve),
  pipeline, recent enquiries, upcoming events, and activity feed all derived from the
  current tenant's store data. `RevenueChart` now accepts a `data` prop.
- **Wired to the store**: Quotes, Invoices, Payments (lists + stats), Tasks (board with
  optimistic drag + dashboard widget with check-to-complete), Messages (inbox from
  store conversations), Notifications (drawer + live unread badge in topbar).
- All with loading/error/empty states + permission-gated actions; everything reacts to
  tenant switching. Typecheck clean.

### 2026-06-29 (demo-mode multi-tenant SaaS) — IN PROGRESS
- **Local mock store** (`src/lib/demo/store.ts`): tenant-scoped CRUD (list/get/create/
  update/remove), localStorage persistence, simulated latency, `reset()`. The single
  seam to later swap for a Postgres client — components never change.
- **4 demo tenants** (`tenants.ts`): The Atrium Hotel (OWNER), Cafe @ Market Street
  (ADMIN), Oakwood Weddings (MANAGER), The Garden Resort (VIEWER) — each with its own
  brand colour, industry, and the demo user at a different role (permission scoping).
- **Rich seed** (`seed.ts`, deterministic RNG): per tenant 30 leads, 32 customers,
  14 events, 10 quotes, 10 invoices, 12 payments, 12 tasks, 8 notifications, 6
  conversations, 5 team — flavoured by industry. **Local SVG initials avatars**
  (`avatar.ts`) — zero external requests.
- **Tenant fabric**: `TenantProvider` (current org, switching, live brand-colour CSS
  var), `TenantSwitcher` in the sidebar, `useCan()` per-tenant permissions. Switching
  tenants isolates data, re-tints branding, and changes the role — verified.
- **Generic resource hooks** (`use-resource.ts` + `resources.ts`): `useList/useItem/
  useCreate/useUpdate/useRemove` for every module, with optimistic updates.
- **Wired so far**: Leads (list + kanban + optimistic stage), Customers, Events — all
  with loading/error/empty states + permission-gated actions, tenant-scoped.
- **Every entity carries `organizationId`** (exactly the future Postgres shape).

### 2026-06-29 (later) — Phase 1 + Phase 2 start
- **Phase 2 artifact:** generated the real baseline Prisma migration
  (`prisma/migrations/0_init/migration.sql`, 1088 lines) + lock file. Ready to
  apply to any Postgres.
- **Phase 1 foundation:** built the reusable React Query data layer —
  `useApiList`/`useApiObject` (live-or-mock), `Skeleton`/`TableSkeleton`/
  `CardGridSkeleton`, `ErrorState` (retry), and reused `EmptyState`.
- **Phase 1 — Leads wired** end-to-end: React Query list (search/filter/pagination),
  loading/error/empty states, **optimistic** kanban stage updates with rollback,
  mock fallback in demo mode. Typecheck clean; renders correctly.

### 2026-06-29 — setup simplification
- Made **PROGRESS.md** the complete source of truth (this rewrite).
- **Simplified setup**: dropped the Docker requirement; app runs locally with
  `npm run dev`. DB/payments kept as placeholders. Backend README reframed
  (local-first, Docker optional).
- Added **demo-mode auth** — Login/Register work locally with no backend.
- Wired **frontend → API foundation**: typed client + token refresh, React Query +
  Auth providers in root layout, Login/Register pages.
- Built the complete **backend** (Express + Prisma): auth, RBAC, ~20 CRM modules,
  queues, websockets, OpenAPI, seed, tests. Typecheck clean, 12/12 tests passing.

### Earlier
- Built the complete **frontend** (~79 routes): marketing site, booking flows,
  auth, customer portal, admin CRM, super-admin — all on mock data.
- Re-skinned the design system from the initial **dark** theme to the warm
  **"roastery"** theme per feedback (cream / espresso / sage / amber).
- Scaffolded Next.js + Tailwind + the luxury design system and component kit.
