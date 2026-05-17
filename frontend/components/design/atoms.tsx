// Atomic visual components shared across Trutina surfaces.
// All colour comes from CSS variables defined in app/globals.css.
// No raw hex codes here.

import type { ReactNode, CSSProperties } from 'react'
import type { TierToken } from '@/lib/case-modules'

// ---------------------------------------------------------------------------
// RiskBadge — small tier indicator. Two visual variants.
// ---------------------------------------------------------------------------

export function RiskBadge({
  tier,
  label,
  stark = false,
  score = null,
}: {
  tier: TierToken
  label?: string
  stark?: boolean
  score?: number | string | null
}) {
  const text = (label ?? FULL_LABEL[tier]).toUpperCase()
  if (stark) {
    return (
      <span className={`pill stamp-stark risk-${tier}`} style={{ background: `var(--risk-${tier})` }}>
        {text}{score != null ? ` . ${score}` : ''}
      </span>
    )
  }
  return (
    <span className={`pill stamp-badge risk-${tier}`}>
      <span className="pip" />{text}
    </span>
  )
}

const FULL_LABEL: Record<TierToken, string> = {
  crit: 'Critical',
  high: 'High',
  med: 'Medium',
  low: 'Low',
}

// ---------------------------------------------------------------------------
// ScoreOnScale — calibration gauge with 0/25/50/70/100 bands.
// ---------------------------------------------------------------------------

export function ScoreOnScale({
  value,
  max = 100,
  low = 25,
  med = 50,
  high = 70,
}: {
  value: number
  max?: number
  low?: number
  med?: number
  high?: number
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="gauge" role="img" aria-label={`Score ${value} of ${max}`}>
      <div className="band band-low" style={{ flex: low }}><span className="l">0</span></div>
      <div className="band band-med" style={{ flex: med - low }}><span className="l">{low}</span></div>
      <div className="band band-high" style={{ flex: high - med }}><span className="l">{med}</span></div>
      <div className="band band-crit" style={{ flex: max - high }}>
        <span className="l">{high}</span>
        <span className="l-r">{max}</span>
      </div>
      <div className="needle" style={{ left: `calc(${pct}% - 1px)` }}>
        <span className="v">{value}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MarginBarRow — 6px coloured left rule for critical/high cases. Pure CSS
// box-shadow is applied via .row-crit / .row-high on .q-table tr; this
// component renders a standalone bar for use outside tables (case header
// margin, audit packet margin).
// ---------------------------------------------------------------------------

export function MarginBar({ tier, offsetLeft = -28 }: { tier: TierToken; offsetLeft?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: offsetLeft, top: 0, bottom: 0,
        width: 'var(--rule-width-stamp)',
        background: `var(--risk-${tier})`,
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// CalibrationTickRule — horizontal hairline with calibration ticks.
// Used as a divider between marketing sections, the in-product top bar
// motif, and the audit packet margin.
// ---------------------------------------------------------------------------

export function CalibrationTickRule({ count = 41, style }: { count?: number; style?: CSSProperties }) {
  return (
    <div className="calib-divider" aria-hidden="true" style={style}>
      <div className="ticks">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className={i % 5 === 0 ? 'major' : ''} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// RejectStamp — the one expressive moment in the system. Reserved for
// Critical cases on the case header and audit packet cover page.
// ---------------------------------------------------------------------------

export function RejectStamp({
  tier = 'crit',
  children = 'REJECT',
  sub,
}: {
  tier?: TierToken
  children?: ReactNode
  sub?: string
}) {
  return (
    <div
      style={{
        display: 'inline-block',
        border: `1.5px solid var(--risk-${tier})`,
        color: `var(--risk-${tier})`,
        padding: '7px 14px',
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: '0.2em',
        background: 'var(--bg-print-white)',
      }}
    >
      {children}
      {sub ? (
        <div style={{ fontSize: 9, letterSpacing: '0.16em', fontWeight: 500, marginTop: 4 }}>
          {sub}
        </div>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CornerFrame — specimen card with 6px L-shape forensic corner ticks.
// Used on payslip specimens and the audit packet evidence cards.
// ---------------------------------------------------------------------------

export function CornerFrame({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="specimen" style={style}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ProvenanceTag — "Measured / Derived / Asserted" stamp for numeric rows.
// ---------------------------------------------------------------------------

export function ProvenanceTag({ kind, children }: { kind: 'measured' | 'derived' | 'asserted'; children?: ReactNode }) {
  const MAP = {
    measured: { bg: 'var(--ink-100)', fg: 'var(--paper-0)', border: 'transparent', text: 'Measured' },
    derived:  { bg: 'var(--paper-2)', fg: 'var(--ink-40)',  border: 'var(--rule)',  text: 'Derived' },
    asserted: { bg: 'var(--risk-high-fill)', fg: 'var(--risk-high)', border: 'var(--risk-high-edge)', text: 'Asserted' },
  } as const
  const s = MAP[kind]
  return (
    <span className="pill" style={{
      padding: '2px 6px', fontSize: 9.5, letterSpacing: '0.16em',
      color: s.fg, background: s.bg, borderColor: s.border,
      marginRight: 8,
    }}>{children ?? s.text}</span>
  )
}
