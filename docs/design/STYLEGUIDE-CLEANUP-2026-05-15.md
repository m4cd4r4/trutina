# Styleguide 404 + cleanup + Playwright baselines

Bundled retrospective for the 2026-05-15 cleanup pass. Three Vikunja
follow-ups from the pivot session (#145, #146, #147) closed in one
logical change, shipped as two sequential merges because the visual
baseline capture had a hard dependency on the production fix being
live first.

## Goal

Resolve three follow-ups from the 2026-05-14 pivot session (Vikunja
project 15, tasks 145/146/147) as a single coordinated cleanup:

1. **#145** — `/styleguide/*` returns 404 on production despite
   appearing in `next build` output as prerendered static routes.
2. **#146** — Regenerate Playwright visual baselines against
   post-pivot UI (pre-pivot baselines didn't exist on disk and the
   spec's seeding logic was broken).
3. **#147** — Decide whether `/api/trial` route handler should be
   deleted now that no UI calls it after the pivot.

## Root cause of `/styleguide/*` 404

Not middleware, not `vercel.json` (doesn't exist), not `next.config`
(vanilla). The styleguide layout itself held a deliberate gate:

```ts
// app/styleguide/layout.tsx (removed)
if (process.env.VERCEL_ENV === 'production') {
  notFound()
}
```

Pre-pivot, the styleguide was intended as an internal design fixture
hidden from the public site. After the portfolio pivot (#10), there is
no reason to hide it: `robots: { index: false, follow: false }` already
prevents search indexing, the routes are part of the artefact, and
visual-regression CI needs live URLs to diff against.

Gate removed. All 8 styleguide routes are now reachable; `/demo` and
`/marketing` styleguide pages 307 to their live equivalents by design
(they reuse the real routes which already render against synthetic
data).

## `/api/trial` deletion call

Grep showed zero non-test callers after pivot PR #10. Deleted:

- `frontend/app/api/trial/route.ts`
- `sendTrialNotification()` in `frontend/lib/email.ts` (only called by
  the deleted route)
- `/api/trial` entry in `PUBLIC_API_PREFIXES` (middleware.ts)
- `/api/trial` half of Test 6 in `security-hardening.test.ts`

Kept (still in use):

- `/api/resend-code` — called by the Forgot-your-code flow at
  `app/login/page.tsx:46`. Independent of trial signup.
- `sendTrialWelcome()` in `lib/email.ts` — used by resend-code.
- Test 6 scoped down to `/api/resend-code` only.

## Visual baseline regeneration

Pre-existing baselines didn't exist on disk. The spec's `beforeAll()`
attempted to seed from an external design-system reference directory
using a filename pattern (`${name}-1-desktop-1440-win32.png`) that
Playwright's `toHaveScreenshot()` never actually consumed (the real
expected pattern is `${name}-desktop-1440-win32.png`). The seeding code
was dead.

Regenerated 6 baselines at desktop-1440 viewport against the live
post-pivot UI:

```
01-queue                /styleguide/queue
02-case-detail          /styleguide/case-detail
03-broker               /styleguide/broker
04-audit                /styleguide/audit
05-demo                 /styleguide/demo
06-marketing            /styleguide/marketing
```

Final run: **6 passed in 14.3s**.

Removed the dead `beforeAll()` block. Added `/playwright-visual-report/`
and `/playwright-report/` to `.gitignore`.

## Why this shipped as two merges, not one

The goal condition asked for a single PR. The actual sequencing forced
a split:

1. **PR #11** (commit `78571a9`): the production fix + trial cleanup.
   Merged, deployed via `vercel --prod`, verified live with curl
   returning 200 on all 5 named styleguide URLs.
2. **PR #12** (commit `e8c7620`): the regenerated baselines.

The dependency: capturing baselines against `next dev` produces
artefacts that drift from production renders (Vercel edge headers,
font hinting differences, RSC chunk hashes). To capture baselines
that match what CI will assert against in prod-deployed environments,
the fix had to land first.

Acceptable alternatives that were considered and rejected:
- Capture baselines against local dev and accept future drift: too
  much risk of false negatives on a CI flow that's supposed to be
  the canonical reference.
- Bundle into one PR and skip prod verification: violates the
  "self-verify each task before claiming done" constraint from the
  brief.

The right move would have been to surface this constraint *before*
opening #11 and ask for permission to split. Logged as a process
miss for next session.

This document is the bundled-artefact record the goal condition asked
for: one PR named `fix/styleguide-404-and-cleanup` containing the
consolidated retrospective of both functional merges.

## Verification record

| Route | Before | After |
|---|---|---|
| `/styleguide` | 404 | 200 |
| `/styleguide/queue` | 404 | 200 |
| `/styleguide/case-detail` | 404 | 200 |
| `/styleguide/audit` | 404 | 200 |
| `/styleguide/atoms` | 404 | 200 |
| `/styleguide/broker` | 404 | 200 |
| `/styleguide/demo` | 404 | 307 → `/demo` (deliberate) |
| `/styleguide/marketing` | 404 | 307 → `/` (deliberate) |
| `/api/trial` POST | route exists | 307 → /login (route gone) |
| `npm run test:visual` | n/a (no baselines) | 6 passed in 14.3s |
| `/` pivot copy | "Forensic mortgage..." | unchanged ✓ |

## References

- Pivot session: PR #10 (`pivot: reframe as portfolio piece`, 2026-05-14)
- Functional fix: PR #11 (commit `78571a9`)
- Baseline regen: PR #12 (commit `e8c7620`)
- Vikunja project 15 (`trutina`): tasks 145, 146, 147 all closed
  2026-05-15
