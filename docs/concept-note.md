# CBE Loop, Concept Note

**Future Makers Hackathon 2026 · National Science Week 2026**
**Challenge:** Powering Uganda to a $500B Economy.

> *Kampala throws away a farm every month. We buy it back, one kilogram at a time.*

---

## 1. The problem

Greater Kampala generates roughly 28,000 tonnes of municipal solid waste every month. Around 60% of it is organic, the single most valuable feedstock a Ugandan farm could ask for, and almost none of it reaches a farm. It goes to Kiteezi instead, where it rots, releases methane, and takes up land the city no longer has.

Four things fail at once:

- **No price signal.** Households have no reason to sort waste, so collectors get a contaminated stream that is useless to poultry and mushroom operators.
- **No trust at intake.** Even motivated farmers cannot pay for waste by weight without a way to verify quality on the spot. Disputes kill the flow.
- **No loop.** The few farms that do use food waste use it once, for poultry feed, and lose the downstream value (manure, spent substrate, compost).
- **No sustainability record.** Even when the loop is real, the farmer has no audit-grade evidence to present to a lender or a green-credit buyer.

Cash for waste without verification gets gamed. Cash for waste with verification, but no onward routing, leaves money on the table. Both sides of the problem have to be solved together.

## 2. The solution, CBE Loop

CBE Loop is a software system that turns household organic waste into **three co-located revenue streams**, poultry, mushrooms, and vegetables, by pricing every kilogram at the household and then routing it, automatically, to the production stage that most needs it.

| Component | What it does |
|---|---|
| **Supplier app** (`/supplier`) | Per-household ledger of kilograms supplied, UGX earned, CO₂ diverted from Kiteezi, and a Trusted Supplier badge for zero-reject streaks. |
| **Intake station** (`/intake`) | Operator weigh-in + camera capture. An AI classifier (stubbed as MobileNet / CLIP zero-shot for the prototype) confirms the category and flags contamination before payment. |
| **Payout** | Mobile money is credited on the same second the batch is approved. The supplier leaves the intake point already paid. |
| **Routing brain** (`src/lib/routing.ts`) | Reads live demand from the three production stages (poultry, mushroom, vegetable) and sends every approved batch to the stage with the largest unmet need. |
| **Green-credit report** (`/report` + `/api/report/csv`) | One-click CSV export that a loan officer, organic certifier, or sustainability-linked lender can audit row by row. |

Every state change writes to a structured database (supplier, batch, classifier verdict, payout reference, stage routed, CO₂ diverted). The farm operator gets a running balance. The committee gets a paper trail.

## 3. What is new

- **Pay for sort-at-source.** Previous Ugandan waste ventures (Asante Waste, Yo-Waste) operate on the collection side, they move bins. CBE Loop prices the content of the bin and pays the household directly. That is what converts one-off donations into a supply chain.
- **AI-verified intake.** The operator presses a button and the camera confirms the category before payment. This is the single feature that lets the price-per-kg model work in the field without subjective disputes.
- **Three-stage loop, not a feed supplement.** Every by-product has a designated next use: poultry manure becomes mushroom substrate, spent mushroom substrate becomes vegetable compost, vegetable residue returns to the loop. Three revenue streams from one procurement event.
- **Green-credit ledger as a first-class output.** The system is not just "waste to farm"; it is "waste to farm to auditable sustainability data." The CSV export at `/api/report/csv` is the row-by-row evidence a green-finance underwriter needs to price a loan.

## 4. Why this wins the $500B challenge

Uganda's Vision 2040 / $500B economy needs three things to compound at once: productive capital in rural and peri-urban households, domestic food-system resilience (poultry feed and fertiliser imports are a structural drag), and bankable sustainability data. CBE Loop delivers all three on rails that already exist:

1. **Productive capital.** Every participating household earns a supplement from what they previously paid to throw away. A family supplying 10 kg of sorted GREEN waste per week at UGX 500/kg earns UGX 20,000/month, real money in a peri-urban setting, and it compounds as the loop scales.
2. **Food-system resilience.** One procurement event feeds three products: eggs and meat, gourmet mushrooms, fresh vegetables. Each one displaces imports (feed, fertiliser, protein) and creates local market supply.
3. **Bankable data.** The CSV export, built into the prototype today, is the exact shape that organic certifiers, sustainability-linked lenders, and voluntary-carbon-market buyers require. The farmer becomes creditworthy without a single additional form.

No new hardware category is required for the pilot. Scales, Android phones with cameras, and mobile-money rails are already in every Kampala ward.

## 5. Impact & scale

- **Pilot:** 1 Kampala ward · 50 participating households · 1 aggregation site · 90 days · 1 underwriting SACCO for MoMo payouts.
- **Year-1 target:** 3 wards · 500 households · ~1,500 tonnes of organic waste priced and routed · ~UGX 750M in household earnings · first audited green-credit issuance.
- **Scale ceiling:** the classifier and the routing brain are stateless; one Next.js instance serves thousands of intake events per day. The bottleneck is physical, aggregation points per ward, which the Parish Development Model already funds in principle.
- **Data dividend:** the per-batch record (weight, category, photo hash, CO₂ factor, provider reference) is the licensable exhaust that insurers and export buyers will pay for at national scale.

## 6. Business model

- 5–8% procurement margin retained on the spread between the farm's willingness-to-pay for clean feedstock and the household rate card, paid out of the farm's feed-cost savings.
- 1% success fee on each green-credit or sustainability-linked-finance drawdown that cites the CBE Loop audit ledger.
- At scale: aggregated data licensing to voluntary-carbon-market buyers.
- **Zero fee to the household.**

## 7. Status today

- **Prototype live:** https://clearing-assembled-assessment-accomplish.trycloudflare.com, four pages: supplier ledger, intake station, farm dashboard, green-credit report.
- **Public source:** https://github.com/okechbrian/cbe-loop
- **Stack:** Next.js 16 · TypeScript · Tailwind v4 · Prisma 6 · SQLite (dev) · Server Actions.
- **Working end to end:** a batch recorded at `/intake` runs classifier → approval → MoMo payout stub → inventory increment → CSV row, all in one request.
- **Seed:** 5 Kampala-area households, rate card GREEN 500 / BROWN 300 / REJECT 0 UGX/kg, 3 production stages with live demand counters.

## 8. Team

{{TEAM_ROSTER}}

**Lead applicant:** Brian Okech, `okechbrian@gmail.com`.

## 9. The ask

1 Kampala ward. 50 households. 90 days. MoSTI endorsement, 1 aggregation site, 1 SACCO underwriter for the mobile-money rail. If the price-per-kg model pulls clean sorted waste out of households, the loop compounds. If it does not, no infrastructure was built that cannot be redeployed. Either way, Uganda learns whether paying for sort-at-source is the missing piece in the circular bio-economy.

## 10. Contact

- **Email:** okechbrian@gmail.com
- **Subject-line reference:** FUTURE MAKERS HACKATHON 2026
- **Repo:** https://github.com/okechbrian/cbe-loop
- **Live demo:** https://clearing-assembled-assessment-accomplish.trycloudflare.com
