'use client'

import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { Microscope, Bot, Link2, Calculator, Users, ClipboardList, Check, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import LoginModal from '../components/LoginModal'
import { Logo } from '../components/Logo'

/* ── Hero features: prominent 2-up ──────────────────────────── */
const HERO_FEATURES: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <Microscope className="w-9 h-9 text-teal-400" />,
    title: 'PDF Forensics',
    desc: 'Analyses creator metadata, font fingerprints, modification timestamps, and embedded image manipulation — hallmarks of AI-fabricated documents.',
  },
  {
    icon: <Bot className="w-9 h-9 text-amber-400" />,
    title: 'AI Content Detection',
    desc: 'Claude Sonnet semantically reads each document for AI-generation patterns, terminology anomalies, and field inconsistencies specific to Australian payroll.',
  },
]

/* ── Supporting features: compact 4-up ──────────────────────── */
const SUPPORTING_FEATURES: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <Link2 className="w-5 h-5 text-teal-400" />,
    title: 'Cross-Reference Verification',
    desc: 'Live ABN Lookup, ASIC register, BSB directory, and ABS wage benchmarks.',
  },
  {
    icon: <Calculator className="w-5 h-5 text-amber-400" />,
    title: 'Math & Date Consistency',
    desc: 'Gross − tax = net, super at 11.5% SGC, YTD consistency checks.',
  },
  {
    icon: <Users className="w-5 h-5 text-teal-400" />,
    title: 'Broker Risk Profiling',
    desc: 'Submission velocity, fraud rates, shared-employer clustering.',
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-amber-400" />,
    title: 'Explainable for APRA',
    desc: 'Plain-English narrative with specific evidence for every score.',
  },
]

/* ── Pricing tiers ──────────────────────────────────────────── */
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
  const [loginMode, setLoginMode] = useState<'signin' | 'trial' | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('trial') === '1') setLoginMode('trial')
  }, [])

  return (
    <div className="min-h-screen text-white"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(13,148,136,0.05) 0%, #0a1210 45%)' }}>

      <LoginModal open={loginMode !== null} onClose={() => setLoginMode(null)} mode={loginMode ?? 'signin'} onSwitchMode={setLoginMode} />

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="border-b border-white/5">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">
          <Logo height={32} />
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="#features" className="hidden sm:inline text-white/50 hover:text-white/80 text-sm transition">Features</a>
            <a href="#pricing" className="hidden sm:inline text-white/50 hover:text-white/80 text-sm transition">Pricing</a>
            <Link href="/docs" className="hidden sm:inline text-white/50 hover:text-white/80 text-sm transition">Docs</Link>
            <Link href="/demo" className="text-amber-300 hover:text-amber-200 text-sm font-medium transition">Live Demo</Link>
            <button
              onClick={() => setLoginMode('signin')}
              className="border border-white/20 hover:border-white/40 text-white/70 hover:text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 sm:px-4 py-1.5 text-red-300 text-xs font-medium mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
          CBA self-reported ~A$1B in AI-document fraud — Feb 2026
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 sm:mb-6">
          Stop AI-generated mortgage fraud
          <br />
          <span className="text-teal-400">before it costs billions</span>
        </h1>

        <p className="text-white/50 text-base sm:text-xl max-w-2xl mx-auto mb-8 sm:mb-10">
          Six-layer forensic analysis of every loan document — PDF metadata, payroll maths, live ABN checks,
          and cross-reference verification — in under 60 seconds.
          <span className="block mt-2 text-white/35 text-sm sm:text-base">Mortgage, personal, and business lending.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href="/demo"
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-3.5 rounded-xl transition text-lg text-center">
            See it in action
          </Link>
          <a href="#pricing" className="text-white/50 hover:text-white/70 font-medium px-6 py-3.5 transition">
            View pricing
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 max-w-lg mx-auto">
          {[
            { value: '~60s', label: 'Analysis time', color: 'text-teal-400' },
            { value: '$0', label: 'ABN lookup cost', color: 'text-amber-400' },
            { value: '5', label: 'Detection modules', color: 'text-teal-400' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-white/30 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Product preview — what a risk report looks like ─── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 pb-8">
        <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
            </div>
            <span className="text-white/30 text-xs font-mono ml-2">trutina.com.au/cases/2024-0847</span>
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="text-white/40 text-xs font-mono mb-1">Case #2024-0847</div>
                <div className="text-white font-semibold text-lg">Home Loan — J. Mitchell</div>
                <div className="text-white/30 text-sm mt-0.5">via Pacific Finance Brokers</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-400 font-mono">78</div>
                <div className="text-red-300/60 text-xs font-semibold uppercase tracking-wider">High Risk</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm text-white/80 font-medium">PDF created with Google Docs</span>
                  <span className="text-xs text-white/30 ml-2 hidden sm:inline">— payslip claims &quot;Woolworths Group Payroll&quot;</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm text-white/80 font-medium">ABN mismatch</span>
                  <span className="text-xs text-white/30 ml-2 hidden sm:inline">— 51 824 753 999 registered to different entity</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm text-white/80 font-medium">YTD inconsistent</span>
                  <span className="text-xs text-white/30 ml-2 hidden sm:inline">— $87k claimed but only 14 pay periods elapsed</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm text-white/80 font-medium">BSB validated</span>
                  <span className="text-xs text-white/30 ml-2 hidden sm:inline">— 062-000 confirmed CBA Sydney</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center mt-4">
          <Link href="/demo" className="text-teal-400 hover:text-teal-300 text-sm font-medium transition">
            Explore five demo cases &rarr;
          </Link>
        </p>
      </section>

      {/* ── Threat context ───────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="rounded-2xl border border-orange-500/20 p-5 sm:p-8"
          style={{ background: 'rgba(249,115,22,0.05)' }}>
          <h2 className="text-orange-300 font-semibold text-lg mb-3">The threat is real and industry-wide</h2>
          <p className="text-white/60 leading-relaxed mb-4 text-sm sm:text-base">
            In February 2026, Commonwealth Bank self-reported ~A$1 billion in suspected fraudulent mortgage
            applications - fake payslips and bank statements generated with AI tools, submitted through broker
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
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Six-layer detection engine</h2>

        {/* Hero features: the two core engines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {HERO_FEATURES.map(f => (
            <div key={f.title}
              className="rounded-xl border border-white/10 p-6 sm:p-8"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="mb-4">{f.icon}</div>
              <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Supporting features: compact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SUPPORTING_FEATURES.map(f => (
            <div key={f.title} className="rounded-lg border border-white/5 p-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-center gap-2 mb-2">
                {f.icon}
                <h3 className="font-semibold text-white text-sm">{f.title}</h3>
              </div>
              <p className="text-white/35 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-xl border border-white/5 px-6 py-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <span className="flex items-center gap-2 text-white/40 text-sm">
            <svg className="w-4 h-4 text-emerald-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            SOC 2 Type II certified
          </span>
          <span className="flex items-center gap-2 text-white/40 text-sm">
            <svg className="w-4 h-4 text-emerald-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Documents never used for training
          </span>
          <span className="flex items-center gap-2 text-white/40 text-sm">
            <svg className="w-4 h-4 text-amber-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Australian-hosted
          </span>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">Pricing</h2>
        <p className="text-white/40 text-center mb-8 sm:mb-12 text-sm sm:text-base">
          Start free. Scale when you&apos;re ready. Also available: <span className="text-amber-400">$15/case</span> pay-as-you-go API.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PRICING.map(plan => (
            <div key={plan.name}
              className={`rounded-2xl border p-6 sm:p-7 flex flex-col ${plan.highlight ? 'border-teal-500/40 ring-1 ring-teal-500/20' : 'border-white/10'}`}
              style={{ background: plan.highlight ? 'rgba(13,148,136,0.08)' : 'rgba(255,255,255,0.04)' }}>
              {plan.highlight && (
                <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase mb-2">Most Popular</div>
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
                  onClick={() => setLoginMode('trial')}
                  className="block w-full text-center font-semibold py-3 rounded-xl transition text-sm border border-white/20 hover:border-white/40 text-white/70 hover:text-white">
                  {plan.cta}
                </button>
              ) : (
                <button
                  onClick={() => { if (typeof window !== 'undefined' && (window as any).BookingWidget) (window as any).BookingWidget.open() }}
                  className={`block w-full text-center font-semibold py-3 rounded-xl transition text-sm cursor-pointer ${
                    plan.highlight
                      ? 'bg-teal-600 hover:bg-teal-500 text-white'
                      : 'border border-white/20 hover:border-white/40 text-white/70 hover:text-white'
                  }`}>
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/5 px-4 sm:px-8 py-6 text-center text-white/25 text-xs">
        Trutina &middot; hello@trutina.com.au &middot; Document fraud detection for Australian lenders
      </footer>
    </div>
  )
}
