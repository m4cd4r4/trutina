# Trutina Design System Migration Brief

Open this in a **fresh Claude Code session** in the worktree directory. Don't carry context from any prior session.

## First action: rebase before doing anything else

This worktree was created from `origin/master` at scaffold time. Other PRs may have merged in the minutes between scaffold and your first edit. Before reading anything else or writing any code, run:

```bash
git fetch origin master --quiet
git rebase origin/master
```

If the rebase is a fast-forward, you're done. If there are conflicts, resolve now.

## The problem

Trutina's live frontend has a split personality. The marketing landing at `frontend/app/page.tsx` hardcodes a warm cream substrate (`#F7F5F0`) inline at five separate points (lines 107, 218, 430, 541, 555). The authenticated app uses a dark teal theme (`#0a1210` / `#0a1e1c`) in `frontend/app/globals.css`. The fonts loaded in `frontend/app/layout.tsx` are Syne + IBM Plex Mono. None of this matches the new design system.

A new design system was iterated across three rounds with Claude Design and lives at the absolute path `I:/Scratch/trutina/design/Trutina Design System (2)/`. It unifies both surfaces with a single token set: cool-paper substrate, Fraunces display serif, IBM Plex Sans body, Geist Mono evidence font, and a four-tier risk colour system (moss / ochre / rust / oxblood). The case-detail view introduces a continuous evidence drill that terminates at a regulator-acceptable source-citation stub. This branch migrates the live frontend onto that system.

## Source of truth (read these BEFORE writing any code)

Reference files live in the parent worktree at absolute paths, not in this worktree's checkout. The design system is reference material, not committed source.

1. `I:/Scratch/trutina/design/Trutina Design System (2)/colors_and_type.css` - the canonical token layer. Paper, ink, risk-tier, accent, geometry, motion, type recipes. Copy this verbatim into the new frontend token file.
2. `I:/Scratch/trutina/design/Trutina Design System (2)/README.md` - system overview, swap rationale, the three rounds of iteration.
3. `I:/Scratch/trutina/design/Trutina Design System (2)/ui_kits/app/` - JSX reference components for queue, case detail, broker, audit, demo. Port pattern-for-pattern.
4. `I:/Scratch/trutina/design/Trutina Design System (2)/ui_kits/marketing/` - JSX reference for the marketing surface.
5. `I:/Scratch/trutina/design/Trutina Design System (2)/screenshots/` - six rendered targets (01-queue, 02-case-detail, 03-broker, 04-audit, 05-demo, 06-marketing). Visual-diff against these at each step.
6. `frontend/app/layout.tsx` - current root layout, currently loads Syne + IBM Plex Mono via next/font. Replace with Fraunces + IBM Plex Sans + Geist Mono.
7. `frontend/app/globals.css` - current dark-teal styles. Replace wholesale with the new token layer.
8. `frontend/app/page.tsx` - current cream landing. Rebuild against the marketing kit.
9. `frontend/components/Logo.tsx` - current logo component. Cascade to new SVG mark.
10. `PRODUCT_AUDIT_REPORT.md` - for context. Do NOT undo any security fix in scope.

If anything in this brief contradicts those source files, the source files win.

## What's in scope

Frontend visual layer only:

- `frontend/app/globals.css` - replace contents with the new token layer
- `frontend/app/layout.tsx` - load Fraunces (with `opsz` and `wonk` axes), IBM Plex Sans, Geist Mono via `next/font/google`
- `frontend/app/page.tsx` - rebuild landing per marketing kit (hero with WONK 25 on display only, AFR citation hook, four measured numbers with citation footnotes, calibration-tick motif)
- `frontend/app/dashboard/page.tsx` - rebuild as the queue per app kit (60-row dense table, margin-bar tier rule, tier-filter chips)
- `frontend/app/cases/[id]/page.tsx` - rebuild case detail with the continuous evidence drill (5 module cards, click filters flag list, flag expands to evidence stub with rule badge, source crop, provenance ledger, copy citation block)
- `frontend/app/brokers/[id]/page.tsx` - broker profile with 24-week stacked cadence bars and shared-producer-signature cluster panel
- `frontend/app/demo/[id]/page.tsx` - Clean vs Critical specimen pair side by side
- `frontend/components/Logo.tsx` - replace with the calibration-tick mark from `assets/logo-mark.svg`
- New components: `RiskBadge`, `ScoreOnScale`, `MarginBarRow`, `ModuleCard`, `EvidenceStub`, `CalibrationTickRule`, `RejectStamp`
- A new `print.css` so the audit packet exports cleanly to PDF

## Out of scope (do NOT modify)

- Backend (`backend/`)
- Database schema (`backend/db/init.sql`)
- Auth gate (`frontend/middleware.ts`)
- API routes (`frontend/app/api/`)
- Email infrastructure
- Tour copy in `frontend/app/demo/` (style only, not content)
- Security fixes from `PRODUCT_AUDIT_REPORT.md` S1-S19 (separate branches)

## Important: what's already on master

The branch `design/bolder-landing-light-editorial` landed on master as **PR #8** (merge tip `b848809 design: editorial forensics redesign - light theme, left-aligned hero`) between the time this brief was first drafted and the time you're reading it. The rebase step at the top of this brief brings that work in automatically.

Do NOT try to preserve anything from PR #8. The Claude Design system supersedes it wholesale. After rebase, your starting state will already include #8's "editorial forensics light theme" changes — your first real edit is to replace `globals.css` and `page.tsx` again, this time with the canonical Claude Design token layer. The two design directions are not compatible; #8 is a stop on the way to the destination, not the destination itself.

## What "good" looks like

- Six live pages match `design/Trutina Design System (2)/screenshots/` at desktop breakpoint
- The substrate is `#F0F1ED` (cool paper). No `#F7F5F0` or `#0a1210` anywhere
- Zero inline hex codes in JSX or Tailwind classes; every colour comes from a CSS variable
- Risk-tier classes (`risk-low`, `risk-med`, `risk-high`, `risk-crit`) drive every coloured element on cases, queue rows, broker stacked bars, and specimen measurement squares
- The case-detail drill is one continuous thread: clicking a module card filters the flag list inline, the other four modules visibly mute, the clicked flag expands to the evidence stub
- Evidence rows render in Geist Mono with tabular figures
- The audit packet view passes a print test: `window.print()` produces a regulator-acceptable PDF with the marginal tick ruler intact
- The marketing hero uses Fraunces with `wonk: 25` on the display headline only, not on subheads or body
- Calibration-tick motif appears in: header status bar, marketing page-rule mid-section, audit packet left margin, logo mark

## Required deliverables

1. A short design-rationale note at the top of the first commit explaining the token-layer port choices (where the design system's CSS variables map to Tailwind 4 theme tokens, if Tailwind is kept).
2. The migration itself, scoped to the in-scope list above.
3. `pnpm build` (or `npm run build`) passes with no new warnings.
4. A Playwright visual-regression run that diffs each of the six pages against `design/Trutina Design System (2)/screenshots/`. Tolerance ~5% per image; flag any larger drift in the PR description.
5. A grep-based token-discipline check: `git grep -nE '#[0-9A-Fa-f]{6}' frontend/app frontend/components` should return zero hits outside `globals.css` and `logo-*.svg`.
6. Manual verification of the print stylesheet on the audit-export route.

## Suggested workflow

1. Rebase. Read all ten source-of-truth files. Open the screenshots side-by-side with the JSX kit files.
2. Run `/design-brief` only if anything in the system is ambiguous. The token layer should be treated as locked, not re-litigated.
3. Update `frontend/app/layout.tsx` to load Fraunces, IBM Plex Sans, Geist Mono via `next/font/google`. Drop Syne entirely. Mind the Fraunces axis declarations (`opsz` 9-144, `wght` 300-800, optional `wonk`).
4. Replace `frontend/app/globals.css` with the contents of `design/Trutina Design System (2)/colors_and_type.css`. Adjust the `@import` line at the top (next/font replaces it).
5. Build atomic components first: `RiskBadge`, `ScoreOnScale`, `MarginBarRow`, `ModuleCard`, `EvidenceStub`, `CalibrationTickRule`, `RejectStamp`. Each gets a Storybook-style preview route under `frontend/app/_styleguide/` for visual verification.
6. Rebuild pages one at a time in this order: marketing > dashboard (queue) > cases/[id] (with evidence drill) > brokers/[id] > demo/[id] > audit-export. Visual-diff at every step.
7. Add `print.css` and verify the audit packet PDF export.
8. Run `/design-review` at the end. Treat any drift from the screenshot set as a finding.
9. PR description: link the six screenshot pairs (before / after), reference the three-round iteration arc.

## Constraints

- One PR. Branch name: `design/claude-design-system`.
- Keep the existing stack: Next.js 16, TypeScript, Tailwind 4. Do NOT introduce styled-components, Emotion, or vanilla-extract.
- Fonts via `next/font/google`, not `@import` (better LCP, no FOUT).
- No new runtime dependencies beyond what `next/font` and `recharts` already provide. Stacked bars on the broker view use the existing recharts install.
- British English in copy. No em-dashes, en-dashes, or ellipsis character (per `~/.claude/rules/writing-style.md`).
- No glassmorphism, no warm cream, no dark teal. The cool-paper substrate replaces both prior directions.

## Out-of-scope follow-ups (capture, do not build)

If you spot problems beyond the visual migration, append them to `docs/CLAUDE-TODO.md`. Particular things to capture but not fix here:

- Engagement-loop gaps D1-D10 from `PRODUCT_AUDIT_REPORT.md` (onboarding tour, post-analysis CTAs, email nurture)
- Security findings S1-S19 still open
- Trial quota enforcement in UI
- Stripe self-serve billing

## Why this brief is structured this way

Three rounds of Claude Design iteration produced a token layer that survived ablation testing across six rendered screens. The next session must not re-litigate token choices, font picks, or risk-tier hues. Read the system, port it, visual-diff against the rendered screenshots. PR #8 (`design/bolder-landing-light-editorial`) is a partial answer to the same problem and is now on master; treat it as scaffolding to overwrite, not as a baseline to preserve. This brief is deliberately specific about file paths, the in-scope list, and the screenshot-diff verification step so the next session can execute without re-deciding.