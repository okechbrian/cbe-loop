# Circular Bio-Economy Loop

A prototype of the procurement-side of a zero-waste agriculture system:
paid household organic-waste collection feeding a three-stage production chain
(Poultry → Mushrooms → Vegetables), orchestrated by an AI agent.

Based on the proposal: _The Circular Bio-Economy Loop — A Household-Sourced
Waste Procurement Model for Integrated Poultry, Mushroom, and Vegetable Production._

## What this prototype covers

The commercial core of the proposal — "households reliably pre-sort when paid,
and an AI verifies quality at intake" — is implemented end-to-end as a thin
vertical slice:

- **Supplier app** (`/supplier`) — per-household ledger: kg supplied, earnings,
  CO₂ diverted, "Trusted Supplier" badge.
- **Intake station** (`/intake`) — operator weigh-in with a stub AI classifier,
  auto-approve / human-review routing, stubbed mobile-money payout, and
  per-stage inventory update.
- **Rate card + inventory counters** — feed the (rules-based) routing brain
  that decides which production stage each batch goes to.

## What's stubbed (deliberately)

Until pilot funding lands, these are interfaces rather than implementations:

| Subsystem | Current | Swap-in path |
|---|---|---|
| Vision classifier | echoes operator's category + random review flag | CLIP zero-shot / MobileNet fine-tune / hosted endpoint |
| Mobile-money payout | logs + returns fake `providerRef` | M-Pesa Daraja B2C or similar |
| Grow-room sensors | manual `InventoryCounter` rows | real humidity/CO₂/temperature sensors |
| Feed balancer | out of scope for slice 1 | nutrient-estimation model tied to dispenser |

## Roadmap

1. **M0 — skeleton** (this repo): Next.js 16 + Prisma/SQLite, supplier +
   intake pages, stubs for classifier / payout / sensors.
2. **M1 — supplier app polish**: phone OTP, push notifications, CO₂ badge share.
3. **M2 — real classifier**: run CLIP zero-shot locally, log photo + label,
   ground-truth review queue.
4. **M3 — real routing**: feed balancer, mushroom substrate scheduler,
   vegetable-bed composting planner.
5. **M4 — sustainability ledger**: per-household + per-farm reports export
   (CSV) for green-credit / sustainability-linked finance applications.

## Stack

- Next.js 16 (App Router, Server Actions)
- TypeScript
- Tailwind CSS v4
- Prisma 6 + SQLite (local dev)

## Dev setup

```bash
# one-time
npm install
npx prisma migrate dev --name init
npx tsx prisma/seed.ts

# run
npm run dev
# open http://localhost:3000
```

## Domain model

See `prisma/schema.prisma`. Core entities: `Supplier`, `WasteBatch`, `Payout`,
`RateCard`, `InventoryCounter`.

## License

MIT
