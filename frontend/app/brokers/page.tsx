'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Broker } from '@/lib/types'
import AppShell from '@/components/design/AppShell'
import { RiskBadge } from '@/components/design/atoms'
import { brokerView } from '@/lib/case-modules'

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.brokers.list().then(setBrokers).finally(() => setLoading(false))
  }, [])

  return (
    <AppShell
      crumbs={[{ href: '/dashboard', label: 'Inbox' }, { label: 'Brokers' }]}
      navCounts={{ brokers: brokers.length }}
    >
      <div className="toolbar">
        <div className="tb-left">
          <span className="tb-title">Brokers</span>
          <span className="tb-count">{brokers.length} broker{brokers.length === 1 ? '' : 's'} . last 90 days</span>
        </div>
        <div className="tb-right">
          <button type="button" className="btn btn-secondary btn-sm">Export view</button>
        </div>
      </div>

      <div className="q-table-wrap">
        <table className="q-table">
          <thead>
            <tr>
              <th style={{ width: '24%' }}>Broker</th>
              <th style={{ width: '16%' }}>ABN</th>
              <th style={{ width: '12%', textAlign: 'right' }}>Submissions</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Flagged</th>
              <th style={{ width: '12%', textAlign: 'right' }}>Fraud rate</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Risk score</th>
              <th style={{ width: '8%' }}>Tier</th>
              <th style={{ width: '8%' }}>Last seen</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-40)' }}>Loading brokers…</td></tr>
            ) : brokers.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-40)' }}>No brokers tracked yet.</td></tr>
            ) : brokers.map(b => {
              const v = brokerView(b)
              const rowCls = v.fraudRateTier === 'crit' ? 'row-crit' : v.fraudRateTier === 'high' ? 'row-high' : ''
              return (
                <tr key={b.id} className={rowCls}>
                  <td>
                    <div style={{ fontSize: 13 }}>{v.name}</div>
                    {v.license ? <div className="mono derived" style={{ fontSize: 10.5 }}>ACL: {v.license}</div> : null}
                  </td>
                  <td className="mono derived">{v.abn ?? <span style={{ color: 'var(--ink-40)' }}>—</span>}</td>
                  <td className="mono right">{v.submissionCount}</td>
                  <td className="mono right">{v.fraudFlagCount}</td>
                  <td className="mono right">
                    {v.fraudRate == null
                      ? <span className="derived">n/a</span>
                      : <span style={{ color: v.fraudRateTier === 'crit' ? 'var(--risk-crit)' : v.fraudRateTier === 'high' ? 'var(--risk-high)' : 'var(--ink-100)', fontWeight: v.fraudRateTier === 'crit' ? 600 : 400 }}>
                          {(v.fraudRate * 100).toFixed(1)}%
                        </span>}
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
