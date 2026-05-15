'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { Case, RiskLevel } from '@/lib/types'
import AppShell from '@/components/design/AppShell'
import { RiskBadge } from '@/components/design/atoms'
import { tierToken, type TierToken } from '@/lib/case-modules'

type TierFilter = 'all' | 'open' | TierToken

const TIER_RANK: Record<TierToken, number> = { crit: 4, high: 3, med: 2, low: 1 }

export default function QueuePage() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [tierFilter, setTierFilter] = useState<TierFilter>('open')
  const [sortKey, setSortKey] = useState<'score' | 'tier' | 'submitted' | 'broker' | 'reference'>('score')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    setLoading(true)
    api.cases.list({ limit: 100 }).then(setCases).finally(() => setLoading(false))
  }, [])

  const tierCount = (t: TierToken) => cases.filter(c => tierToken(c.risk_level) === t).length

  const filtered = useMemo(() => {
    return cases.filter(c => {
      const t = tierToken(c.risk_level)
      if (tierFilter === 'all') return true
      if (tierFilter === 'open') return t !== 'low'
      return t === tierFilter
    })
  }, [cases, tierFilter])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'score') {
        cmp = (a.risk_score ?? -1) - (b.risk_score ?? -1)
      } else if (sortKey === 'tier') {
        cmp = TIER_RANK[tierToken(a.risk_level)] - TIER_RANK[tierToken(b.risk_level)]
      } else if (sortKey === 'submitted') {
        cmp = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      } else if (sortKey === 'broker') {
        cmp = (a.broker?.broker_name ?? '').localeCompare(b.broker?.broker_name ?? '')
      } else if (sortKey === 'reference') {
        cmp = a.reference.localeCompare(b.reference)
      }
      return sortDir === 'desc' ? -cmp : cmp
    })
    return arr
  }, [filtered, sortKey, sortDir])

  const onSort = (k: typeof sortKey) => {
    if (sortKey === k) setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    else { setSortKey(k); setSortDir('desc') }
  }
  const sortIcon = (k: typeof sortKey) => sortKey !== k ? '' : (sortDir === 'desc' ? '▾' : '▴')

  const navCounts = {
    inbox: cases.filter(c => tierToken(c.risk_level) !== 'low').length,
    crit: tierCount('crit'),
  }

  return (
    <AppShell
      crumbs={[{ label: 'Inbox' }]}
      navCounts={navCounts}
    >
      <div className="toolbar">
        <div className="tb-left">
          <span className="tb-title">Queue</span>
          <span className="tb-count">{cases.length} cases . {tierCount('crit')} critical . {tierCount('high')} high</span>
        </div>
        <div className="tb-right">
          <button type="button" className="btn btn-secondary btn-sm">Export view</button>
          <div className="tb-divider" />
          <Link href="/cases/new" className="btn btn-primary btn-sm">+ New case</Link>
        </div>
      </div>
      <div className="toolbar-caption">
        Auto-refresh every 5 min. Last updated {new Date().toLocaleString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false })} AEST.
      </div>

      <div className="filter-bar">
        <FilterChip active={tierFilter === 'all'}  onClick={() => setTierFilter('all')}  label="All"          count={cases.length} />
        <FilterChip active={tierFilter === 'open'} onClick={() => setTierFilter('open')} label="Needs eyes"   count={tierCount('crit') + tierCount('high') + tierCount('med')} />
        <FilterChip active={tierFilter === 'crit'} onClick={() => setTierFilter('crit')} label="Critical"     count={tierCount('crit')} dot="crit" />
        <FilterChip active={tierFilter === 'high'} onClick={() => setTierFilter('high')} label="High"         count={tierCount('high')} dot="high" />
        <FilterChip active={tierFilter === 'med'}  onClick={() => setTierFilter('med')}  label="Medium"       count={tierCount('med')}  dot="med" />
        <FilterChip active={tierFilter === 'low'}  onClick={() => setTierFilter('low')}  label="Cleared"      count={tierCount('low')}  dot="low" />
      </div>

      <div className="q-table-wrap">
        <table className="q-table">
          <thead>
            <tr>
              <th onClick={() => onSort('reference')} className={sortKey === 'reference' ? 'sorted' : ''} style={{ width: '14%' }}>Case <span className="sort">{sortIcon('reference') || '▾'}</span></th>
              <th onClick={() => onSort('broker')} className={sortKey === 'broker' ? 'sorted' : ''} style={{ width: '16%' }}>Broker <span className="sort">{sortIcon('broker') || '▾'}</span></th>
              <th style={{ width: '16%' }}>Applicant</th>
              <th onClick={() => onSort('submitted')} className={sortKey === 'submitted' ? 'sorted' : ''} style={{ width: '11%' }}>Submitted <span className="sort">{sortIcon('submitted') || '▾'}</span></th>
              <th style={{ width: '8%', textAlign: 'right' }}>Loan</th>
              <th onClick={() => onSort('score')} className={sortKey === 'score' ? 'sorted' : ''} style={{ width: '12%' }}>Score <span className="sort">{sortIcon('score') || '▾'}</span></th>
              <th onClick={() => onSort('tier')} className={sortKey === 'tier' ? 'sorted' : ''} style={{ width: '8%' }}>Tier <span className="sort">{sortIcon('tier') || '▾'}</span></th>
              <th style={{ width: '15%' }}>Flags / actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-40)' }}>Loading queue…</td></tr>
            ) : sorted.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-40)' }}>
                {cases.length === 0
                  ? <>No cases yet. <Link href="/cases/new" style={{ color: 'var(--accent)' }}>Create one.</Link></>
                  : 'No cases match the current filters.'}
              </td></tr>
            ) : sorted.map(c => (
              <CaseRow key={c.id} c={c} />
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--ink-60)' }}>{sorted.length} cases shown. Sorted by {sortKey} {sortDir}.</span>
      </div>
    </AppShell>
  )
}

function FilterChip({ active, onClick, label, count, dot }: { active: boolean; onClick: () => void; label: string; count: number; dot?: TierToken }) {
  return (
    <button type="button" className={`filter-pill${active ? ' active' : ''}`} onClick={onClick} style={{ background: 'inherit', font: 'inherit' }}>
      {dot ? <span style={{ width: 6, height: 6, background: `var(--risk-${dot})`, display: 'inline-block' }} /> : null}
      {label} <span className="ct">{count}</span>
    </button>
  )
}

function CaseRow({ c }: { c: Case }) {
  const t = tierToken(c.risk_level)
  const rowCls = t === 'crit' ? 'row-crit' : t === 'high' ? 'row-high' : ''
  const submittedTime = new Date(c.submitted_at).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false })
  const submittedDate = new Date(c.submitted_at).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })
  const totalFlags = c.flag_counts.critical + c.flag_counts.high + c.flag_counts.medium + c.flag_counts.low
  return (
    <tr className={rowCls}>
      <td className="mono">
        <Link href={`/cases/${c.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{c.reference}</Link>
      </td>
      <td>
        <div style={{ fontSize: 12.5 }}>{c.broker?.broker_name ?? <span className="derived">—</span>}</div>
        {c.broker?.broker_abn ? <div className="mono derived" style={{ fontSize: 10.5 }}>{c.broker.broker_abn}</div> : null}
      </td>
      <td>
        <div style={{ fontSize: 12.5 }}>{c.applicant_name ?? <span className="derived">Redacted</span>}</div>
      </td>
      <td className="mono derived">{submittedDate} . {submittedTime}</td>
      <td className="mono right">{c.loan_amount != null ? `$${Math.round(c.loan_amount / 1000)}k` : <span className="derived">—</span>}</td>
      <td>
        <div className="score-cell">
          <span className="mono" style={{ minWidth: 22, textAlign: 'right', fontWeight: t === 'crit' ? 600 : 400, color: t === 'crit' ? 'var(--risk-crit)' : t === 'high' ? 'var(--risk-high)' : 'var(--ink-100)' }}>
            {c.risk_score ?? '—'}
          </span>
          {c.risk_score != null ? (
            <span className={`score-bar tier-${t}`} aria-hidden="true">
              <i style={{ width: `${c.risk_score}%` }} />
            </span>
          ) : null}
        </div>
      </td>
      <td><RiskBadge tier={t} /></td>
      <td>
        <span className="mono" style={{ color: totalFlags > 0 ? 'var(--ink-100)' : 'var(--ink-40)', fontSize: 11 }}>
          {totalFlags > 0
            ? `${c.flag_counts.critical}c/${c.flag_counts.high}h/${c.flag_counts.medium}m`
            : 'no flags'}
        </span>
        <span className="row-actions" style={{ marginLeft: 8 }}>
          <Link href={`/cases/${c.id}`}>Open</Link>
          <button type="button">Assign</button>
          <button type="button">Dismiss</button>
        </span>
      </td>
    </tr>
  )
}
