import Link from 'next/link'

export default function SecurityWhitepaper() {
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
          .print-page .print-blue { color: #2563eb !important; }
          .print-page .print-muted { color: #555 !important; }
          .print-page .print-light { color: #888 !important; }
          .print-page .print-card {
            background: #f8f9fa !important;
            border: 1px solid #e5e7eb !important;
          }
          .print-page a { text-decoration: none !important; }
        }
      `}} />

      <div className="min-h-screen text-white print-page"
        style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(30,27,75,0.9) 0%, #0a0a1a 50%)' }}>

        {/* Nav */}
        <nav className="no-print flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/5">
          <Link href="/" className="text-xl font-bold">
            Tru<span className="text-blue-400">tina</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/docs" className="text-white/50 hover:text-white/80 text-sm transition">
              Docs
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

          {/* Header */}
          <div className="mb-10">
            <Link href="/docs" className="text-white/30 hover:text-white/50 text-xs uppercase tracking-wider transition no-print">
              Documentation
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">Security &amp; Privacy Whitepaper</h1>
            <p className="text-white/50 max-w-2xl">
              How Trutina protects sensitive mortgage application data. Designed for CISOs, procurement teams, and compliance officers at regulated financial institutions.
            </p>
          </div>

          {/* Executive Summary */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Executive Summary</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-white/70 print-muted text-sm leading-relaxed">
                Trutina processes sensitive mortgage application documents to detect fraud. This document outlines our
                security architecture, data handling practices, and privacy commitments. We are designed for regulated
                financial institutions subject to APRA and Privacy Act 1988 requirements.
              </p>
            </div>
          </section>

          {/* Architecture Overview */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Architecture Overview</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <ul className="space-y-3 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">Frontend:</strong> Hosted on Vercel (SOC 2 Type II, ISO 27001)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">Backend:</strong> Hosted on dedicated VPS in Sydney, Australia (data sovereignty)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">AI Engine:</strong> Anthropic Claude Sonnet (SOC 2 Type II compliant)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">Database:</strong> PostgreSQL with encryption at rest (AES-256)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">Jurisdiction:</strong> All data stays within Australian jurisdiction</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Processing */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Data Processing</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <ol className="space-y-3 text-sm text-white/70 print-muted list-decimal list-inside">
                <li>Documents are uploaded via HTTPS (TLS 1.3)</li>
                <li>Stored temporarily during analysis (~60 seconds active processing)</li>
                <li>Text extracted from PDFs using PyMuPDF (local processing, no third-party OCR)</li>
                <li>Document text sent to Anthropic Claude API for AI content analysis only</li>
                <li>Raw PDF files are <strong className="text-white/90">NOT</strong> sent to Claude &mdash; only extracted text</li>
              </ol>
            </div>
          </section>

          {/* Anthropic AI - No Training Guarantee */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Anthropic AI &mdash; No Training Guarantee</h2>
            <div className="rounded-xl border border-emerald-500/20 p-5 sm:p-6"
              style={{ background: 'rgba(16,185,129,0.04)' }}>
              <p className="text-sm font-semibold text-emerald-300 mb-3">Critical for regulated customers:</p>
              <ul className="space-y-3 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span>Anthropic&apos;s API Terms of Service explicitly state: <em>&ldquo;We do not train our models on your inputs or outputs&rdquo;</em></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span>Anthropic is SOC 2 Type II certified</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span>Data sent to Claude API is processed and discarded &mdash; not stored, not used for training</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span>Trutina uses the Anthropic API (not consumer Claude) &mdash; business-grade data handling</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  <span>Source: <a href="https://www.anthropic.com/policies/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition" target="_blank" rel="noopener noreferrer">anthropic.com/policies/privacy</a></span>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Data Retention</h2>
            <div className="rounded-xl border border-white/10 overflow-hidden print-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-3 text-xs">Data Type</th>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-3 text-xs">Retention Period</th>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-3 text-xs">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80">Raw PDF files</td>
                    <td className="px-4 py-3 text-white/60">90 days</td>
                    <td className="px-4 py-3 text-white/40">Configurable per customer. Auto-deleted after period.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80">Extracted text</td>
                    <td className="px-4 py-3 text-white/60">90 days</td>
                    <td className="px-4 py-3 text-white/40">Stored encrypted. Used for audit trail.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80">Risk scores &amp; flags</td>
                    <td className="px-4 py-3 text-white/60">7 years</td>
                    <td className="px-4 py-3 text-white/40">APRA record-keeping requirement (CPS 220)</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80">Audit events</td>
                    <td className="px-4 py-3 text-white/60">7 years</td>
                    <td className="px-4 py-3 text-white/40">Immutable audit log for compliance</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white/80">Broker profiles</td>
                    <td className="px-4 py-3 text-white/60">Indefinite</td>
                    <td className="px-4 py-3 text-white/40">Aggregated data, no PII</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-white/30 text-xs mt-3">Enterprise customers can configure custom retention periods.</p>
          </section>

          {/* Encryption */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Encryption</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <ul className="space-y-3 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">In transit:</strong> TLS 1.3 for all API communication</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">At rest:</strong> AES-256 for database (PostgreSQL). Documents stored on encrypted filesystem.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">API keys:</strong> Hashed with bcrypt. Never stored in plaintext.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">Secrets management:</strong> Environment variables injected at deployment. No hardcoded credentials.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Authentication & Access Control */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Authentication &amp; Access Control</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <ul className="space-y-3 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">API access:</strong> Per-customer API keys with rate limiting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">Dashboard:</strong> Password-based authentication with httpOnly secure cookies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">Future:</strong> SSO/SAML integration for Enterprise customers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">RBAC:</strong> Role-based access control planned for multi-user accounts</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Network Security */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Network Security</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <ul className="space-y-3 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Backend runs on dedicated infrastructure (not shared hosting)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">Firewall:</strong> Only ports 443 (HTTPS) and 22 (SSH management) exposed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">DDoS protection:</strong> Via Vercel&apos;s edge network (frontend)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Rate limiting on all API endpoints</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span><strong className="text-white/90">IP allowlisting:</strong> Available for Enterprise customers</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Incident Response */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Incident Response</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <ul className="space-y-3 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Automated monitoring with alerting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Security incidents communicated within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Post-incident review and report provided to affected customers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Contact: <a href="mailto:security@trutina.com.au" className="text-blue-400 hover:text-blue-300 transition">security@trutina.com.au</a></span>
                </li>
              </ul>
            </div>
          </section>

          {/* Third-Party Dependencies */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Third-Party Dependencies</h2>
            <div className="rounded-xl border border-white/10 overflow-hidden print-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-3 text-xs">Service</th>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-3 text-xs">Purpose</th>
                    <th className="text-left text-white/50 print-muted font-medium px-4 py-3 text-xs">Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80 font-medium">Anthropic (Claude API)</td>
                    <td className="px-4 py-3 text-white/60">AI content analysis</td>
                    <td className="px-4 py-3 text-white/40">SOC 2 Type II, no training on inputs</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80 font-medium">Vercel</td>
                    <td className="px-4 py-3 text-white/60">Frontend hosting</td>
                    <td className="px-4 py-3 text-white/40">SOC 2 Type II, ISO 27001</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-3 text-white/80 font-medium">ABN Lookup API</td>
                    <td className="px-4 py-3 text-white/60">ABN verification</td>
                    <td className="px-4 py-3 text-white/40">Australian Government API (public)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white/80 font-medium">RBA BSB Directory</td>
                    <td className="px-4 py-3 text-white/60">BSB validation</td>
                    <td className="px-4 py-3 text-white/40">Public data (updated monthly)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Privacy Act 1988 Compliance */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Privacy Act 1988 Compliance</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <ul className="space-y-3 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Trutina processes personal information (names, financial data) as a service provider</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Data Processing Agreement available for all customers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>We collect only what&apos;s necessary for fraud detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>No data sold to third parties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Individuals can request data deletion (right to erasure)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Australian Privacy Principles (APPs) 1&ndash;13 addressed in full DPA</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Penetration Testing */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Penetration Testing</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <ul className="space-y-3 text-sm text-white/70 print-muted">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Annual third-party penetration testing (report available under NDA)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Continuous automated vulnerability scanning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Dependency monitoring for known CVEs</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-blue-400 print-blue mb-3">Contact</h2>
            <div className="rounded-xl border border-white/10 p-5 sm:p-6 print-card"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Security Inquiries</p>
                  <a href="mailto:security@trutina.com.au" className="text-blue-400 hover:text-blue-300 transition">
                    security@trutina.com.au
                  </a>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Privacy Officer</p>
                  <a href="mailto:privacy@trutina.com.au" className="text-blue-400 hover:text-blue-300 transition">
                    privacy@trutina.com.au
                  </a>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">General</p>
                  <a href="mailto:hello@trutina.com.au" className="text-blue-400 hover:text-blue-300 transition">
                    hello@trutina.com.au
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-white/5 text-center text-white/20 text-xs">
            <p>Last updated: March 2026</p>
            <p className="mt-1">&copy; Trutina &mdash; AI Mortgage Fraud Detection</p>
          </div>

        </div>
      </div>
    </>
  )
}
