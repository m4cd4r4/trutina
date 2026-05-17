import type { Metadata } from 'next'
import Link from 'next/link'
import DocShell from '@/components/DocShell'

export const metadata: Metadata = {
  title: 'APRA/ASIC Compliance Brief',
  description: 'How Trutina aligns with APRA CPS 220, CPS 234, and ASIC RG 209 requirements for responsible lending and operational risk management.',
  alternates: { canonical: '/docs/compliance' },
}

const CARD = { background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' } as const
const DOT = { background: 'var(--accent)' } as const
const NESTED = { background: 'var(--paper-1)', border: '1px solid var(--rule-soft)' } as const

export default function ComplianceBrief() {
  return (
    <DocShell
      title="APRA/ASIC Compliance Brief"
      intro="How Trutina's AI-powered fraud detection aligns with key APRA and ASIC prudential standards for Australian lenders."
      updated="March 2026"
    >

          {/* Purpose */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Purpose</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-80)' }}>
                This brief demonstrates how Trutina&apos;s AI-powered fraud detection system aligns with key APRA
                and ASIC prudential standards relevant to mortgage lending and operational risk management.
              </p>
            </div>
          </section>

          {/* CPS 220 */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>APRA CPS 220 &mdash; Risk Management</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <div className="rounded-lg p-4 mb-4" style={NESTED}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Requirement</p>
                <p className="text-sm" style={{ color: 'var(--ink-80)' }}>
                  ADIs must maintain a risk management framework that identifies, measures, monitors, and manages material risks.
                </p>
              </div>
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--ink-40)' }}>How Trutina helps</p>
              <ul className="space-y-2.5 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Automated fraud risk detection across 100% of applications (vs manual sampling)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Quantified risk scoring (0&ndash;100) provides measurable risk metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Continuous broker risk profiling identifies systemic risks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Audit trail documents all risk assessments for prudential review</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Dashboard provides real-time portfolio risk visibility</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CPS 234 */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>APRA CPS 234 &mdash; Information Security</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <div className="rounded-lg p-4 mb-4" style={NESTED}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Requirement</p>
                <p className="text-sm" style={{ color: 'var(--ink-80)' }}>
                  ADIs must maintain information security capabilities commensurate with threats.
                </p>
              </div>
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--ink-40)' }}>How Trutina helps</p>
              <ul className="space-y-2.5 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Detects AI-generated documents &mdash; a new and rapidly evolving threat vector</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>PDF forensics identifies document manipulation (metadata, font, timestamp analysis)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Cross-references against authoritative data sources (ABN Register, BSB Directory)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>All data encrypted in transit (TLS 1.3) and at rest (AES-256)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Australian data sovereignty &mdash; all processing in Australia</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>See <Link href="/docs/security" className="underline underline-offset-2" style={{ color: 'var(--accent)' }}>Security &amp; Privacy Whitepaper</Link> for full details</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CPG 235 */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>APRA CPG 235 &mdash; Managing Data Risk</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <div className="rounded-lg p-4 mb-4" style={NESTED}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Requirement</p>
                <p className="text-sm" style={{ color: 'var(--ink-80)' }}>
                  Sound data risk management practices including data quality and integrity.
                </p>
              </div>
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--ink-40)' }}>How Trutina helps</p>
              <ul className="space-y-2.5 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Validates document data against external authoritative sources</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Consistency checks ensure internal data integrity (math verification)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Flags discrepancies between documents (payslip income vs bank statement credits)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Structured data extraction with confidence scoring</span>
                </li>
              </ul>
            </div>
          </section>

          {/* RG 209 */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>ASIC RG 209 &mdash; Responsible Lending Conduct</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <div className="rounded-lg p-4 mb-4" style={NESTED}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Requirement</p>
                <p className="text-sm" style={{ color: 'var(--ink-80)' }}>
                  Licensees must make reasonable inquiries about a borrower&apos;s financial situation and verify information.
                </p>
              </div>
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--ink-40)' }}>How Trutina helps</p>
              <ul className="space-y-2.5 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Automated verification of income documentation (payslips, bank statements)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Cross-references employer ABN against Australian Business Register</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Validates salary against ABS occupational benchmarks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Detects forged or AI-generated evidence of financial capacity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Provides documented verification trail for regulatory audit</span>
                </li>
              </ul>
            </div>
          </section>

          {/* ASIC Report 780 */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>ASIC Report 780 &mdash; Mortgage Fraud (2024)</h2>
            <div className="rounded-xl p-5 sm:p-6"
              style={{ background: 'var(--risk-med-fill)', border: '1px solid var(--risk-med-edge)' }}>
              <div className="rounded-lg p-4 mb-4" style={NESTED}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Context</p>
                <p className="text-sm" style={{ color: 'var(--ink-80)' }}>
                  ASIC highlighted growing use of technology in mortgage fraud, particularly fabricated income documents.
                </p>
              </div>
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--ink-40)' }}>How Trutina responds</p>
              <ul className="space-y-2.5 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: 'var(--risk-med)' }} />
                  <span>Purpose-built to address the exact threat ASIC identified</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: 'var(--risk-med)' }} />
                  <span>AI content detection specifically trained to identify AI-generated financial documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: 'var(--risk-med)' }} />
                  <span>Broker risk profiling addresses ASIC&apos;s concern about fraud networks operating through broker channels</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: 'var(--risk-med)' }} />
                  <span>Comprehensive audit trail supports ASIC enforcement investigations</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Explainability */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Explainability Requirement</h2>
            <div className="rounded-xl p-5 sm:p-6"
              style={{ background: 'var(--accent-fill)', border: '1px solid var(--accent-edge)' }}>
              <div className="rounded-lg p-4 mb-4" style={NESTED}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Why it matters</p>
                <p className="text-sm" style={{ color: 'var(--ink-80)' }}>
                  APRA and ASIC both require that automated decision-making be explainable and auditable.
                </p>
              </div>
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--ink-40)' }}>How Trutina delivers</p>
              <ul className="space-y-2.5 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Every risk score accompanied by plain-English narrative</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Each fraud flag includes: category (which module detected it), specific evidence (exact values, comparisons, sources), severity rating with rationale, and weight contribution to overall score</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Reports designed for inclusion in credit assessment documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>No &ldquo;black box&rdquo; &mdash; every score component is traceable</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Suitable for presentation to regulators, auditors, and customers</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Record Keeping */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Record Keeping</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <ul className="space-y-2.5 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Risk scores and flags retained for 7 years (APRA requirement)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Immutable audit log of all actions (who, what, when)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Full document analysis history available for regulatory review</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Export capability for APRA/ASIC information requests</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Regulatory Mapping Summary */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Regulatory Mapping Summary</h2>
            <div className="rounded-xl overflow-hidden" style={CARD}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--paper-1)', borderBottom: '1px solid var(--rule)' }}>
                    <th className="text-left font-medium px-4 py-3 text-xs" style={{ color: 'var(--ink-60)' }}>Standard</th>
                    <th className="text-left font-medium px-4 py-3 text-xs" style={{ color: 'var(--ink-60)' }}>Requirement</th>
                    <th className="text-left font-medium px-4 py-3 text-xs" style={{ color: 'var(--ink-60)' }}>Trutina Feature</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink-100)' }}>CPS 220</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>Risk management framework</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>Automated risk scoring, broker profiling</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink-100)' }}>CPS 234</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>Information security</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>Encryption, Aus data sovereignty, threat detection</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink-100)' }}>CPG 235</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>Data risk management</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>Cross-reference verification, data validation</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink-100)' }}>RG 209</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>Responsible lending</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>Income verification, document authenticity</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink-100)' }}>Privacy Act 1988</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>Data protection</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>DPA available, data minimisation, right to erasure</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Conclusion</h2>
            <div className="rounded-xl p-5 sm:p-6"
              style={{ background: 'var(--accent-fill)', border: '1px solid var(--accent-edge)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-80)' }}>
                Trutina provides Australian lenders with a purpose-built fraud detection capability that directly
                addresses the AI-generated document fraud threat while maintaining full alignment with APRA and ASIC
                prudential requirements. The system&apos;s emphasis on explainability ensures that automated risk
                assessments can be reviewed, audited, and presented to regulators with confidence.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Contact</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Compliance Inquiries</p>
                  <a href="mailto:compliance@trutina.com.au" className="underline underline-offset-2" style={{ color: 'var(--accent)' }}>
                    compliance@trutina.com.au
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>General</p>
                  <a href="mailto:hello@trutina.com.au" className="underline underline-offset-2" style={{ color: 'var(--accent)' }}>
                    hello@trutina.com.au
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Website</p>
                  <a href="https://trutina.com.au" className="underline underline-offset-2" style={{ color: 'var(--accent)' }}>
                    trutina.com.au
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-4 text-xs leading-relaxed max-w-2xl mx-auto text-center" style={{ color: 'var(--ink-40)' }}>
            This brief is for informational purposes. It does not constitute legal advice.
            Organisations should consult their own legal and compliance teams.
          </div>

    </DocShell>
  )
}
