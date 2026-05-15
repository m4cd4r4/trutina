'use client'

import { useRouter } from 'next/navigation'
import { DEMO_CASES } from '@/lib/demo-data'
import SiteHeader from '@/components/design/SiteHeader'
import SiteFooter from '@/components/design/SiteFooter'
import { RiskBadge } from '@/components/design/atoms'
import { tierToken } from '@/lib/case-modules'

export default function DemoLandingPage() {
  const router = useRouter()
  return (
    <>
      <SiteHeader active="demo" />

      <main className="page" style={{ paddingTop: 40, paddingBottom: 0, position: 'relative' }}>
        <div className="content-header" style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 16, marginBottom: 24 }}>
          <h1>Specimens</h1>
          <span className="sub">
            Five redacted Australian loan applications. Click a case to see the full breakdown.
          </span>
        </div>

        <div style={{ padding: '14px 0 18px', fontSize: 14, color: 'var(--ink-80)', maxWidth: 780, fontFamily: 'var(--font-serif)', lineHeight: 1.55 }}>
          Each panel below shows a case as it arrived through a broker channel, the modules that flagged it, and the score derived from the evidence. There is no overall verdict at the top; the verdict is the sum of the measurements.
        </div>

        <div className="q-table-wrap" style={{ marginTop: 24 }}>
          <table className="q-table">
            <thead>
              <tr>
                <th style={{ width: '14%' }}>Case</th>
                <th>Applicant / headline</th>
                <th style={{ width: '14%' }}>Broker</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Loan</th>
                <th style={{ width: '8%', textAlign: 'right' }}>Score</th>
                <th style={{ width: '9%' }}>Tier</th>
                <th style={{ width: '8%' }}>Flags</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_CASES.map(c => {
                const t = tierToken(c.risk_level)
                const rowCls = t === 'crit' ? 'row-crit' : t === 'high' ? 'row-high' : ''
                const totalFlags = c.flag_counts.critical + c.flag_counts.high + c.flag_counts.medium + c.flag_counts.low
                const href = `/demo/${c.id}`
                const navigate = () => router.push(href)
                return (
                  <tr
                    key={c.id}
                    className={rowCls}
                    role="link"
                    tabIndex={0}
                    aria-label={`Open case ${c.reference} — ${c.applicant_name}`}
                    onClick={navigate}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate() } }}
                  >
                    <td className="mono">{c.reference}</td>
                    <td>
                      <div style={{ fontSize: 13 }}>{c.applicant_name}</div>
                      <div className="derived" style={{ fontSize: 11.5 }}>{c.headline}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12.5 }}>{c.broker?.broker_name ?? <span className="derived">—</span>}</div>
                    </td>
                    <td className="mono right">${c.loan_amount?.toLocaleString('en-AU') ?? '—'}</td>
                    <td className="mono right" style={{ color: t === 'crit' ? 'var(--risk-crit)' : t === 'high' ? 'var(--risk-high)' : 'var(--ink-100)', fontWeight: t === 'crit' ? 600 : 400 }}>
                      {c.risk_score}
                    </td>
                    <td><RiskBadge tier={t} /></td>
                    <td className="mono" style={{ color: totalFlags > 0 ? 'var(--ink-100)' : 'var(--ink-40)' }}>
                      {totalFlags > 0
                        ? `${c.flag_counts.critical}c/${c.flag_counts.high}h`
                        : 'no flags'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 48, padding: 32, background: 'var(--paper-1)', border: '1px solid var(--rule)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Assess against your portfolio</h2>
          <p style={{ color: 'var(--ink-60)', maxWidth: 480, margin: '0 auto 16px' }}>
            For Australian lenders, aggregators, and credit-risk teams. Source and methods paper available on request.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a href="mailto:hello@trutina.com.au?subject=Trutina%20engagement%20enquiry" className="btn btn-primary">Email about an engagement</a>
            <a href="/methods-paper.pdf" target="_blank" rel="noopener" className="btn-text">Methods paper (PDF)</a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
