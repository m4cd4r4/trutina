import type { Metadata } from 'next'
import Link from 'next/link'
import { Microscope, Bot, Link2, Calculator, Users, ClipboardList, Check } from 'lucide-react'
import { Logo } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Sales One-Pager — AI Lending Fraud Detection',
  description: 'One-page overview of Trutina: the problem of AI-generated mortgage fraud, how the six-layer detection engine works, and pricing for Australian lenders.',
  alternates: { canonical: '/docs/one-pager' },
}

const MODULES = [
  {
    icon: <Microscope className="w-5 h-5 text-teal-400" />,
    title: 'PDF Forensics',
    desc: 'Metadata, font fingerprints, timestamp anomalies',
  },
  {
    icon: <Bot className="w-5 h-5 text-teal-400" />,
    title: 'AI Content Detection',
    desc: 'Claude Sonnet semantic analysis for AI-generation patterns',
  },
  {
    icon: <Link2 className="w-5 h-5 text-teal-400" />,
    title: 'Cross-Reference Verification',
    desc: 'Live ABN Lookup, BSB directory, ABS wage benchmarks',
  },
  {
    icon: <Calculator className="w-5 h-5 text-teal-400" />,
    title: 'Math & Date Consistency',
    desc: 'Gross\u2212tax=net, 11.5% SGC super, YTD validation',
  },
  {
    icon: <Users className="w-5 h-5 text-teal-400" />,
    title: 'Broker Risk Profiling',
    desc: 'Velocity, fraud rates, network clustering',
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-teal-400" />,
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
    <>
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 1.5cm;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          .print-page {
            background: white !important;
            color: #111 !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .print-page * {
            color: #111 !important;
            border-color: #ddd !important;
          }
          .print-page .print-blue { color: #1F4FA3 !important; }
          .print-page .print-muted { color: #555 !important; }
          .print-page .print-light { color: #888 !important; }
          .print-page .print-card {
            background: #f8f9fa !important;
            border: 1px solid #e5e7eb !important;
          }
          .print-page .print-highlight {
            background: #eff6ff !important;
            border: 2px solid #1F4FA3 !important;
          }
          .print-page .print-alert {
            background: #fef2f2 !important;
            border: 1px solid #fca5a5 !important;
          }
          .print-page .print-alert * { color: #991b1b !important; }
          .print-page .print-step-num {
            background: #1F4FA3 !important;
            color: white !important;
          }
          .print-page a { text-decoration: none !important; }
        }
      `}} />

      <div className="min-h-screen docs-page print-page"
        style={{  }}>

        {/* Screen nav */}
        <nav className="border-b border-white/5 no-print">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">
          <Logo height={32} />
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/docs" className="text-white/50 hover:text-white/80 text-sm transition">
              All docs
            </Link>
          </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <Logo variant="wordmark" href="" className="text-2xl sm:text-3xl" />
            <h1 className="text-lg sm:text-xl font-semibold text-white/80 print-muted mb-2">
              AI Lending Fraud Detection for Australian Lenders
            </h1>
            <div className="w-16 h-0.5 bg-teal-500 mx-auto" />
          </div>

          {/* Problem */}
          <div className="rounded-xl border border-red-500/20 p-5 sm:p-6 mb-6 print-alert"
            style={{ background: 'rgba(239,68,68,0.05)' }}>
            <h2 className="font-bold text-red-300 mb-2 text-sm uppercase tracking-wider">The Problem</h2>
            <p className="text-white/70 print-muted text-sm leading-relaxed mb-3">
              CBA self-reported <strong className="text-white">~A$1 billion</strong> in AI-document mortgage fraud (Feb 2026).
              Westpac and ANZ have flagged similar issues. AI tools now generate payslips, bank statements, and
              employment letters convincing enough to bypass manual review. The problem is industry-wide and unsolved.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="bg-white/5 print-card rounded-lg px-3 py-1.5">
                <strong>CBA</strong> ~$1B
              </span>
              <span className="bg-white/5 print-card rounded-lg px-3 py-1.5">
                <strong>NAB</strong> ~$105M (&ldquo;Penthouse Syndicate&rdquo;)
              </span>
              <span className="bg-white/5 print-card rounded-lg px-3 py-1.5">
                <strong>Westpac / ANZ</strong> Undisclosed
              </span>
            </div>
          </div>

          {/* What Trutina does */}
          <div className="mb-6">
            <h2 className="font-bold text-sm uppercase tracking-wider text-teal-400 print-blue mb-3">
              What Trutina Does
            </h2>
            <p className="text-white/60 print-muted text-sm leading-relaxed">
              Upload loan application documents. Trutina runs a 6-layer AI analysis and returns an
              explainable risk score in approximately 60 seconds. It catches what humans cannot &mdash;
              AI-generated patterns, metadata anomalies, invalid references, and mathematical inconsistencies.
            </p>
          </div>

          {/* How it works - 3 steps */}
          <div className="mb-6">
            <h2 className="font-bold text-sm uppercase tracking-wider text-teal-400 print-blue mb-3">
              How It Works
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {STEPS.map(s => (
                <div key={s.num} className="text-center">
                  <div className="w-8 h-8 rounded-full bg-teal-600 print-step-num flex items-center justify-center text-white text-sm font-bold mx-auto mb-2">
                    {s.num}
                  </div>
                  <div className="text-white text-sm font-semibold mb-0.5">{s.title}</div>
                  <div className="text-white/40 print-light text-xs leading-snug">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 6 Detection Modules */}
          <div className="mb-6">
            <h2 className="font-bold text-sm uppercase tracking-wider text-teal-400 print-blue mb-3">
              Six Detection Modules
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MODULES.map(m => (
                <div key={m.title}
                  className="rounded-lg border border-white/10 p-3 print-card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="no-print">{m.icon}</span>
                    <h3 className="font-semibold text-white text-xs">{m.title}</h3>
                  </div>
                  <p className="text-white/40 print-light text-xs leading-snug">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <h2 className="font-bold text-sm uppercase tracking-wider text-teal-400 print-blue mb-3">
              Pricing
            </h2>
            <div className="rounded-xl border border-white/10 overflow-hidden print-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-2.5 text-xs">Plan</th>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-2.5 text-xs">Price</th>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-2.5 text-xs">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING.map(p => (
                    <tr key={p.name}
                      className={`border-b border-white/5 last:border-b-0 ${p.highlight ? 'bg-teal-500/5 print-highlight' : ''}`}>
                      <td className="px-4 py-2.5 text-white font-medium text-sm">
                        {p.name}
                        {p.highlight && (
                          <span className="ml-2 text-xs text-teal-400 print-blue font-normal">Most popular</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-white font-semibold text-sm">{p.price}</td>
                      <td className="px-4 py-2.5 text-white/50 print-muted text-sm">{p.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-white/10 p-5 text-center print-card"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <h2 className="font-bold text-white mb-1 text-sm">Ready to protect your loan book?</h2>
            <p className="text-white/40 print-light text-xs mb-3">
              Start with a free trial &mdash; 5 documents, no credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
              <a href="mailto:hello@trutina.com.au" className="text-teal-400 print-blue hover:text-teal-300 transition font-medium">
                hello@trutina.com.au
              </a>
              <span className="text-white/20 hidden sm:inline">|</span>
              <a href="https://trutina.com.au" className="text-teal-400 print-blue hover:text-teal-300 transition font-medium">
                trutina.com.au
              </a>
            </div>
            <div className="mt-3 text-white/20 print-light text-xs">
              trutina.com.au &middot; hello@trutina.com.au
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
