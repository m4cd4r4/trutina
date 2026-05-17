import type { Metadata } from 'next'
import { Microscope, Bot, Link2, Calculator, Users, ClipboardList } from 'lucide-react'
import { Logo } from '@/components/Logo'
import DocShell from '@/components/DocShell'

export const metadata: Metadata = {
  title: 'Sales One-Pager — AI Lending Fraud Detection',
  description: 'One-page overview of Trutina: the problem of AI-generated mortgage fraud, how the six-layer detection engine works, and pricing for Australian lenders.',
  alternates: { canonical: '/docs/one-pager' },
}

const CARD = { background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' } as const
const DOT = { background: 'var(--accent)' } as const
const ICON_STYLE = { color: 'var(--accent)' } as const

const MODULES = [
  {
    icon: <Microscope className="w-5 h-5" style={ICON_STYLE} />,
    title: 'PDF Forensics',
    desc: 'Metadata, font fingerprints, timestamp anomalies',
  },
  {
    icon: <Bot className="w-5 h-5" style={ICON_STYLE} />,
    title: 'AI Content Detection',
    desc: 'Claude Sonnet semantic analysis for AI-generation patterns',
  },
  {
    icon: <Link2 className="w-5 h-5" style={ICON_STYLE} />,
    title: 'Cross-Reference Verification',
    desc: 'Live ABN Lookup, BSB directory, ABS wage benchmarks',
  },
  {
    icon: <Calculator className="w-5 h-5" style={ICON_STYLE} />,
    title: 'Math & Date Consistency',
    desc: 'Gross−tax=net, 11.5% SGC super, YTD validation',
  },
  {
    icon: <Users className="w-5 h-5" style={ICON_STYLE} />,
    title: 'Broker Risk Profiling',
    desc: 'Velocity, fraud rates, network clustering',
  },
  {
    icon: <ClipboardList className="w-5 h-5" style={ICON_STYLE} />,
    title: 'APRA-Ready Explainability',
    desc: 'Plain-English narrative + evidence for every score',
  },
]

const PRICING = [
  { name: 'Free Trial', price: 'Free', volume: '5 documents', highlight: false },
  { name: 'Starter', price: '$2,000/mo', volume: '200 cases/mo', highlight: false },
  { name: 'Professional', price: '$6,000/mo', volume: '1,000 cases/mo', highlight: true },
  { name: 'Enterprise', price: 'Custom', volume: 'Unlimited', highlight: false },
  { name: 'API', price: '$15/case', volume: 'Pay-as-you-go', highlight: false },
]

const STEPS = [
  { num: '1', title: 'Upload documents', desc: 'Via API webhook or web dashboard' },
  { num: '2', title: 'AI analyses in ~60s', desc: '6-layer detection engine processes each document' },
  { num: '3', title: 'Explainable risk score', desc: 'Score + plain-English narrative + recommended action' },
]

export default function OnePager() {
  return (
    <DocShell
      title="Sales One-Pager"
      intro="AI Lending Fraud Detection for Australian Lenders"
    >
          <div className="text-center mb-8 sm:mb-10 no-print">
            <Logo variant="wordmark" href="" className="text-2xl sm:text-3xl" />
            <div className="w-16 h-0.5 mx-auto mt-2" style={DOT} />
          </div>

          {/* Problem */}
          <div className="rounded-xl p-5 sm:p-6 mb-6"
            style={{ background: 'var(--risk-crit-fill)', border: '1px solid var(--risk-crit-edge)' }}>
            <h2 className="font-bold mb-2 text-sm uppercase tracking-wider" style={{ color: 'var(--risk-crit)' }}>The Problem</h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--ink-80)' }}>
              CBA self-reported <strong style={{ color: 'var(--ink-100)' }}>~A$1 billion</strong> in AI-document mortgage fraud (Feb 2026).
              Westpac and ANZ have flagged similar issues. AI tools now generate payslips, bank statements, and
              employment letters convincing enough to bypass manual review. The problem is industry-wide and unsolved.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="rounded-lg px-3 py-1.5" style={{ background: 'var(--paper-2)' }}>
                <strong>CBA</strong> ~$1B
              </span>
              <span className="rounded-lg px-3 py-1.5" style={{ background: 'var(--paper-2)' }}>
                <strong>NAB</strong> ~$105M (&ldquo;Penthouse Syndicate&rdquo;)
              </span>
              <span className="rounded-lg px-3 py-1.5" style={{ background: 'var(--paper-2)' }}>
                <strong>Westpac / ANZ</strong> Undisclosed
              </span>
            </div>
          </div>

          {/* What Trutina does */}
          <div className="mb-6">
            <h2 style={{ marginBottom: 12 }}>What Trutina Does</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-60)' }}>
              Upload loan application documents. Trutina runs a 6-layer AI analysis and returns an
              explainable risk score in approximately 60 seconds. It catches what humans cannot &mdash;
              AI-generated patterns, metadata anomalies, invalid references, and mathematical inconsistencies.
            </p>
          </div>

          {/* How it works - 3 steps */}
          <div className="mb-6">
            <h2 style={{ marginBottom: 12 }}>How It Works</h2>
            <div className="grid grid-cols-3 gap-3">
              {STEPS.map(s => (
                <div key={s.num} className="text-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2"
                    style={{ background: 'var(--accent)', color: 'var(--paper-0)' }}>
                    {s.num}
                  </div>
                  <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--ink-100)' }}>{s.title}</div>
                  <div className="text-xs leading-snug" style={{ color: 'var(--ink-40)' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 6 Detection Modules */}
          <div className="mb-6">
            <h2 style={{ marginBottom: 12 }}>Six Detection Modules</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MODULES.map(m => (
                <div key={m.title}
                  className="rounded-lg p-3"
                  style={CARD}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="no-print">{m.icon}</span>
                    <h3 className="font-semibold text-xs" style={{ color: 'var(--ink-100)' }}>{m.title}</h3>
                  </div>
                  <p className="text-xs leading-snug" style={{ color: 'var(--ink-40)' }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <h2 style={{ marginBottom: 12 }}>Pricing</h2>
            <div className="rounded-xl overflow-hidden" style={CARD}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--paper-1)', borderBottom: '1px solid var(--rule)' }}>
                    <th className="text-left font-medium px-4 py-2.5 text-xs" style={{ color: 'var(--ink-60)' }}>Plan</th>
                    <th className="text-left font-medium px-4 py-2.5 text-xs" style={{ color: 'var(--ink-60)' }}>Price</th>
                    <th className="text-left font-medium px-4 py-2.5 text-xs" style={{ color: 'var(--ink-60)' }}>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING.map(p => (
                    <tr key={p.name}
                      className="last:border-b-0"
                      style={{
                        borderBottom: '1px solid var(--rule-soft)',
                        ...(p.highlight ? { background: 'var(--accent-fill)' } : {}),
                      }}>
                      <td className="px-4 py-2.5 font-medium text-sm" style={{ color: 'var(--ink-100)' }}>
                        {p.name}
                        {p.highlight && (
                          <span className="ml-2 text-xs font-normal" style={{ color: 'var(--accent)' }}>Most popular</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-sm" style={{ color: 'var(--ink-100)' }}>{p.price}</td>
                      <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--ink-60)' }}>{p.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl p-5 text-center" style={CARD}>
            <h2 className="font-bold mb-1 text-sm" style={{ color: 'var(--ink-100)' }}>Ready to protect your loan book?</h2>
            <p className="text-xs mb-3" style={{ color: 'var(--ink-40)' }}>
              Start with a free trial &mdash; 5 documents, no credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
              <a href="mailto:hello@trutina.com.au" className="underline underline-offset-2 font-medium" style={{ color: 'var(--accent)' }}>
                hello@trutina.com.au
              </a>
              <span className="hidden sm:inline" style={{ color: 'var(--ink-25)' }}>|</span>
              <a href="https://trutina.com.au" className="underline underline-offset-2 font-medium" style={{ color: 'var(--accent)' }}>
                trutina.com.au
              </a>
            </div>
            <div className="mt-3 text-xs" style={{ color: 'var(--ink-25)' }}>
              trutina.com.au &middot; hello@trutina.com.au
            </div>
          </div>

    </DocShell>
  )
}
