'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { DEMO_CASES } from '@/lib/demo-data'
import { Logo } from '@/components/Logo'
import ScoreGauge from '@/components/ui/ScoreGauge'
import RiskBadge from '@/components/ui/RiskBadge'
import DemoTour from '@/components/ui/DemoTour'

const ACTION_STYLE = {
  approve: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  manual_review: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  reject: 'text-red-300 bg-red-500/10 border-red-500/20',
} as const

const ACTION_LABEL = {
  approve: 'Approve',
  manual_review: 'Manual Review',
  reject: 'Reject',
} as const

export default function DemoPage() {
  return (
    <div className="min-h-screen text-white"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(30,27,75,0.9) 0%, #0a0a1a 50%)' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5">
        <Logo variant="combo" height={40} />
        <div className="flex items-center gap-4">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-3 py-1 font-medium">
            Live Demo
          </span>
          <Link href="/" className="text-white/50 hover:text-white/80 text-sm transition">
            Back to site
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12" data-tour="demo-header">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">See Trutina in action</h1>
          <p className="text-white/50 max-w-2xl mx-auto">
            Five pre-analysed loan applications demonstrating how Trutina catches AI-generated documents,
            invalid ABNs, forged bank statements, and suspicious broker patterns. Click any case to see the full breakdown.
          </p>
        </div>

        {/* Case grid */}
        <div className="space-y-4">
          {DEMO_CASES.map((c, i) => (
            <Link key={c.id} href={`/demo/${c.id}`}
              data-tour={`case-card-${i}`}
              className="block rounded-xl border border-white/10 p-6 hover:border-white/20 transition group"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Score */}
                <div className="shrink-0 flex justify-center">
                  <ScoreGauge score={c.risk_score} size={80} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-white/30 text-xs font-mono">{c.reference}</span>
                    <RiskBadge level={c.risk_level} />
                    {c.recommended_action && (
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium ${ACTION_STYLE[c.recommended_action]}`}>
                        {ACTION_LABEL[c.recommended_action]}
                      </span>
                    )}
                  </div>
                  <div className="text-white font-semibold group-hover:text-blue-300 transition">
                    {c.applicant_name}
                  </div>
                  <div className="text-white/40 text-sm mt-1">{c.headline}</div>
                </div>

                {/* Stats */}
                <div className="flex md:flex-col items-center gap-4 md:gap-1 md:text-right shrink-0">
                  <div className="text-white/50 text-sm">
                    ${c.loan_amount?.toLocaleString()}
                  </div>
                  <div className="text-white/30 text-xs">
                    {c.document_count} doc{c.document_count !== 1 && 's'} · {c.flags.length} flag{c.flags.length !== 1 && 's'}
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center text-white/20 group-hover:text-white/50 transition">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              {/* Flag summary chips */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                {c.flag_counts.critical > 0 && (
                  <span className="text-xs bg-red-500/15 text-red-300 rounded px-2 py-0.5">
                    {c.flag_counts.critical} critical
                  </span>
                )}
                {c.flag_counts.high > 0 && (
                  <span className="text-xs bg-orange-500/15 text-orange-300 rounded px-2 py-0.5">
                    {c.flag_counts.high} high
                  </span>
                )}
                {c.flag_counts.medium > 0 && (
                  <span className="text-xs bg-amber-500/15 text-amber-300 rounded px-2 py-0.5">
                    {c.flag_counts.medium} medium
                  </span>
                )}
                {c.flag_counts.low > 0 && (
                  <span className="text-xs bg-emerald-500/15 text-emerald-300 rounded px-2 py-0.5">
                    {c.flag_counts.low} low
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 rounded-2xl border border-blue-500/20 p-10"
          style={{ background: 'rgba(59,130,246,0.05)' }}>
          <h2 className="text-2xl font-bold mb-3">Ready to try with your own documents?</h2>
          <p className="text-white/50 mb-6 max-w-lg mx-auto">
            Start a free trial — upload up to 5 documents with no credit card required.
            See exactly how Trutina would assess your real loan applications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#pricing"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition">
              Start free trial
            </Link>
            <a href="mailto:hello@trutina.com.au"
              className="text-white/50 hover:text-white/70 transition text-sm">
              Or request a demo call
            </a>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 px-8 py-6 text-center text-white/20 text-xs mt-12">
        Trutina by Solaisoft Pty Ltd · hello@trutina.com.au · All sample data is synthetic — no real applicant data is shown
      </footer>

      <DemoTour page="case-list" />
    </div>
  )
}
