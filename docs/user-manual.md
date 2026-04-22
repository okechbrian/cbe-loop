# CBE Loop, User Manual

> *Kampala throws away a farm every month. We buy it back, one kilogram at a time.*

This manual covers four audiences:
1. **Household supplier**, the person sorting waste at home and walking it to the aggregation point.
2. **Intake operator**, the person at the aggregation point who weighs, classifies, pays, and routes.
3. **Farm operator**, the person on the receiving end who physically takes routed batches and manages the three production stages.
4. **Partner**, MoSTI / NEMA / SACCO / green-finance underwriter staff who audit the system.

---

## 1. For the household supplier

### 1.1 What CBE Loop does for you

CBE Loop pays you, by mobile money, for organic waste you already throw away. You sort at home, you carry it to the nearest aggregation point, the operator weighs it and takes a photo, the camera confirms it is clean, and the payment arrives on your phone before you leave the site.

### 1.2 Sorting at home

Keep three bins in your kitchen:

| Colour | Category | Examples |
|---|---|---|
| Green | GREEN, high-nitrogen | Vegetable peels, fruit trimmings, eggshells, grain leftovers |
| Brown | BROWN, high-carbon | Coffee grounds, cardboard, sawdust, dry leaves |
| Red | REJECT, not paid for | Plastic, glass, metal, cooked meat scraps with bones |

Two rules:

- **Do not mix.** A green bin with plastic fragments is not paid for and counts as a reject strike against your account.
- **Keep it dry where you can.** Wet BROWN waste loses weight on the scale and earns less than dry BROWN waste.

### 1.3 At the aggregation point

1. Bring your bins (or a tied bag per category).
2. Give the operator your registered phone number.
3. The operator weighs each category and takes one photo per bag.
4. If the classifier is unsure, the operator will ask you to pull out obvious contamination before the batch is approved.
5. Mobile money payment arrives at the operator's "Send" step. Your phone pings before you leave.

Typical timing: under 3 minutes per household per visit.

### 1.4 Checking your ledger

Visit `/supplier/[your-id]` (printed on your receipt) or ask the operator to open it for you. The page shows:

- Every batch you have supplied, most recent first.
- Category, weight, status (APPROVED / PENDING / REJECTED), and UGX paid.
- Lifetime total kilograms supplied and UGX earned.
- Lifetime CO₂ diverted from Kiteezi, in kilograms.

### 1.5 The Trusted Supplier badge

Five consecutive approved batches with no rejects earns a **Trusted Supplier** badge. The badge unlocks a premium rate per kilogram on GREEN and BROWN, and visible priority if there is a queue at the aggregation point.

A single rejected batch resets the streak but does not remove the badge immediately. Three rejected batches in a rolling 30-day window removes you from the rate card. The operator will speak to you before the third strike.

### 1.6 If your batch is rejected

Reasons, in order of frequency:

- Wrong category (GREEN waste in the BROWN bin, usually).
- Contamination (plastic, glass, or meat in an otherwise-clean bin).
- Weight too low to be useful (under 0.5 kg per visit).

The operator will show you the photo and the classifier result. You can re-sort at the site, bring it back tomorrow, or withdraw.

---

## 2. For the intake operator

### 2.1 Opening the station

1. Open `http://<aggregation-laptop>:3001/intake` on the site laptop.
2. Confirm the three stages show live demand on the top bar (POULTRY, MUSHROOM, VEGETABLE).
3. Confirm the printer and scale are connected if in use.

### 2.2 Recording a batch

1. **Supplier dropdown.** Pick the registered household by phone or name.
2. **Category.** Pick GREEN, BROWN, or REJECT based on what the supplier presented.
3. **Weight.** Read the scale, enter kilograms.
4. **Photo.** Snap one photo per bag, with good light.
5. **Submit.**

The system runs, in one request:

- The classifier (`classifyStub` → real CLIP zero-shot in production). Confidence below 0.70 triggers human review; the batch is logged as PENDING_REVIEW and not paid.
- The approval step. Approved batches are routed to the stage with the largest unmet demand.
- The payout. Mobile money is sent in the same request; the provider reference is logged to the `Payout` table.
- The inventory increment. The receiving farm stage's `onHandKg` ticks up.

### 2.3 Human-review queue

Any batch tagged `humanReview = true` appears in the review queue on `/intake`. You have three options per batch:

- **Approve manually** (the supplier is in front of you, you confirm the category visually).
- **Reject** (the classifier caught real contamination).
- **Defer** (you are not sure; the batch stays PENDING_REVIEW and the supplier will be called back).

The pilot SOP is: never leave a batch in PENDING_REVIEW at end of day. Either approve or reject.

### 2.4 Photo hygiene

Every photo is of waste, not of people. If a supplier's face is visible in the frame, retake the photo. The SOP is intentional: the system generates an audit trail that will be shared with an underwriter, and the underwriter should not see supplier faces.

### 2.5 End-of-day checklist

1. All batches resolved (no PENDING_REVIEW rows for today).
2. All APPROVED batches have a Payout row with status PAID.
3. Sync photos to object storage (if the site is online) or queue for morning sync.
4. Export `/api/report/csv` and save to the site drive. This is the day's evidence.

### 2.6 Common error recovery

| Symptom | What to do |
|---|---|
| Payout shows FAILED | Retry via the operator dashboard; if it fails twice, switch to the SACCO manual rail, log the batch as paid-manual |
| Scale reads 0.0 | Check the scale is zeroed, re-weigh, do not submit a 0-kg batch |
| Photo upload hangs | The laptop has lost internet, continue recording, the photos sync on reconnect |
| Classifier returns the wrong category | Override to the correct category on the form, the operator override is logged alongside the classifier output |

---

## 3. For the farm operator

### 3.1 The farm dashboard

Open `/farm`. You see:

- Three counters, one per stage: POULTRY, MUSHROOM, VEGETABLE.
- For each stage: `demandKg` (what the stage needs this cycle), `onHandKg` (what has physically arrived), and the delta (unmet demand in red, fully fed in green).
- A list of the most recent incoming batches with their routed stage, so you can match arriving bags to the dashboard in real time.

### 3.2 Receiving a routed batch

When a batch arrives at the farm from the aggregation point:

1. Match the physical bag tag (QR or handwritten batch ID) to the batch row on `/farm`.
2. Confirm the weight matches the intake weight (scale at the farm is the tiebreaker).
3. Move the contents into the correct stage's holding area.
4. No further UI action is needed, the `onHandKg` already ticked up when the batch was approved at intake.

### 3.3 Closing a production cycle

When a stage finishes a cycle (eggs laid, mushrooms harvested, vegetables picked):

1. Reset `onHandKg` to 0 for that stage.
2. Set a new `demandKg` based on the next cycle's feedstock target.
3. The routing brain picks up the new demand on the next batch.

This is a manual step in M0. M3 automates it with a cycle-scheduler.

### 3.4 Cross-stage transfers

The loop's by-products (poultry manure → mushroom substrate, spent mushroom substrate → vegetable compost) are not tracked per-batch in M0; they are tracked as cycle-end aggregates. In M3 they become their own `WasteBatch` rows with a dedicated `ProductionStage` source, so the audit ledger covers the entire loop, not just household inputs.

---

## 4. For the partner dashboard

### 4.1 Opening the dashboard

Browse to `/report`.

You see:

- **Totals.** Lifetime kilograms supplied, lifetime UGX paid, lifetime CO₂ diverted.
- **Per-supplier table.** Name, phone, batches, kilograms, UGX, reject rate, trusted-supplier status.
- **Per-stage table.** POULTRY, MUSHROOM, VEGETABLE: cumulative kilograms received, current onHand, current unmet demand.
- **Per-batch table.** Every batch, most recent first.

### 4.2 Exporting the audit CSV

Click **Download CSV** on `/report`, or hit `/api/report/csv` directly. The file has 15 columns, one row per batch:

`batch_id, created_at, supplier_name, supplier_phone, category, weight_kg, status, classifier_score, human_review, routed_stage, co2_diverted_kg, payout_amount, payout_currency, payout_status, payout_ref`

This is the audit artefact. For a green-credit underwriter:

- `co2_diverted_kg` is the carbon figure. Sum per period.
- `payout_amount` is the economic activity figure. Sum per supplier for PDPA-compliant wealth-diversion reporting.
- `status` + `classifier_score` is the quality-control audit. Filter for `status = APPROVED` AND `classifier_score >= 0.7` to get the clean stream.

### 4.3 Verifying a claim

If the operator tells an underwriter that a given supplier earned UGX 50,000 last month and diverted 60 kg of CO₂:

1. Download the CSV.
2. Filter to the supplier's phone and the month.
3. Sum `payout_amount` and `co2_diverted_kg`.

If the numbers do not match within a rounding tolerance, the operator has a problem, not you. Flag it to the SACCO contact.

### 4.4 CO₂ factor transparency

The per-kilogram CO₂-equivalent factors are in `src/lib/co2.ts`, one line per category:

- GREEN: 0.58 kg CO₂e / kg
- BROWN: 0.32 kg CO₂e / kg
- REJECT: 0 kg CO₂e / kg

These are EPA / IPCC midpoint estimates, deliberately conservative. For a specific methodology (VM0041, Gold Standard compost, or a Ugandan NDC protocol), the factor is a one-line edit, and the CSV export regenerates with the new figure on the next run.

---

## 5. Data privacy

- Supplier PII is phone number and name. No GPS, no national ID, no financial account number is collected.
- Photos are of waste, not of people. The operator SOP rejects any photo with a visible face.
- PDPA 2019 compliance: opt-in at registration, revocation on request, per-supplier ledger export available on demand.
- Third-party sharing: none without explicit supplier consent. The sole exception is per-stage inventory (not supplier PII), shared with the receiving farm.

Questions: write to the CBE Loop operations team via your SACCO contact.

---

## 6. Support

- **Supplier account, SIM registration, lost receipt** → SACCO operations line.
- **Intake station technical** → aggregation-site laptop admin.
- **Farm dashboard / CSV / API** → MoSTI technical liaison.
- **Green-credit certification paperwork** → partner underwriter.
