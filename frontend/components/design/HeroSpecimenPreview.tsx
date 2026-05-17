'use client'

import { useEffect, useState } from 'react'
import { RiskBadge, RejectStamp } from '@/components/design/atoms'

/**
 * Compact specimen-card preview rendered on the right side of the
 * marketing hero. Same forensic register as the case-detail page,
 * shrunk to a single card visitors can absorb at a glance. Proof
 * artefact for the hero — answers the buyer's silent "show me what
 * this looks like" before they click through.
 */
export default function HeroSpecimenPreview() {
  const [stampVisible, setStampVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setStampVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={WRAPPER}>
      {/* Filed-on-paper margin tab */}
      <span aria-hidden="true" style={MARGIN_BAR} />

      {/* Document chrome */}
      <div style={HEAD}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-60)', letterSpacing: '0.04em' }}>
          Case . TRU-2026-04812
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-60)' }}>
          submitted 09:14 AEST
        </div>
      </div>

      {/* Title + score */}
      <div style={{ padding: '14px 18px 8px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 19, lineHeight: 1.2, color: 'var(--ink-100)' }}>
            Payslip does not reconcile<br />to MYOB producer signature
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-60)', marginTop: 6 }}>
            Applicant A. R. (redacted) . loan $612.5k . via AGG-118-4421
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <RiskBadge tier="crit" stark score={82} />
          <div style={{ marginTop: 2 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 44, lineHeight: 0.95, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
              82
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 12, color: 'var(--ink-60)', marginLeft: 2 }}>/100</span>
          </div>
        </div>
      </div>

      {/* Flag list — compact */}
      <div style={{ borderTop: '1px solid var(--rule)', padding: '4px 18px 10px' }}>
        <Flag tier="crit" code="PM-007" title="Payslip producer signature seen on three prior unrelated applications" />
        <Flag tier="crit" code="IA-002" title="Net pay does not equal gross minus PAYG" detail="off by $47.20" />
        <Flag tier="high" code="PM-002" title="PDF object stream lacks the producer hash expected from MYOB" />
        <Flag tier="crit" code="NC-003" title="Same employer ABN appears on 5 applications by this broker in 11 days" />
      </div>

      {/* Foot — citation hook */}
      <div style={FOOT}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-60)' }}>
          ledger TRU-2026-04812 . retained 7y per APRA CPG 234
        </span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-60)' }}>
          4 flags
        </span>
      </div>

      {/* REJECT stamp annotation */}
      <div style={{
        position: 'absolute', right: 14, top: 14,
        opacity: stampVisible ? 1 : 0,
        transform: `scale(0.62)`,
        transformOrigin: 'top right',
        transition: 'opacity 240ms var(--ease)',
        pointerEvents: 'none',
      }}>
        <RejectStamp tier="crit" sub="TRU-2026-04812">REJECT</RejectStamp>
      </div>
    </div>
  )
}

function Flag({ tier, code, title, detail }: { tier: 'crit' | 'high'; code: string; title: string; detail?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr auto', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--rule-soft)', alignItems: 'baseline' }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-60)', fontWeight: 600 }}>{code}</span>
      <span style={{ fontSize: 12, color: 'var(--ink-100)', lineHeight: 1.4 }}>
        {title}{detail ? <> . <span className="mono" style={{ color: tier === 'crit' ? 'var(--risk-crit)' : 'var(--risk-high)', fontWeight: 600 }}>{detail}</span></> : null}
      </span>
      <RiskBadge tier={tier} />
    </div>
  )
}

const WRAPPER: React.CSSProperties = {
  position: 'relative',
  background: 'var(--bg-print-white)',
  border: '1px solid var(--ink-25)',
  boxShadow: '0 1px 0 var(--paper-edge), 0 18px 32px -22px rgba(20, 22, 24, 0.20)',
  maxWidth: 480,
  width: '100%',
}

const MARGIN_BAR: React.CSSProperties = {
  position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
  background: 'var(--accent)',
}

const HEAD: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  padding: '10px 18px 8px',
  borderBottom: '1px solid var(--rule)',
  background: 'var(--paper-1)',
}

const FOOT: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  padding: '8px 18px',
  borderTop: '1px solid var(--rule)',
  background: 'var(--paper-1)',
}
