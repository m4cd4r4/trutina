import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Presentation, Calculator, Code, BarChart3, Zap, Shield, Scale } from 'lucide-react'
import { Logo } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'Documentation & Resources',
  description: 'Technical documentation, integration guides, risk score methodology, ROI calculator, and compliance briefs for Trutina AI lending fraud detection.',
  alternates: { canonical: '/docs' },
}

const DOCS = [
  {
    href: '/docs/one-pager',
    icon: <FileText className="w-6 h-6 text-teal-400" />,
    title: 'Sales One-Pager',
    desc: 'Leave-behind PDF summarising the fraud problem, what Trutina does, and pricing.',
    audience: 'Prospects, meeting follow-ups',
  },
  {
    href: '/docs/pitch',
    icon: <Presentation className="w-6 h-6 text-emerald-400" />,
    title: 'Pitch Deck',
    desc: '8-slide presentation covering the industry problem, detection engine, live demo walkthrough, and pricing.',
    audience: 'Demo calls, board presentations',
  },
  {
    href: '/docs/roi',
    icon: <Calculator className="w-6 h-6 text-amber-400" />,
    title: 'ROI Calculator',
    desc: 'Interactive calculator showing fraud savings based on your application volume and fraud rate.',
    audience: 'Decision-makers, CFOs',
  },
  {
    href: '/docs/integration',
    icon: <Code className="w-6 h-6 text-violet-400" />,
    title: 'API Integration Guide',
    desc: 'Technical guide for the webhook API. Base64 docs in, risk score out. Code samples in Python, Node.js, and C#.',
    audience: 'Engineering teams',
  },
  {
    href: '/docs/risk-scores',
    icon: <BarChart3 className="w-6 h-6 text-red-400" />,
    title: 'Risk Score Guide',
    desc: 'How to read risk scores, flag categories, severity levels, and recommended actions.',
    audience: 'Credit analysts, compliance officers',
  },
  {
    href: '/docs/quickstart',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: 'Quick-Start Guide',
    desc: 'Upload your first document and understand the risk report in under 5 minutes.',
    audience: 'New customers, trial users',
  },
  {
    href: '/docs/security',
    icon: <Shield className="w-6 h-6 text-cyan-400" />,
    title: 'Security & Privacy',
    desc: 'Data processing, encryption, retention policies, and Anthropic\'s no-training guarantee.',
    audience: 'CISOs, procurement, compliance',
  },
  {
    href: '/docs/compliance',
    icon: <Scale className="w-6 h-6 text-orange-400" />,
    title: 'APRA/ASIC Compliance Brief',
    desc: 'How explainable risk scoring meets APRA CPS 220, CPS 234, and ASIC RG 209 requirements.',
    audience: 'Compliance officers, regulators',
  },
]

export default function DocsHub() {
  return (
    <div className="min-h-screen text-white"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(13,148,136,0.12) 0%, #0a1210 60%)' }}>

      <nav className="border-b border-white/5">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">
        <Logo variant="wordmark" height={28} />
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/demo" className="text-emerald-300 hover:text-emerald-200 text-sm font-medium transition">
            Live Demo
          </Link>
          <Link href="/" className="text-white/50 hover:text-white/80 text-sm transition">
            Home
          </Link>
        </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Documentation & Resources</h1>
        <p className="text-white/50 mb-10 sm:mb-14 max-w-2xl">
          Everything you need to evaluate, integrate, and deploy Trutina.
          All documents are printable — use Ctrl+P (or Cmd+P) to save as PDF.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {DOCS.map(d => (
            <Link key={d.href} href={d.href}
              className="group rounded-xl border border-white/10 p-5 sm:p-6 transition hover:border-white/20"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5">{d.icon}</div>
                <div>
                  <h2 className="font-semibold text-white group-hover:text-teal-300 transition mb-1">{d.title}</h2>
                  <p className="text-white/40 text-sm leading-relaxed mb-2">{d.desc}</p>
                  <span className="text-white/20 text-xs">For: {d.audience}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center text-white/20 text-sm">
          Need something else? <a href="mailto:hello@trutina.com.au" className="text-teal-400 hover:text-teal-300">hello@trutina.com.au</a>
        </div>
      </div>
    </div>
  )
}
