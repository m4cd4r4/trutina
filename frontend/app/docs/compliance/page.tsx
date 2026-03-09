import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'APRA/ASIC Compliance Brief',
  description: 'How Trutina aligns with APRA CPS 220, CPS 234, and ASIC RG 209 requirements for responsible lending and operational risk management.',
  alternates: { canonical: '/docs/compliance' },
}

export default function ComplianceBrief() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 1.5cm;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          .print-page {
            background: white !important;
            color: #111 !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .print-page * {
            color: #111 !important;
            border-color: #ddd !important;
          }
          .print-page .print-blue { color: #0d9488 !important; }
          .print-page .print-muted { color: #555 !important; }
          .print-page .print-light { color: #888 !important; }
          .print-page .print-card {
            background: #f8f9fa !important;
            border: 1px solid #e5e7eb !important;
          }
          .print-page .print-highlight {
            background: #eff6ff !important;
            border: 2px solid #0d9488 !important;
          }
          .print-page a { text-decoration: none !important; }
        }
      `}} />

      <div className="min-h-screen text-white print-page"
        style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(30,27,75,0.9) 0%, #0a0a1a 50%)' }}>

        {/* Nav */}
        <nav className="border-b border-white/5 no-print">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">
          <Logo variant="combo" height={40} />
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/docs" className="text-white/50 hover:text-white/80 text-sm transition">
              Docs
            </Link>
          </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

          {/* Header */}
          <div className="mb-10">
            <Link href="/docs" className="text-white/30 hover:text-white/50 text-xs uppercase tracking-wider transition no-print">
              Documentation
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">APRA/ASIC Compliance Brief</h1>
            <p className="text-white/50 max-w-2xl">
              How Trutina&apos;s AI-powered fraud detection aligns with key APRA and ASIC prudential standards for Australian lenders.
            </p>
          </div>

          {/* Purpose */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">Purpose</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-white/70 print-muted text-sm leading-relaxed">
                This brief demonstrates how Trutina&apos;s AI-powered fraud detection system aligns with key APRA
                and ASIC prudential standards relevant to mortgage lending and operational risk management.
              </p>
            </div>
          </section>

          {/* CPS 220 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">APRA CPS 220 &mdash; Risk Management</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="rounded-lg border border-white/5 p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Requirement</p>
                <p className="text-white/70 print-muted text-sm">
                  ADIs must maintain a risk management framework that identifies, measures, monitors, and manages material risks.
                </p>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">How Trutina helps</p>
              <ul className="space-y-2.5 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Automated fraud risk detection across 100% of applications (vs manual sampling)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Quantified risk scoring (0&ndash;100) provides measurable risk metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Continuous broker risk profiling identifies systemic risks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Audit trail documents all risk assessments for prudential review</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Dashboard provides real-time portfolio risk visibility</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CPS 234 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">APRA CPS 234 &mdash; Information Security</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="rounded-lg border border-white/5 p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Requirement</p>
                <p className="text-white/70 print-muted text-sm">
                  ADIs must maintain information security capabilities commensurate with threats.
                </p>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">How Trutina helps</p>
              <ul className="space-y-2.5 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Detects AI-generated documents &mdash; a new and rapidly evolving threat vector</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>PDF forensics identifies document manipulation (metadata, font, timestamp analysis)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Cross-references against authoritative data sources (ABN Register, BSB Directory)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>All data encrypted in transit (TLS 1.3) and at rest (AES-256)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Australian data sovereignty &mdash; all processing in Australia</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>See <Link href="/docs/security" className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition">Security &amp; Privacy Whitepaper</Link> for full details</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CPG 235 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">APRA CPG 235 &mdash; Managing Data Risk</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="rounded-lg border border-white/5 p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Requirement</p>
                <p className="text-white/70 print-muted text-sm">
                  Sound data risk management practices including data quality and integrity.
                </p>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">How Trutina helps</p>
              <ul className="space-y-2.5 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Validates document data against external authoritative sources</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Consistency checks ensure internal data integrity (math verification)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Flags discrepancies between documents (payslip income vs bank statement credits)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Structured data extraction with confidence scoring</span>
                </li>
              </ul>
            </div>
          </section>

          {/* RG 209 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">ASIC RG 209 &mdash; Responsible Lending Conduct</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="rounded-lg border border-white/5 p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Requirement</p>
                <p className="text-white/70 print-muted text-sm">
                  Licensees must make reasonable inquiries about a borrower&apos;s financial situation and verify information.
                </p>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">How Trutina helps</p>
              <ul className="space-y-2.5 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Automated verification of income documentation (payslips, bank statements)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Cross-references employer ABN against Australian Business Register</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Validates salary against ABS occupational benchmarks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Detects forged or AI-generated evidence of financial capacity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Provides documented verification trail for regulatory audit</span>
                </li>
              </ul>
            </div>
          </section>

          {/* ASIC Report 780 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">ASIC Report 780 &mdash; Mortgage Fraud (2024)</h2>
            <div className="rounded-xl border border-amber-500/20 p-5 sm:p-6"
              style={{ background: 'rgba(245,158,11,0.04)' }}>
              <div className="rounded-lg border border-white/5 p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Context</p>
                <p className="text-white/70 print-muted text-sm">
                  ASIC highlighted growing use of technology in mortgage fraud, particularly fabricated income documents.
                </p>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">How Trutina responds</p>
              <ul className="space-y-2.5 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                  <span>Purpose-built to address the exact threat ASIC identified</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                  <span>AI content detection specifically trained to identify AI-generated financial documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                  <span>Broker risk profiling addresses ASIC&apos;s concern about fraud networks operating through broker channels</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                  <span>Comprehensive audit trail supports ASIC enforcement investigations</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Explainability */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">Explainability Requirement</h2>
            <div className="rounded-xl border border-emerald-500/20 p-5 sm:p-6"
              style={{ background: 'rgba(16,185,129,0.04)' }}>
              <div className="rounded-lg border border-white/5 p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Why it matters</p>
                <p className="text-white/70 print-muted text-sm">
                  APRA and ASIC both require that automated decision-making be explainable and auditable.
                </p>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">How Trutina delivers</p>
              <ul className="space-y-2.5 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span>Every risk score accompanied by plain-English narrative</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span>Each fraud flag includes: category (which module detected it), specific evidence (exact values, comparisons, sources), severity rating with rationale, and weight contribution to overall score</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span>Reports designed for inclusion in credit assessment documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span>No &ldquo;black box&rdquo; &mdash; every score component is traceable</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span>Suitable for presentation to regulators, auditors, and customers</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Record Keeping */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">Record Keeping</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <ul className="space-y-2.5 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Risk scores and flags retained for 7 years (APRA requirement)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Immutable audit log of all actions (who, what, when)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Full document analysis history available for regulatory review</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5" />
                  <span>Export capability for APRA/ASIC information requests</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Regulatory Mapping Summary */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">Regulatory Mapping Summary</h2>
            <div className="rounded-xl border border-white/10 overflow-hidden print-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-3 text-xs">Standard</th>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-3 text-xs">Requirement</th>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-3 text-xs">Trutina Feature</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80 font-medium">CPS 220</td>
                    <td className="px-4 py-3 text-white/60">Risk management framework</td>
                    <td className="px-4 py-3 text-white/40">Automated risk scoring, broker profiling</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80 font-medium">CPS 234</td>
                    <td className="px-4 py-3 text-white/60">Information security</td>
                    <td className="px-4 py-3 text-white/40">Encryption, Aus data sovereignty, threat detection</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80 font-medium">CPG 235</td>
                    <td className="px-4 py-3 text-white/60">Data risk management</td>
                    <td className="px-4 py-3 text-white/40">Cross-reference verification, data validation</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80 font-medium">RG 209</td>
                    <td className="px-4 py-3 text-white/60">Responsible lending</td>
                    <td className="px-4 py-3 text-white/40">Income verification, document authenticity</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white/80 font-medium">Privacy Act 1988</td>
                    <td className="px-4 py-3 text-white/60">Data protection</td>
                    <td className="px-4 py-3 text-white/40">DPA available, data minimisation, right to erasure</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">Conclusion</h2>
            <div className="rounded-xl border border-teal-500/20 p-5 sm:p-6 print-highlight"
              style={{ background: 'rgba(59,130,246,0.04)' }}>
              <p className="text-white/70 print-muted text-sm leading-relaxed">
                Trutina provides Australian lenders with a purpose-built fraud detection capability that directly
                addresses the AI-generated document fraud threat while maintaining full alignment with APRA and ASIC
                prudential requirements. The system&apos;s emphasis on explainability ensures that automated risk
                assessments can be reviewed, audited, and presented to regulators with confidence.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-teal-400 print-blue mb-3">Contact</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Compliance Inquiries</p>
                  <a href="mailto:compliance@trutina.com.au" className="text-teal-400 hover:text-teal-300 transition">
                    compliance@trutina.com.au
                  </a>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">General</p>
                  <a href="mailto:hello@trutina.com.au" className="text-teal-400 hover:text-teal-300 transition">
                    hello@trutina.com.au
                  </a>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Website</p>
                  <a href="https://trutina.com.au" className="text-teal-400 hover:text-teal-300 transition">
                    trutina.com.au
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-white/5 text-center space-y-2">
            <p className="text-white/30 text-xs leading-relaxed max-w-2xl mx-auto">
              This brief is for informational purposes. It does not constitute legal advice.
              Organisations should consult their own legal and compliance teams.
            </p>
            <p className="text-white/20 text-xs">Last updated: March 2026</p>
            <p className="text-white/20 text-xs">&copy; Trutina &mdash; AI Lending Fraud Detection</p>
          </div>

        </div>
      </div>
    </>
  )
}
