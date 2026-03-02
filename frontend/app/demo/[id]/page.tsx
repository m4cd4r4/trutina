'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { getDemoCase } from '@/lib/demo-data'
import { CategoryIcon, getCategoryLabel } from '@/components/ui/CategoryIcon'
import type { FlagCategory, FraudFlag, RiskLevel } from '@/lib/types'
import ScoreGauge from '@/components/ui/ScoreGauge'
import RiskBadge from '@/components/ui/RiskBadge'
import DocumentViewer from '@/components/ui/DocumentViewer'
import DemoTour from '@/components/ui/DemoTour'

const ACTION_CONFIG = {
  approve: { label: 'Approve', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', desc: 'All checks passed. This application can proceed through standard processing.' },
  manual_review: { label: 'Manual Review', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-300', desc: 'Flags detected that require human assessment before a decision can be made.' },
  reject: { label: 'Reject', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300', desc: 'Critical issues detected. This application should not proceed without escalation.' },
} as const

const SEVERITY_STYLES: Record<RiskLevel, string> = {
  critical: 'border-l-red-500 bg-red-500/5',
  high: 'border-l-orange-500 bg-orange-500/5',
  medium: 'border-l-amber-500 bg-amber-500/5',
  low: 'border-l-emerald-500 bg-emerald-500/5',
}

function groupFlags(flags: FraudFlag[]): Record<FlagCategory, FraudFlag[]> {
  const groups: Partial<Record<FlagCategory, FraudFlag[]>> = {}
  for (const f of flags) {
    if (!groups[f.category]) groups[f.category] = []
    groups[f.category]!.push(f)
  }
  return groups as Record<FlagCategory, FraudFlag[]>
}

export default function DemoCaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const c = getDemoCase(id)
  if (!c) notFound()

  const grouped = groupFlags(c.flags)
  const action = c.recommended_action ? ACTION_CONFIG[c.recommended_action] : null

  return (
    <div className="min-h-screen text-white"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(30,27,75,0.9) 0%, #0a0a1a 50%)' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5">
        <Logo variant="combo" height={36} />
        <div className="flex items-center gap-4">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-3 py-1 font-medium">
            Live Demo
          </span>
          <Link href="/demo" className="text-white/50 hover:text-white/80 text-sm transition">
            All cases
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-10">
          <div className="shrink-0 flex justify-center" data-tour="score-gauge">
            <ScoreGauge score={c.risk_score} size={140} />
          </div>
          <div className="flex-1" data-tour="case-header">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-white/30 text-xs font-mono">{c.reference}</span>
              <RiskBadge level={c.risk_level} size="md" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{c.applicant_name}</h1>
            <p className="text-white/40 text-sm mb-4">{c.headline}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/30 text-xs mb-1">Loan Amount</div>
                <div className="text-white font-semibold">${c.loan_amount?.toLocaleString()}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/30 text-xs mb-1">Documents</div>
                <div className="text-white font-semibold">{c.document_count}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/30 text-xs mb-1">Flags</div>
                <div className="text-white font-semibold">{c.flags.length}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white/30 text-xs mb-1">Broker</div>
                <div className="text-white font-semibold truncate">{c.broker?.broker_name || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Action */}
        {action && (
          <div data-tour="recommended-action" className={`rounded-xl border ${action.border} ${action.bg} p-6 mb-8`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-lg font-bold ${action.text}`}>Recommended: {action.label}</span>
            </div>
            <p className="text-white/50 text-sm">{action.desc}</p>
          </div>
        )}

        {/* Summary */}
        <div data-tour="analysis-summary" className="rounded-xl border border-white/10 p-6 mb-8"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <h2 className="text-white font-semibold mb-3">Analysis Summary</h2>
          <p className="text-white/60 text-sm leading-relaxed">{c.summary}</p>
        </div>

        {/* Documents with inline PDF viewer */}
        <div data-tour="document-viewer">
          <DocumentViewer documents={c.documents} flags={c.flags} />
        </div>

        {/* Flags by category */}
        <div data-tour="fraud-flags">
        <h2 className="text-white font-semibold text-lg mb-4">
          Fraud Flags ({c.flags.length})
        </h2>

        <div className="space-y-6">
          {(Object.entries(grouped) as [FlagCategory, FraudFlag[]][]).map(([category, flags]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <CategoryIcon category={category} className="w-5 h-5 text-blue-400" />
                <span className="text-white/60 text-sm font-medium">{getCategoryLabel(category)}</span>
                <span className="text-white/20 text-xs">({flags.length})</span>
              </div>

              <div className="space-y-3">
                {flags.map(f => (
                  <div key={f.id}
                    className={`rounded-xl border-l-4 border border-white/5 p-5 ${SEVERITY_STYLES[f.severity]}`}>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <RiskBadge level={f.severity} />
                      <span className="text-white font-semibold text-sm">{f.title}</span>
                      <span className="text-white/20 text-xs font-mono ml-auto">{f.code}</span>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed mb-3">{f.description}</p>

                    {/* Evidence */}
                    {Object.keys(f.evidence).length > 0 && (
                      <div className="bg-black/20 rounded-lg p-3 overflow-x-auto">
                        <div className="text-white/30 text-xs uppercase tracking-wider mb-2">Evidence</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {Object.entries(f.evidence).map(([key, val]) => (
                            <div key={key}>
                              <span className="text-white/30">{key.replace(/_/g, ' ')}: </span>
                              <span className="text-white/70 font-mono">
                                {Array.isArray(val) ? val.join(', ') : String(val)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
          <Link href="/demo" className="text-white/50 hover:text-white/80 transition text-sm flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            All demo cases
          </Link>
          <Link href="/#pricing"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm">
            Start free trial
          </Link>
        </div>
      </div>

      <footer className="border-t border-white/5 px-8 py-6 text-center text-white/20 text-xs mt-8">
        All sample data is synthetic — no real applicant data is shown
      </footer>

      <DemoTour page="case-detail" />
    </div>
  )
}
