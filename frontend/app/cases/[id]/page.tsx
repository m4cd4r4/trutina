'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { CaseDetail, FlagCategory, RiskLevel } from '@/lib/types'
import RiskBadge from '@/components/ui/RiskBadge'
import ScoreGauge from '@/components/ui/ScoreGauge'

const CATEGORY_LABELS: Record<FlagCategory, string> = {
  pdf_forensics: 'PDF Forensics',
  ai_content: 'AI Content Detection',
  consistency: 'Math & Date Consistency',
  cross_reference: 'Cross-Reference Checks',
  broker_risk: 'Broker Risk',
  identity: 'Identity Verification',
}

const ACTION_CONFIG = {
  approve: { label: 'APPROVE', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-300' },
  manual_review: { label: 'MANUAL REVIEW REQUIRED', bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-300' },
  reject: { label: 'REJECT — ESCALATE TO FRAUD TEAM', bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-300' },
}

const SEVERITY_ORDER: RiskLevel[] = ['critical', 'high', 'medium', 'low']

export default function CasePage() {
  const { id } = useParams<{ id: string }>()
  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    api.cases.get(id).then(setCaseData).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-white/30">
      Loading case…
    </div>
  )

  if (!caseData) return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-red-400">
      Case not found
    </div>
  )

  const action = caseData.recommended_action
  const actionCfg = action ? ACTION_CONFIG[action] : null

  // Group flags by category
  const byCategory: Record<string, typeof caseData.flags> = {}
  for (const flag of caseData.flags) {
    if (!byCategory[flag.category]) byCategory[flag.category] = []
    byCategory[flag.category].push(flag)
  }
  // Sort each category by severity
  for (const cat of Object.keys(byCategory)) {
    byCategory[cat].sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6 text-sm">
          <Link href="/dashboard" className="text-white/40 hover:text-white/70">Dashboard</Link>
          <span className="text-white/20">/</span>
          <Link href="/cases" className="text-white/40 hover:text-white/70">Cases</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/70 font-mono">{caseData.reference}</span>
        </div>

        {/* Action Banner */}
        {actionCfg && (
          <div className={`rounded-xl border ${actionCfg.border} ${actionCfg.bg} px-6 py-4 mb-6 flex items-center gap-4`}>
            <span className={`font-bold text-sm tracking-wider ${actionCfg.text}`}>{actionCfg.label}</span>
            {caseData.summary && (
              <span className="text-white/50 text-sm flex-1">{caseData.summary}</span>
            )}
          </div>
        )}

        {/* Score + details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Score gauge */}
          <div className="rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center gap-3"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <ScoreGauge score={caseData.risk_score} size={140} />
            <RiskBadge level={caseData.risk_level} size="md" />
          </div>

          {/* Case info */}
          <div className="md:col-span-2 rounded-xl border border-white/10 p-6 grid grid-cols-2 gap-4"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            {[
              { label: 'Reference', value: caseData.reference },
              { label: 'Applicant', value: caseData.applicant_name || '—' },
              { label: 'Loan Amount', value: caseData.loan_amount ? `$${caseData.loan_amount.toLocaleString()}` : '—' },
              { label: 'Property', value: caseData.property_address || '—' },
              { label: 'Broker', value: caseData.broker?.broker_name || '—' },
              { label: 'Broker ABN', value: caseData.broker?.broker_abn || '—' },
              { label: 'Submitted', value: new Date(caseData.submitted_at).toLocaleString('en-AU') },
              { label: 'Analysed', value: caseData.analysed_at ? new Date(caseData.analysed_at).toLocaleString('en-AU') : '—' },
            ].map(row => (
              <div key={row.label}>
                <div className="text-white/40 text-xs uppercase tracking-wider">{row.label}</div>
                <div className="text-white/80 text-sm mt-0.5 truncate">{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Flag counts */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {SEVERITY_ORDER.map(sev => {
            const count = caseData.flag_counts[sev] || 0
            const colors = {
              critical: 'text-red-400', high: 'text-orange-400', medium: 'text-amber-400', low: 'text-emerald-400'
            }
            return (
              <div key={sev} className="rounded-xl border border-white/10 p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className={`text-2xl font-bold ${colors[sev]}`}>{count}</div>
                <div className="text-white/30 text-xs mt-0.5 uppercase tracking-wider">{sev}</div>
              </div>
            )
          })}
        </div>

        {/* Documents */}
        {caseData.documents.length > 0 && (
          <div className="rounded-xl border border-white/10 p-4 mb-6"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3">Documents</h3>
            <div className="flex flex-wrap gap-2">
              {caseData.documents.map(d => (
                <div key={d.id} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
                  <span className="text-blue-400">{d.doc_type.replace(/_/g, ' ')}</span>
                  <span className="text-white/40 ml-2">{d.filename}</span>
                  <span className={`ml-2 ${d.status === 'processed' ? 'text-emerald-400' : 'text-white/30'}`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flags by category */}
        {caseData.flags.length === 0 ? (
          <div className="rounded-xl border border-white/10 p-8 text-center text-white/30"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            No fraud indicators detected
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-white/70 font-semibold">Fraud Indicators ({caseData.flags.length})</h3>
            {Object.entries(byCategory).map(([cat, flags]) => (
              <div key={cat} className="rounded-xl border border-white/10 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <button
                  onClick={() => setExpanded(expanded === cat ? null : cat)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition"
                >
                  <span className="font-medium text-white/80 text-sm">
                    {CATEGORY_LABELS[cat as FlagCategory] || cat}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-xs">{flags.length} flag{flags.length !== 1 ? 's' : ''}</span>
                    <span className="text-white/30 text-xs">{expanded === cat ? '▲' : '▼'}</span>
                  </div>
                </button>

                {expanded === cat && (
                  <div className="border-t border-white/10 divide-y divide-white/5">
                    {flags.map(flag => (
                      <div key={flag.id} className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <RiskBadge level={flag.severity} />
                          <div className="flex-1 min-w-0">
                            <div className="text-white/80 text-sm font-medium">{flag.title}</div>
                            <div className="text-white/40 text-xs mt-1 leading-relaxed">{flag.description}</div>
                            {flag.evidence && Object.keys(flag.evidence).length > 0 && (
                              <div className="mt-2 bg-black/20 rounded-lg p-2">
                                <div className="text-white/20 text-xs mb-1">Evidence</div>
                                <pre className="text-white/50 text-xs overflow-x-auto">
                                  {JSON.stringify(flag.evidence, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                          <div className="text-white/20 text-xs font-mono shrink-0">{flag.code}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
