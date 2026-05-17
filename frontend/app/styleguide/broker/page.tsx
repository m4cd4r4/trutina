'use client'

import AppShell from '@/components/design/AppShell'
import { RiskBadge } from '@/components/design/atoms'
import { brokerView } from '@/lib/case-modules'
import { FIXTURE_BROKERS } from '@/lib/styleguide-fixtures'

export default function StyleguideBroker() {
  return (
    <AppShell crumbs={[{ href: '/dashboard', label: 'Inbox' }, { label: 'Brokers' }]} navCounts={{ brokers: FIXTURE_BROKERS.length }}>
      <div className="toolbar">
        <div className="tb-left">
          <span className="tb-title">Brokers</span>
          <span className="tb-count">{FIXTURE_BROKERS.length} brokers . last 90 days</span>
        </div>
        <div className="tb-right">
          <button type="button" className="btn btn-secondary btn-sm">Export view</button>
        </div>
      </div>
      <div className="q-table-wrap">
      <table className="q-table">
        <thead>
          <tr>
            <th>Broker</th><th>ABN</th>
            <th style={{ textAlign: 'right' }}>Submissions</th>
            <th style={{ textAlign: 'right' }}>Flagged</th>
            <th style={{ textAlign: 'right' }}>Fraud rate</th>
            <th style={{ textAlign: 'right' }}>Risk score</th>
            <th>Tier</th><th>Last seen</th>
          </tr>
        </thead>
        <tbody>
          {FIXTURE_BROKERS.map(b => {
            const v = brokerView(b)
            const rowCls = v.fraudRateTier === 'crit' ? 'row-crit' : v.fraudRateTier === 'high' ? 'row-high' : ''
            return (
              <tr key={b.id} className={rowCls}>
                <td>
                  <div style={{ fontSize: 13 }}>{v.name}</div>
                  {v.license ? <div className="mono derived" style={{ fontSize: 10.5 }}>ACL: {v.license}</div> : null}
                </td>
                <td className="mono derived">{v.abn}</td>
                <td className="mono right">{v.submissionCount}</td>
                <td className="mono right">{v.fraudFlagCount}</td>
                <td className={`mono right tier-ink-${v.fraudRateTier}`}>
                  {v.fraudRate != null ? `${(v.fraudRate * 100).toFixed(1)}%` : 'n/a'}
                </td>
                <td className="mono right">{v.riskScore}</td>
                <td><RiskBadge tier={v.fraudRateTier} /></td>
                <td className="mono derived">{new Date(v.lastSeenAt).toLocaleDateString('en-AU')}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </AppShell>
  )
}
