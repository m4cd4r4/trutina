# Docs off-shim - editorial class/token migration map

Deliverable 1. Derived from reading `frontend/app/docs/page.tsx` (the proven
editorial pattern), the `:root` token block + `.page`/`.line-numbers` rules in
`frontend/app/globals.css`, and the shim block (lines 841-955) being deleted.

This is the authoritative map. Every in-scope page is migrated by applying it.

---

## Principle: two source classes, two rules

The shim catches **Tailwind colour utility classes** (`text-teal-*`,
`text-white/N`, ...) via attribute selectors. It does **not** catch inline
`style={{}}` `rgba()`/`#hex` (it only special-cases two literal hex strings).
So today:

- Tailwind colour classes are remapped on screen by the shim -> migrating them
  must **preserve the current rendered colour** (apply the shim's own mapping).
- Inline `rgba()`/`#hex` leaks raw onto the oxblood paper today -> migrating
  it is the **intended visual fix** ("leaked blues/greens becoming editorial").

### Rule A - Tailwind colour utilities (preserve on-screen result = shim's map)

| Source utility            | Editorial replacement (inline `var(--*)` or editorial class) |
|---------------------------|--------------------------------------------------------------|
| `text-white`  `text-white/90` | `color: var(--ink-100)` |
| `text-white/80` `text-white/70` | `color: var(--ink-80)` |
| `text-white/60` `text-white/50` | `color: var(--ink-60)` |
| `text-white/40` `text-white/30` | `color: var(--ink-40)` |
| `text-white/20`           | `color: var(--ink-25)` |
| `text-white/10`           | `color: var(--ink-15)` |
| `border-white/20`         | `border-color: var(--ink-25)` |
| `border-white/10`         | `border-color: var(--rule)` |
| `border-white/5`          | `border-color: var(--rule-soft)` |
| `bg-white/5`              | `background: var(--paper-1)` |
| `bg-white/10` `bg-white/20` `bg-white/40` | `background: var(--paper-2)` |
| `bg-black/30` `bg-black/40`| `background: var(--paper-2)` (code surface, + `border: 1px solid var(--rule)`) |
| `text-teal-*` `text-emerald-*` | `color: var(--accent)` |
| `bg-teal-*`               | `background: var(--accent); color: var(--paper-0)` |
| `bg-emerald-*`            | `background: var(--accent-fill); color: var(--accent-press)` |
| `border-teal-*` `border-emerald-*` | `border-color: var(--accent-edge)` |
| `hover:bg-teal-*`         | hover -> `background: var(--accent-press)` |
| `text-amber-*`            | `color: var(--risk-med)` |
| `bg-amber-*`              | `background: var(--risk-med); color: var(--paper-0)` |
| `border-amber-*`          | `border-color: var(--risk-med-edge)` |
| `text-orange-*`           | `color: var(--risk-high)` |
| `bg-orange-*`             | `background: var(--risk-high); color: var(--paper-0)` |
| `border-orange-*`         | `border-color: var(--risk-high-edge)` |
| `text-red-*`              | `color: var(--risk-crit)` |
| `bg-red-*`                | `background: var(--risk-crit); color: var(--paper-0)` |
| `border-red-*`            | `border-color: var(--risk-crit-edge)` |
| `text-violet-*` `text-cyan-*` (risk-scores category accents) | `color: var(--ink-60)` (neutral; were decorative category tags, not severity) |
| `placeholder-white/20`    | n/a after migration (drop; inputs restyled) |

Non-colour layout utilities (`flex`, `grid`, `gap-*`, `mb-8`, `rounded-xl`,
`w-1.5`, `space-y-3`, `sm:p-6`, `min-h-screen`, ...) are **kept** - they are not
shim-dependent. `max-w-4xl mx-auto px-4 py-8` wrapper in DocShell is replaced by
`.page` (see DocShell section).

### Rule B - inline `rgba()`/`#hex` (currently leaking -> map to nearest token)

| Source value(s)                                              | Editorial replacement |
|--------------------------------------------------------------|-----------------------|
| `rgba(255,255,255,0.04)` `rgba(255,255,255,0.03)` (card substrate) | `background: var(--bg-print-white)` + `border: 1px solid var(--rule-soft)` (matches index card) |
| `rgba(255,255,255,0.1)` (slider unfilled track)              | `var(--paper-2)` |
| `rgba(0,0,0,0.4)` (code block bg)                            | `background: var(--paper-2)` + `border: 1px solid var(--rule)` (mirror `.codeblock`) |
| decorative blue `rgba(59,130,246,*)` (info/conclusion/tip/quote cards, inline-code bg) | `background: var(--accent-fill)`; border `var(--accent-edge)`; inline-code text `var(--accent)` - blue here is the same decorative "info" role as teal -> accent family |
| `#1F4FA3` / `#1e1b4b` (ROI slider fill / thumb border)       | `var(--accent)` / `var(--accent-press)` |
| green: `#22c55e` `rgba(34,197,94,*)` (LOW end of a severity scale / "Approve") | `var(--risk-low)` ink, `var(--risk-low-fill)` bg, `var(--risk-low-edge)` border |
| green decorative (guarantee/savings/ROI-multiple/checkmarks, NOT a tier) `rgba(16,185,129,*)` | `var(--accent)` / `var(--accent-fill)` / `var(--accent-edge)` (shim intent: emerald = affirmative, not risk-low) |
| amber: `#f59e0b` `rgba(245,158,11,*)`                        | `var(--risk-med)` / `var(--risk-med-fill)` / `var(--risk-med-edge)` |
| orange: `#f97316` `rgba(249,115,22,*)`                       | `var(--risk-high)` / `var(--risk-high-fill)` / `var(--risk-high-edge)` |
| red: `#ef4444` `rgba(239,68,68,*)`                           | `var(--risk-crit)` / `var(--risk-crit-fill)` / `var(--risk-crit-edge)` |
| `#052e16` (dark-green text on low fill)                       | `var(--risk-low)` |
| `#fff` text on a filled severity bar                         | `var(--paper-0)` |

Disambiguation between "green = severity-low" vs "green = decorative
affirmative": if the green sits in a Low/Medium/High/Critical *scale* alongside
amber/orange/red (risk-scores threshold + severity + example cards, integration
risk-level grid, quickstart Approve/Review/Reject), it is **risk-low**. If it
stands alone marking a guarantee, savings figure, ROI multiple, or a tick, it is
**accent** (per the shim's own emerald comment).

---

## Editorial card / section patterns (from `docs/page.tsx`)

The index proves the vocabulary. Migrated docs reuse it verbatim:

- **Document card / callout box** (replaces `rounded-xl border border-white/10
  print-card` + `rgba(255,255,255,0.04)`):
  `style={{ background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }}`
  keep existing `rounded-*`, padding utilities. Drop `print-card`.
- **Tinted callout** (info/affirmative, was teal/emerald/blue tinted):
  `background: var(--accent-fill)`, `border: 1px solid var(--accent-edge)`,
  emphasis text `color: var(--accent-press)`.
- **Risk-tiered callout** (was amber/orange/red/green tinted): wrap in the
  existing `risk-{low,med,high,crit}` utility class (sets `--r-ink/--r-fill/
  --r-edge`) and use `background: var(--r-fill); border-color: var(--r-edge);
  color: var(--r-ink)` - the same idiom `.stamp-badge`/`.specimen-doc` use.
- **Section heading** (was `<h2 className="text-lg font-bold text-teal-400
  print-blue mb-3">`): `<h2>` (inherits serif editorial `h2`) +
  `style={{ marginBottom: 12 }}`; drop `text-teal-400 print-blue text-lg
  font-bold`. Where pages used a small uppercase eyebrow, use `className="t-section"`.
- **Status-dot list** (was `bg-teal-400` dot + `text-white/70 print-muted`):
  dot `style={{ background: 'var(--ink-40)' }}` (neutral) or the row's risk
  `var(--r-ink)` when the list is severity-coded; text `color: var(--ink-80)`.
  Drop `print-muted`.
- **Data table** (was `border-white/10`, thead `rgba(255,255,255,0.04)`, cells
  `text-white/80|60|40`): thead `background: var(--paper-1)`, header text
  `t-section`-style (`color: var(--ink-60)`), row borders `1px solid
  var(--rule-soft)`, body cells `color: var(--ink-100)`, secondary cells
  `var(--ink-60)`, tertiary `var(--ink-40)`. Mirror `.q-table`. Keep the
  `.docs-page table { overflow-x:auto }` mobile rule (not shim, retained).
- **Code block** (was `bg-black/30`/`rgba(0,0,0,0.4)` + `text-teal-300`):
  `background: var(--paper-2)`, `border: 1px solid var(--rule)`,
  `color: var(--ink-100)`, `font-family: var(--font-mono)`; syntax spans ->
  `.codeblock .c`(comment `--ink-40`)/`.k`(keyword `--accent`)/`.s`(string
  `--risk-low`)/`.n`(number `--risk-high`) idiom or plain `--ink-100`.
- **Inline code** (was `text-teal-300` + `rgba(59,130,246,0.1)`):
  `background: var(--paper-2)`, `color: var(--ink-100)`, mono.
- **Numbered step badge** (was `border-teal-400/40 bg-teal-400/10 text-teal-400`
  / `bg-teal-600 print-step-num`): `background: var(--accent)`, `color:
  var(--paper-0)`, circle kept. Drop `print-step-num`.
- **Big-number / metric block**: number `font-family: var(--font-serif)`,
  `color: var(--ink-100)` (or the risk `--r-ink` if it is a severity figure),
  label `t-section`. Mirror `.trust-strip`/`.module-card .score`.

## DocShell scaffold (mirror `docs/page.tsx`)

Replace the Tailwind dark wrapper with the index's editorial scaffold. Props
API (`title`, `intro`, `updated`, `children`) unchanged.

```
<div className="min-h-screen docs-page">          // keep docs-page: it is the
  <SiteHeader active="docs" />                     // responsive-scope hook
  <main className="page" style={{ paddingTop: 56, paddingBottom: 80 }}>
    <header style={{ borderBottom:'1px solid var(--rule)', paddingBottom:28, marginBottom:40 }}>
      <Link href="/docs" className="t-section no-print"      // editorial back-link
            style={{ color:'var(--ink-40)', textDecoration:'none', display:'inline-block', marginBottom:14 }}>
        ← Back to docs
      </Link>
      <h1 style={{ fontSize:40, lineHeight:1.1, marginBottom: intro?14:0, fontVariationSettings:'"opsz" 36' }}>
        {title}
      </h1>
      {intro && <p style={{ fontFamily:'var(--font-serif)', fontSize:17, color:'var(--ink-80)',
                            lineHeight:1.55, maxWidth:'62ch', fontVariationSettings:'"opsz" 16' }}>{intro}</p>}
    </header>
    {children}
    <div style={{ marginTop:56, paddingTop:18, borderTop:'1px solid var(--rule)',
                  display:'flex', justifyContent:'space-between', alignItems:'baseline' }}
         className="t-caption">
      {updated && <span>Last updated: {updated}</span>}
      <span>© Trutina - AI lending fraud detection</span>
    </div>
  </main>
  <SiteFooter />
</div>
```

- Drop `print-page` (the 820px paper-mock + 110px absolute margin). `.page`
  already collapses to `padding: 0 24px` at <=1024px, so docs stay full-width
  and readable at 393px (Critical mobile fix from PR #20 preserved) without the
  `.docs-page.print-page` collapse hack.
- `docs-page` class is **kept** - post-shim it only carries the retained
  responsive rules (`.docs-page h1/h2/table/pre` at <=768px) and the
  `.print-page:not(.docs-page)` audit exclusion. It is no longer a colour shim.

## globals.css changes

1. **Delete** lines 841-904 entirely: the `/docs/* compatibility shim` header
   comment, `.docs-page { background/color !important }`, the full
   `.text-white\/N` / `border-white\/N` / `bg-white\/N` / `placeholder` map, the
   `[class*="text-teal|emerald|amber|orange|red"]` remaps, and the
   `[style*="#0a1210"|"#0d9488"]` inline-hex override.
2. **Rebase** the docs `@media print` block (906-955) onto editorial classes -
   editorial tokens already print identically to screen, so the colour-forcing
   (`.print-blue/.print-card/.print-muted/.print-highlight/.print-alert/
   .print-step-num`, `.docs-page .print-page` reflow) is deleted. Keep only:
   ```
   @media print {
     @page { margin: 1.5cm; size: A4; }
     body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
     .docs-page .no-print { display: none !important; }
     .docs-page a { text-decoration: none !important; }
   }
   ```
3. Remove the now-orphaned-by-this-change `.docs-page.print-page` mobile
   collapse block and `.docs-page .docs-grid/.docs-index-grid` (no migrated doc
   uses those classes). Keep `.docs-page h1/h2/table/pre` mobile rules,
   `.docs-group-grid*`, `--forensic-*`, and every other token/rule.

## pitch (detach only - NO layout change)

Apply Rule A + Rule B to every shim-dependent class/value in place. Keep all
positioning, slide structure, grid, sizing, animation. The deck is already
rendered light today (the shim forces `.docs-page` paper bg + ink remap), so
baking the same tokens inline is visually inert except the currently-leaking
`rgba(255,255,255,0.04)` cards gaining proper editorial card surface.
```
