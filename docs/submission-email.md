# Future Makers Hackathon 2026, Submission email, CBE Loop

This is a mirror of the Gmail draft that will be sent to the Future Makers Hackathon 2026 review committee for the **CBE Loop** entry. The only edit required before sending is to fill the `TEAM` block with 2 to 5 named members.

---

**To:** `info@sti.go.ug`
**Subject:** `FUTURE MAKERS HACKATHON 2026`

---

## Email body

Dear Members of the Future Makers Hackathon 2026 Review Committee,

I am writing to submit CBE Loop, the software core of a circular bio-economy procurement model for Ugandan farms, delivered over Next.js + mobile money so it runs today on rails Uganda already owns, to the Future Makers Hackathon 2026.

CBE Loop pays Ugandan households for pre-sorted organic waste, verifies every batch with an AI classifier at the intake scale, routes the approved feedstock to one of three co-located production stages (poultry, mushroom, vegetable), and writes every kilogram to a CSV audit ledger that a green-finance underwriter or organic certifier can read row by row. The prototype is live, it is all software, it runs on existing hardware (a scale, an Android phone with a camera, a mobile-money account), and the three-stage loop means one procurement event feeds three revenue streams for the farm and one paycheck for the household.

CBE Loop speaks directly to the *"Powering Uganda to a $500B Economy"* challenge because it turns an ignored waste stream (~28,000 tonnes/month of organic waste in Greater Kampala) into three things at once: productive capital in peri-urban households, domestic food-system resilience (displaced feed and fertiliser imports), and bankable sustainability data.

```
────────────────────────────────
LIVE PROTOTYPE
────────────────────────────────

   https://clearing-assembled-assessment-accomplish.trycloudflare.com

   /                Landing and navigation
   /supplier        Per-household ledger, kilograms supplied + UGX earned + CO2 diverted
   /intake          Operator weigh-in, classifier stub, instant mobile-money payout
   /farm            Live inventory across poultry, mushroom, vegetable stages
   /report          Green-credit dashboard
   /api/report/csv  One-click CSV audit ledger (15 columns, one row per batch)

────────────────────────────────
PUBLIC SOURCE
────────────────────────────────

   https://github.com/okechbrian/cbe-loop

────────────────────────────────
SUBMISSION REQUIREMENTS, ARTEFACT INDEX
────────────────────────────────

   1. Prototype or MVP
      Live URL and public repository above.

   2. Short concept note
      https://github.com/okechbrian/cbe-loop/blob/main/docs/concept-note.md

   3. Demo pitch
      Nine-slide, five-minute script with eight Q&A cards:
      https://github.com/okechbrian/cbe-loop/blob/main/docs/pitch-deck.md
      The on-stage delivery will take place between 28 April and 3 May 2026.

   4. Written summary
      https://github.com/okechbrian/cbe-loop/blob/main/docs/written-summary.md

   5. User manual (supplier / intake operator / farm operator / partner)
      https://github.com/okechbrian/cbe-loop/blob/main/docs/user-manual.md

────────────────────────────────
TEAM  (2 to 5 members, per hackathon rules)
────────────────────────────────

   >>> [TEAM ROSTER, PLEASE FILL BEFORE SENDING] <<<

   {{TEAM_ROSTER}}

────────────────────────────────
STACK
────────────────────────────────

Next.js 16 (App Router, React 19, TypeScript) · Tailwind CSS v4 · Prisma 6 + SQLite (dev) · Server Actions for the intake flow · EPA/IPCC-derived CO2 factors (`src/lib/co2.ts`) · stub classifier (`src/lib/classify.ts`) with a CLIP zero-shot / MobileNet swap-in path · stub MoMo payout (`src/lib/payout.ts`) with an MTN MoMo / Airtel Money swap-in path · 15-column audit CSV export at `/api/report/csv`.

────────────────────────────────
PILOT ASK
────────────────────────────────

1 Kampala ward · 50 households · 1 aggregation site · 90 days · 1 SACCO for the mobile-money rail. No new hardware category. MoSTI endorsement + a named NEMA introduction for the green-credit certification path. If paying for sort-at-source pulls clean waste out of Kampala households, the CBE Loop compounds and the pilot CSV becomes the first bankable circular-bio-economy record in the country. If it does not, the only money spent was the operator wage.

────────────────────────────────
```

I am available for clarifying questions at `okechbrian@gmail.com`, and am ready for any demo slot between 28 April and 3 May 2026.

Thank you for considering CBE Loop.

Yours sincerely,

**Brian Okech**
On behalf of the CBE Loop team
`okechbrian@gmail.com`

---

## Send checklist

- [ ] Team roster filled, two or more named members, each with role, email, and a one-line bio.
- [ ] Live prototype URL responds (`curl -s https://clearing-assembled-assessment-accomplish.trycloudflare.com` returns HTTP 200).
- [ ] Repository is public and all five `docs/` files render anonymously on GitHub.
- [ ] Subject line matches the ad exactly: `FUTURE MAKERS HACKATHON 2026`.
- [ ] QR-code application form (on the poster) scanned in parallel, if the form asks for fields beyond what is in this email, copy-paste from the repo docs.
- [ ] Copy saved to the applicant's *Sent* folder as the definitive submission record.

## Post-send

- Keep the Cloudflare tunnel process alive until the on-stage demo window (28 April to 3 May 2026). If the laptop must sleep before then, promote the quick tunnel to a named Cloudflare Tunnel on a stable subdomain and update this document + the Gmail sent copy with the new URL via a short follow-up reply.
- If the committee asks why this submission is adjacent to a prior Mavuno submission from the same lead applicant: both prototypes are from the same team; one addresses farm access to productive capital (Mavuno), the other addresses farm access to feedstock and sustainability finance (CBE Loop); winning one does not preclude the other, and the committee should read them as complementary, not duplicate.
