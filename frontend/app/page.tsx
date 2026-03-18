'use client'

import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { Microscope, Bot, Link2, Calculator, Users, ClipboardList, Check, AlertTriangle, CheckCircle2, XCircle, Shield, Lock, Globe } from 'lucide-react'
import LoginModal from '../components/LoginModal'
import { Logo } from '../components/Logo'

/* ── Hero features: prominent 2-up ──────────────────────────── */
const HERO_FEATURES: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <Microscope className="w-6 h-6" />,
    title: 'PDF Forensics',
    desc: 'Analyses creator metadata, font fingerprints, modification timestamps, and embedded image manipulation — hallmarks of AI-fabricated documents.',
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: 'AI Content Detection',
    desc: 'Claude Sonnet semantically reads each document for AI-generation patterns, terminology anomalies, and field inconsistencies specific to Australian payroll.',
  },
]

/* ── Supporting features: compact 4-up ──────────────────────── */
const SUPPORTING_FEATURES: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <Link2 className="w-4 h-4" />,
    title: 'Cross-Reference Verification',
    desc: 'Live ABN Lookup, ASIC register, BSB directory, and ABS wage benchmarks.',
  },
  {
    icon: <Calculator className="w-4 h-4" />,
    title: 'Math & Date Consistency',
    desc: 'Gross − tax = net, super at 11.5% SGC, YTD consistency checks.',
  },
  {
    icon: <Users className="w-4 h-4" />,
    title: 'Broker Risk Profiling',
    desc: 'Submission velocity, fraud rates, shared-employer clustering.',
  },
  {
    icon: <ClipboardList className="w-4 h-4" />,
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
    <div
      className="min-h-screen"
      style={{
        background: '#F7F5F0',
        color: '#1C1917',
        colorScheme: 'light',
      }}
    >
      <LoginModal open={loginMode !== null} onClose={() => setLoginMode(null)} mode={loginMode ?? 'signin'} onSwitchMode={setLoginMode} />

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid #E2DDD6' }}>
        <div className="flex items-center justify-between px-6 sm:px-10 py-4 max-w-7xl mx-auto">
          <Logo height={28} />
          <div className="flex items-center gap-4 sm:gap-7">
            <a href="#features" className="hidden sm:inline text-sm transition" style={{ color: '#9C9089' }}>Features</a>
            <a href="#pricing" className="hidden sm:inline text-sm transition" style={{ color: '#9C9089' }}>Pricing</a>
            <Link href="/docs" className="hidden sm:inline text-sm transition" style={{ color: '#9C9089' }}>Docs</Link>
            <Link
              href="/demo"
              className="text-sm font-semibold transition"
              style={{ color: '#DC1C1C' }}
            >
              Live Demo
            </Link>
            <button
              onClick={() => setLoginMode('signin')}
              className="text-sm font-semibold px-4 py-2 rounded-lg transition"
              style={{ border: '1px solid #D6D0C8', color: '#44403C', background: 'white' }}
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-14 sm:pt-20 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">

          {/* Left: copy */}
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold mb-7"
              style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#DC2626' }} />
              CBA self-reported ~A$1B in AI-document fraud — Feb 2026
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.05] mb-5"
              style={{ color: '#1C1917', letterSpacing: '-0.02em' }}
            >
              Stop AI-generated<br />
              mortgage fraud<br />
              <span style={{ color: '#DC1C1C' }}>before settlement.</span>
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: '#78716C' }}
            >
              Six-layer forensic analysis of every loan document — PDF metadata,
              payroll maths, live ABN checks, and cross-reference verification —
              in under 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                href="/demo"
                className="inline-block font-bold px-7 py-3.5 rounded-xl text-base transition text-center"
                style={{ background: '#1C1917', color: 'white' }}
              >
                See it in action
              </Link>
              <a
                href="#pricing"
                className="inline-block font-medium px-7 py-3.5 rounded-xl text-base transition text-center"
                style={{ color: '#78716C', border: '1px solid #D6D0C8', background: 'white' }}
              >
                View pricing
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-8" style={{ color: '#9C9089' }}>
              <span className="flex items-center gap-1.5 text-xs">
                <Shield className="w-3.5 h-3.5" style={{ color: '#059669' }} />
                SOC 2 Type II
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                <Lock className="w-3.5 h-3.5" style={{ color: '#059669' }} />
                Documents never used for training
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                <Globe className="w-3.5 h-3.5" style={{ color: '#059669' }} />
                Australian-hosted
              </span>
            </div>
          </div>

          {/* Right: live case card */}
          <div className="lg:mt-4">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: '#ffffff',
                border: '1px solid #E2DDD6',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 50px -12px rgba(0,0,0,0.08)',
              }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-2 px-4 py-2.5"
                style={{ borderBottom: '1px solid #F0EDE8', background: '#FAFAF7' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FECACA' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FDE68A' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#A7F3D0' }} />
                </div>
                <span className="font-mono text-xs ml-2" style={{ color: '#C4BAB0' }}>
                  trutina.com.au/cases/2024-0847
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="font-mono text-xs mb-1" style={{ color: '#B8AFA7' }}>Case #2024-0847</div>
                    <div className="font-bold text-lg" style={{ color: '#1C1917' }}>Home Loan — J. Mitchell</div>
                    <div className="text-sm mt-0.5" style={{ color: '#A09690' }}>via Pacific Finance Brokers</div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-4xl font-extrabold font-mono"
                      style={{ color: '#DC1C1C', letterSpacing: '-0.02em' }}
                    >
                      78
                    </div>
                    <div
                      className="text-xs font-bold uppercase tracking-wider mt-0.5"
                      style={{ color: '#DC1C1C', opacity: 0.7 }}
                    >
                      High Risk
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
                  >
                    <XCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#DC1C1C' }} />
                    <div>
                      <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>PDF created with Google Docs</span>
                      <span className="text-xs ml-2 hidden sm:inline" style={{ color: '#A09690' }}>— payslip claims &quot;Woolworths Group Payroll&quot;</span>
                    </div>
                  </div>
                  <div
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
                  >
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#B45309' }} />
                    <div>
                      <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>ABN mismatch</span>
                      <span className="text-xs ml-2 hidden sm:inline" style={{ color: '#A09690' }}>— 51 824 753 999 registered to different entity</span>
                    </div>
                  </div>
                  <div
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
                  >
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#B45309' }} />
                    <div>
                      <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>YTD inconsistent</span>
                      <span className="text-xs ml-2 hidden sm:inline" style={{ color: '#A09690' }}>— $87k claimed but only 14 pay periods elapsed</span>
                    </div>
                  </div>
                  <div
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: '#F0FDF4', border: '1px solid #A7F3D0' }}
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#059669' }} />
                    <div>
                      <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>BSB validated</span>
                      <span className="text-xs ml-2 hidden sm:inline" style={{ color: '#A09690' }}>— 062-000 confirmed CBA Sydney</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #F0EDE8' }}>
                  <Link
                    href="/demo"
                    className="text-sm font-semibold transition"
                    style={{ color: '#DC1C1C' }}
                  >
                    Explore five demo cases &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Threat context — editorial table ─────────────────── */}
      <section
        className="py-10 sm:py-14"
        style={{ borderTop: '1px solid #E2DDD6', borderBottom: '1px solid #E2DDD6' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-start">
            <div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: '#DC1C1C' }}
              >
                Industry exposure
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>
                In February 2026, Commonwealth Bank self-reported ~A$1 billion in suspected fraudulent mortgage
                applications. Fake payslips and bank statements generated with AI tools, submitted through broker channels.
                Westpac and ANZ have since flagged similar issues.
              </p>
            </div>
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '2px solid #1C1917' }}>
                    <th className="text-left pb-3 font-bold" style={{ color: '#1C1917' }}>Institution</th>
                    <th className="text-left pb-3 font-bold" style={{ color: '#1C1917' }}>Exposure</th>
                    <th className="text-left pb-3 font-bold hidden sm:table-cell" style={{ color: '#1C1917' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { bank: 'Commonwealth Bank', amount: '~A$1,000,000,000', status: 'Self-reported Feb 2026' },
                    { bank: 'NAB', amount: '~A$105,000,000', status: '"Penthouse Syndicate" charged' },
                    { bank: 'Westpac / ANZ', amount: 'Undisclosed', status: 'Flagged internally' },
                  ].map((b, i) => (
                    <tr key={b.bank} style={{ borderBottom: '1px solid #E2DDD6' }}>
                      <td className="py-3.5 font-semibold" style={{ color: '#1C1917' }}>{b.bank}</td>
                      <td
                        className="py-3.5 font-mono font-bold"
                        style={{ color: b.amount === 'Undisclosed' ? '#9C9089' : '#DC1C1C' }}
                      >
                        {b.amount}
                      </td>
                      <td className="py-3.5 hidden sm:table-cell" style={{ color: '#9C9089' }}>{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="max-w-7xl mx-auto px-6 sm:px-10 py-14 sm:py-20">
        <div className="mb-10 sm:mb-14">
          <div
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: '#9C9089' }}
          >
            Six-layer detection engine
          </div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold"
            style={{ color: '#1C1917', letterSpacing: '-0.02em' }}
          >
            Two forensic engines.<br />Four verification layers.
          </h2>
        </div>

        {/* Hero features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {HERO_FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="p-7 rounded-2xl"
              style={{ background: i === 0 ? '#1C1917' : 'white', border: '1px solid #E2DDD6' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: i === 0 ? 'rgba(255,255,255,0.1)' : '#FEF2F2',
                  color: i === 0 ? 'white' : '#DC1C1C',
                }}
              >
                {f.icon}
              </div>
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: i === 0 ? 'white' : '#1C1917' }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: i === 0 ? 'rgba(255,255,255,0.55)' : '#78716C' }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Supporting features */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #E2DDD6' }}
        >
          {SUPPORTING_FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="flex items-start gap-4 px-6 py-5"
              style={{
                borderBottom: i < SUPPORTING_FEATURES.length - 1 ? '1px solid #F0EDE8' : undefined,
                background: 'white',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: '#F7F5F0', color: '#44403C' }}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-0.5" style={{ color: '#1C1917' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: '#9C9089' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-14 sm:py-20"
        style={{ borderTop: '1px solid #E2DDD6' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="mb-10 sm:mb-14">
            <div
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: '#9C9089' }}
            >
              Pricing
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold mb-2"
              style={{ color: '#1C1917', letterSpacing: '-0.02em' }}
            >
              Start free. Scale when ready.
            </h2>
            <p className="text-sm" style={{ color: '#9C9089' }}>
              Also available: <span style={{ color: '#B45309', fontWeight: 600 }}>$15/case</span> pay-as-you-go API.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING.map(plan => (
              <div
                key={plan.name}
                className="rounded-2xl p-6 flex flex-col"
                style={{
                  background: plan.highlight ? '#1C1917' : 'white',
                  border: plan.highlight ? 'none' : '1px solid #E2DDD6',
                }}
              >
                {plan.highlight && (
                  <div
                    className="text-xs font-bold tracking-wider uppercase mb-3"
                    style={{ color: '#DC1C1C' }}
                  >
                    Most Popular
                  </div>
                )}
                <div
                  className="text-base font-bold mb-2"
                  style={{ color: plan.highlight ? 'white' : '#1C1917' }}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="font-extrabold"
                    style={{
                      fontSize: '2rem',
                      color: plan.highlight ? 'white' : '#1C1917',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#9C9089' }}
                  >
                    {plan.period}
                  </span>
                </div>
                <div
                  className="text-xs mb-0.5"
                  style={{ color: plan.highlight ? 'rgba(255,255,255,0.4)' : '#9C9089' }}
                >
                  {plan.volume}
                </div>
                <div
                  className="text-xs mb-5"
                  style={{ color: plan.highlight ? 'rgba(255,255,255,0.3)' : '#B8AFA7' }}
                >
                  {plan.target}
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: plan.highlight ? 'rgba(255,255,255,0.65)' : '#78716C' }}
                    >
                      <Check
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: plan.highlight ? '#6EE7B7' : '#059669' }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.ctaAction === 'trial' ? (
                  <button
                    onClick={() => setLoginMode('trial')}
                    className="block w-full text-center font-semibold py-3 rounded-xl text-sm transition"
                    style={{ border: '1px solid #D6D0C8', color: '#44403C', background: '#F7F5F0' }}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).BookingWidget)
                        (window as any).BookingWidget.open()
                    }}
                    className="block w-full text-center font-semibold py-3 rounded-xl text-sm transition cursor-pointer"
                    style={
                      plan.highlight
                        ? { background: '#DC1C1C', color: 'white' }
                        : { border: '1px solid #D6D0C8', color: '#44403C', background: '#F7F5F0' }
                    }
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        className="px-6 sm:px-10 py-6 text-xs"
        style={{ borderTop: '1px solid #E2DDD6', color: '#C4BAB0' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Trutina &middot; Document fraud detection for Australian lenders</span>
          <span>hello@trutina.com.au</span>
        </div>
      </footer>
    </div>
  )
}
