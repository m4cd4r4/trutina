'use client'

import { useState, useEffect, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import {
  Microscope, Bot, Link2, Calculator, Users, ClipboardList,
  ChevronLeft, ChevronRight, X, Check, AlertTriangle, Shield,
  ArrowRight, Play, TrendingUp, DollarSign, Clock, FileWarning,
} from 'lucide-react'

function SlideWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center p-6 sm:p-12 md:p-16">
      <div className="max-w-5xl w-full">
        {children}
      </div>
    </div>
  )
}

function TitleSlide() {
  return (
    <SlideWrapper>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-8"
          style={{ background: 'var(--risk-crit)', color: 'var(--paper-0)', border: '1px solid var(--risk-crit-edge)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--paper-0)' }} />
          Industry crisis &mdash; Feb 2026
        </div>

        <Logo variant="wordmark" href="" className="text-4xl sm:text-5xl" />

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
          Stop AI-Generated Mortgage Fraud
          <br />
          <span style={{ color: 'var(--accent)' }}>Before It Costs Billions</span>
        </h1>

        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--ink-60)' }}>
          6-layer AI document analysis. Explainable risk scores.
          Under 60 seconds.
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
          {[
            { value: '~60s', label: 'Per document' },
            { value: '6', label: 'Detection layers' },
            { value: '~95%', label: 'Gross margin' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--accent)' }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--ink-40)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}

function ProblemSlide() {
  const BANKS = [
    { bank: 'CBA', amount: '~$1B', detail: 'Self-reported Feb 2026. AI-generated payslips and bank statements submitted via broker channels.' },
    { bank: 'NAB', amount: '~$105M', detail: '"Penthouse Syndicate" — organised fraud ring using fabricated documents, charges laid.' },
    { bank: 'Westpac / ANZ', amount: 'Undisclosed', detail: 'Internal reviews underway. Similar patterns flagged across broker-originated applications.' },
  ]

  return (
    <SlideWrapper>
      <div>
        <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>The Problem</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
          AI tools now generate mortgage documents
          <br className="hidden sm:block" />
          <span style={{ color: 'var(--risk-crit)' }}> that bypass human review</span>
        </h2>
        <p className="text-base sm:text-lg max-w-3xl mb-8" style={{ color: 'var(--ink-60)' }}>
          Fake payslips, bank statements, and employment letters are created with AI tools in minutes,
          then submitted through broker channels. Banks have no real-time verification.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BANKS.map(b => (
            <div key={b.bank}
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-lg" style={{ color: 'var(--ink-100)' }}>{b.bank}</span>
                <span className="font-mono font-bold text-xl" style={{ color: 'var(--risk-crit)' }}>{b.amount}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-40)' }}>{b.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}

function CostSlide() {
  return (
    <SlideWrapper>
      <div>
        <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>The Cost of Inaction</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          Every month without detection
          <br />
          <span style={{ color: 'var(--risk-crit)' }}>= more fraudulent loans on your book</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl p-6" style={{ background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }}>
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6" style={{ color: 'var(--risk-crit)' }} />
              <h3 className="font-semibold text-lg">Exposure calculation</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between" style={{ color: 'var(--ink-60)' }}>
                <span>Average fraudulent mortgage</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--ink-100)' }}>$750,000</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--ink-60)' }}>
                <span>If 2% of applications are fraudulent</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--ink-100)' }}>2%</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--ink-60)' }}>
                <span>Bank processing 50,000 apps/year</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--ink-100)' }}>50,000</span>
              </div>
              <div className="h-px my-2" style={{ background: 'var(--rule-soft)' }} />
              <div className="flex justify-between" style={{ color: 'var(--ink-100)' }}>
                <span className="font-semibold">Total annual exposure</span>
                <span className="font-mono font-bold text-lg" style={{ color: 'var(--risk-crit)' }}>$750M</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: <AlertTriangle className="w-5 h-5" style={{ color: 'var(--risk-med)' }} />, title: 'Regulatory penalties', desc: 'APRA CPS 220 requires sound risk management. Failure to detect fraud = supervisory action.' },
              { icon: <TrendingUp className="w-5 h-5" style={{ color: 'var(--risk-crit)' }} />, title: 'Reputational damage', desc: 'CBA disclosure sent shockwaves through markets. No bank wants to be next.' },
              { icon: <FileWarning className="w-5 h-5" style={{ color: 'var(--risk-high)' }} />, title: 'Loan book write-downs', desc: 'Fraudulent loans default at higher rates. Provisions eat into profits for years.' },
            ].map(item => (
              <div key={item.title} className="rounded-xl p-4 flex items-start gap-3"
                style={{ background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }}>
                <div className="shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <h4 className="font-semibold text-sm mb-0.5">{item.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-40)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

function HowItWorksSlide() {
  const STEPS = [
    { num: '1', title: 'Upload documents', desc: 'API webhook or dashboard. Base64 docs in, risk score out.', icon: <ArrowRight className="w-5 h-5" /> },
    { num: '2', title: '6-layer AI analysis', desc: 'PDF forensics, AI detection, cross-referencing, math validation, broker profiling, explainability.', icon: <Shield className="w-5 h-5" /> },
    { num: '3', title: 'Risk score + narrative', desc: 'Explainable score with specific evidence and recommended action in ~60 seconds.', icon: <Check className="w-5 h-5" /> },
  ]

  return (
    <SlideWrapper>
      <div>
        <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>How It Works</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
          One API call. <span style={{ color: 'var(--accent)' }}>Instant protection.</span>
        </h2>
        <p className="text-base sm:text-lg mb-10 max-w-2xl" style={{ color: 'var(--ink-60)' }}>
          Integrate with a single webhook endpoint. Send base64-encoded documents.
          Receive a risk assessment with full explainability.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0 mb-10">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex-1 flex items-stretch">
              <div className="flex-1 rounded-xl p-6 text-center"
                style={{ background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
                  style={{ background: 'var(--accent)', color: 'var(--paper-0)' }}>
                  {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-40)' }}>{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:flex items-center px-2">
                  <ChevronRight className="w-5 h-5" style={{ color: 'var(--ink-25)' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }}>
          <div className="text-xs font-mono mb-2" style={{ color: 'var(--ink-40)' }}>POST /api/v1/webhooks/ingest</div>
          <pre className="text-xs sm:text-sm font-mono overflow-x-auto whitespace-pre" style={{ color: 'var(--accent)' }}>
{`{
  "application_id": "APP-2026-00142",
  "documents": [
    { "type": "payslip", "content_base64": "JVBERi0x..." },
    { "type": "bank_statement", "content_base64": "JVBERi0x..." }
  ]
}`}
          </pre>
        </div>
      </div>
    </SlideWrapper>
  )
}

function EngineSlide() {
  const MODULES = [
    { icon: <Microscope className="w-6 h-6" style={{ color: 'var(--accent)' }} />, title: 'PDF Forensics', desc: 'Creator metadata, font fingerprints, modification timestamps, embedded image manipulation. Detects documents made from templates.' },
    { icon: <Bot className="w-6 h-6" style={{ color: 'var(--ink-60)' }} />, title: 'AI Content Detection', desc: 'Claude Sonnet reads each document for AI-generation patterns, terminology anomalies, and field inconsistencies specific to Australian payroll.' },
    { icon: <Link2 className="w-6 h-6" style={{ color: 'var(--accent)' }} />, title: 'Cross-Reference Verification', desc: 'Live ABN Lookup (ABR API), BSB directory validation, ABS wage benchmarks by occupation and region. Invalid employers caught instantly.' },
    { icon: <Calculator className="w-6 h-6" style={{ color: 'var(--risk-med)' }} />, title: 'Math & Date Consistency', desc: 'Deterministic checks: gross minus tax equals net, super at 11.5% SGC, YTD consistent with pay periods since 1 July. Impossible dates flagged.' },
    { icon: <Users className="w-6 h-6" style={{ color: 'var(--risk-crit)' }} />, title: 'Broker Risk Profiling', desc: 'Tracks submission velocity, fraud rates per broker, and shared-employer network clustering across all applications.' },
    { icon: <ClipboardList className="w-6 h-6" style={{ color: 'var(--ink-60)' }} />, title: 'Explainable Reports', desc: 'Every risk score comes with a plain-English narrative and specific evidence citations. APRA CPS 220 and ASIC RG 209 ready.' },
  ]

  return (
    <SlideWrapper>
      <div>
        <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>Detection Engine</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          Six layers. <span style={{ color: 'var(--accent)' }}>Nothing slips through.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(m => (
            <div key={m.title}
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }}>
              <div className="mb-3">{m.icon}</div>
              <h3 className="font-semibold mb-1.5 text-sm" style={{ color: 'var(--ink-100)' }}>{m.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-40)' }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}

function DemoSlide() {
  return (
    <SlideWrapper>
      <div>
        <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>Live Demo</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          See it <span style={{ color: 'var(--accent)' }}>in action</span>
        </h2>

        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }}>

          {/* Mock title bar */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--rule-soft)', background: 'var(--paper-1)' }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--risk-crit)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--risk-med)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)' }} />
            </div>
            <span className="text-xs font-mono ml-3" style={{ color: 'var(--ink-40)' }}>trutina.com.au/cases/APP-2026-00142</span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Score gauge mockup */}
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--paper-2)" strokeWidth="8" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--risk-crit)" strokeWidth="8"
                      strokeDasharray={`${(82 / 100) * 327} 327`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color: 'var(--risk-crit)' }}>82</span>
                    <span className="text-xs" style={{ color: 'var(--ink-40)' }}>/100</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: 'var(--risk-crit)', color: 'var(--paper-0)', border: '1px solid var(--risk-crit-edge)' }}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  CRITICAL RISK
                </div>
              </div>

              {/* Flags */}
              <div className="sm:col-span-2 space-y-2">
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--ink-60)' }}>Fraud Indicators</h3>
                {[
                  { severity: 'critical', text: 'PDF created with Canva — not employer payroll system' },
                  { severity: 'critical', text: 'ABN 12345678901 does not exist in ABR' },
                  { severity: 'high', text: 'Gross ($8,200) minus tax ($1,640) does not equal net ($6,280). Gap: $280' },
                  { severity: 'medium', text: 'Super rate 10.5% — should be 11.5% SGC (FY2025-26)' },
                  { severity: 'low', text: 'Salary $98K — 87th percentile for role (ABS)' },
                ].map((flag, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="shrink-0 mt-1 w-2 h-2 rounded-full" style={{
                      background: flag.severity === 'critical' ? 'var(--risk-crit)' :
                        flag.severity === 'high' ? 'var(--risk-high)' :
                        flag.severity === 'medium' ? 'var(--risk-med)' : 'var(--accent)'
                    }} />
                    <span style={{ color: 'var(--ink-60)' }}>{flag.text}</span>
                  </div>
                ))}
                <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--rule-soft)' }}>
                  <span className="text-xs" style={{ color: 'var(--ink-40)' }}>Recommended action:</span>
                  <span className="ml-2 text-sm font-semibold" style={{ color: 'var(--risk-crit)' }}>Reject &mdash; request original documents from employer directly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/demo" className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition text-sm"
            style={{ background: 'var(--accent)', color: 'var(--paper-0)' }}>
            <Play className="w-4 h-4" />
            Try the interactive demo
          </Link>
        </div>
      </div>
    </SlideWrapper>
  )
}

function PricingSlide() {
  const PLANS = [
    {
      name: 'Free Trial',
      price: 'Free',
      period: '',
      volume: '5 documents',
      features: ['All 6 detection modules', 'Full risk reports', 'No credit card'],
      highlight: false,
    },
    {
      name: 'Starter',
      price: '$2,000',
      period: '/mo',
      volume: '200 cases/mo',
      features: ['ABN + BSB live verification', 'Risk dashboard', 'Email support'],
      highlight: false,
    },
    {
      name: 'Professional',
      price: '$6,000',
      period: '/mo',
      volume: '1,000 cases/mo',
      features: ['Broker risk profiling', 'APRA-ready audit trail', 'Webhook API', 'Priority support'],
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      volume: 'Unlimited',
      features: ['Custom SLA', 'On-premise option', 'Dedicated engineer', 'AUSTRAC support'],
      highlight: false,
    },
  ]

  return (
    <SlideWrapper>
      <div>
        <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>Pricing</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
          Start free. <span style={{ color: 'var(--accent)' }}>Scale when ready.</span>
        </h2>
        <p className="mb-8 max-w-xl" style={{ color: 'var(--ink-60)' }}>
          Also available: <span className="font-semibold" style={{ color: 'var(--accent)' }}>$15/case</span> pay-as-you-go API.
          Claude API cost per case is ~$0.20&ndash;$0.50 &mdash; approximately <span className="font-semibold" style={{ color: 'var(--accent)' }}>95% gross margin</span>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(plan => (
            <div key={plan.name}
              className="rounded-xl p-5 flex flex-col"
              style={plan.highlight
                ? { background: 'var(--accent-fill)', border: '1px solid var(--accent-edge)' }
                : { background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }
              }>
              {plan.highlight && (
                <div className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: 'var(--accent)' }}>Most Popular</div>
              )}
              <div className="text-base font-bold mb-1" style={{ color: 'var(--ink-100)' }}>{plan.name}</div>
              <div className="flex items-baseline gap-0.5 mb-1">
                <span className="text-2xl font-bold" style={{ color: 'var(--ink-100)' }}>{plan.price}</span>
                <span className="text-sm" style={{ color: 'var(--ink-40)' }}>{plan.period}</span>
              </div>
              <div className="text-xs mb-4" style={{ color: 'var(--ink-40)' }}>{plan.volume}</div>
              <ul className="space-y-1.5 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--ink-60)' }}>
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}

function WhyNowSlide() {
  return (
    <SlideWrapper>
      <div className="text-center">
        <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>Why Now</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 max-w-3xl mx-auto">
          The question isn&apos;t whether you need this.
          <br />
          <span style={{ color: 'var(--accent)' }}>It&apos;s how many fraudulent loans are already on your book.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          {[
            {
              icon: <Shield className="w-7 h-7 mx-auto mb-3" style={{ color: 'var(--risk-crit)' }} />,
              title: 'Regulatory pressure',
              desc: 'Post-CBA disclosure, APRA and ASIC are watching. Proactive detection demonstrates compliance.',
            },
            {
              icon: <Clock className="w-7 h-7 mx-auto mb-3" style={{ color: 'var(--risk-med)' }} />,
              title: 'First-mover advantage',
              desc: 'No established solution exists. Early adopters protect their book while competitors remain exposed.',
            },
            {
              icon: <TrendingUp className="w-7 h-7 mx-auto mb-3" style={{ color: 'var(--accent)' }} />,
              title: 'Compounding risk',
              desc: 'Every month without detection adds fraudulent loans. Defaults compound over 3-5 year mortgage terms.',
            },
          ].map(item => (
            <div key={item.title}
              className="rounded-xl p-6 text-center"
              style={{ background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }}>
              {item.icon}
              <h3 className="font-semibold mb-2 text-sm" style={{ color: 'var(--ink-100)' }}>{item.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-40)' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-6 max-w-2xl mx-auto"
          style={{ background: 'var(--accent-fill)', border: '1px solid var(--accent-edge)' }}>
          <p className="text-base sm:text-lg italic leading-relaxed" style={{ color: 'var(--ink-80)' }}>
            &ldquo;Banks are in an arms race against AI-generated fraud. The tools that create fake documents
            are improving monthly. Detection must improve faster.&rdquo;
          </p>
        </div>
      </div>
    </SlideWrapper>
  )
}

function NextStepsSlide() {
  return (
    <SlideWrapper>
      <div className="text-center">
        <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>Next Steps</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-10">
          Get started <span style={{ color: 'var(--accent)' }}>today</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          {[
            { num: '1', title: 'Free trial', desc: '5 documents, all 6 modules, no credit card required', cta: 'Start now', href: '/login' },
            { num: '2', title: 'Request a demo call', desc: 'Walk through your specific use case with our team', cta: 'Book demo', href: 'mailto:hello@trutina.com.au?subject=Demo%20request' },
            { num: '3', title: 'API integration', desc: 'Single webhook endpoint. Up and running in under a day', cta: 'Read docs', href: '/docs/integration' },
          ].map(item => (
            <div key={item.num}
              className="rounded-xl p-6"
              style={{ background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-4"
                style={{ background: 'var(--accent)', color: 'var(--paper-0)' }}>
                {item.num}
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ink-100)' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ink-40)' }}>{item.desc}</p>
              <Link href={item.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium transition"
                style={{ color: 'var(--accent)' }}>
                {item.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <a href="mailto:hello@trutina.com.au"
            className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl transition text-lg"
            style={{ background: 'var(--accent)', color: 'var(--paper-0)' }}>
            hello@trutina.com.au
          </a>
          <div className="text-sm mb-6" style={{ color: 'var(--ink-40)' }}>
            trutina.com.au
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition text-sm font-medium"
              style={{ color: 'var(--ink-60)', border: '1px solid var(--rule)' }}>
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Docs
            </Link>
            <Link href="/demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition text-sm font-medium"
              style={{ color: 'var(--accent)', border: '1px solid var(--accent-edge)' }}>
              Try the Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}

const SLIDES = [
  TitleSlide,
  ProblemSlide,
  CostSlide,
  HowItWorksSlide,
  EngineSlide,
  DemoSlide,
  PricingSlide,
  WhyNowSlide,
  NextStepsSlide,
]

export default function PitchDeck() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const router = useRouter()
  const total = SLIDES.length

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= total || index === current || transitioning) return
    setTransitioning(true)
    setCurrent(index)
    setTimeout(() => setTransitioning(false), 300)
  }, [current, total, transitioning])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'Escape') {
        router.push('/docs')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev, router])

  const CurrentSlide = SLIDES[current]

  return (
    <div className="docs-page h-screen overflow-hidden select-none">

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3">
        <Logo variant="wordmark" className="text-lg" />
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-xs font-mono" style={{ color: 'var(--ink-40)' }}>
            {current + 1}/{total}
          </span>
          <Link href="/docs"
            className="flex items-center gap-1 text-xs transition"
            style={{ color: 'var(--ink-40)' }}>
            <X className="w-4 h-4" /> Exit
          </Link>
        </div>
      </div>

      {/* Slide content */}
      <div
        className="transition-opacity duration-300 ease-in-out"
        style={{ opacity: transitioning ? 0.3 : 1 }}
      >
        <CurrentSlide />
      </div>

      {/* Navigation arrows */}
      <div className="fixed inset-y-0 left-0 w-16 sm:w-20 flex items-center justify-center z-40">
        {current > 0 && (
          <button onClick={prev}
            className="p-2 rounded-full transition"
            style={{ background: 'var(--paper-1)', color: 'var(--ink-40)' }}
            aria-label="Previous slide">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>
      <div className="fixed inset-y-0 right-0 w-16 sm:w-20 flex items-center justify-center z-40">
        {current < total - 1 && (
          <button onClick={next}
            className="p-2 rounded-full transition"
            style={{ background: 'var(--paper-1)', color: 'var(--ink-40)' }}
            aria-label="Next slide">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Slide indicator dots */}
      <div className="fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={i === current
              ? { width: '1.5rem', height: '0.5rem', background: 'var(--accent)' }
              : { width: '0.5rem', height: '0.5rem', background: 'var(--paper-2)' }
            }
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Keyboard hint (first slide only) */}
      {current === 0 && (
        <div className="fixed bottom-10 left-0 right-0 text-center z-40">
          <span className="text-xs" style={{ color: 'var(--ink-25)' }}>
            Use arrow keys to navigate &middot; ESC to exit
          </span>
        </div>
      )}
    </div>
  )
}
