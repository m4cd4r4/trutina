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
      crumbs={[{ label: 'Inbox' }]}
      navCounts={{ inbox: counts.crit + counts.high + counts.med, assigned: 3, watching: 8, brokers: 6, crit: counts.crit }}
    >
      <div className="toolbar">
        <div className="tb-left">
          <span className="tb-title">Queue</span>
          <span className="tb-count">{cases.length} cases . {counts.crit} critical . {counts.high} high</span>
        </div>
        <div className="tb-right">
          <button type="button" className="btn btn-secondary btn-sm">Export view</button>
          <div className="tb-divider" />
          <button type="button" className="btn btn-primary btn-sm">+ New case</button>
        </div>
      </div>
      <div className="toolbar-caption">
        Auto-refresh every 5 min. Last updated 09:14 AEST.
      </div>

      <div className="filter-bar">
        <span className="filter-pill">All <span className="ct">{cases.length}</span></span>
        <span className="filter-pill active">Needs eyes <span className="ct">{counts.crit + counts.high + counts.med}</span></span>
        <span className="filter-pill"><span style={{ width: 6, height: 6, background: 'var(--risk-crit)', display: 'inline-block' }} />Critical <span className="ct">{counts.crit}</span></span>
        <span className="filter-pill"><span style={{ width: 6, height: 6, background: 'var(--risk-high)', display: 'inline-block' }} />High <span className="ct">{counts.high}</span></span>
        <span className="filter-pill"><span style={{ width: 6, height: 6, background: 'var(--risk-med)', display: 'inline-block' }} />Medium <span className="ct">{counts.med}</span></span>
        <span className="filter-pill"><span style={{ width: 6, height: 6, background: 'var(--risk-low)', display: 'inline-block' }} />Cleared <span className="ct">{counts.low}</span></span>
      </div>

      <div className="q-table-wrap">
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
                <td>
                  <div className="score-cell">
                    <span className="mono" style={{ minWidth: 22, textAlign: 'right', fontWeight: t === 'crit' ? 600 : 400, color: t === 'crit' ? 'var(--risk-crit)' : t === 'high' ? 'var(--risk-high)' : 'var(--ink-100)' }}>{c.risk_score}</span>
                    <span className={`score-bar tier-${t}`} aria-hidden="true">
                      <i style={{ width: `${c.risk_score}%` }} />
                    </span>
                  </div>
                </td>
                <td><RiskBadge tier={t} /></td>
                <td>
                  <span className="mono" style={{ fontSize: 11 }}>{c.flag_counts.critical}c/{c.flag_counts.high}h</span>
                  <span className="row-actions" style={{ marginLeft: 8 }}>
                    <button type="button">Open</button>
                    <button type="button">Assign</button>
                    <button type="button">Dismiss</button>
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </AppShell>
  )
}
