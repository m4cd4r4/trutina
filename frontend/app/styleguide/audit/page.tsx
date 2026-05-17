'use client'

import AppShell from '@/components/design/AppShell'
import { RejectStamp } from '@/components/design/atoms'
import { aggregateModules, tierToken } from '@/lib/case-modules'
import { FIXTURE_CASE } from '@/lib/styleguide-fixtures'
import { Logo } from '@/components/Logo'

export default function StyleguideAudit() {
  const c = FIXTURE_CASE
  const modules = aggregateModules(c.flags)
  const t = tierToken(c.risk_level)

  return (
    <AppShell crumbs={[{ href: '/dashboard', label: 'Inbox' }, { href: `/cases/${c.id}`, label: c.reference }, { label: 'Audit packet' }]}>
      <div className="content-header no-print">
        <h1>Evidence packet preview</h1>
        <span className="sub">{c.reference}.evidence-packet.pdf</span>
      </div>

      <div style={{ marginTop: 18, background: 'var(--paper-1)', padding: '40px 60px', borderTop: '1px solid var(--rule)' }}>
        <article className="print-page">
          <div className="margin-rule" />
          <div className="margin-ticks">
            {Array.from({ length: 18 }, (_, i) => <span key={i}>{(i + 1) * 5}</span>)}
          </div>
          <header className="print-head">
            <Logo variant="wordmark" height={32} href="" />
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-60)' }}>Evidence packet . {c.reference} . page 1 . prepared 2026-04-09 09:18:04 AEST</div>
          </header>

          <div style={{ display: 'flex', gap: 32, marginTop: 36 }}>
            <div style={{ flex: 1 }}>
              <div className="t-section" style={{ color: 'var(--ink-40)' }}>Evidence packet</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 36, lineHeight: 1.1, margin: '8px 0 12px' }}>Case {c.reference}</h2>
              <div style={{ fontSize: 14, color: 'var(--ink-80)', lineHeight: 1.55, maxWidth: 460 }}>
                Prepared by Trutina v0.41, evidence schema 2026.04. This packet is a derived artefact.
              </div>
            </div>
            {t === 'crit' ? <RejectStamp tier="crit" sub={c.reference}>REJECT</RejectStamp> : null}
          </div>

          <div className="hr-rule" style={{ margin: '36px 0 24px', borderTop: '1px solid var(--ink-80)' }} />

          <div className="t-section">Summary of findings</div>
          <ol style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.6, paddingLeft: 22, marginTop: 10 }}>
            {c.flags.map(f => <li key={f.id} style={{ marginBottom: 4 }}>{f.title}. {f.description}</li>)}
          </ol>

          <div className="hr-rule" style={{ margin: '24px 0', borderTop: '1px solid var(--ink-25)' }} />

          <div className="t-section">Module aggregates</div>
          <table className="q-table" style={{ marginTop: 12 }}>
            <thead><tr>
              <th>Module</th>
              <th className="right">Score</th>
              <th className="right">Flags</th>
              <th>Severity</th>
            </tr></thead>
            <tbody>
              {modules.map(m => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td className="mono right">{m.score}</td>
                  <td className="mono right">{m.flagCount}</td>
                  <td className={`tier-ink-${m.severity}`}>{m.severity.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="print-foot">
            <span>Trutina v0.41 . schema 2026.04</span>
            <span>This document is the lender&apos;s record.</span>
          </div>
        </article>
      </div>
    </AppShell>
  )
}
