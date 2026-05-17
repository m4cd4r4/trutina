# Docs off-shim migration brief

Open this in a **fresh Claude Code session** in the worktree root. Do not carry context from the session that scaffolded it.

## First action: rebase before doing anything else

This worktree was branched from `origin/design/landing-polish` (the PR #20 branch), NOT master, because the work depends on code that only exists on PR #20 (the `DocShell` component, the consolidated print CSS, and the current shim location). Before reading anything else or writing any code:

```bash
git fetch origin --quiet
# If PR #20 is still open, its branch is your base:
git rebase origin/design/landing-polish
# If PR #20 has merged and the branch is gone, rebase onto master instead
# (master will then contain the DocShell/print/shim work this depends on):
#   git rebase origin/master
```

If the rebase is a fast-forward you are done. Resolve any conflicts now. Do not skip this: this branch is stacked on an unmerged PR and the base moves.

## The problem

The 8 Trutina `/docs` subpages were authored against a dark-teal Tailwind palette (`text-white/70`, `bg-teal-400`, `border-white/10`, inline `rgba(59,130,246)` blue cards, `#22c55e`/`#f59e0b`/`#ef4444` status dots). They are not styled natively. They are forced to look editorial by a ~60-line `!important` CSS shim plus teal/emerald/amber/orange/red attribute-selector remaps in `globals.css`. The rendered consistency is one CSS layer deep: any inline hex punches straight through it, so blue cards and raw-green status dots still leak next to the oxblood brand, and a printed page renders different colours from the screen. The audit verdict was: this is a retrofit, not a coherent documentation system, and is a real refactor track, not a fix.

The `/docs` index (`frontend/app/docs/page.tsx`) is the ONE doc already built natively in the editorial system (uses `.page`, Fraunces, the line-numbered margin). It is the reference pattern.

## Source of truth (read these BEFORE coding)

1. [frontend/app/docs/page.tsx](frontend/app/docs/page.tsx) - the docs index. The target editorial pattern: `.page` scaffold, editorial tokens, no Tailwind dark utilities. Migrate the subpages toward this.
2. [frontend/components/DocShell.tsx](frontend/components/DocShell.tsx) - the shared shell the 7 subpages already use. It currently emits Tailwind dark scaffold (`text-white/30`, `max-w-4xl`, `border-white/5`). It must be migrated too, to emit the editorial scaffold.
3. [frontend/app/globals.css](frontend/app/globals.css) - search for `/docs/* compatibility shim`. That block plus the `.docs-page [class*="text-teal"|"text-emerald"|"text-amber"|"text-orange"|"text-red"]` remaps and the `.docs-page .text-white/N` / `.bg-white/N` / `.border-white/N` map are what you will DELETE at the end. Also read the `:root` token block (the `--ink-*`, `--accent`, `--risk-*`, `--paper-*` tokens) and the `.page` / `.line-numbers` rules near it - that is the editorial system you migrate onto.
4. [frontend/app/docs/security/page.tsx](frontend/app/docs/security/page.tsx) - representative subpage; shows the current shim-dependent JSX pattern (Tailwind dark utilities + inline hex) you are replacing.

If anything in this brief contradicts those files, the files win.

## What's in scope

- The 7 documentation subpages: `frontend/app/docs/{security,compliance,integration,quickstart,risk-scores,roi,one-pager}/page.tsx` - rewrite their JSX to use editorial classes and `var(--*)` tokens directly. Remove every `text-white/N`, `bg-white/N`, `border-white/N`, `text-teal/bg-teal/border-teal`, `text-emerald/amber/orange/red` Tailwind utility and every inline `rgba(...)`/`#hex`.
- `frontend/app/docs/pitch/page.tsx` - it is a fullscreen slide deck, NOT a document. Do NOT redesign it. Only detach it from the shim: replace its shim-dependent utilities/hex with editorial tokens so it survives the shim deletion. No layout change.
- `frontend/components/DocShell.tsx` - migrate it to emit the editorial scaffold (mirror `docs/page.tsx`: `.page` container, editorial nav link, serif heading) instead of the Tailwind dark wrapper. Keep its props API (`title`, `intro`, `updated`, `children`).
- `frontend/app/globals.css` - once nothing depends on it, delete the entire `/docs/* compatibility shim` block including the attribute-selector colour remaps and the `.docs-page .text-white/...` map. Keep the consolidated `@media print` rules but rebase them on the editorial classes. Keep `--forensic-*` and all other tokens.

## Out of scope (do NOT modify)

- The prose, data, tables, and numbers inside any doc. This is a styling/markup migration only. Content stays byte-identical in meaning.
- `pitch` slide-deck layout/interaction.
- Anything outside `frontend/app/docs/`, `frontend/components/DocShell.tsx`, and the docs-related parts of `globals.css`.
- The landing, demo, styleguide, login, the `.landing-saas` scope, `EngagementCTA`, the risk-tier tokens. PR #20 owns those.

## What "good" looks like

- Every `/docs` page renders in the editorial system and is visually consistent with the `/docs` index and the rest of the editorial app (Fraunces/IBM Plex, cool paper, the forensic margin where the index has it).
- `grep -rE "text-white/|bg-white/|text-teal|bg-teal|text-emerald|text-amber|rgba\(|#[0-9a-fA-F]{6}" frontend/app/docs/` returns nothing in styling positions (raw hex/Tailwind-dark gone).
- The `/docs/* compatibility shim` block and all its attribute-selector remaps are deleted from `globals.css`, and the site still renders correctly (the shim is dead because nothing needs it).
- Print output and screen output are the same colour (no medium-dependent brand colour).
- The Critical mobile fix from PR #20 still holds: docs subpages are full-width and readable at 393px, not a narrow scaled column.
- One coherent documentation set, not nine separately-authored pages.

## Required deliverables

1. A short plain-text migration plan before any code: the editorial class/token map you will apply (what `text-white/70` becomes, what a `.print-card` box becomes, etc.), derived from reading `docs/page.tsx`.
2. The migration, page by page, scoped to the in-scope list.
3. Verification: `cd frontend && node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json` clean, plus Playwright full-page screenshots of all 8 docs routes at 1440 and 393 against a running dev server, confirming no regression and the shim deleted. Compare against the PR #20 screenshots in the audit folder if still present.
4. Guardrail grep (the `grep` in "What good looks like") returning clean, pasted into the PR.

## Suggested workflow

1. Rebase (above). Read the four source-of-truth files.
2. Run `/design-review` philosophy: screenshot the current docs pages first as a before-baseline.
3. Write the class/token map (deliverable 1).
4. Migrate `DocShell.tsx` first (it scaffolds 7 pages), then one page end-to-end, screenshot-verify, then the rest.
5. Migrate `pitch` (detach only).
6. Delete the shim from `globals.css`. Re-screenshot every docs route. Nothing should change visually except the leaked blues/greens becoming editorial.
7. Run `/review-frontend` at the end for the source-side audit.

## Constraints

- One PR. Branch: `refactor/docs-off-shim`. Base: `design/landing-polish` while PR #20 is open, else `master`.
- No new dependencies. No content changes. British English in any new copy.
- Do not reintroduce a shim or a parallel utility layer. Editorial tokens directly, or extend `DocShell`/add a small editorial doc component if a pattern repeats.

## Out-of-scope follow-ups (capture, do not build)

Append anything beyond scope to the project backlog at `C:/Users/Hard-Worker/Obsidian/Second-Brain/wiki/backlog/trutina.md`. Do not fix inline.

## Why this brief is structured this way

PR #20 already neutralised the worst visible leaks and built `DocShell` + the editorial baseline, so this is a contained migration onto an existing target, not a redesign. The brief points at `docs/page.tsx` as the proven pattern so the session does not invent a new doc system or fall back into a second shim. The rebase section is explicit because this branch is deliberately stacked on an unmerged PR and the base will move.