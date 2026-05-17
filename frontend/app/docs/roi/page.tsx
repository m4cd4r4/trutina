'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import DocShell from '@/components/DocShell'

const CARD = { background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' } as const
const DOT = { background: 'var(--accent)' } as const

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
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium" style={{ color: 'var(--ink-60)' }}>{label}</label>
        <span className="text-sm font-mono" style={{ color: 'var(--ink-100)' }}>{format(value)}</span>
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
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--paper-2) ${pct}%, var(--paper-2) 100%)`,
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px]" style={{ color: 'var(--ink-25)' }}>{format(min)}</span>
        <span className="text-[10px]" style={{ color: 'var(--ink-25)' }}>{format(max)}</span>
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
    <DocShell
      title="ROI Calculator"
      intro="Estimate how much fraud exposure Trutina eliminates based on your lending volume. Adjust the inputs below and see your projected annual savings in real time."
    >
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          border: 2px solid var(--accent-press);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          border: 2px solid var(--accent-press);
          cursor: pointer;
        }
      `}</style>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Inputs */}
            <div
              className="lg:col-span-2 rounded-xl p-6"
              style={CARD}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: 'var(--ink-40)' }}>Your Inputs</h2>

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
                  className="rounded-xl p-5 text-center"
                  style={CARD}
                >
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--ink-40)' }}>Annual Fraud Exposure</p>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--risk-crit)' }}>{formatAUD(results.annualExposure)}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--ink-40)' }}>
                    {results.fraudAppsPerMonth.toLocaleString()} fraudulent apps/mo
                  </p>
                </div>

                <div
                  className="rounded-xl p-5 text-center"
                  style={CARD}
                >
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--ink-40)' }}>Annual Savings</p>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--accent)' }}>{formatAUD(results.annualSavings)}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--ink-40)' }}>
                    After Trutina cost ({results.plan.monthly})
                  </p>
                </div>

                <div
                  className="rounded-xl p-5 text-center"
                  style={{ background: 'var(--accent-fill)', border: '1px solid var(--accent-edge)' }}
                >
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--ink-40)' }}>ROI Multiple</p>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--accent-press)' }}>
                    {results.roiMultiple > 0 ? `${Math.round(results.roiMultiple)}x` : '--'}
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--ink-40)' }}>return on investment</p>
                </div>
              </div>

              {/* Detail breakdown */}
              <div
                className="rounded-xl p-6"
                style={CARD}
              >
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--ink-40)' }}>Breakdown</h2>
                <table className="w-full text-sm">
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                      <td className="py-2.5" style={{ color: 'var(--ink-60)' }}>Monthly applications</td>
                      <td className="py-2.5 text-right font-mono" style={{ color: 'var(--ink-80)' }}>{volume.toLocaleString()}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                      <td className="py-2.5" style={{ color: 'var(--ink-60)' }}>Fraud rate</td>
                      <td className="py-2.5 text-right font-mono" style={{ color: 'var(--ink-80)' }}>{fraudRate.toFixed(1)}%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                      <td className="py-2.5" style={{ color: 'var(--ink-60)' }}>Fraudulent applications / month</td>
                      <td className="py-2.5 text-right font-mono" style={{ color: 'var(--ink-80)' }}>{results.fraudAppsPerMonth.toLocaleString()}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                      <td className="py-2.5" style={{ color: 'var(--ink-60)' }}>Average loan amount</td>
                      <td className="py-2.5 text-right font-mono" style={{ color: 'var(--ink-80)' }}>{formatAUDFull(avgLoan)}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                      <td className="py-2.5" style={{ color: 'var(--ink-60)' }}>Loss per fraudulent loan ({lossPercent}%)</td>
                      <td className="py-2.5 text-right font-mono" style={{ color: 'var(--ink-80)' }}>{formatAUDFull(avgLoan * (lossPercent / 100))}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                      <td className="py-2.5" style={{ color: 'var(--ink-60)' }}>Annual fraud exposure</td>
                      <td className="py-2.5 text-right font-mono font-semibold" style={{ color: 'var(--risk-crit)' }}>{formatAUDFull(results.annualExposure)}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                      <td className="py-2.5" style={{ color: 'var(--ink-60)' }}>Trutina plan ({results.plan.name})</td>
                      <td className="py-2.5 text-right font-mono" style={{ color: 'var(--ink-80)' }}>-{formatAUDFull(results.plan.annualCost)}/yr</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold" style={{ color: 'var(--ink-80)' }}>Net annual savings</td>
                      <td className="py-2.5 text-right font-mono font-semibold" style={{ color: 'var(--accent)' }}>{formatAUDFull(results.annualSavings)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Trutina Plan */}
              <div
                className="rounded-xl p-5 flex items-center justify-between"
                style={{ background: 'var(--accent-fill)', border: '1px solid var(--accent-edge)' }}
              >
                <div>
                  <p className="text-sm" style={{ color: 'var(--ink-60)' }}>Recommended plan for {volume.toLocaleString()} apps/mo</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{results.plan.name} &mdash; {results.plan.monthly}</p>
                </div>
                <Link
                  href="/#pricing"
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap no-print"
                  style={{ background: 'var(--accent)', color: 'var(--paper-0)' }}
                >
                  View plans
                </Link>
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <div
            className="mt-10 rounded-xl p-6"
            style={CARD}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ink-40)' }}>Assumptions & Methodology</h2>
            <div className="text-xs leading-relaxed space-y-2" style={{ color: 'var(--ink-40)' }}>
              <p>
                <strong style={{ color: 'var(--ink-60)' }}>Fraud exposure</strong> is calculated as: monthly fraudulent applications x 12 months x average loan amount x loss percentage.
                This represents the maximum potential loss if all fraudulent applications were approved and defaulted.
              </p>
              <p>
                <strong style={{ color: 'var(--ink-60)' }}>Loss percentage</strong> represents the typical unrecoverable portion of a fraudulent loan after asset recovery, legal costs, and write-offs.
                Industry estimates range from 30-60% depending on property market conditions and speed of detection.
              </p>
              <p>
                <strong style={{ color: 'var(--ink-60)' }}>Fraud rate</strong> defaults to 2%, consistent with the Commonwealth Bank&rsquo;s disclosed $1B annual fraud exposure
                across ~$150B in mortgage originations. Your actual rate may vary based on channel mix (direct vs broker), geographic concentration, and product type.
              </p>
              <p>
                <strong style={{ color: 'var(--ink-60)' }}>Savings estimate</strong> assumes Trutina detects and prevents 100% of fraudulent applications. In practice,
                detection rates depend on document quality and fraud sophistication. This calculator provides an upper-bound estimate.
              </p>
              <p>
                <strong style={{ color: 'var(--ink-60)' }}>Trutina pricing</strong> is based on published plan pricing: Starter ($2,000/mo, up to 200 cases),
                Professional ($6,000/mo, up to 1,000 cases), Enterprise (custom, estimated at $20,000/mo for this calculator).
                Actual Enterprise pricing is negotiated based on volume and integration requirements.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center no-print">
            <h2 className="text-xl font-bold mb-2">Ready to eliminate fraud exposure?</h2>
            <p className="text-sm mb-5" style={{ color: 'var(--ink-60)' }}>Start with a free trial &mdash; 5 documents, full analysis, no credit card.</p>
            <Link
              href="/#pricing"
              className="inline-block px-8 py-3 rounded-lg text-sm font-semibold transition"
              style={{ background: 'var(--accent)', color: 'var(--paper-0)' }}
            >
              Get started
            </Link>
          </div>

    </DocShell>
  )
}
