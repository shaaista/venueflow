# VenueFlow

A white-label, multi-tenant **Venue & Event Enquiry CRM** for luxury hospitality —
cafes, hotels, resorts, banquet halls, and wedding venues. Manage the full event
lifecycle from public enquiry to payment, with a polished admin CRM, a customer
portal, and a super-admin console.

> **Live demo mode:** the app runs entirely on local mock data — no database or
> external services required. Perfect for client demos. The architecture mirrors the
> future PostgreSQL shapes, so it connects to a real backend with no rewrites.

## ✨ Highlights

- **Full event lifecycle, clickable end to end** — public enquiry → lead → convert to
  customer → create event → quote → accept → invoice → pay → complete → dashboard updates.
- **One-click Guided Demo Journey** that runs the whole lifecycle.
- **Multi-tenant** with live per-tenant branding, an onboarding wizard, and 5 industry
  templates (Hotel, Cafe, Wedding Venue, Resort, Banquet Hall).
- **Admin CRM** — dashboard, leads (table + drag kanban), customers, events, calendar,
  quotes, invoices, payments, tasks, messages, analytics, settings, and more.
- **Customer Portal** — view & accept quotes, pay invoices, view events and timelines.
- React Query data layer with loading / error / empty states, optimistic updates, CSV
  export, PDF placeholders, and print views.

## 🧱 Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS · Framer Motion ·
Recharts · @tanstack/react-query · cmdk

The `backend/` folder contains a separate, production-shaped Express + Prisma API for
when you're ready to connect a real database — it is **not** required to run the demo.

## 🚀 Run locally

```bash
npm install
npm run dev          # → http://localhost:3000
```

That's it — the demo works standalone on mock data. Login/Register work in demo mode.

### Demo-mode flag (`.env.local`)

```
NEXT_PUBLIC_API_ENABLED=false   # mock demo (default)
# NEXT_PUBLIC_API_ENABLED=true  # talk to the real backend (needs a DB)
```

## ▲ Deploy on Vercel

This is a standard Next.js app — import the repo at [vercel.com/new](https://vercel.com/new),
keep the defaults, and deploy. No env vars are required for the demo.

## 📄 Project status

See [PROGRESS.md](./PROGRESS.md) for the full build log. VenueFlow **v1 (demo)** is complete.
