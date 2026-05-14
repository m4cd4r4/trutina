'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import type { CaseDetail } from '@/lib/types'
import AppShell from '@/components/design/AppShell'
import { RejectStamp } from '@/components/design/atoms'
import { aggregateModules, tierToken } from '@/lib/case-modules'
import { Logo } from '@/components/Logo'

/**
 * Regulator-ready evidence packet. Rendered with print-friendly chrome:
 *   - sticky topbar/sidebar collapse via @media print (in globals.css)
 *   - .print-page wraps each "page" of the packet
 *   - left margin rule + every-5-lines tick numbering survives the PDF
 *
 * The on-screen presentation shows a single packet preview in the
 * standard AppShell; window.print() (or the Print button) cleans it up.
 */
export default function AuditExportPage() {
  const { id } = useParams<{ id: string }>()
  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.cases.get(id).then(setCaseData).finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <AppShell crumbs={[{ href: '/dashboard', label: 'Inbox' }, { label: 'Audit packet' }]}>
        <div style={{ padding: 64, textAlign: 'center', color: 'var(--ink-40)' }}>Loading evidence packet…</div>
      </AppShell>
    )
  }
  if (!caseData) {
    return (
      <AppShell crumbs={[{ href: '/dashboard', label: 'Inbox' }, { label: 'Not found' }]}>
        <div style={{ padding: 64, textAlign: 'center', color: 'var(--risk-crit)' }}>Case not found.</div>
      </AppShell>
    )
  }

  const t = tierToken(caseData.risk_level)
  const score = caseData.risk_score ?? 0
  const modules = aggregateModules(caseData.flags)

  return (
    <AppShell crumbs={[
      { href: '/dashboard', label: 'Inbox' },
      { href: `/cases/${caseData.id}`, label: caseData.reference },
      { label: 'Audit packet' },
    ]}>
      <div className="content-header no-print">
        <h1>Evidence packet preview</h1>
        <span className="sub">{caseData.reference}.evidence-packet.pdf</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Print / save PDF
          </button>
        </span>
      </div>

      <div style={{ marginTop: 18, background: 'var(--paper-1)', padding: '40px 60px', borderTop: '1px solid var(--rule)' }}>
        {/* Page 1 — cover + findings summary */}
        <article className="print-page">
          <div className="margin-rule" />
          <div className="margin-ticks">
            {Array.from({ length: 18 }, (_, i) => <span key={i}>{(i + 1) * 5}</span>)}
          </div>

          <header className="print-head">
            <Logo variant="wordmark" height={32} href="" />
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-60)', letterSpacing: '0.04em' }}>
              Evidence packet . {caseData.reference} . page 1 . prepared {new Date().toISOString().slice(0, 19).replace('T', ' ')} AEST
            </div>
          </header>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, marginTop: 36 }}>
            <div style={{ flex: 1 }}>
              <div className="t-section" style={{ color: 'var(--ink-40)' }}>Evidence packet</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 36, lineHeight: 1.1, color: 'var(--ink-100)', margin: '8px 0 12px' }}>
                Case {caseData.reference}
              </h2>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-80)', lineHeight: 1.55, maxWidth: 460 }}>
                Prepared by Trutina v0.41, evidence schema 2026.04. This packet is a derived artefact. Source documents and the immutable evidence ledger remain in the lender&apos;s system of record.
              </div>
            </div>
            {t === 'crit' ? (
              <div style={{ position: 'relative', transform: 'translateY(8px)' }}>
                <RejectStamp tier="crit" sub={caseData.reference}>REJECT</RejectStamp>
              </div>
            ) : null}
          </div>

          <div className="hr-rule" style={{ margin: '36px 0 24px', borderTop: '1px solid var(--ink-80)' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 32px' }}>
            <KV k="Submitted" v={new Date(caseData.submitted_at).toLocaleString('en-AU')} />
            <KV k="Analysed" v={caseData.analysed_at ? new Date(caseData.analysed_at).toLocaleString('en-AU') : 'pending'} />
            {caseData.broker ? <KV k="Broker" v={`${caseData.broker.broker_name}${caseData.broker.broker_abn ? ` . ${caseData.broker.broker_abn}` : ''}`} /> : null}
            <KV k="Applicant" v={caseData.applicant_name ?? 'Redacted'} />
            {caseData.loan_amount != null ? <KV k="Loan amount" v={`$${caseData.loan_amount.toLocaleString('en-AU')} AUD`} /> : null}
            {caseData.property_address ? <KV k="Property" v={caseData.property_address} /> : null}
            <KV k="Score" v={`${score} / 100 . ${t.toUpperCase()}`} highlight={t === 'crit'} />
            {caseData.recommended_action ? <KV k="Recommended" v={caseData.recommended_action.replace('_', ' ')} highlight={caseData.recommended_action === 'reject'} /> : null}
          </div>

          <div className="hr-rule" style={{ margin: '24px 0', borderTop: '1px solid var(--ink-25)' }} />

          {caseData.flags.length > 0 ? (
            <>
              <div className="t-section">Summary of findings</div>
              <ol style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.6, color: 'var(--ink-100)', paddingLeft: 22, marginTop: 10 }}>
                {caseData.flags.map(f => (
                  <li key={f.id} style={{ marginBottom: 4 }}>
                    {f.title}. {f.description}
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className="t-prose">No flags fired against this case. All five modules returned scores within expected bounds.</p>
          )}
        </article>

        {/* Page 2 — module breakdown */}
        <article className="print-page">
          <div className="margin-rule" />
          <div className="margin-ticks">
            {Array.from({ length: 18 }, (_, i) => <span key={i}>{(i + 1) * 5}</span>)}
          </div>
          <header className="print-head">
            <Logo variant="wordmark" height={32} href="" />
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-60)' }}>
              Evidence packet . {caseData.reference} . page 2 . module breakdown
            </div>
          </header>

          <div className="t-section" style={{ marginTop: 28 }}>Module aggregates</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)', fontSize: 12.5, marginTop: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ink-80)' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px', fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>Module</th>
                <th style={{ textAlign: 'right', padding: '6px 8px', fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>Score</th>
                <th style={{ textAlign: 'right', padding: '6px 8px', fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>Flags</th>
                <th style={{ textAlign: 'left', padding: '6px 8px', fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {modules.map(m => (
                <tr key={m.id}>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--rule-soft)' }}>{m.name}</td>
                  <td className="mono" style={{ padding: '6px 8px', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right' }}>{m.score}</td>
                  <td className="mono" style={{ padding: '6px 8px', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right' }}>{m.flagCount}</td>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--rule-soft)', color: `var(--risk-${m.severity})`, fontWeight: m.severity === 'crit' ? 600 : 400 }}>
                    {m.severity.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {caseData.documents.length > 0 ? (
            <>
              <div className="t-section" style={{ marginTop: 32 }}>Source documents</div>
              <ul style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-100)', paddingLeft: 0, listStyle: 'none', marginTop: 12 }}>
                {caseData.documents.map(d => (
                  <li key={d.id} style={{ padding: '6px 0', borderBottom: '1px solid var(--rule-soft)' }}>
                    {d.filename} . {d.doc_type.replace('_', ' ')}{d.page_count != null ? ` . ${d.page_count}p` : ''}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <div className="print-foot">
            <span>Trutina v0.41 . schema 2026.04</span>
            <span>This document is the lender&apos;s record. Trutina retains evidence pointers.</span>
          </div>
        </article>
      </div>
    </AppShell>
  )
}

function KV({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, paddingBottom: 6, borderBottom: '1px solid var(--rule-soft)' }}>
      <div style={{ width: 140, flexShrink: 0, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--ink-60)', textTransform: 'uppercase', paddingTop: 2 }}>{k}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: highlight ? 'var(--risk-crit)' : 'var(--ink-100)', fontWeight: highlight ? 600 : 400 }}>{v}</div>
    </div>
  )
}
