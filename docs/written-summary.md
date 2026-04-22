# CBE Loop, Written Summary

**Submission to:** Future Makers Hackathon 2026, MoSTI Uganda.
**Challenge:** Powering Uganda to a $500B Economy.
**Lead applicant:** Brian Okech, `okechbrian@gmail.com`.

---

## 1. Executive summary

CBE Loop is the software core of a circular bio-economy operating model for Ugandan farms. It pays households for pre-sorted organic waste, uses an AI classifier at the aggregation point to verify quality before payment, and routes every approved batch to one of three co-located production stages: poultry, mushroom, and vegetable. Every state change writes to a structured ledger that exports, one click, to a CSV that a loan officer, an organic certifier, or a sustainability-linked lender can audit row by row.

The prototype is live, it is all software, it runs on rails Uganda already has (scales, Android phones, mobile money, SACCOs), and it is ready for a 90-day pilot in a single Kampala ward.

## 2. Problem context, Uganda 2024–2026

Four structural problems converge at the same kitchen bin.

**Waste.** Greater Kampala generates roughly 28,000 tonnes of municipal solid waste each month. Around 60% is organic. Almost all of it is landfilled at Kiteezi, which has been at and over capacity for the last five years. Methane from open organic disposal is a national greenhouse-gas line item and a disaster risk the city has already paid for once.

**Unemployment.** Youth unemployment in Uganda is among the highest in East Africa. Peri-urban wards have working hands, zero farmgate access, and no income stream from their own household activity.

**Feed-system fragility.** Uganda imports a significant share of commercial poultry feed inputs (maize bran, soya, fishmeal). Every currency-shock event of the last four years has shown up as a poultry-margin shock within weeks. Locally sourced, pre-sorted GREEN waste can displace a measurable fraction of that feed at a fraction of the price, but only if the farmer can trust the input stream.

**Green finance without data.** Sustainability-linked lending and voluntary-carbon-market buyers exist in the region, but they do not buy farmer narrative. They buy per-kilogram, per-batch, timestamped, supplier-attributed records. Ugandan farmers do not generate that data today. CBE Loop generates it as a by-product of the procurement flow.

Cash micro-loans do not solve any of this. The instrument has to be a procurement ledger, not a debt instrument, and it has to be carried over hardware households already own.

## 3. Solution architecture

The prototype is vertically sliced: procurement-side (households and intake) and production-side (farm inventory and routing) share one database, one Next.js process, and one audit trail.

### 3.1 Procurement side

- **Supplier ledger (`/supplier`, `/supplier/[id]`).** One row per household, phone number in +256 format, name, trusted-supplier boolean, running total of kilograms supplied and UGX earned, and a per-batch CO₂-diverted counter.
- **Intake station (`/intake`).** An operator form with four inputs: supplier dropdown, category (GREEN / BROWN / REJECT), weight in kilograms, and a photo file. Server Action `recordBatch` in `src/app/actions/intake.ts` runs the full pipeline in one request.
- **Classifier stub (`src/lib/classify.ts`).** Echoes the operator's category with a random confidence score between 0.82 and 0.99, and randomly flags approximately 15% of GREEN / BROWN batches for human review. This is deliberately a contract, not an implementation. The swap-in path is a hosted CLIP zero-shot endpoint or a MobileNet fine-tune; neither changes the surrounding code.
- **Payout stub (`src/lib/payout.ts`).** Accepts a phone, amount, currency, and reference, and returns a fake provider reference in the shape of a real MoMo B2C response. Swap-in target is MTN MoMo or Airtel Money B2C.
- **Rate card (`RateCard` table).** One active row per category, currency = UGX. The seed is GREEN 500, BROWN 300, REJECT 0. The model supports rate changes over time by history-only appends, the intake flow always reads the most recent active row.

### 3.2 Production side

- **Inventory counters (`InventoryCounter` table).** One row per stage: POULTRY, MUSHROOM, VEGETABLE. Each row carries `demandKg` (target feedstock for the current cycle) and `onHandKg` (actual stock). The seed is POULTRY 50 / MUSHROOM 40 / VEGETABLE 20 kg of demand.
- **Routing brain (`src/lib/routing.ts`).** A rules engine, not a model. GREEN waste is eligible for POULTRY or VEGETABLE; BROWN is eligible for MUSHROOM or VEGETABLE; REJECT routes to nothing. Among the eligible stages, the routing brain picks the stage with the largest `demandKg - onHandKg` gap. The design allows swap-in for a learned model later without changing the call site.
- **Farm dashboard (`/farm`).** Operator-facing view of the three counters and the most recent incoming batches, so the farm side can physically receive routed batches.

### 3.3 Sustainability side

- **CO₂ accounting (`src/lib/co2.ts`).** Per-kilogram CO₂-equivalent diverted, 0.58 kg for GREEN, 0.32 kg for BROWN, 0 for REJECT. Midpoint of EPA / IPCC organics-to-landfill estimates. The constant is one line; replacing it with a methodology-specific factor (VM0041, Gold Standard compost) is a single edit.
- **Green-credit report (`/report` + `/api/report/csv`).** A one-click CSV export. Fifteen columns: batch ID, timestamp, supplier name, supplier phone, category, weight, status, classifier score, human-review flag, routed stage, CO₂ diverted, payout amount, payout currency, payout status, payout provider reference. This is the exact shape a green-finance underwriter needs.

## 4. Technical stack

- **Next.js 16.2.4** (App Router, React 19), Server Actions for the intake flow, route handlers for the CSV export.
- **TypeScript**, end-to-end, no JavaScript code paths.
- **Tailwind CSS v4** for styling, dark-mode toggle on the top nav.
- **Prisma 6.19** + **SQLite** for local development. One schema file, six models, zero migration friction. The same schema runs on Postgres with a one-line datasource change.
- **Local filesystem** for intake photos (`public/uploads`), swap-in target is Vercel Blob or S3 for production.
- **Seed** (`prisma/seed.ts`) installs 5 Kampala households, the three-row rate card, and the three inventory counters, so the prototype is demo-ready from a fresh clone.

### 4.1 Stub-to-real swap map

| Subsystem | Current | Pilot swap-in |
|---|---|---|
| Intake classifier | Operator-echo stub, 15% random-review | CLIP zero-shot / MobileNet fine-tune / hosted inference endpoint |
| MoMo payout | Logs + fake provider reference | MTN MoMo Collections / Airtel Money B2C |
| Photo storage | `public/uploads` on the local disk | Vercel Blob or equivalent object storage |
| Grow-room sensors | Manual `InventoryCounter` updates | ESP32-based humidity / CO₂ / temperature sensors writing to the same schema |
| Rate-card pricing | Manual edit | Monthly recalculation tied to feed-cost index + supplier-retention target |

Each contract is stable. The entire production release plan is "replace one function at a time."

## 5. Market and competitive landscape

The adjacent solutions operate on one side or the other of the problem, not both.

- **Asante Waste** and **Yo-Waste** (Uganda, collection-side). Both move bins. Neither prices the content of the bin, neither routes to a farm, neither generates a green-credit audit trail. They are potential partners for last-mile pickup; they are not competitors on the procurement model.
- **Jaguza** and **Ensibuuko** (Uganda, farm-side). Farm management and SACCO-facing financial tools. They assume the farmer already has feedstock; they do not source it. Potential integration partners on the sustainability-reporting side; not competitors on procurement.
- **M-KOPA**, **Apollo Agriculture** (East Africa, credit-side). Pay-as-you-go hardware and input credit. Useful parallels for mobile-money disbursement and risk scoring. Orthogonal to the CBE Loop problem, which is not a credit product.

The differentiator is the bundle: paid sort-at-source **plus** AI-verified intake **plus** three-stage routing **plus** green-credit ledger, as one product. No one in the market today offers the bundle, and the bundle is what makes each individual piece economically viable.

## 6. Business model

- **Procurement spread.** The farm's willingness-to-pay for clean, category-verified feedstock is higher than the household rate card. The operator captures 5–8% on that spread, paid out of feed-cost savings on the poultry stage.
- **Green-finance success fee.** 1% on each green-credit or sustainability-linked drawdown that cites the CBE Loop audit ledger. This is the instrument that converts the per-batch record into cash flow.
- **Data licensing at scale.** Aggregated, anonymised supplier-and-stage data licensed to voluntary-carbon-market buyers and organic certifiers. Not day-one revenue.
- **Zero fee to the household.** The household is a supplier, not a customer, and is always paid on the same second the batch is approved.

Unit-economic working example (conservative):
- 50 households × 8 kg/week sorted = 400 kg/week, roughly 1,600 kg/month.
- Split 60% GREEN / 35% BROWN / 5% REJECT, household payouts ~= (960 × 500) + (560 × 300) + 0 = UGX 648,000/month.
- Farm-side: ~560 kg of poultry-feed supplementation at ~UGX 1,500/kg commercial-feed-equivalent displaced = ~UGX 840,000/month in feed-cost avoidance.
- Farm-side: ~320 kg of mushroom substrate producing ~80 kg of Oyster mushrooms at UGX 8,000/kg wholesale = ~UGX 640,000/month gross.
- Operator margin (6% procurement spread + green-credit success fees) ~= UGX 150,000–250,000/month at ward scale.

Numbers are illustrative. The pilot measures them.

## 7. Pilot plan

- **Location:** one Kampala ward (candidate: Bwaise II or Kasubi, selection based on NEMA waste-to-value designation).
- **Participants:** 50 households, recruited through the ward LC1 office.
- **Aggregation site:** one rented 3m × 3m space, one digital scale, one Android phone running the operator app, one operator at UGX 600,000/month.
- **Mobile money:** one partner SACCO for the MoMo B2C relationship, so payouts are routed through a pooled account.
- **Duration:** 90 days.
- **Stop conditions / learning goals:** (a) >=70% of recruited households supply in week 1, (b) <=10% reject rate at intake, (c) >=30% measured displacement of commercial poultry feed at the receiving farm, (d) first green-credit-eligible CSV issued to a named underwriter by day 75.

Budget (zero-capex, software-only): operator wage + rent + phone credit + classifier hosting. Under UGX 3M total for the 90 days.

## 8. Data protection posture

The system is deliberately PII-minimal.

- **Identifiers.** Phone number in +256 format and human-readable name are the only supplier-level PII. No national ID, no GPS, no financial account number.
- **Photos.** Intake photos are of waste, not of people. A visible-face test is part of the operator SOP (`docs/user-manual.md` §2).
- **Storage.** Files on the intake-site laptop until the nightly sync; then object storage with hashed filenames and no supplier metadata in the path.
- **PDPA 2019 compliance.** Opt-in at registration, revocation-on-request, right-to-export the per-supplier ledger. Processor role sits with the operating SACCO; controller is the farmer-cooperative that owns the procurement contract.
- **Third-party sharing.** None without explicit supplier consent, with one exception: the operator's own rate-card and inventory counters are shareable with the farm without supplier-level PII.

## 9. Roadmap

- **M0, done.** The live prototype. Supplier ledger, intake station, farm dashboard, green-credit report, CSV export. This submission.
- **M1, 30 days post-pilot-start.** Supplier-side phone OTP, Africa's Talking SMS receipts, push notifications of trusted-supplier badge changes.
- **M2, 60 days.** Real classifier, hosted CLIP zero-shot endpoint, tracked accuracy vs. operator-label ground truth.
- **M3, 90 days.** Real routing, learned nutrient-estimation model on top of the current rules engine, mushroom-substrate scheduler, vegetable-bed composting planner.
- **M4, 6 months.** Green-credit ledger export targeting a specific underwriter (candidate: aBi Finance or NSSF green-finance pilot), monthly CSV ingestion.

## 10. Team

{{TEAM_ROSTER}}

**Lead applicant:** Brian Okech, `okechbrian@gmail.com`.

## 11. The ask

1 Kampala ward. 50 households. 90 days. MoSTI endorsement so the ward council authorises the aggregation site. UGX 300M of prize capital, routed approximately 40% to household payouts, 30% to classifier hosting and the one part-time operator, 20% to one round of organic-certification paperwork, 10% reserve. A named introduction to NEMA for the green-credit certification path.

If paying for sort-at-source pulls clean waste out of Kampala households, the CBE Loop compounds, and the pilot's CSV becomes the first bankable circular-bio-economy record on the continent. If it does not, the only money spent was the operator wage, and Uganda has ruled out a model whose absence is costing it a landfill a year.

## 12. Appendix

### 12.1 Data model (from `prisma/schema.prisma`)

- `Supplier` (id, phone unique, name, createdAt, trusted, rejectCount, removed, batches, payouts)
- `WasteBatch` (id, supplier, category, weightKg, photoPath, classifierLabel, classifierScore, humanReview, status, routedStage, co2DivertedKg, createdAt, payout)
- `Payout` (id, supplier, batch unique, amount, currency, status, providerRef, createdAt, paidAt)
- `RateCard` (id, category, pricePerKg, currency, active, createdAt)
- `InventoryCounter` (id, stage unique, demandKg, onHandKg, updatedAt)
- Enums: `WasteCategory` {GREEN, BROWN, REJECT}, `BatchStatus` {PENDING_REVIEW, APPROVED, REJECTED}, `ProductionStage` {POULTRY, MUSHROOM, VEGETABLE}, `PayoutStatus` {PENDING, PAID, FAILED}.

### 12.2 Routes and endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Landing and navigation |
| GET | `/supplier` | List of registered households |
| GET | `/supplier/[id]` | Per-household ledger |
| GET | `/intake` | Operator weigh-in form |
| POST | `recordBatch` (Server Action) | Classify, approve, pay, route, increment inventory, log |
| GET | `/farm` | Live inventory across the three stages |
| GET | `/report` | Green-credit summary view |
| GET | `/api/report/csv` | CSV export, 15 columns, one row per batch |

### 12.3 CSV export columns

`batch_id, created_at, supplier_name, supplier_phone, category, weight_kg, status, classifier_score, human_review, routed_stage, co2_diverted_kg, payout_amount, payout_currency, payout_status, payout_ref`

### 12.4 Public artefacts

- **Live prototype:** https://clearing-assembled-assessment-accomplish.trycloudflare.com
- **Public source:** https://github.com/okechbrian/cbe-loop
- **Concept note:** `docs/concept-note.md`
- **User manual:** `docs/user-manual.md`
- **Pitch deck (on-stage script + Q&A cards):** `docs/pitch-deck.md`
- **Submission email:** `docs/submission-email.md`
