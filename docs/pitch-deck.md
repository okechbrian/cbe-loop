# CBE Loop, 5-minute Pitch Deck

> *Kampala throws away a farm every month. We buy it back, one kilogram at a time.*

Nine slides, 30 seconds each. Eight Q&A cards for the five minutes of committee questions that follow. Delivered on stage during the Future Makers Hackathon 2026 demo window, 2026-04-28 to 2026-05-03.

---

## Slide 1, Cold open (30 s)

**Visual:** a single photo of Kiteezi landfill, then cut to a kitchen bin in a Kampala home.

**Speaker:** "Good [morning]. I'm Brian Okech. Meet CBE Loop. Greater Kampala throws away 28,000 tonnes of waste every month. Sixty percent of it is organic. None of it gets to a farm. Today we change that."

## Slide 2, The problem (35 s)

**Visual:** four-panel grid, each panel one failure.

**Speaker:** "Four things fail at once. Households have no reason to sort, so collectors get a contaminated stream. Farmers cannot pay by weight without on-the-spot verification. The farms that do use food waste use it once. And when the loop is real, there is no audit trail a lender will trust. Solve one, you still fail. You have to solve all four in the same session."

## Slide 3, The insight (35 s)

**Visual:** a three-step arrow: HOUSEHOLD → INTAKE → FARM. Price tag above "household", camera icon above "intake", three silos above "farm".

**Speaker:** "The insight is small and obvious in hindsight. Pay for sort-at-source. Verify at intake with a camera. Route to three farm stages at once. One procurement event. Three revenue streams. And every kilogram is audit-grade from the first weigh-in."

## Slide 4, The three-stage loop (40 s)

**Visual:** the resource-flow table from the proposal: Poultry → Mushroom → Vegetable, with arrows for manure and spent substrate.

**Speaker:** "Stage A: GREEN waste, vegetable peels, fruit trimmings, feeds the birds. Stage B: BROWN waste, coffee grounds, cardboard, sawdust, plus manure from Stage A, grows the mushrooms. Stage C: spent mushroom substrate plus composted bedding, grows the vegetables. Nothing leaves the system. Each stage pays for the next."

## Slide 5, Live demo (60 s)

**Visual:** screen share of the running prototype at the tunnel URL.

**Speaker:**
1. "Supplier page. Here are five Kampala households, each with their earnings ledger in UGX and kilograms diverted from Kiteezi." *(click one)*
2. "Intake station. I'm the operator. I pick a supplier, pick GREEN, weigh 8 kilograms, snap a photo, submit." *(submit)*
3. "The classifier confirms the category, the batch is approved, UGX 4,000 is sent to the supplier's phone, the batch is routed to Poultry because that's the stage with the most unmet demand today, and the CO₂ diverted counter ticks up by 4.64 kilograms."
4. "Farm dashboard. Poultry demand just dropped by 8 kilograms."
5. "Green-credit report. One click, CSV export. Every row is a batch, a supplier, a category, a CO₂ figure, a payout reference. This is what a green-finance underwriter asks for."

## Slide 6, Why now (25 s)

**Visual:** three icons, policy document, mobile-money logo, vision model.

**Speaker:** "Three things converged in the last twelve months. NEMA waste-to-value policy actively rewards diversion. Mobile money sits on 70% of adult phones. And a zero-shot vision classifier that used to need a data-science team now fits in a hosted endpoint for pennies per call. The infrastructure is finally ready."

## Slide 7, The pilot (30 s)

**Visual:** map pin on a Kampala ward, a ticker beneath it counting households to 50.

**Speaker:** "One ward. Fifty households. Ninety days. One aggregation site. One SACCO for the mobile-money rail. No new hardware category. At the end of 90 days we will know, with receipts, whether paying for sort-at-source is the missing piece in the Ugandan circular bio-economy."

## Slide 8, The ask (25 s)

**Visual:** a list of three items.

**Speaker:** "Three things from the Future Makers committee. MoSTI endorsement, so the ward council lets us put up the aggregation site. UGX 300M of prize capital, routed to household payouts, classifier hosting, and a single part-time intake operator. And a partnership introduction to NEMA for the green-credit certification path. We supply the code, the data, and the weekly report."

## Slide 9, Close (20 s)

**Visual:** the opening photo again, landfill, then kitchen bin, then the three farm stages, then the CSV export.

**Speaker:** "Kampala throws away a farm every month. CBE Loop buys it back, one kilogram at a time, and turns it into eggs, mushrooms, vegetables, and an audit trail a bank can read. Thank you."

---

## Q&A cards

Eight cards. Keep the answer under 40 seconds, lead with the number, follow with the mechanism.

### Card 1, "How accurate is the classifier?"

"Good question. The prototype uses a stub that echoes the operator's category and flags 15% for human review, so you can feel the flow. The pilot swaps in a hosted CLIP zero-shot or a MobileNet fine-tune. Published CLIP zero-shot accuracy on food-versus-non-food images is about 94%. We gate below 70% confidence to human review, so the false-approval rate is structurally bounded, not accuracy-dependent."

### Card 2, "What stops a household from gaming the system?"

"Three defences, in order. One, the camera at intake, plastic fragments and non-organic matter are the easiest thing a vision model flags. Two, the Trusted Supplier badge, it earns a premium rate, and one rejected batch resets the streak, so the incentive is to be clean every time. Three, running rejects are tracked per supplier, and three strikes removes them from the rate card."

### Card 3, "Why mobile money? Isn't that expensive?"

"MoMo B2C charges roughly 1–3% per transaction in Uganda. At UGX 500/kg for GREEN waste, that is UGX 5–15 per kilogram. Cheaper than the dispute-resolution cost of cash at the aggregation point, faster than voucher redemption at a SACCO counter, and it leaves a digital receipt that becomes the household's credit history. The prototype logs a stub payout reference today. Swap-in for Daraja B2C or MTN MoMo API is a two-week ticket."

### Card 4, "How do you calculate CO₂ diverted?"

"We use an EPA/IPCC midpoint factor: 0.58 kg CO₂-equivalent avoided per kilogram of high-nitrogen organic waste kept out of an open landfill, 0.32 kg for high-carbon. The factor is in `src/lib/co2.ts`, one line, and is deliberately conservative. For a voluntary-carbon-market buyer we would move to a methodology-specific value (for example VM0041 or a Gold Standard compost protocol) and attach the audit CSV."

### Card 5, "Sensors, when, and how much?"

"Not in the pilot. Stage A (poultry) runs on the existing commercial feed scale. Stage B (mushroom) needs humidity and CO₂ sensors eventually, off-the-shelf ESP32 modules are under USD 20 each and log to the same Prisma schema. Stage C (vegetable) is unsensored. We deliberately ship software first so the procurement side is validated before we spend a shilling on hardware."

### Card 6, "Unit economics, the one-slide version?"

"At steady-state, a 50-household ward supplies roughly 4 tonnes of sorted waste per month. GREEN share at UGX 500/kg and BROWN at UGX 300/kg pays out about UGX 1.6M to households. The farm captures ~35% feed-cost savings on poultry (displaced grain) plus roughly 200 kg of mushrooms per month at wholesale UGX 8,000/kg. Break-even is ward-level in month 2 on conservative assumptions."

### Card 7, "Why Next.js on SQLite? Isn't that a toy stack?"

"Deliberate. Next.js Server Actions give us a zero-boilerplate HTTP surface for an operator-facing intake flow, no separate API server to maintain. SQLite is a one-file database that survives a laptop reboot and exports cleanly to Postgres on day one of the pilot. The whole procurement flow, form submit to payout to inventory update to CSV export, is ninety lines of TypeScript you can read in one sitting. That is a feature, not a toy."

### Card 8, "How does CBE Loop relate to Mavuno?"

"Two prototypes, same team. Mavuno turns soil data into non-cashable energy credit for smallholder irrigation. CBE Loop turns household waste into three revenue streams for a peri-urban farm. They share a philosophy, price a signal the market currently misses, audit every kilogram, refuse to lend cash the farmer cannot repay in kind. One is upstream (farm access to productive capital), the other is downstream (farm access to feedstock and sustainability finance). Winning one does not preclude the other."
