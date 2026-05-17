'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/design/SiteHeader'
import SiteFooter from '@/components/design/SiteFooter'
import HeroSpecimenPreview from '@/components/design/HeroSpecimenPreview'
import { EngagementCTA } from '@/components/EngagementCTA'

/* Portfolio landing — SaaS-shape rewrite.
 *
 * Editorial system (Fraunces + cool-paper + line-numbered margin) lives
 * everywhere else in the app and represents the forensic product itself.
 * This single page (/) is the marketing surface and uses a separate
 * SaaS scope (.landing-saas) with Geist Sans, white background, sharper
 * hierarchy, subtle motion, and mobile-responsive layout.
 *
 * Sections: hero / trust strip / measurements / modules / demo / methods / engagements / refs.
 */

const MODULES = [
  { id: 'PM', name: 'Producer metadata',     range: 'PM-001 to PM-014', rules: 14, ex: 'Producer string mismatch. Asserted MYOB, found macOS Pages. Signature shared with 3 cases.' },
  { id: 'IC', name: 'Identity coherence',    range: 'IC-001 to IC-009', rules: 9,  ex: 'Payslip BSB 062-001 vs bank statement BSB 062-006. Branch mismatch.' },
  { id: 'IA', name: 'Income arithmetic',     range: 'IA-001 to IA-011', rules: 11, ex: 'Gross minus PAYG should equal net. Off by $47.20.' },
  { id: 'EV', name: 'Employer verification', range: 'EV-001 to EV-007', rules: 7,  ex: 'Employer ABN cancelled 2024-08-12. No BAS lodged since 2024-Q2.' },
  { id: 'NC', name: 'Network clustering',    range: 'NC-001 to NC-005', rules: 5,  ex: 'Font subset hash appears in 4 cases across one broker in 60 days.' },
]

const FLOW = [
  { n: '01', t: 'A case arrives', d: 'Payslip, bank statement, employer letter, application form. Every file is hashed with SHA-256 before a single rule reads it.', meta: 'POST /v1/cases, or via LOS connector' },
  { n: '02', t: 'Five modules read it', d: 'Producer, identity, arithmetic, employer, network. Each runs its own rules against the source PDFs, independently. No shared black-box score.', meta: '46 cited rules across 5 modules' },
  { n: '03', t: 'Highest module wins', d: 'The case score is the single highest module score, never an average. One Critical module makes a Critical case. Every flag drills to the rule and the byte.', meta: 'Disagree? See the next-highest' },
  { n: '04', t: 'Signed evidence packet', d: 'The verdict ships with the rules that fired, the field each one read, and a citation for every rule. Written to a WORM ledger.', meta: 'AES-256 . AU residency . 7-year retention' },
]

export default function Landing() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('trial') === '1') {
      window.location.href = 'mailto:hello@trutina.com.au?subject=Trutina%20engagement%20enquiry'
    }
  }, [])

  return (
    <>
      <SiteHeader active="index" />

      <div className="landing-saas">
        <main className="page" style={{ paddingTop: 0, paddingBottom: 0 }}>

          {/* Hero */}
          <section id="hero" className="hero">
            <div className="hero-grid">
              <div className="hero-copy">
                <span className="saas-chip">
                  <span className="pip" aria-hidden="true" />
                  <span>
                    <strong>CBA 2026-02:</strong> ~A$1B in suspected fraudulent mortgages
                  </span>
                  <a className="cite-link" href="#refs">[1]</a>
                </span>

                <h1>
                  Forensic mortgage<br />fraud detection.
                </h1>

                <p className="lede">
                  A five-module rule engine for detecting AI-generated payslips, forged bank statements, and invalid ABNs in Australian mortgage applications. Forty-six rules, each cited. Every flag drills to a SHA-256 evidence ledger retained seven years per APRA CPG 234.
                </p>

                <div className="actions">
                  <Link href="/demo" className="btn btn-primary">Open the worked specimens</Link>
                  <a href="/methods-paper.pdf" target="_blank" rel="noopener" className="btn btn-secondary">
                    Methods paper (PDF) <span className="arrow" aria-hidden="true">→</span>
                  </a>
                </div>

                <p className="byline">
                  Independent project by <a href="https://github.com/m4cd4r4" target="_blank" rel="noopener">Macdara</a> from Perth. Source available on request.
                </p>
              </div>

              <div className="hero-artefact">
                <HeroSpecimenPreview />
              </div>
            </div>
          </section>

          {/* Trust strip — semantic dl/dt/dd for key-value stats */}
          <section className="saas-section no-border" style={{ paddingTop: 0, paddingBottom: 64 }}>
            <dl className="saas-trust">
              <div className="cell">
                <dt className="k">Detection modules</dt>
                <dd className="v">5</dd>
              </div>
              <div className="cell">
                <dt className="k">Cited rules</dt>
                <dd className="v">46</dd>
              </div>
              <div className="cell">
                <dt className="k">Regulatory frame</dt>
                <dd className="v">APRA CPG 234</dd>
              </div>
              <div className="cell">
                <dt className="k">Worked specimens</dt>
                <dd className="v">5</dd>
              </div>
            </dl>
          </section>

          {/* How it works — scannable pipeline before the deep detail */}
          <section id="how" className="saas-section">
            <div>
              <div className="saas-eyebrow">01 — How it works</div>
              <h2>How a case moves through the engine.</h2>
              <p className="section-lede">
                Four steps, no black box. Documents go in; a scored verdict and a citable evidence packet come out.
              </p>
            </div>

            <div className="saas-flow">
              {FLOW.map(s => (
                <div className="flow-step" key={s.n}>
                  <span className="n">{s.n}</span>
                  <div className="t">{s.t}</div>
                  <div className="d">{s.d}</div>
                  <div className="meta">{s.meta}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Measurements */}
          <section id="measurements" className="saas-section">
            <div>
              <div className="saas-eyebrow">02 — What it measures</div>
              <h2>Producer, identity, arithmetic.</h2>
              <p className="section-lede">
                Trutina reads the PDF as a forensic file before it reads it as a document. Three of the four properties cost the borrower nothing to produce honestly; the fourth, arithmetic, cannot be faked without leaving a trace.
              </p>
            </div>

            <div className="modules-grid">
              {MODULES.map((m, i) => (
                <div key={m.id} className="module-cell">
                  <div className="id">{String(i + 1).padStart(2, '0')} · {m.id}</div>
                  <div className="name">{m.name}</div>
                  <div className="range">{m.range} · {m.rules} rules</div>
                  <div className="ex">{m.ex}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Demo CTA */}
          <section id="demo" className="saas-section">
            <div>
              <div className="saas-eyebrow">03 — Worked specimens</div>
              <h2>Five redacted Australian cases.</h2>
              <p className="section-lede">
                Clean applications next to fabricated ones, all submitted through Australian broker channels. Each shows the source PDFs, the rules that fired, and the audit packet produced. No sign-in. Read-only. Synthetic data.
              </p>
              <Link href="/demo" className="btn btn-primary">Open the specimens →</Link>
            </div>
          </section>

          {/* Methods + integration */}
          <section id="methods" className="saas-section">
            <div>
              <div className="saas-eyebrow">04 — Methods & integration</div>
              <h2>How a deployment receives a case.</h2>
              <p className="section-lede">
                The shape of a working LOS integration: POST a case bundle, receive a verdict and an evidence packet. AU data residency, AES-256, seven-year ledger. This portfolio site does not run the engine against uploaded files.
              </p>
            </div>

            <div className="saas-card">
              <pre className="codeblock"><code>{`POST https://api.trutina.com.au/v1/cases
Authorization: Bearer sk_live_…
Content-Type:  application/json

{
  "case_ref":  "WBS-2026-04-08-00128",
  "applicant": { "name_hash": "sha256:9a4…" },
  "documents": [
    { "kind": "payslip",        "uri": "s3://…", "sha256": "7f2a91…" },
    { "kind": "bank_statement", "uri": "s3://…" },
    { "kind": "employer_letter","uri": "s3://…" }
  ],
  "webhook": "https://example.com.au/los/webhooks/trutina"
}

# 200 OK
{ "case_id": "TRU-2026-04812", "score": 78, "tier": "critical" }`}</code></pre>
            </div>
          </section>

          {/* Engagements — primary conversion. Soft-fill section distinguishes
              it from the white reading sections above. */}
          <section id="engagements" className="saas-section is-conversion">
            <div>
              <div className="saas-eyebrow">05 — Engagements</div>
              <h2>Available for genuine enquiries.</h2>
              <p className="section-lede">
                The engine, rule library, and audit packet design are available for assessment by Australian lenders, aggregators, and credit-risk teams. Bespoke engagements, not a SaaS subscription. Source and methods paper on request.
              </p>
              <EngagementCTA variant="saas" />
            </div>
          </section>

          {/* References */}
          <section id="refs" className="saas-section" style={{ paddingBottom: 80 }}>
            <div>
              <div className="saas-eyebrow">06 — Citations</div>
              <h2 style={{ fontSize: 24 }}>References</h2>
            </div>
            <div className="saas-refs">
              <div className="fn"><span className="n">[1]</span><span>Commonwealth Bank of Australia, half-year results February 2026. Self-reported A$1B exposure to suspected fraudulent mortgage applications via broker channels.</span></div>
              <div className="fn"><span className="n">[2]</span><span>NAB &quot;Penthouse Syndicate&quot; matter, charged 2025. ~A$105M exposure across fabricated payslip applications.</span></div>
              <div className="fn"><span className="n">[3]</span><span>APRA Prudential Practice Guide CPG 234 (Information Security), November 2019.</span></div>
              <div className="fn"><span className="n">[4]</span><span>Australian Privacy Principle 11, Privacy Act 1988.</span></div>
              <div className="fn"><span className="n">[5]</span><span>Producer string field, ISO 32000-1:2008, table 317.</span></div>
              <div className="fn"><span className="n">[6]</span><span>ATO Super Guarantee rate schedule. 11.5% from 2024-07-01. 12.0% from 2025-07-01.</span></div>
            </div>
          </section>

        </main>
      </div>

      <SiteFooter />
    </>
  )
}
