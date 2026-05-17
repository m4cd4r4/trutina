import type { Metadata } from 'next'
import DocShell from '@/components/DocShell'

export const metadata: Metadata = {
  title: 'Security & Privacy Whitepaper',
  description: 'How Trutina protects sensitive loan application data: encryption standards, data retention policies, Anthropic no-training guarantee, and penetration testing.',
  alternates: { canonical: '/docs/security' },
}

const CARD = { background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' } as const
const DOT = { background: 'var(--accent)' } as const

export default function SecurityWhitepaper() {
  return (
    <DocShell
      title="Security & Privacy Whitepaper"
      intro="How Trutina protects sensitive loan application data. Designed for CISOs, procurement teams, and compliance officers at regulated financial institutions."
      updated="March 2026"
    >

          {/* Executive Summary */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Executive Summary</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-80)' }}>
                Trutina processes sensitive loan application documents to detect fraud. This document outlines our
                security architecture, data handling practices, and privacy commitments. We are designed for regulated
                financial institutions subject to APRA and Privacy Act 1988 requirements.
              </p>
            </div>
          </section>

          {/* Architecture Overview */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Architecture Overview</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>Frontend:</strong> Hosted on Vercel (SOC 2 Type II, ISO 27001)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>Backend:</strong> Hosted on dedicated VPS in Sydney, Australia (data sovereignty)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>AI Engine:</strong> Anthropic Claude Sonnet (SOC 2 Type II compliant)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>Database:</strong> PostgreSQL with encryption at rest (AES-256)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>Jurisdiction:</strong> All data stays within Australian jurisdiction</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Processing */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Data Processing</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <ol className="space-y-3 text-sm list-decimal list-inside" style={{ color: 'var(--ink-80)' }}>
                <li>Documents are uploaded via HTTPS (TLS 1.3)</li>
                <li>Stored temporarily during analysis (~60 seconds active processing)</li>
                <li>Text extracted from PDFs using PyMuPDF (local processing, no third-party OCR)</li>
                <li>Document text sent to Anthropic Claude API for AI content analysis only</li>
                <li>Raw PDF files are <strong style={{ color: 'var(--ink-100)' }}>NOT</strong> sent to Claude &mdash; only extracted text</li>
              </ol>
            </div>
          </section>

          {/* Anthropic AI - No Training Guarantee */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Anthropic AI &mdash; No Training Guarantee</h2>
            <div className="rounded-xl p-5 sm:p-6" style={{ background: 'var(--accent-fill)', border: '1px solid var(--accent-edge)' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--accent-press)' }}>Critical for regulated customers:</p>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Anthropic&apos;s API Terms of Service explicitly state: <em>&ldquo;We do not train our models on your inputs or outputs&rdquo;</em></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Anthropic is SOC 2 Type II certified</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Data sent to Claude API is processed and discarded &mdash; not stored, not used for training</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Trutina uses the Anthropic API (not consumer Claude) &mdash; business-grade data handling</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Source: <a href="https://www.anthropic.com/policies/privacy" className="underline underline-offset-2" style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">anthropic.com/policies/privacy</a></span>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Data Retention</h2>
            <div className="rounded-xl overflow-hidden" style={CARD}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--paper-1)', borderBottom: '1px solid var(--rule)' }}>
                    <th className="text-left font-medium px-4 py-3 text-xs" style={{ color: 'var(--ink-60)' }}>Data Type</th>
                    <th className="text-left font-medium px-4 py-3 text-xs" style={{ color: 'var(--ink-60)' }}>Retention Period</th>
                    <th className="text-left font-medium px-4 py-3 text-xs" style={{ color: 'var(--ink-60)' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-100)' }}>Raw PDF files</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>90 days</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>Configurable per customer. Auto-deleted after period.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-100)' }}>Extracted text</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>90 days</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>Stored encrypted. Used for audit trail.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-100)' }}>Risk scores &amp; flags</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>7 years</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>APRA record-keeping requirement (CPS 220)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-100)' }}>Audit events</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>7 years</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>Immutable audit log for compliance</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-100)' }}>Broker profiles</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>Indefinite</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>Aggregated data, no PII</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--ink-40)' }}>Enterprise customers can configure custom retention periods.</p>
          </section>

          {/* Encryption */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Encryption</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>In transit:</strong> TLS 1.3 for all API communication</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>At rest:</strong> AES-256 for database (PostgreSQL). Documents stored on encrypted filesystem.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>API keys:</strong> Hashed with bcrypt. Never stored in plaintext.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>Secrets management:</strong> Environment variables injected at deployment. No hardcoded credentials.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Authentication & Access Control */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Authentication &amp; Access Control</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>API access:</strong> Per-customer API keys with rate limiting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>Dashboard:</strong> Password-based authentication with httpOnly secure cookies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>Future:</strong> SSO/SAML integration for Enterprise customers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>RBAC:</strong> Role-based access control planned for multi-user accounts</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Network Security */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Network Security</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Backend runs on dedicated infrastructure (not shared hosting)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>Firewall:</strong> Only ports 443 (HTTPS) and 22 (SSH management) exposed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>DDoS protection:</strong> Via Vercel&apos;s edge network (frontend)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Rate limiting on all API endpoints</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span><strong style={{ color: 'var(--ink-100)' }}>IP allowlisting:</strong> Available for Enterprise customers</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Incident Response */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Incident Response</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Automated monitoring with alerting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Security incidents communicated within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Post-incident review and report provided to affected customers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Contact: <a href="mailto:security@trutina.com.au" style={{ color: 'var(--accent)' }}>security@trutina.com.au</a></span>
                </li>
              </ul>
            </div>
          </section>

          {/* Third-Party Dependencies */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Third-Party Dependencies</h2>
            <div className="rounded-xl overflow-hidden" style={CARD}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--paper-1)', borderBottom: '1px solid var(--rule)' }}>
                    <th className="text-left font-medium px-4 py-3 text-xs" style={{ color: 'var(--ink-60)' }}>Service</th>
                    <th className="text-left font-medium px-4 py-3 text-xs" style={{ color: 'var(--ink-60)' }}>Purpose</th>
                    <th className="text-left font-medium px-4 py-3 text-xs" style={{ color: 'var(--ink-60)' }}>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink-100)' }}>Anthropic (Claude API)</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>AI content analysis</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>SOC 2 Type II, no training on inputs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink-100)' }}>Vercel</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>Frontend hosting</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>SOC 2 Type II, ISO 27001</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink-100)' }}>ABN Lookup API</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>ABN verification</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>Australian Government API (public)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink-100)' }}>RBA BSB Directory</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-60)' }}>BSB validation</td>
                    <td className="px-4 py-3" style={{ color: 'var(--ink-40)' }}>Public data (updated monthly)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Privacy Act 1988 Compliance */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Privacy Act 1988 Compliance</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Trutina processes personal information (names, financial data) as a service provider</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Data Processing Agreement available for all customers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>We collect only what&apos;s necessary for fraud detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>No data sold to third parties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Individuals can request data deletion (right to erasure)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Australian Privacy Principles (APPs) 1&ndash;13 addressed in full DPA</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Penetration Testing */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Penetration Testing</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-80)' }}>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Annual third-party penetration testing (report available under NDA)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Continuous automated vulnerability scanning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={DOT} />
                  <span>Dependency monitoring for known CVEs</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 style={{ marginBottom: 12 }}>Contact</h2>
            <div className="rounded-xl p-5 sm:p-6" style={CARD}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Security Inquiries</p>
                  <a href="mailto:security@trutina.com.au" style={{ color: 'var(--accent)' }}>
                    security@trutina.com.au
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Privacy Officer</p>
                  <a href="mailto:privacy@trutina.com.au" style={{ color: 'var(--accent)' }}>
                    privacy@trutina.com.au
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>General</p>
                  <a href="mailto:hello@trutina.com.au" style={{ color: 'var(--accent)' }}>
                    hello@trutina.com.au
                  </a>
                </div>
              </div>
            </div>
          </section>

    </DocShell>
  )
}
