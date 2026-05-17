import type { Metadata } from 'next'
import DocShell from '@/components/DocShell'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Quick-Start Guide',
  description: 'Get your first Trutina risk report in under 5 minutes. Step-by-step guide to uploading documents, running analysis, and reading risk scores.',
  alternates: { canonical: '/docs/quickstart' },
}

const CARD = { background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' } as const
const DOT = { background: 'var(--accent)' } as const

const STEPS = [
  {
    number: 1,
    title: 'Log In',
    content: [
      'Go to your Trutina dashboard URL (provided during onboarding).',
      'Enter your email and password.',
      'You\'ll see the main dashboard with summary stats, recent cases, and risk trend charts.',
    ],
    tip: null,
  },
  {
    number: 2,
    title: 'Create a New Case',
    content: [
      'Click "New Case" in the top navigation bar.',
    ],
    fields: [
      { name: 'Applicant name', required: true, example: 'Sarah Mitchell' },
      { name: 'Loan amount', required: true, example: '$620,000' },
      { name: 'Property address', required: false, example: '42 Collins St, Melbourne VIC 3000' },
      { name: 'Broker', required: false, example: 'Select from list or enter broker ABN' },
    ],
    closing: 'Click "Create Case" to proceed to the upload step.',
    tip: null,
  },
  {
    number: 3,
    title: 'Upload Documents',
    content: [
      'On the case page, click "Upload Documents".',
      'Drag and drop or browse for PDF files.',
    ],
    documentTypes: [
      { type: 'Payslips', detail: 'Most recent 2–3 months' },
      { type: 'Bank statements', detail: 'Most recent 3 months' },
      { type: 'Employment letters', detail: 'Letter of offer or employment confirmation' },
      { type: 'Tax returns', detail: 'Most recent financial year' },
      { type: 'ID documents', detail: 'Driver licence, passport, or Medicare card' },
    ],
    closing: 'Maximum file size: 20 MB per document. Click "Upload" to attach files to the case.',
    tip: 'For best results, upload original PDFs rather than scanned copies. Scanned documents may have reduced detection accuracy for font and metadata analysis.',
  },
  {
    number: 4,
    title: 'Run Analysis',
    content: [
      'Click "Analyse" on the case page.',
      'Analysis typically completes in approximately 60 seconds.',
    ],
    statuses: [
      { status: 'Pending', desc: 'Case created, awaiting analysis', color: 'var(--ink-60)' },
      { status: 'Processing', desc: 'Documents being analysed by 5 detection modules', color: 'var(--accent)' },
      { status: 'Complete', desc: 'Risk score and report ready for review', color: 'var(--accent)' },
    ],
    closing: 'You\'ll see the risk score gauge and flags when analysis is complete.',
    tip: null,
  },
  {
    number: 5,
    title: 'Read the Risk Report',
    content: [],
    reportSections: [
      {
        name: 'Score gauge',
        desc: '0–100 with color coding: green (0–19), amber (20–44), orange (45–69), red (70–100).',
      },
      {
        name: 'Recommended action',
        desc: 'Approve, Manual Review, or Reject — based on the score threshold.',
      },
      {
        name: 'Summary narrative',
        desc: 'Plain-English explanation of findings, written for credit analysts and compliance officers.',
      },
      {
        name: 'Flags',
        desc: 'Grouped by category (PDF Forensics, AI Detection, Math, Cross-Reference, Broker). Each flag shows severity, title, and description. Click to expand for detailed evidence and field values.',
      },
      {
        name: 'Documents',
        desc: 'Click any uploaded document to view it inline alongside the risk flags.',
      },
    ],
    tip: 'For a detailed explanation of score thresholds, flag categories, and severity levels, see the Risk Score Guide.',
    tipLink: '/docs/risk-scores',
  },
  {
    number: 6,
    title: 'Take Action',
    content: ['Based on the recommended action:'],
    actions: [
      {
        range: '0 – 19',
        label: 'Approve',
        ink: 'var(--risk-low)',
        fill: 'var(--risk-low-fill)',
        edge: 'var(--risk-low-edge)',
        desc: 'Proceed with normal processing. Documents appear genuine.',
      },
      {
        range: '20 – 69',
        label: 'Manual Review',
        ink: 'var(--risk-med)',
        fill: 'var(--risk-med-fill)',
        edge: 'var(--risk-med-edge)',
        desc: 'Route to a senior credit analyst for verification of flagged items.',
      },
      {
        range: '70 – 100',
        label: 'Reject',
        ink: 'var(--risk-crit)',
        fill: 'var(--risk-crit-fill)',
        edge: 'var(--risk-crit-edge)',
        desc: 'Flag for fraud investigation team. Do not proceed with the application.',
      },
    ],
    tip: null,
  },
]

const NEXT_STEPS = [
  { label: 'Explore the Live Demo to see sample cases', href: '/demo' },
  { label: 'Read the Risk Score Guide for detailed score interpretation', href: '/docs/risk-scores' },
  { label: 'Review Security & Privacy for compliance documentation', href: '/docs/security' },
]

export default function QuickStartGuide() {
  return (
    <DocShell
      title="Quick-Start Guide"
      intro="Get from zero to your first risk report in under 5 minutes."
    >

        {/* Steps */}
        <div className="space-y-8">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-4 sm:gap-6">
              {/* Step number circle */}
              <div className="shrink-0">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm"
                  style={{ background: 'var(--accent)', color: 'var(--paper-0)', border: 'none' }}
                >
                  {step.number}
                </div>
                {step.number < STEPS.length && (
                  <div className="w-px h-full mx-auto mt-2" style={{ background: 'var(--rule-soft)' }} />
                )}
              </div>

              {/* Step content */}
              <div className="pb-2 flex-1 min-w-0">
                <h2 style={{ marginBottom: 12 }}>
                  {step.title}
                </h2>

                {/* Text content */}
                {step.content.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {step.content.map((line) => (
                      <li
                        key={line}
                        className="text-sm leading-relaxed flex items-start gap-2"
                        style={{ color: 'var(--ink-60)' }}
                      >
                        <span className="mt-0.5" style={{ color: 'var(--accent)' }}>&bull;</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Fields table (Step 2) */}
                {'fields' in step && step.fields && (
                  <div
                    className="rounded-xl overflow-hidden mb-4"
                    style={CARD}
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                          <th className="text-left text-xs uppercase tracking-wider px-4 py-2.5" style={{ color: 'var(--ink-40)' }}>
                            Field
                          </th>
                          <th className="text-left text-xs uppercase tracking-wider px-4 py-2.5" style={{ color: 'var(--ink-40)' }}>
                            Required
                          </th>
                          <th className="text-left text-xs uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell" style={{ color: 'var(--ink-40)' }}>
                            Example
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {step.fields.map((f) => (
                          <tr
                            key={f.name}
                            style={{ borderBottom: '1px solid var(--rule-soft)' }}
                            className="last:border-0"
                          >
                            <td className="px-4 py-2.5" style={{ color: 'var(--ink-80)' }}>
                              {f.name}
                            </td>
                            <td className="px-4 py-2.5">
                              {f.required ? (
                                <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
                                  Yes
                                </span>
                              ) : (
                                <span className="text-xs font-mono" style={{ color: 'var(--ink-40)' }}>
                                  Optional
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-xs hidden sm:table-cell" style={{ color: 'var(--ink-40)' }}>
                              {f.example}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Document types (Step 3) */}
                {'documentTypes' in step && step.documentTypes && (
                  <div className="space-y-2 mb-4">
                    {step.documentTypes.map((d) => (
                      <div
                        key={d.type}
                        className="flex items-center gap-3 text-sm rounded-lg px-4 py-2.5"
                        style={CARD}
                      >
                        <span className="font-medium min-w-[140px]" style={{ color: 'var(--ink-80)' }}>
                          {d.type}
                        </span>
                        <span style={{ color: 'var(--ink-40)' }}>{d.detail}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Statuses (Step 4) */}
                {'statuses' in step && step.statuses && (
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    {step.statuses.map((s, i) => (
                      <div
                        key={s.status}
                        className="flex-1 rounded-lg px-4 py-3"
                        style={CARD}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-bold" style={{ color: s.color }}>
                            {s.status}
                          </span>
                          {i < step.statuses.length - 1 && (
                            <span className="hidden sm:inline" style={{ color: 'var(--ink-15)' }}>
                              &rarr;
                            </span>
                          )}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--ink-40)' }}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Report sections (Step 5) */}
                {'reportSections' in step && step.reportSections && (
                  <div className="space-y-3 mb-4">
                    {step.reportSections.map((r) => (
                      <div
                        key={r.name}
                        className="rounded-lg px-4 py-3"
                        style={CARD}
                      >
                        <div className="font-medium text-sm mb-1" style={{ color: 'var(--ink-80)' }}>
                          {r.name}
                        </div>
                        <div className="text-sm leading-relaxed" style={{ color: 'var(--ink-40)' }}>
                          {r.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions (Step 6) */}
                {'actions' in step && step.actions && (
                  <div className="space-y-3 mb-4">
                    {step.actions.map((a) => (
                      <div
                        key={a.label}
                        className="rounded-lg px-4 py-3 flex items-start gap-3"
                        style={{
                          background: a.fill,
                          border: `1px solid ${a.edge}`,
                        }}
                      >
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                          style={{ background: a.ink }}
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className="font-bold text-sm"
                              style={{ color: a.ink }}
                            >
                              {a.label}
                            </span>
                            <span className="text-xs font-mono" style={{ color: 'var(--ink-25)' }}>
                              {a.range}
                            </span>
                          </div>
                          <div className="text-sm" style={{ color: 'var(--ink-60)' }}>
                            {a.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Closing text */}
                {'closing' in step && step.closing && (
                  <p className="text-sm" style={{ color: 'var(--ink-60)' }}>{step.closing}</p>
                )}

                {/* Tip box */}
                {step.tip && (
                  <div
                    className="rounded-lg px-4 py-3 mt-3"
                    style={{ background: 'var(--accent-fill)', border: '1px solid var(--accent-edge)' }}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
                      Tip
                    </div>
                    <div className="text-sm" style={{ color: 'var(--ink-60)' }}>
                      {step.tip}
                      {'tipLink' in step && step.tipLink && (
                        <>
                          {' '}
                          <Link
                            href={step.tipLink}
                            className="underline transition"
                            style={{ color: 'var(--accent)' }}
                          >
                            View guide &rarr;
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── API Quick-Start ── */}
        <section className="mt-14 mb-10">
          <h2 style={{ marginBottom: 16 }}>API Quick-Start</h2>
          <div
            className="rounded-xl p-5 sm:p-6"
            style={CARD}
          >
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ink-60)' }}>
              For programmatic access, use the one-shot ingest endpoint. Send
              base64-encoded documents and receive an instant risk score.
            </p>
            <div className="rounded-lg p-4 font-mono text-sm overflow-x-auto" style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)' }}>
              <div className="mb-1" style={{ color: 'var(--ink-40)' }}># One-shot analysis</div>
              <div>
                <span style={{ color: 'var(--accent)' }}>POST</span>{' '}
                <span style={{ color: 'var(--ink-80)' }}>
                  /api/v1/webhooks/ingest
                </span>
              </div>
              <div className="mt-2 mb-1" style={{ color: 'var(--ink-40)' }}># Returns</div>
              <div style={{ color: 'var(--ink-60)' }}>
                {'{'} &quot;risk_score&quot;: 42, &quot;risk_level&quot;: &quot;medium&quot;, &quot;recommended_action&quot;: &quot;manual_review&quot; {'}'}
              </div>
            </div>
            <p className="text-sm mt-3" style={{ color: 'var(--ink-40)' }}>
              See the{' '}
              <Link
                href="/docs/integration"
                className="underline transition"
                style={{ color: 'var(--accent)' }}
              >
                Integration Guide
              </Link>{' '}
              for full API documentation, authentication, and code samples.
            </p>
          </div>
        </section>

        {/* ── Next Steps ── */}
        <section className="mb-10">
          <h2 style={{ marginBottom: 16 }}>Next Steps</h2>
          <div className="space-y-3">
            {NEXT_STEPS.map((ns) => (
              <Link
                key={ns.href}
                href={ns.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition group"
                style={CARD}
              >
                <span style={{ color: 'var(--accent)' }}>
                  &rarr;
                </span>
                <span className="text-sm" style={{ color: 'var(--ink-60)' }}>
                  {ns.label}
                </span>
              </Link>
            ))}
            <div
              className="flex items-center gap-3 rounded-lg px-4 py-3"
              style={CARD}
            >
              <span style={{ color: 'var(--accent)' }}>&rarr;</span>
              <span className="text-sm" style={{ color: 'var(--ink-60)' }}>
                Contact{' '}
                <a
                  href="mailto:hello@trutina.com.au"
                  className="underline transition"
                  style={{ color: 'var(--accent)' }}
                >
                  hello@trutina.com.au
                </a>{' '}
                for onboarding support
              </span>
            </div>
          </div>
        </section>

        <div className="text-center text-xs mt-8 mb-4" style={{ color: 'var(--ink-25)' }}>
          This page is print-friendly. Use Ctrl+P (or Cmd+P) to save as PDF.
        </div>

    </DocShell>
  )
}
