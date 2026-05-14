'use client'

import AppShell from '@/components/design/AppShell'
import { RiskBadge } from '@/components/design/atoms'
import { tierToken } from '@/lib/case-modules'
import { FIXTURE_QUEUE } from '@/lib/styleguide-fixtures'

export default function StyleguideQueue() {
  const cases = FIXTURE_QUEUE
  const counts = {
    crit: cases.filter(c => c.risk_level === 'critical').length,
    high: cases.filter(c => c.risk_level === 'high').length,
    med:  cases.filter(c => c.risk_level === 'medium').length,
    low:  cases.filter(c => c.risk_level === 'low').length,
  }
  return (
    <AppShell
      crumbs={[{ href: '/dashboard', label: 'Today' }, { label: 'Queue' }]}
      navCounts={{ queue: counts.crit + counts.high + counts.med, cases: cases.length, crit: counts.crit }}
    >
      <div className="content-header">
        <h1>Overnight intake</h1>
        <span className="sub">60 applications between 17:00 yesterday and 09:14 today</span>
        <span className="meta">2026-04-09 . 09:14:22 AEST</span>
      </div>

      <div className="filter-bar">
        <span className="filter-pill">All <span className="ct">{cases.length}</span></span>
        <span className="filter-pill active">Needs eyes <span className="ct">{counts.crit + counts.high + counts.med}</span></span>
        <span className="filter-pill"><span style={{ width: 6, height: 6, background: 'var(--risk-crit)', display: 'inline-block' }} />Critical <span className="ct">{counts.crit}</span></span>
        <span className="filter-pill"><span style={{ width: 6, height: 6, background: 'var(--risk-high)', display: 'inline-block' }} />High <span className="ct">{counts.high}</span></span>
        <span className="filter-pill"><span style={{ width: 6, height: 6, background: 'var(--risk-med)', display: 'inline-block' }} />Medium <span className="ct">{counts.med}</span></span>
        <span className="filter-pill"><span style={{ width: 6, height: 6, background: 'var(--risk-low)', display: 'inline-block' }} />Cleared <span className="ct">{counts.low}</span></span>
      </div>

      <table className="q-table">
        <thead>
          <tr>
            <th>Case</th>
            <th>Broker</th>
            <th>Applicant</th>
            <th>Submitted</th>
            <th style={{ textAlign: 'right' }}>Loan</th>
            <th style={{ textAlign: 'right' }}>Score</th>
            <th>Tier</th>
            <th>Flags</th>
          </tr>
        </thead>
        <tbody>
          {cases.slice(0, 30).map(c => {
            const t = tierToken(c.risk_level)
            return (
              <tr key={c.id} className={t === 'crit' ? 'row-crit' : t === 'high' ? 'row-high' : ''}>
                <td className="mono">{c.reference}</td>
                <td>
                  <div style={{ fontSize: 12.5 }}>{c.broker?.broker_name}</div>
                  <div className="mono derived" style={{ fontSize: 10.5 }}>{c.broker?.id}</div>
                </td>
                <td>{c.applicant_name}</td>
                <td className="mono derived">{c.submitted_at.slice(11, 16)}</td>
                <td className="mono right">${Math.round((c.loan_amount ?? 0) / 1000)}k</td>
                <td className="mono right" style={{ color: t === 'crit' ? 'var(--risk-crit)' : t === 'high' ? 'var(--risk-high)' : 'var(--ink-100)', fontWeight: t === 'crit' ? 600 : 400 }}>
                  {c.risk_score}
                </td>
                <td><RiskBadge tier={t} /></td>
                <td className="mono" style={{ fontSize: 11 }}>{c.flag_counts.critical}c/{c.flag_counts.high}h</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </AppShell>
  )
}
