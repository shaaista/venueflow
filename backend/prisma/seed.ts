import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding VenueFlow…");
  const password = await bcrypt.hash("password123", 12);

  // ── Plans ──────────────────────────────────────────────
  const plans = [
    { tier: "STARTER" as const, name: "Starter", priceMonthly: 49, maxUsers: 3, maxEvents: 20, features: ["Leads", "Customers", "Calendar"] },
    { tier: "PROFESSIONAL" as const, name: "Professional", priceMonthly: 149, maxUsers: 10, maxEvents: 50, features: ["Everything in Starter", "Quotes", "Invoices", "Automations", "Custom branding"] },
    { tier: "ENTERPRISE" as const, name: "Enterprise", priceMonthly: 499, maxUsers: 999, maxEvents: 9999, features: ["Everything in Pro", "Custom domain", "API access", "Priority support"] },
  ];
  for (const p of plans) {
    await prisma.plan.upsert({
      where: { tier: p.tier },
      update: { name: p.name, priceMonthly: p.priceMonthly, maxUsers: p.maxUsers, maxEvents: p.maxEvents, features: p.features },
      create: { ...p },
    });
  }

  // ── Feature flags ──────────────────────────────────────
  const flags = [
    { key: "ai-assistant", name: "AI Enquiry Assistant", enabled: true, rolloutPct: 12 },
    { key: "whatsapp", name: "WhatsApp Channel", enabled: true, rolloutPct: 100 },
    { key: "new-calendar", name: "New Calendar Engine", enabled: true, rolloutPct: 30 },
    { key: "multi-currency", name: "Multi-currency Billing", enabled: false, rolloutPct: 2 },
  ];
  for (const f of flags) {
    await prisma.featureFlag.upsert({ where: { key: f.key }, update: f, create: f });
  }

  // ── Super admin ────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "ops@venueflow.app" },
    update: {},
    create: { name: "Platform Admin", email: "ops@venueflow.app", passwordHash: password, isSuperAdmin: true, emailVerified: true },
  });

  // ── Demo tenant + owner ────────────────────────────────
  const owner = await prisma.user.upsert({
    where: { email: "alex@theatrium.co" },
    update: {},
    create: { name: "Alex Rivera", email: "alex@theatrium.co", passwordHash: password, emailVerified: true },
  });

  let org = await prisma.organization.findUnique({ where: { slug: "the-atrium-collection" } });
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "The Atrium Collection",
        slug: "the-atrium-collection",
        status: "ACTIVE",
        brandColor: "#4A3728",
        memberships: { create: { userId: owner.id, role: "OWNER", status: "ACTIVE" } },
      },
    });
    const starter = await prisma.plan.findUnique({ where: { tier: "PROFESSIONAL" } });
    if (starter) {
      await prisma.subscription.create({
        data: { organizationId: org.id, planId: starter.id, status: "ACTIVE" },
      });
    }
  }
  const orgId = org.id;

  // Avoid duplicating demo data on repeated seeds.
  const existingLeads = await prisma.lead.count({ where: { organizationId: orgId } });
  if (existingLeads === 0) {
    // Venue + spaces
    const venue = await prisma.venue.create({
      data: { organizationId: orgId, name: "The Atrium", address: "1200 Riverside Ave, Portland, OR" },
    });
    await prisma.space.createMany({
      data: [
        { organizationId: orgId, venueId: venue.id, name: "The Grand Atrium", slug: "grand-atrium", capacity: 320, size: "6,400 sq ft", priceFrom: 8500, amenities: ["Glass ceiling", "Stage", "Bridal suite"], availability: "LIMITED" },
        { organizationId: orgId, venueId: venue.id, name: "The Reserve", slug: "reserve", capacity: 40, size: "900 sq ft", priceFrom: 2200, amenities: ["Chef's table", "Wine cellar"], availability: "HIGH" },
        { organizationId: orgId, venueId: venue.id, name: "The Terrace Gardens", slug: "terrace", capacity: 220, size: "5,000 sq ft", priceFrom: 6400, amenities: ["Pergola", "Fire pits"], availability: "HIGH" },
      ],
    });

    // Customers
    const eleanor = await prisma.customer.create({
      data: { organizationId: orgId, name: "Eleanor Vance", email: "eleanor@vancemail.com", phone: "+1 (555) 234-8901", location: "Portland, OR", status: "ACTIVE", tags: ["Wedding", "VIP"], lifetimeValue: 28500 },
    });
    const priya = await prisma.customer.create({
      data: { organizationId: orgId, name: "Priya Raman", company: "Lumen Capital", email: "priya@lumencap.com", phone: "+1 (555) 901-2245", location: "Seattle, WA", status: "VIP", tags: ["Corporate"], lifetimeValue: 186000 },
    });

    // Leads
    await prisma.lead.createMany({
      data: [
        { organizationId: orgId, name: "Eleanor & James Wedding", contactName: "Eleanor Vance", email: "eleanor@vancemail.com", phone: "+1 (555) 234-8901", status: "PROPOSAL_SENT", temperature: "HOT", eventType: "Wedding Reception", value: 28500, guests: 220, source: "Website Form", assignedToId: owner.id, customerId: eleanor.id, tags: ["Wedding", "VIP"] },
        { organizationId: orgId, name: "Lumen Capital Annual Gala", contactName: "Priya Raman", email: "priya@lumencap.com", status: "CONFIRMED", temperature: "HOT", eventType: "Corporate Gala", value: 64000, guests: 320, source: "Referral", assignedToId: owner.id, customerId: priya.id, tags: ["Corporate"] },
        { organizationId: orgId, name: "Almeida 50th Anniversary", contactName: "Sofia Almeida", email: "sofia@gmail.com", status: "NEW", temperature: "WARM", eventType: "Anniversary", value: 12400, guests: 90, source: "Website Form" },
      ],
    });

    // Event
    const space = await prisma.space.findFirst({ where: { organizationId: orgId, slug: "grand-atrium" } });
    const event = await prisma.event.create({
      data: {
        organizationId: orgId, title: "Eleanor & James Wedding", type: "Wedding Reception",
        customerId: eleanor.id, spaceId: space?.id, date: new Date("2026-09-14"), startTime: "4:00 PM", endTime: "11:00 PM",
        guests: 220, value: 28500, paid: 14250, status: "CONFIRMED", coordinatorId: owner.id,
      },
    });

    // Quote + Invoice
    await prisma.quote.create({
      data: {
        organizationId: orgId, number: "Q-1182", customerId: eleanor.id, eventId: event.id, status: "VIEWED",
        subtotal: 58360, taxRate: 8, total: 63029, validUntil: new Date("2026-07-10"),
        lineItems: { create: [
          { label: "Venue hire — The Grand Atrium", quantity: 1, unit: 8500, order: 0 },
          { label: "Five-course tasting menu", detail: "Per guest", quantity: 220, unit: 145, order: 1 },
        ] },
      },
    });
    await prisma.invoice.create({
      data: {
        organizationId: orgId, number: "INV-1181", customerId: eleanor.id, eventId: event.id, status: "PENDING",
        subtotal: 28500, taxRate: 0, total: 28500, amountPaid: 14250, issuedAt: new Date("2026-06-26"), dueAt: new Date("2026-08-31"),
      },
    });

    // Tasks
    await prisma.task.createMany({
      data: [
        { organizationId: orgId, title: "Send revised quote to Eleanor Vance", status: "TODO", priority: "HIGH", eventId: event.id, assignedToId: owner.id },
        { organizationId: orgId, title: "Confirm catering numbers — Lumen Gala", status: "TODO", priority: "HIGH", assignedToId: owner.id },
        { organizationId: orgId, title: "Approve monthly vendor ledger", status: "REVIEW", priority: "LOW", assignedToId: owner.id },
      ],
    });
  }

  console.log("✅ Seed complete.");
  console.log("   Super admin: ops@venueflow.app / password123");
  console.log("   Owner:       alex@theatrium.co / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
