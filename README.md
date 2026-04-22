# CBE Loop

> *Kampala throws away a farm every month. We buy it back, one kilogram at a time.*

Circular Bio-Economy Loop, a prototype of the procurement side of a zero-waste agriculture system: paid household organic-waste collection feeding a three-stage production chain (Poultry, Mushrooms, Vegetables), orchestrated by an AI agent.

Based on the proposal _The Circular Bio-Economy Loop, A Household-Sourced Waste Procurement Model for Integrated Poultry, Mushroom, and Vegetable Production._

---

## Future Makers Hackathon 2026, submission index

Submitted to MoSTI Uganda's Future Makers Hackathon 2026 ("Powering Uganda to a $500B Economy"). Application deadline: **2026-04-22**. Demo window: **2026-04-28 to 2026-05-03**.

- **Live prototype:** https://clearing-assembled-assessment-accomplish.trycloudflare.com (ephemeral Cloudflare quick tunnel, promoted to a named tunnel before the demo window)
- **Public source:** https://github.com/okechbrian/cbe-loop
- **Short concept note:** [`docs/concept-note.md`](docs/concept-note.md)
- **Written summary:** [`docs/written-summary.md`](docs/written-summary.md)
- **Demo pitch (9-slide, 5:00 script, 8 Q&A cards):** [`docs/pitch-deck.md`](docs/pitch-deck.md)
- **User manual (supplier / intake operator / farm operator / partner):** [`docs/user-manual.md`](docs/user-manual.md)
- **Submission email draft:** [`docs/submission-email.md`](docs/submission-email.md)

---

## What this prototype covers

The commercial core of the proposal, "households reliably pre-sort when paid, and an AI verifies quality at intake", is implemented end-to-end as a thin vertical slice:

- **Supplier app** (`/supplier`), per-household ledger: kg supplied, earnings, CO₂ diverted, "Trusted Supplier" badge.
- **Intake station** (`/intake`), operator weigh-in with a stub AI classifier, auto-approve / human-review routing, stubbed mobile-money payout, and per-stage inventory update.
- **Farm dashboard** (`/farm`), live inventory across poultry, mushroom, vegetable stages.
- **Green-credit report** (`/report` + `/api/report/csv`), sustainability CSV export for loan officers and certifiers.

## What's stubbed (deliberately)

Until pilot funding lands, these are interfaces rather than implementations:

| Subsystem | Current | Swap-in path |
|---|---|---|
| Vision classifier | echoes operator's category + random review flag | CLIP zero-shot / MobileNet fine-tune / hosted endpoint |
| Mobile-money payout | logs + returns fake `providerRef` | MTN MoMo Collections / Airtel Money B2C |
| Grow-room sensors | manual `InventoryCounter` rows | real humidity / CO₂ / temperature sensors |
| Feed balancer | out of scope for slice 1 | nutrient-estimation model tied to dispenser |

## Roadmap

1. **M0, skeleton** (this repo): Next.js 16 + Prisma/SQLite, supplier + intake pages, stubs for classifier / payout / sensors.
2. **M1, supplier app polish**: phone OTP, push notifications, CO₂ badge share.
3. **M2, real classifier**: run CLIP zero-shot locally, log photo + label, ground-truth review queue.
4. **M3, real routing**: feed balancer, mushroom substrate scheduler, vegetable-bed composting planner.
5. **M4, sustainability ledger**: per-household + per-farm reports export (CSV) for green-credit / sustainability-linked finance applications.

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

See `prisma/schema.prisma`. Core entities: `Supplier`, `WasteBatch`, `Payout`, `RateCard`, `InventoryCounter`.

## License

MIT

## Hackathon context

Entry for **Future Makers Hackathon 2026** (National Science Week, Uganda). Application deadline: 22 Apr 2026. Demo week: 28 Apr to 3 May 2026. Prize: UGX 300M × 3 winners in funding, mentorship, and partnerships.

Challenge: _"Powering Uganda to a $500B Economy."_
