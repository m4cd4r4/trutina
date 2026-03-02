import Link from 'next/link'
import { Logo } from '@/components/Logo'

const THRESHOLDS = [
  {
    range: '0 \u2013 19',
    label: 'Low Risk',
    color: '#22c55e',
    bgColor: 'rgba(34,197,94,0.08)',
    borderColor: 'rgba(34,197,94,0.25)',
    action: 'Approve',
    description:
      'Documents appear genuine. May have minor informational flags that do not indicate fraud.',
    commonReasons: [
      'Minor metadata quirks (e.g., unusual PDF producer but consistent content)',
      'Salary marginally above median but within 75th percentile',
    ],
    widthPercent: 20,
  },
  {
    range: '20 \u2013 44',
    label: 'Medium Risk',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.25)',
    action: 'Manual Review',
    description:
      'Some anomalies detected that warrant human verification. Most turn out benign but should be documented.',
    commonReasons: [
      'Salary above ABS benchmarks for stated occupation',
      'Minor metadata quirks (e.g., mismatched creation/modification dates)',
      'Super rate slightly outside 10\u201314% tolerance',
    ],
    widthPercent: 25,
  },
  {
    range: '45 \u2013 69',
    label: 'High Risk',
    color: '#f97316',
    bgColor: 'rgba(249,115,22,0.08)',
    borderColor: 'rgba(249,115,22,0.25)',
    action: 'Manual Review (Priority)',
    description:
      'Significant issues detected. Multiple flags across categories suggest the document may not be genuine.',
    commonReasons: [
      'Employer ABN registered to a different entity name',
      'Mathematical inconsistencies (gross \u2212 tax \u2260 net)',
      'Suspicious PDF metadata (browser-created, excessive fonts)',
      'UK/US terminology in an Australian payslip',
    ],
    widthPercent: 25,
  },
  {
    range: '70 \u2013 100',
    label: 'Critical Risk',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.25)',
    action: 'Reject',
    description:
      'Strong indicators of fraud or fabrication. Multiple critical flags across categories. Recommend escalation to fraud investigation.',
    commonReasons: [
      'AI-generated content detected with high confidence',
      'Gross \u2212 tax \u2260 net (mathematical impossibility)',
      'ABN does not exist or is cancelled',
      'PDF created in browser, not payroll software',
      'Network clustering with known fraudulent broker submissions',
    ],
    widthPercent: 30,
  },
]

const CATEGORIES = [
  {
    number: 1,
    name: 'PDF Forensics',
    maxPoints: 25,
    color: 'text-violet-400',
    borderColor: 'border-violet-400/20',
    checks: [
      'PDF producer/creator metadata (e.g., "Chrome" vs "Xero Payroll")',
      'Creation and modification timestamps (future dates, identical timestamps)',
      'Font variety (>3 fonts suggests copy-paste editing)',
      'Text-in-image detection (text rendered as images to avoid extraction)',
    ],
    commonFlags: [
      {
        code: 'SUSPICIOUS_PRODUCER',
        desc: 'PDF not created by known payroll software (Xero, MYOB, KeyPay, Employment Hero, Sage)',
      },
      { code: 'FUTURE_TIMESTAMP', desc: 'Creation or modification date is in the future' },
      { code: 'EXCESSIVE_FONTS', desc: 'More than 3 font families detected \u2014 common in manually assembled documents' },
      { code: 'TEXT_AS_IMAGE', desc: 'Text rendered as raster image to prevent content extraction' },
    ],
    knownClean: 'Xero, MYOB, KeyPay, Employment Hero, Sage, ADP, Definitiv',
  },
  {
    number: 2,
    name: 'AI Content Detection',
    maxPoints: 35,
    color: 'text-blue-400',
    borderColor: 'border-blue-400/20',
    checks: [
      'Semantic analysis for AI-generation patterns and phrasing',
      'Terminology anomalies (UK/US terms in Australian documents)',
      'Field inconsistencies (generic values, placeholder-like data)',
      'Overall document authenticity evaluation',
    ],
    commonFlags: [
      {
        code: 'AI_GENERATED_HIGH',
        desc: 'Claude confidence >90% that document text was AI-generated',
      },
      {
        code: 'UK_TERMINOLOGY',
        desc: '"Basic Salary" instead of "Ordinary Earnings", "National Insurance" instead of super',
      },
      {
        code: 'GENERIC_SUPER_FUND',
        desc: 'Super fund name is generic or does not match known APRA-registered funds',
      },
      {
        code: 'PLACEHOLDER_VALUES',
        desc: 'Round numbers, sequential identifiers, or template-like field values',
      },
    ],
    howItWorks:
      'Claude Sonnet reads the full extracted document text and evaluates authenticity against Australian payroll conventions, industry terminology, and AI-generation patterns.',
  },
  {
    number: 3,
    name: 'Math & Date Consistency',
    maxPoints: 30,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400/20',
    checks: [
      'Payslip: Gross \u2212 Tax = Net (within \u00b1$1 rounding tolerance)',
      'Super = ~11.5% of ordinary earnings (SGC rate, \u00b12% tolerance \u2192 10\u201314%)',
      'YTD figures consistent with pay periods elapsed since 1 July',
      'Bank statement: Opening balance + Credits \u2212 Debits = Closing balance',
      'Date sequencing (no impossible or future dates)',
    ],
    commonFlags: [
      {
        code: 'PAYSLIP_MATH_ERROR',
        desc: 'Gross minus tax does not equal net pay (outside \u00b1$1 tolerance)',
      },
      {
        code: 'SUPER_RATE_WRONG',
        desc: 'Superannuation rate falls outside 10\u201314% of ordinary earnings',
      },
      {
        code: 'YTD_INCONSISTENT',
        desc: 'Year-to-date figures do not align with the number of pay periods since 1 July',
      },
      {
        code: 'BALANCE_MISMATCH',
        desc: 'Bank statement opening + credits \u2212 debits \u2260 closing balance',
      },
    ],
    tolerance:
      'Super rate: \u00b12% (10\u201314% acceptable). Net pay: \u00b1$1 rounding. YTD: \u00b15% cumulative tolerance.',
  },
  {
    number: 4,
    name: 'Cross-Reference Verification',
    maxPoints: 20,
    color: 'text-amber-400',
    borderColor: 'border-amber-400/20',
    checks: [
      'ABN exists and is active via ABN Lookup API',
      'Employer name fuzzy-matches the registered ABN entity name',
      'BSB exists in the RBA BSB directory',
      'Salary compared against ABS average weekly earnings for stated occupation',
    ],
    commonFlags: [
      { code: 'ABN_NOT_FOUND', desc: 'ABN does not exist in the ABR' },
      { code: 'ABN_CANCELLED', desc: 'ABN exists but has been cancelled' },
      {
        code: 'ABN_NAME_MISMATCH',
        desc: 'Employer name on document does not match ABN-registered entity',
      },
      { code: 'UNKNOWN_BSB', desc: 'BSB number not found in the RBA directory' },
      {
        code: 'SALARY_ABOVE_90TH_PERCENTILE',
        desc: 'Stated salary exceeds the 90th percentile for the occupation/industry',
      },
    ],
    dataSources:
      'api.abn.business.gov.au (free, live), RBA BSB directory, ABS average weekly earnings (Cat. 6302.0)',
  },
  {
    number: 5,
    name: 'Broker Risk Profiling',
    maxPoints: 15,
    color: 'text-red-400',
    borderColor: 'border-red-400/20',
    checks: [
      'Submission velocity (>5 applications in 7 days)',
      'Fraud flag rate (>20% of submissions flagged high/critical)',
      'Network clustering (shared employer ABN, address, or phone across submissions)',
    ],
    commonFlags: [
      {
        code: 'HIGH_VELOCITY',
        desc: 'Broker submitted more than 5 applications within a 7-day window',
      },
      {
        code: 'HIGH_FRAUD_RATE',
        desc: 'More than 20% of this broker\u0027s submissions have been flagged high or critical risk',
      },
      {
        code: 'NETWORK_CLUSTER_DETECTED',
        desc: 'Multiple submissions share the same employer ABN, address, or phone number',
      },
    ],
    note: 'Broker scores are cumulative and update across all their submissions. A new submission by the same broker re-evaluates their entire history.',
  },
]

const SEVERITIES = [
  {
    level: 'Critical',
    multiplier: '1.0',
    color: 'text-red-400',
    bg: 'rgba(239,68,68,0.08)',
    border: 'border-red-400/20',
    description: 'Strong fraud indicator. Requires immediate attention and investigation.',
  },
  {
    level: 'High',
    multiplier: '0.7',
    color: 'text-orange-400',
    bg: 'rgba(249,115,22,0.08)',
    border: 'border-orange-400/20',
    description: 'Significant anomaly. Likely requires investigation before proceeding.',
  },
  {
    level: 'Medium',
    multiplier: '0.4',
    color: 'text-amber-400',
    bg: 'rgba(245,158,11,0.08)',
    border: 'border-amber-400/20',
    description: 'Noteworthy finding. May be benign but is documented for review.',
  },
  {
    level: 'Low',
    multiplier: '0.15',
    color: 'text-emerald-400',
    bg: 'rgba(34,197,94,0.08)',
    border: 'border-emerald-400/20',
    description: 'Informational only. Unlikely to indicate fraud on its own.',
  },
]

export default function RiskScoresGuide() {
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
        <Logo variant="combo" height={36} />
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

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/docs"
            className="text-white/30 hover:text-white/50 text-sm transition mb-4 inline-block"
          >
            &larr; Back to Docs
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Understanding Risk Scores
          </h1>
          <p className="text-white/50 max-w-2xl">
            A comprehensive guide to interpreting Trutina risk scores, flag
            categories, severity levels, and recommended actions. Written for
            credit analysts and compliance officers.
          </p>
        </div>

        {/* ── Risk Score Overview ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-4">Risk Score Overview</h2>
          <div
            className="rounded-xl border border-white/10 p-5 sm:p-6"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-0.5">&bull;</span>
                Scores range from <strong className="text-white">0 to 100</strong>,
                where 0 is lowest risk and 100 is highest risk.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-0.5">&bull;</span>
                The composite score is derived from{' '}
                <strong className="text-white">5 detection categories</strong>,
                each with its own maximum point cap.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-0.5">&bull;</span>
                Each flag has a <strong className="text-white">severity</strong>{' '}
                and <strong className="text-white">weight</strong> that
                contribute to the category total.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-0.5">&bull;</span>
                Scores are{' '}
                <strong className="text-white">deterministic</strong> &mdash;
                the same inputs always produce the same score.
              </li>
            </ul>
          </div>
        </section>

        {/* ── Score Thresholds ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">Score Thresholds</h2>

          {/* Visual gradient bar */}
          <div className="mb-8">
            <div className="flex rounded-lg overflow-hidden h-10 sm:h-12">
              {THRESHOLDS.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center justify-center text-xs sm:text-sm font-semibold"
                  style={{
                    width: `${t.widthPercent}%`,
                    backgroundColor: t.color,
                    color: t.label === 'Low Risk' ? '#052e16' : '#fff',
                  }}
                >
                  {t.range}
                </div>
              ))}
            </div>
            <div className="flex mt-1">
              {THRESHOLDS.map((t) => (
                <div
                  key={t.label}
                  className="text-center text-xs"
                  style={{
                    width: `${t.widthPercent}%`,
                    color: t.color,
                  }}
                >
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Threshold cards */}
          <div className="space-y-4">
            {THRESHOLDS.map((t) => (
              <div
                key={t.label}
                className="rounded-xl border p-5 sm:p-6"
                style={{
                  background: t.bgColor,
                  borderColor: t.borderColor,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-lg font-bold text-white">
                      {t.range}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: t.color }}
                    >
                      {t.label}
                    </span>
                  </div>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: t.bgColor,
                      border: `1px solid ${t.borderColor}`,
                      color: t.color,
                    }}
                  >
                    Action: {t.action}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-3">
                  {t.description}
                </p>
                <div>
                  <div className="text-white/30 text-xs uppercase tracking-wider mb-1.5">
                    Common reasons
                  </div>
                  <ul className="space-y-1">
                    {t.commonReasons.map((r) => (
                      <li
                        key={r}
                        className="text-white/40 text-sm flex items-start gap-2"
                      >
                        <span className="text-white/20 mt-0.5">&ndash;</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Flag Categories ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">Flag Categories</h2>
          <p className="text-white/50 text-sm mb-8">
            Each flag category has a maximum point cap. Flags within a category
            are summed (weighted by severity) up to the cap. The total risk
            score is the sum of all category scores, capped at 100.
          </p>

          <div className="space-y-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className={`rounded-xl border ${cat.borderColor} p-5 sm:p-7`}
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full border ${cat.borderColor} text-sm font-bold ${cat.color}`}
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    {cat.number}
                  </span>
                  <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                  <span className="text-white/30 text-sm font-mono ml-auto">
                    max {cat.maxPoints} pts
                  </span>
                </div>

                {/* What it checks */}
                <div className="mb-4">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                    What it checks
                  </div>
                  <ul className="space-y-1.5">
                    {cat.checks.map((c) => (
                      <li
                        key={c}
                        className="text-white/60 text-sm flex items-start gap-2"
                      >
                        <span className={`${cat.color} mt-0.5`}>&bull;</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common flags */}
                <div className="mb-4">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                    Common flags
                  </div>
                  <div className="space-y-2">
                    {cat.commonFlags.map((f) => (
                      <div key={f.code} className="flex items-start gap-3">
                        <code className={`text-xs font-mono ${cat.color} shrink-0 mt-0.5`}>
                          {f.code}
                        </code>
                        <span className="text-white/40 text-sm">{f.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extra info */}
                {'knownClean' in cat && (
                  <div className="text-white/30 text-xs">
                    <span className="text-white/50">Known clean producers:</span>{' '}
                    {cat.knownClean}
                  </div>
                )}
                {'howItWorks' in cat && (
                  <div className="text-white/30 text-xs">
                    <span className="text-white/50">How it works:</span>{' '}
                    {cat.howItWorks}
                  </div>
                )}
                {'tolerance' in cat && (
                  <div className="text-white/30 text-xs">
                    <span className="text-white/50">Tolerance:</span>{' '}
                    {cat.tolerance}
                  </div>
                )}
                {'dataSources' in cat && (
                  <div className="text-white/30 text-xs">
                    <span className="text-white/50">Data sources:</span>{' '}
                    {cat.dataSources}
                  </div>
                )}
                {'note' in cat && (
                  <div className="text-white/30 text-xs">
                    <span className="text-white/50">Note:</span> {cat.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Severity Levels ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">Severity Levels</h2>
          <p className="text-white/50 text-sm mb-6">
            Each flag is assigned a severity level that determines its weight in
            the score calculation. Higher severity flags contribute more points.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEVERITIES.map((s) => (
              <div
                key={s.level}
                className={`rounded-xl border ${s.border} p-5`}
                style={{ background: s.bg }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold ${s.color}`}>{s.level}</span>
                  <span className="text-white/30 font-mono text-sm">
                    &times;{s.multiplier}
                  </span>
                </div>
                <p className="text-white/50 text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Score Calculation Formula ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-4">Score Calculation Formula</h2>
          <div
            className="rounded-xl border border-white/10 p-5 sm:p-6"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div className="space-y-4">
              <div>
                <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                  Category score
                </div>
                <code className="text-blue-400 text-sm font-mono bg-blue-400/5 px-3 py-2 rounded-lg block">
                  category_score = min(category_cap, sum(flag_weight &times;
                  severity_multiplier))
                </code>
              </div>
              <div>
                <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                  Total score
                </div>
                <code className="text-blue-400 text-sm font-mono bg-blue-400/5 px-3 py-2 rounded-lg block">
                  total_score = min(100, sum(all_category_scores))
                </code>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                Category caps
              </div>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((c) => (
                  <span
                    key={c.name}
                    className="text-xs font-mono text-white/50 bg-white/5 px-2.5 py-1 rounded"
                  >
                    {c.name}:{' '}
                    <span className={c.color}>{c.maxPoints}</span>
                  </span>
                ))}
              </div>
              <div className="text-white/30 text-xs mt-3">
                Total possible: 25 + 35 + 30 + 20 + 15 ={' '}
                <span className="text-white/50">125</span>, capped at{' '}
                <span className="text-white/50">100</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Reading the Report Narrative ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-4">
            Reading the Report Narrative
          </h2>
          <div
            className="rounded-xl border border-white/10 p-5 sm:p-6"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <ul className="space-y-3 text-white/60 text-sm leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-0.5">&bull;</span>
                Every analysis includes a{' '}
                <strong className="text-white">plain-English summary</strong>{' '}
                written for bank credit officers and compliance teams.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-0.5">&bull;</span>
                The narrative references{' '}
                <strong className="text-white">specific evidence</strong> from
                the documents (e.g., &ldquo;ABN 12345678901 is registered to
                &lsquo;Smith Holdings Pty Ltd&rsquo;, not &lsquo;Acme
                Corp&rsquo; as stated on the payslip&rdquo;).
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-0.5">&bull;</span>
                Reports are suitable for inclusion in{' '}
                <strong className="text-white">
                  APRA/ASIC documentation
                </strong>{' '}
                and audit trails.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold mt-0.5">&bull;</span>
                Each flag in the report is expandable, showing the raw field
                values, expected values, and the confidence level of the
                detection.
              </li>
            </ul>
          </div>
        </section>

        {/* ── Example: Low Risk ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-4">
            Example: Low Risk (Score 12)
          </h2>
          <div
            className="rounded-xl border p-5 sm:p-6"
            style={{
              background: 'rgba(34,197,94,0.05)',
              borderColor: 'rgba(34,197,94,0.2)',
            }}
          >
            {/* Score header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-full border-2 font-bold text-xl"
                style={{ borderColor: '#22c55e', color: '#22c55e' }}
              >
                12
              </div>
              <div>
                <div className="font-semibold text-white">Low Risk</div>
                <div className="text-emerald-400 text-sm font-mono">
                  Recommended: Approve
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="mb-4">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                Summary narrative
              </div>
              <div className="text-white/60 text-sm leading-relaxed bg-black/20 rounded-lg p-4 font-mono">
                The application from <strong className="text-white">Sarah
                Mitchell</strong> (Loan: $620,000) includes 2 payslips from
                &ldquo;Melbourne Consulting Group Pty Ltd&rdquo; and 3 months of
                bank statements from ANZ. All documents appear genuine.
                <br /><br />
                ABN 51 824 753 186 is active and registered to &ldquo;Melbourne
                Consulting Group Pty Ltd&rdquo; (exact match). BSB 013-442
                (ANZ Melbourne) is valid. Gross ($8,200) minus tax ($2,050)
                equals net ($6,150) &mdash; correct. Super at $943 represents
                11.5% of gross &mdash; matches current SGC rate. YTD figures
                align with 4 fortnightly pay periods since 1 July.
                <br /><br />
                One informational flag: salary is above the 75th percentile for
                &ldquo;Management Consultants&rdquo; (ABS Cat. 6302.0) but
                within normal range for senior roles.
              </div>
            </div>

            {/* Flags */}
            <div>
              <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                Flags (1)
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    LOW
                  </span>
                  <span className="text-xs font-mono text-amber-400">
                    SALARY_ABOVE_75TH_PERCENTILE
                  </span>
                  <span className="text-white/30 text-xs ml-auto">
                    Cross-Reference &middot; +2 pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Example: Critical Risk ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-4">
            Example: Critical Risk (Score 82)
          </h2>
          <div
            className="rounded-xl border p-5 sm:p-6"
            style={{
              background: 'rgba(239,68,68,0.05)',
              borderColor: 'rgba(239,68,68,0.2)',
            }}
          >
            {/* Score header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-full border-2 font-bold text-xl"
                style={{ borderColor: '#ef4444', color: '#ef4444' }}
              >
                82
              </div>
              <div>
                <div className="font-semibold text-white">Critical Risk</div>
                <div className="text-red-400 text-sm font-mono">
                  Recommended: Reject
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="mb-4">
              <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                Summary narrative
              </div>
              <div className="text-white/60 text-sm leading-relaxed bg-black/20 rounded-lg p-4 font-mono">
                The application from <strong className="text-white">James
                Parker</strong> (Loan: $1,200,000) contains 2 payslips from
                &ldquo;Acme Corp&rdquo; and 3 months of bank statements. Multiple
                critical issues detected across 4 of 5 categories.
                <br /><br />
                <strong className="text-red-400">PDF Forensics:</strong> Both
                payslips were created in &ldquo;Google Chrome&rdquo; (not payroll
                software). 5 different font families detected. Creation timestamp
                is identical to modification timestamp (no editing history).
                <br /><br />
                <strong className="text-red-400">AI Content Detection:</strong>{' '}
                Claude confidence 94% that payslip text is AI-generated. Uses
                &ldquo;Basic Salary&rdquo; (UK terminology) instead of
                &ldquo;Ordinary Earnings&rdquo;. Super fund listed as
                &ldquo;Australian Super Fund&rdquo; (generic, not an
                APRA-registered entity name).
                <br /><br />
                <strong className="text-red-400">Math Errors:</strong> Payslip
                shows Gross $12,500, Tax $3,125, Net $9,575 &mdash; actual net
                should be $9,375 (discrepancy of $200). Super at $1,000
                represents 8.0% of gross (below SGC minimum of 11.5%).
                <br /><br />
                <strong className="text-red-400">Cross-Reference:</strong> ABN
                98 765 432 100 is registered to &ldquo;Acme Trading Holdings Pty
                Ltd&rdquo;, not &ldquo;Acme Corp&rdquo; as stated. Salary of
                $325,000 p.a. exceeds the 99th percentile for the stated
                occupation &ldquo;Administrative Assistant&rdquo;.
              </div>
            </div>

            {/* Flags */}
            <div>
              <div className="text-white/40 text-xs uppercase tracking-wider mb-2">
                Flags (9)
              </div>
              <div className="space-y-2">
                {[
                  {
                    severity: 'CRITICAL',
                    sevColor: 'text-red-400',
                    sevBg: 'bg-red-400/10',
                    code: 'AI_GENERATED_HIGH',
                    cat: 'AI Detection',
                    pts: 35,
                  },
                  {
                    severity: 'CRITICAL',
                    sevColor: 'text-red-400',
                    sevBg: 'bg-red-400/10',
                    code: 'PAYSLIP_MATH_ERROR',
                    cat: 'Math & Dates',
                    pts: 12,
                  },
                  {
                    severity: 'HIGH',
                    sevColor: 'text-orange-400',
                    sevBg: 'bg-orange-400/10',
                    code: 'SUSPICIOUS_PRODUCER',
                    cat: 'PDF Forensics',
                    pts: 8,
                  },
                  {
                    severity: 'HIGH',
                    sevColor: 'text-orange-400',
                    sevBg: 'bg-orange-400/10',
                    code: 'SUPER_RATE_WRONG',
                    cat: 'Math & Dates',
                    pts: 7,
                  },
                  {
                    severity: 'HIGH',
                    sevColor: 'text-orange-400',
                    sevBg: 'bg-orange-400/10',
                    code: 'ABN_NAME_MISMATCH',
                    cat: 'Cross-Reference',
                    pts: 7,
                  },
                  {
                    severity: 'MEDIUM',
                    sevColor: 'text-amber-400',
                    sevBg: 'bg-amber-400/10',
                    code: 'EXCESSIVE_FONTS',
                    cat: 'PDF Forensics',
                    pts: 4,
                  },
                  {
                    severity: 'MEDIUM',
                    sevColor: 'text-amber-400',
                    sevBg: 'bg-amber-400/10',
                    code: 'UK_TERMINOLOGY',
                    cat: 'AI Detection',
                    pts: 4,
                  },
                  {
                    severity: 'MEDIUM',
                    sevColor: 'text-amber-400',
                    sevBg: 'bg-amber-400/10',
                    code: 'SALARY_ABOVE_90TH_PERCENTILE',
                    cat: 'Cross-Reference',
                    pts: 3,
                  },
                  {
                    severity: 'LOW',
                    sevColor: 'text-emerald-400',
                    sevBg: 'bg-emerald-400/10',
                    code: 'GENERIC_SUPER_FUND',
                    cat: 'AI Detection',
                    pts: 2,
                  },
                ].map((f) => (
                  <div key={f.code} className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`text-xs font-mono ${f.sevColor} ${f.sevBg} px-2 py-0.5 rounded`}
                      >
                        {f.severity}
                      </span>
                      <span className="text-xs font-mono text-white/70">
                        {f.code}
                      </span>
                      <span className="text-white/20 text-xs ml-auto">
                        {f.cat} &middot; +{f.pts} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Print note ── */}
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
