'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { Case, CaseStatus, RiskLevel } from '@/lib/types'
import RiskBadge from '@/components/ui/RiskBadge'
import DemoTour from '@/components/ui/DemoTour'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'complete', label: 'Complete' },
  { value: 'flagged_for_review', label: 'Flagged for Review' },
  { value: 'failed', label: 'Failed' },
]

const RISK_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Risk Levels' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

export default function Dashboard() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)

  useEffect(() => {
    const params: { status?: string; risk_level?: string; limit?: number } = { limit: 100 }
    if (statusFilter) params.status = statusFilter
    if (riskFilter) params.risk_level = riskFilter
    setLoading(true)
    api.cases.list(params).then(setCases).finally(() => setLoading(false))
  }, [statusFilter, riskFilter])

  const filteredCases = useMemo(() => {
    if (!searchQuery.trim()) return cases
    const q = searchQuery.toLowerCase()
    return cases.filter(c =>
      c.applicant_name?.toLowerCase().includes(q) ||
      c.reference.toLowerCase().includes(q)
    )
  }, [cases, searchQuery])

  const total = cases.length
  const flagged = cases.filter(c => c.risk_level === 'high' || c.risk_level === 'critical').length
  const processing = cases.filter(c => c.status === 'processing').length
  const avgScore = cases.filter(c => c.risk_score !== null).reduce((sum, c) => sum + (c.risk_score ?? 0), 0) / (cases.filter(c => c.risk_score !== null).length || 1)

  const stats = [
    { label: 'Total Cases', value: total },
    { label: 'High / Critical Risk', value: flagged, highlight: flagged > 0 },
    { label: 'Processing', value: processing },
    { label: 'Avg Risk Score', value: isNaN(avgScore) ? '—' : avgScore.toFixed(0) },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Tru<span className="text-blue-400">tina</span></h1>
            <p className="text-white/40 text-sm mt-0.5">AI Lending Fraud Detection</p>
          </div>
          <Link href="/cases/new" data-tour="dash-new-case"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            + New Case
          </Link>
        </div>

        {/* Stats */}
        <div data-tour="dash-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label}
              className="rounded-xl border border-white/10 p-4"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className={`text-3xl font-bold ${s.highlight ? 'text-red-400' : 'text-white'}`}>{s.value}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Credit warning banner */}
        {creditsRemaining !== null && creditsRemaining <= 1 && (
          <div className="rounded-xl border border-amber-500/30 p-4 mb-8 flex items-center justify-between"
            style={{ background: 'rgba(245,158,11,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">&#9888;</div>
              <div>
                <span className="text-amber-300 text-sm font-semibold">
                  {creditsRemaining === 0 ? 'No credits remaining' : '1 credit remaining'}
                </span>
                <span className="text-white/30 text-sm mx-2">&mdash;</span>
                <span className="text-white/50 text-sm">upgrade to continue analysing documents</span>
              </div>
            </div>
            <a href="mailto:hello@trutina.com.au?subject=Trutina%20%E2%80%94%20Upgrade%20Request"
              className="text-sm bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium px-4 py-1.5 rounded-lg transition whitespace-nowrap border border-amber-500/20">
              Upgrade &rarr;
            </a>
          </div>
        )}

        {/* Credits banner (normal state) */}
        {(creditsRemaining === null || creditsRemaining > 1) && (
          <div data-tour="dash-credits" className="rounded-xl border border-white/10 p-4 mb-8 flex items-center justify-between"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-sm">&#9889;</div>
              <div>
                <span className="text-white/70 text-sm">Free trial</span>
                <span className="text-white/30 text-sm mx-2">&middot;</span>
                <span className="text-white/50 text-sm">5 document analyses included</span>
              </div>
            </div>
            <a href="mailto:hello@trutina.com.au?subject=Trutina%20%E2%80%94%20Interested%20in%20more%20credits"
              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition whitespace-nowrap">
              Need more? Contact us &rarr;
            </a>
          </div>
        )}

        {/* Filters */}
        <div data-tour="dash-filters" className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:border-blue-500/50 transition appearance-none cursor-pointer"
            style={{ minWidth: '160px' }}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[#0a0a1a]">{opt.label}</option>
            ))}
          </select>

          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:border-blue-500/50 transition appearance-none cursor-pointer"
            style={{ minWidth: '160px' }}
          >
            {RISK_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[#0a0a1a]">{opt.label}</option>
            ))}
          </select>

          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by applicant name or reference..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/20 text-sm focus:outline-none focus:border-blue-500/50 transition"
            />
          </div>

          {(statusFilter || riskFilter || searchQuery) && (
            <button
              onClick={() => { setStatusFilter(''); setRiskFilter(''); setSearchQuery('') }}
              className="text-white/30 hover:text-white/60 text-xs transition"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Cases table */}
        <div data-tour="dash-cases" className="rounded-xl border border-white/10 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white/80">
              {statusFilter || riskFilter || searchQuery ? `Filtered Cases (${filteredCases.length})` : 'Recent Cases'}
            </h2>
            <Link href="/cases" className="text-blue-400 text-sm hover:text-blue-300">View all</Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-white/30">Loading...</div>
          ) : filteredCases.length === 0 ? (
            <div className="p-8 text-center text-white/30">
              {cases.length === 0
                ? <>No cases yet. <Link href="/cases/new" className="text-blue-400 hover:underline">Create one.</Link></>
                : 'No cases match the current filters.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['Reference', 'Applicant', 'Loan Amount', 'Broker', 'Risk', 'Status', 'Submitted'].map(h => (
                    <th key={h} className="text-left text-white/40 font-normal px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCases.slice(0, 20).map(c => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                    <td className="px-6 py-3">
                      <Link href={`/cases/${c.id}`} className="text-blue-400 hover:text-blue-300 font-mono text-xs">
                        {c.reference}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-white/80">{c.applicant_name || '—'}</td>
                    <td className="px-6 py-3 text-white/60">
                      {c.loan_amount ? `$${c.loan_amount.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-6 py-3 text-white/50 text-xs">{c.broker?.broker_name || '—'}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {c.risk_score !== null && (
                          <span className="text-white/60 font-mono text-xs w-6 text-right">{c.risk_score}</span>
                        )}
                        <RiskBadge level={c.risk_level} />
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-xs ${c.status === 'flagged_for_review' ? 'text-orange-400' : c.status === 'failed' ? 'text-red-400' : c.status === 'processing' ? 'text-blue-400' : 'text-white/50'}`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-white/30 text-xs">
                      {new Date(c.submitted_at).toLocaleDateString('en-AU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <DemoTour page="dashboard" />
    </div>
  )
}
