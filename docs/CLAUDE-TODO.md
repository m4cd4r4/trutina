# Out-of-scope follow-ups from the Claude Design migration

Captured during PR `design/claude-design-system`. None of these belong on
that branch; each needs its own ticket.

## Backend schema growth (needed before the evidence stub is fully realised)

Each row corresponds to a fallback path implemented in
`frontend/lib/case-modules.ts:evidenceView()`. When the backend grows the
field, the stub will render the richer panel without UI changes.

- `FraudFlag.evidence.page` (number): which page of the source document the flag fired on
- `FraudFlag.evidence.sha256` (string): integrity hash of the source PDF
- `FraudFlag.evidence.crop` ({x,y,w,h} 0..1): rectangle to highlight in the page preview
- `FraudFlag.evidence.byte_offset` (string): hex byte range, e.g. `0x00008a4c - 0x00008b21`
- `FraudFlag.evidence.fired_at` (ISO timestamp): when the rule evaluated
- `FraudFlag.evidence.fired_ms` (number): how long the rule took to evaluate
- Per-module aggregate score on the case payload, if the current `sum(flag.weight) clamped 0..100` heuristic proves too coarse

## Broker view fields

The broker stacked-cadence chart and shared-producer cluster panel ship
with honest empty states until these arrive:

- `Broker.aggregator` (string, e.g. AFG / Connective / Loan Market)
- A cluster-detection endpoint that groups a broker's last-N submissions by producer-string hash and returns shared signatures
- Weekly tier breakdown derived endpoint (currently the frontend computes from the case list; ok at small scale, will need a backend rollup at volume)

## Case-detail fields not surfaced

- `Case.product` (e.g. "Owner-occupied P&I, 30y") — design header has a slot for it
- `Case.lvr` (number)
- `Case.confidence` (number 0..1)

## Marketing surface

- Methods paper (PDF). The trust-strip placeholder note links to it.
- Sourced fraud-rate / FP-rate / latency / time-saved numbers, when measured. The four trust-strip values that were in the Claude Design kit had no provenance and were cut on this branch.
- Per-broker / per-rule submission-quality breakdowns to back the Network tier's "Quarterly anonymised industry report" claim.

## Out-of-scope pages still on the old palette

These routes still contain raw hex colours and the dark teal theme. Not
in the design migration's scope (the brief listed only marketing,
dashboard, cases/[id], brokers/[id], demo/[id]). Migrate when capacity:

- `app/docs/*` (one-pager, pitch, compliance, integration, quickstart, risk-scores, roi, security)
- `app/login/page.tsx`
- `app/cases/new/page.tsx`

When migrated, drop the per-page `#0a1210` substrate and reuse the token
layer; `RiskBadge` from `components/design/atoms` replaces the bespoke
risk-pill in `components/ui/RiskBadge.tsx`.

## Engagement-loop gaps D1-D10

Listed in PRODUCT_AUDIT_REPORT.md. Out of scope for the design
migration: onboarding tour copy update, post-analysis CTAs, email
nurture sequences. The driver.js styling is now light-theme so the tour
will render against the new substrate; copy review is a separate PR.

## Security findings S1-S19

Open from PRODUCT_AUDIT_REPORT.md. Untouched by the design migration.
Each is its own branch.

## Playwright visual-regression — first-run snapshotting

The visual-regression spec at `frontend/tests/visual/styleguide.spec.ts`
expects baseline PNGs in `tests/visual/styleguide.spec.ts-snapshots/`.
On first run the spec attempts to copy the reference set from
`I:/Scratch/trutina/design/Trutina Design System (2)/screenshots/`. If
that path is not available (CI, fresh checkout, another machine), run:

```
cd frontend && npm run test:visual:update
```

…to authorise the current rendering as the baseline. The reference PNGs
should ideally live inside the repo at `docs/design/screenshots/`
checked-in alongside the schema-mapping doc.

## Trial number assertions in the marketing footer

The `MeasurementsSection` example blocks include fabricated numbers
("$3,636.00 off by $47.20", "ABN 51 824 753 556 cancelled 2024-08-12").
These are illustrative for the methods explanation, not measured claims
about a real customer. If a regulator reads them literally they should
be marked as worked examples; consider adding a small "EXAMPLE" stamp
or footnote per block.
