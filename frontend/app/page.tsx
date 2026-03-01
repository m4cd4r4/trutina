'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Microscope, Bot, Link2, Calculator, Users, ClipboardList, Check } from 'lucide-react'
import LoginModal from '../components/LoginModal'

const ICON_CLASS = 'w-8 h-8 text-blue-400'

const FEATURES: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <Microscope className={ICON_CLASS} />,
    title: 'PDF Forensics',
    desc: 'Analyses creator metadata, font fingerprints, modification timestamps, and embedded image manipulation — hallmarks of AI-fabricated documents.',
  },
  {
    icon: <Bot className={ICON_CLASS} />,
    title: 'AI Content Detection',
    desc: 'Claude Sonnet semantically reads each document for AI-generation patterns, terminology anomalies, and field inconsistencies specific to Australian payroll.',
  },
  {
    icon: <Link2 className={ICON_CLASS} />,
    title: 'Cross-Reference Verification',
    desc: 'Live ABN Lookup, ASIC company register, BSB directory, and ABS wage benchmark checks. Invalid ABNs and non-existent employers caught instantly.',
  },
  {
    icon: <Calculator className={ICON_CLASS} />,
    title: 'Math & Date Consistency',
    desc: 'Deterministic checks: gross − tax = net, super at 11.5% SGC rate, YTD consistent with pay periods elapsed since 1 July, impossible dates caught.',
  },
  {
    icon: <Users className={ICON_CLASS} />,
    title: 'Broker Risk Profiling',
    desc: 'Tracks submission velocity, fraud rates, and shared-employer network clustering across all applications submitted by each broker.',
  },
  {
    icon: <ClipboardList className={ICON_CLASS} />,
    title: 'Explainable for APRA',
    desc: 'Every risk score comes with a plain-English narrative and specific evidence — meeting ASIC and APRA explainability requirements for loan decisions.',
  },
]

const PRICING = [
  {
    name: 'Free Trial',
    price: 'Free',
    period: '',
    volume: '5 documents',
    target: 'Try it on your own applications',
    features: ['All 5 detection modules', 'Full risk reports', 'No credit card required'],
    cta: 'Start free trial',
    ctaAction: 'trial' as const,
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$2,000',
    period: '/month',
    volume: '200 cases/mo',
    target: 'Credit unions, mortgage brokerages',
    features: ['Everything in Free Trial', 'ABN + BSB live verification', 'Risk dashboard', 'Email support'],
    cta: 'Get started',
    ctaAction: 'email' as const,
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$6,000',
    period: '/month',
    volume: '1,000 cases/mo',
    target: 'Regional banks, non-bank lenders',
    features: ['Everything in Starter', 'Broker risk profiling', 'Audit trail (APRA-ready)', 'Priority support', 'Webhook API integration'],
    cta: 'Request demo',
    ctaAction: 'email' as const,
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    volume: 'Unlimited',
    target: 'Big 4 banks, major lenders',
    features: ['Everything in Professional', 'Custom SLA', 'On-premise option', 'Dedicated engineer', 'AUSTRAC support'],
    cta: 'Contact us',
    ctaAction: 'email' as const,
    highlight: false,
  },
]

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen text-white"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(30,27,75,0.9) 0%, #0a0a1a 50%)' }}>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />

      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">
          Tru<span className="text-blue-400">tina</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="#features" className="hidden sm:inline text-white/50 hover:text-white/80 text-sm transition">Features</a>
          <a href="#pricing" className="hidden sm:inline text-white/50 hover:text-white/80 text-sm transition">Pricing</a>
          <Link href="/demo"
            className="text-emerald-300 hover:text-emerald-200 text-sm font-medium transition">
            Live Demo
          </Link>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 sm:px-4 py-1.5 text-red-300 text-xs font-medium mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
          CBA self-reported ~A$1B in AI-document fraud — Feb 2026
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 sm:mb-6">
          Stop AI-generated mortgage fraud
          <br />
          <span className="text-blue-400">before it costs billions</span>
        </h1>

        <p className="text-white/50 text-base sm:text-xl max-w-2xl mx-auto mb-8 sm:mb-10">
          Trutina analyses loan application documents for AI-fabricated payslips, forged bank statements,
          and invalid ABNs — returning an explainable risk score in under 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href="/demo"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition text-lg text-center">
            See it in action
          </Link>
          <a href="#pricing" className="text-white/50 hover:text-white/70 font-medium px-6 py-3.5 transition">
            View pricing
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 max-w-lg mx-auto">
          {[
            { value: '~60s', label: 'Analysis time' },
            { value: '$0', label: 'ABN lookup cost' },
            { value: '5', label: 'Detection modules' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">{s.value}</div>
              <div className="text-white/30 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat context */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="rounded-2xl border border-orange-500/20 p-5 sm:p-8"
          style={{ background: 'rgba(249,115,22,0.05)' }}>
          <h2 className="text-orange-300 font-semibold text-lg mb-3">The threat is real and industry-wide</h2>
          <p className="text-white/60 leading-relaxed mb-4 text-sm sm:text-base">
            In February 2026, Commonwealth Bank self-reported ~A$1 billion in suspected fraudulent mortgage
            applications — fake payslips and bank statements generated with AI tools, submitted through broker
            channels. Westpac and ANZ have since flagged similar issues.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            {[
              { bank: 'CBA', amount: '~$1B', status: 'Self-reported Feb 2026' },
              { bank: 'NAB', amount: '~$105M', status: '"Penthouse Syndicate" charged' },
              { bank: 'Westpac / ANZ', amount: 'Undisclosed', status: 'Flagged internally' },
            ].map(b => (
              <div key={b.bank} className="bg-white/5 rounded-xl p-3">
                <div className="text-white font-semibold">{b.bank}</div>
                <div className="text-orange-300 font-mono">{b.amount}</div>
                <div className="text-white/30 text-xs mt-1">{b.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Six-layer detection engine</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map(f => (
            <div key={f.title}
              className="rounded-xl border border-white/10 p-5 sm:p-6"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}>
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">Pricing</h2>
        <p className="text-white/40 text-center mb-8 sm:mb-12 text-sm sm:text-base">
          Start free. Scale when you&apos;re ready. Also available: <span className="text-blue-400">$15/case</span> pay-as-you-go API.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PRICING.map(plan => (
            <div key={plan.name}
              className={`rounded-2xl border p-6 sm:p-7 flex flex-col ${plan.highlight ? 'border-blue-500/40 bg-blue-500/5' : 'border-white/10'}`}
              style={!plan.highlight ? { background: 'rgba(255,255,255,0.04)' } : {}}>
              {plan.highlight && (
                <div className="text-xs text-blue-400 font-semibold tracking-wider uppercase mb-2">Most Popular</div>
              )}
              <div className="text-lg font-bold text-white mb-1">{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl sm:text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-white/40 text-sm">{plan.period}</span>
              </div>
              <div className="text-white/40 text-xs mb-1">{plan.volume}</div>
              <div className="text-white/30 text-xs mb-5">{plan.target}</div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              {plan.ctaAction === 'trial' ? (
                <button
                  onClick={() => setShowLogin(true)}
                  className="block w-full text-center font-semibold py-3 rounded-xl transition text-sm border border-white/20 hover:border-white/40 text-white/70 hover:text-white">
                  {plan.cta}
                </button>
              ) : (
                <a href="mailto:hello@trutina.com.au"
                  className={`block text-center font-semibold py-3 rounded-xl transition text-sm ${
                    plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'border border-white/20 hover:border-white/40 text-white/70 hover:text-white'
                  }`}>
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 sm:px-8 py-6 text-center text-white/20 text-xs">
        Trutina by Solaisoft Pty Ltd · hello@trutina.com.au · Built for Australian lenders
      </footer>
    </div>
  )
}
