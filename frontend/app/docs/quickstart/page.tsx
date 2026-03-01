import Link from 'next/link'

const STEPS = [
  {
    number: 1,
    title: 'Log In',
    content: [
      'Go to your Trutina dashboard URL (provided during onboarding).',
      'Enter your email and password.',
      'You\u0027ll see the main dashboard with summary stats, recent cases, and risk trend charts.',
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
      { type: 'Payslips', detail: 'Most recent 2\u20133 months' },
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
      { status: 'Pending', desc: 'Case created, awaiting analysis', color: 'text-white/50' },
      { status: 'Processing', desc: 'Documents being analysed by 5 detection modules', color: 'text-blue-400' },
      { status: 'Complete', desc: 'Risk score and report ready for review', color: 'text-emerald-400' },
    ],
    closing: 'You\u0027ll see the risk score gauge and flags when analysis is complete.',
    tip: null,
  },
  {
    number: 5,
    title: 'Read the Risk Report',
    content: [],
    reportSections: [
      {
        name: 'Score gauge',
        desc: '0\u2013100 with color coding: green (0\u201319), amber (20\u201344), orange (45\u201369), red (70\u2013100).',
      },
      {
        name: 'Recommended action',
        desc: 'Approve, Manual Review, or Reject \u2014 based on the score threshold.',
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
        range: '0 \u2013 19',
        label: 'Approve',
        color: '#22c55e',
        desc: 'Proceed with normal processing. Documents appear genuine.',
      },
      {
        range: '20 \u2013 69',
        label: 'Manual Review',
        color: '#f59e0b',
        desc: 'Route to a senior credit analyst for verification of flagged items.',
      },
      {
        range: '70 \u2013 100',
        label: 'Reject',
        color: '#ef4444',
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
    <div
      className="min-h-screen text-white"
      style={{
        background:
          'radial-gradient(ellipse at 20% 0%, rgba(30,27,75,0.9) 0%, #0a0a1a 50%)',
      }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/5">
        <Link href="/" className="text-xl font-bold">
          Tru<span className="text-blue-400">tina</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/docs"
            className="text-white/50 hover:text-white/80 text-sm transition"
          >
            Docs
          </Link>
          <Link
            href="/"
            className="text-white/50 hover:text-white/80 text-sm transition"
          >
            Home
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/docs"
            className="text-white/30 hover:text-white/50 text-sm transition mb-4 inline-block"
          >
            &larr; Back to Docs
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Quick-Start Guide
          </h1>
          <p className="text-white/50 max-w-xl">
            Get from zero to your first risk report in under 5 minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-4 sm:gap-6">
              {/* Step number circle */}
              <div className="shrink-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-400/40 bg-blue-400/10 text-blue-400 font-bold text-sm">
                  {step.number}
                </div>
                {step.number < STEPS.length && (
                  <div className="w-px h-full bg-white/5 mx-auto mt-2" />
                )}
              </div>

              {/* Step content */}
              <div className="pb-2 flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h2>

                {/* Text content */}
                {step.content.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {step.content.map((line) => (
                      <li
                        key={line}
                        className="text-white/60 text-sm leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-blue-400 mt-0.5">&bull;</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Fields table (Step 2) */}
                {'fields' in step && step.fields && (
                  <div
                    className="rounded-xl border border-white/10 overflow-hidden mb-4"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left text-white/40 text-xs uppercase tracking-wider px-4 py-2.5">
                            Field
                          </th>
                          <th className="text-left text-white/40 text-xs uppercase tracking-wider px-4 py-2.5">
                            Required
                          </th>
                          <th className="text-left text-white/40 text-xs uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">
                            Example
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {step.fields.map((f) => (
                          <tr
                            key={f.name}
                            className="border-b border-white/5 last:border-0"
                          >
                            <td className="text-white/70 px-4 py-2.5">
                              {f.name}
                            </td>
                            <td className="px-4 py-2.5">
                              {f.required ? (
                                <span className="text-emerald-400 text-xs font-mono">
                                  Yes
                                </span>
                              ) : (
                                <span className="text-white/30 text-xs font-mono">
                                  Optional
                                </span>
                              )}
                            </td>
                            <td className="text-white/40 px-4 py-2.5 font-mono text-xs hidden sm:table-cell">
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
                        className="flex items-center gap-3 text-sm rounded-lg border border-white/5 px-4 py-2.5"
                        style={{ background: 'rgba(255,255,255,0.02)' }}
                      >
                        <span className="text-white/70 font-medium min-w-[140px]">
                          {d.type}
                        </span>
                        <span className="text-white/30">{d.detail}</span>
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
                        className="flex-1 rounded-lg border border-white/5 px-4 py-3"
                        style={{ background: 'rgba(255,255,255,0.02)' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-mono text-sm font-bold ${s.color}`}>
                            {s.status}
                          </span>
                          {i < step.statuses.length - 1 && (
                            <span className="text-white/10 hidden sm:inline">
                              &rarr;
                            </span>
                          )}
                        </div>
                        <div className="text-white/30 text-xs">{s.desc}</div>
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
                        className="rounded-lg border border-white/5 px-4 py-3"
                        style={{ background: 'rgba(255,255,255,0.02)' }}
                      >
                        <div className="text-white/80 font-medium text-sm mb-1">
                          {r.name}
                        </div>
                        <div className="text-white/40 text-sm leading-relaxed">
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
                        className="rounded-lg border px-4 py-3 flex items-start gap-3"
                        style={{
                          background: `${a.color}08`,
                          borderColor: `${a.color}30`,
                        }}
                      >
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                          style={{ backgroundColor: a.color }}
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className="font-bold text-sm"
                              style={{ color: a.color }}
                            >
                              {a.label}
                            </span>
                            <span className="text-white/20 text-xs font-mono">
                              {a.range}
                            </span>
                          </div>
                          <div className="text-white/50 text-sm">
                            {a.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Closing text */}
                {'closing' in step && step.closing && (
                  <p className="text-white/50 text-sm">{step.closing}</p>
                )}

                {/* Tip box */}
                {step.tip && (
                  <div
                    className="rounded-lg border border-blue-400/20 px-4 py-3 mt-3"
                    style={{ background: 'rgba(96,165,250,0.05)' }}
                  >
                    <div className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      Tip
                    </div>
                    <div className="text-white/50 text-sm">
                      {step.tip}
                      {'tipLink' in step && step.tipLink && (
                        <>
                          {' '}
                          <Link
                            href={step.tipLink}
                            className="text-blue-400 hover:text-blue-300 underline transition"
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
          <h2 className="text-2xl font-bold mb-4">API Quick-Start</h2>
          <div
            className="rounded-xl border border-white/10 p-5 sm:p-6"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              For programmatic access, use the one-shot ingest endpoint. Send
              base64-encoded documents and receive an instant risk score.
            </p>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div className="text-white/30 mb-1"># One-shot analysis</div>
              <div>
                <span className="text-emerald-400">POST</span>{' '}
                <span className="text-white/70">
                  /api/v1/webhooks/ingest
                </span>
              </div>
              <div className="text-white/30 mt-2 mb-1"># Returns</div>
              <div className="text-white/50">
                {'{'} &quot;risk_score&quot;: 42, &quot;risk_level&quot;: &quot;medium&quot;, &quot;recommended_action&quot;: &quot;manual_review&quot; {'}'}
              </div>
            </div>
            <p className="text-white/40 text-sm mt-3">
              See the{' '}
              <Link
                href="/docs/integration"
                className="text-blue-400 hover:text-blue-300 underline transition"
              >
                Integration Guide
              </Link>{' '}
              for full API documentation, authentication, and code samples.
            </p>
          </div>
        </section>

        {/* ── Next Steps ── */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
          <div className="space-y-3">
            {NEXT_STEPS.map((ns) => (
              <Link
                key={ns.href}
                href={ns.href}
                className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 hover:border-white/20 transition group"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <span className="text-blue-400 group-hover:text-blue-300 transition">
                  &rarr;
                </span>
                <span className="text-white/60 text-sm group-hover:text-white/80 transition">
                  {ns.label}
                </span>
              </Link>
            ))}
            <div
              className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <span className="text-blue-400">&rarr;</span>
              <span className="text-white/60 text-sm">
                Contact{' '}
                <a
                  href="mailto:hello@trutina.com.au"
                  className="text-blue-400 hover:text-blue-300 underline transition"
                >
                  hello@trutina.com.au
                </a>{' '}
                for onboarding support
              </span>
            </div>
          </div>
        </section>

        {/* Print note */}
        <div className="text-center text-white/20 text-xs mt-8 mb-4">
          This page is print-friendly. Use Ctrl+P (or Cmd+P) to save as PDF.
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-6 text-center text-white/20 text-xs">
          Trutina by Solaisoft Pty Ltd &middot; hello@trutina.com.au
        </footer>
      </div>
    </div>
  )
}
