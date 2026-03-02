'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

function formatAUD(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  return '$' + value.toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function formatAUDFull(value: number): string {
  return '$' + value.toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function getPlan(volume: number): { name: string; annualCost: number; monthly: string } {
  if (volume <= 200) return { name: 'Starter', annualCost: 24_000, monthly: '$2,000/mo' }
  if (volume <= 1_000) return { name: 'Professional', annualCost: 72_000, monthly: '$6,000/mo' }
  return { name: 'Enterprise', annualCost: 240_000, monthly: '~$20,000/mo' }
}

interface SliderInputProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}

function SliderInput({ label, value, min, max, step, format, onChange }: SliderInputProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-white/60 font-medium">{label}</label>
        <span className="text-sm font-mono text-white/90">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-white/20">{format(min)}</span>
        <span className="text-[10px] text-white/20">{format(max)}</span>
      </div>
    </div>
  )
}

export default function ROICalculator() {
  const [volume, setVolume] = useState(5_000)
  const [fraudRate, setFraudRate] = useState(2)
  const [avgLoan, setAvgLoan] = useState(750_000)
  const [lossPercent, setLossPercent] = useState(40)

  const results = useMemo(() => {
    const fraudAppsPerMonth = Math.round(volume * (fraudRate / 100))
    const annualExposure = fraudAppsPerMonth * 12 * avgLoan * (lossPercent / 100)
    const plan = getPlan(volume)
    const annualSavings = annualExposure - plan.annualCost
    const roiMultiple = plan.annualCost > 0 ? annualSavings / plan.annualCost : 0

    return {
      fraudAppsPerMonth,
      annualExposure,
      plan,
      annualSavings,
      roiMultiple,
    }
  }, [volume, fraudRate, avgLoan, lossPercent])

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          input[type="range"] { display: none; }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid #1e1b4b;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid #1e1b4b;
          cursor: pointer;
        }
      `}</style>

      <div
        className="min-h-screen text-white"
        style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(30,27,75,0.9) 0%, #0a0a1a 50%)' }}
      >
        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/5 no-print">
          <Link href="/" className="text-xl font-bold">
            Tru<span className="text-blue-400">tina</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/docs" className="text-white/50 hover:text-white/80 text-sm transition">
              Docs
            </Link>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          {/* Header */}
          <div className="mb-10">
            <Link href="/docs" className="text-white/30 hover:text-white/50 text-xs uppercase tracking-wider transition no-print">
              Documentation
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">ROI Calculator</h1>
            <p className="text-white/50 max-w-2xl">
              Estimate how much fraud exposure Trutina eliminates based on your lending volume.
              Adjust the inputs below and see your projected annual savings in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Inputs */}
            <div
              className="lg:col-span-2 rounded-xl border border-white/10 p-6"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-6">Your Inputs</h2>

              <SliderInput
                label="Monthly application volume"
                value={volume}
                min={100}
                max={100_000}
                step={100}
                format={v => v.toLocaleString()}
                onChange={setVolume}
              />

              <SliderInput
                label="Estimated fraud rate"
                value={fraudRate}
                min={0.5}
                max={10}
                step={0.1}
                format={v => `${v.toFixed(1)}%`}
                onChange={setFraudRate}
              />

              <SliderInput
                label="Average loan amount"
                value={avgLoan}
                min={200_000}
                max={2_000_000}
                step={10_000}
                format={v => formatAUD(v)}
                onChange={setAvgLoan}
              />

              <SliderInput
                label="Average loss per fraudulent loan"
                value={lossPercent}
                min={10}
                max={100}
                step={1}
                format={v => `${v}% of loan`}
                onChange={setLossPercent}
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-4">
              {/* Hero Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className="rounded-xl border border-white/10 p-5 text-center"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Annual Fraud Exposure</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-400">{formatAUD(results.annualExposure)}</p>
                  <p className="text-[11px] text-white/30 mt-1">
                    {results.fraudAppsPerMonth.toLocaleString()} fraudulent apps/mo
                  </p>
                </div>

                <div
                  className="rounded-xl border border-white/10 p-5 text-center"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-2">Annual Savings</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-400">{formatAUD(results.annualSavings)}</p>
                  <p className="text-[11px] text-white/30 mt-1">
                    After Trutina cost ({results.plan.monthly})
                  </p>
                </div>

                <div
                  className="rounded-xl border border-emerald-500/30 p-5 text-center"
                  style={{ background: 'rgba(16,185,129,0.06)' }}
                >
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-2">ROI Multiple</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                    {results.roiMultiple > 0 ? `${Math.round(results.roiMultiple)}x` : '--'}
                  </p>
                  <p className="text-[11px] text-white/30 mt-1">return on investment</p>
                </div>
              </div>

              {/* Detail breakdown */}
              <div
                className="rounded-xl border border-white/10 p-6"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">Breakdown</h2>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 text-white/60">Monthly applications</td>
                      <td className="py-2.5 text-right font-mono text-white/80">{volume.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 text-white/60">Fraud rate</td>
                      <td className="py-2.5 text-right font-mono text-white/80">{fraudRate.toFixed(1)}%</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 text-white/60">Fraudulent applications / month</td>
                      <td className="py-2.5 text-right font-mono text-white/80">{results.fraudAppsPerMonth.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 text-white/60">Average loan amount</td>
                      <td className="py-2.5 text-right font-mono text-white/80">{formatAUDFull(avgLoan)}</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 text-white/60">Loss per fraudulent loan ({lossPercent}%)</td>
                      <td className="py-2.5 text-right font-mono text-white/80">{formatAUDFull(avgLoan * (lossPercent / 100))}</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 text-white/60">Annual fraud exposure</td>
                      <td className="py-2.5 text-right font-mono text-red-400 font-semibold">{formatAUDFull(results.annualExposure)}</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 text-white/60">Trutina plan ({results.plan.name})</td>
                      <td className="py-2.5 text-right font-mono text-white/80">-{formatAUDFull(results.plan.annualCost)}/yr</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-white/80 font-semibold">Net annual savings</td>
                      <td className="py-2.5 text-right font-mono text-blue-400 font-semibold">{formatAUDFull(results.annualSavings)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Trutina Plan */}
              <div
                className="rounded-xl border border-blue-500/20 p-5 flex items-center justify-between"
                style={{ background: 'rgba(59,130,246,0.06)' }}
              >
                <div>
                  <p className="text-sm text-white/60">Recommended plan for {volume.toLocaleString()} apps/mo</p>
                  <p className="text-lg font-bold text-blue-400">{results.plan.name} &mdash; {results.plan.monthly}</p>
                </div>
                <Link
                  href="/#pricing"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition whitespace-nowrap no-print"
                >
                  View plans
                </Link>
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <div
            className="mt-10 rounded-xl border border-white/10 p-6"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-3">Assumptions & Methodology</h2>
            <div className="text-xs text-white/40 leading-relaxed space-y-2">
              <p>
                <strong className="text-white/60">Fraud exposure</strong> is calculated as: monthly fraudulent applications x 12 months x average loan amount x loss percentage.
                This represents the maximum potential loss if all fraudulent applications were approved and defaulted.
              </p>
              <p>
                <strong className="text-white/60">Loss percentage</strong> represents the typical unrecoverable portion of a fraudulent loan after asset recovery, legal costs, and write-offs.
                Industry estimates range from 30-60% depending on property market conditions and speed of detection.
              </p>
              <p>
                <strong className="text-white/60">Fraud rate</strong> defaults to 2%, consistent with the Commonwealth Bank&rsquo;s disclosed $1B annual fraud exposure
                across ~$150B in mortgage originations. Your actual rate may vary based on channel mix (direct vs broker), geographic concentration, and product type.
              </p>
              <p>
                <strong className="text-white/60">Savings estimate</strong> assumes Trutina detects and prevents 100% of fraudulent applications. In practice,
                detection rates depend on document quality and fraud sophistication. This calculator provides an upper-bound estimate.
              </p>
              <p>
                <strong className="text-white/60">Trutina pricing</strong> is based on published plan pricing: Starter ($2,000/mo, up to 200 cases),
                Professional ($6,000/mo, up to 1,000 cases), Enterprise (custom, estimated at $20,000/mo for this calculator).
                Actual Enterprise pricing is negotiated based on volume and integration requirements.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center no-print">
            <h2 className="text-xl font-bold mb-2">Ready to eliminate fraud exposure?</h2>
            <p className="text-white/50 text-sm mb-5">Start with a free trial &mdash; 5 documents, full analysis, no credit card.</p>
            <Link
              href="/#pricing"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
            >
              Get started
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-white/5 text-center text-white/20 text-xs">
            <p>&copy; {new Date().getFullYear()} Trutina &mdash; AI Lending Fraud Detection</p>
            <p className="mt-1">
              Questions? <a href="mailto:hello@trutina.com.au" className="text-blue-400 hover:text-blue-300">hello@trutina.com.au</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
