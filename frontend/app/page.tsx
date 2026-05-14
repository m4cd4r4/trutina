'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoginModal from '@/components/LoginModal'
import SiteHeader from '@/components/design/SiteHeader'
import SiteFooter from '@/components/design/SiteFooter'
import HeroSpecimenPreview from '@/components/design/HeroSpecimenPreview'
import { CalibrationTickRule } from '@/components/design/atoms'

/* Portfolio landing. Trutina was launched as a commercial product in
 * February 2026 and received zero commercial inbound across three
 * months. Backend wasn't reachable from the public marketing site for
 * most of that period - the trial CTA hit a 503. Rather than
 * relaunch the funnel, the asset has been repositioned as a portfolio
 * piece: methods paper + worked specimens + audit packet design,
 * available for genuine engagements on request.
 *
 * Sections: hero / measurements / modules / demo link / methods / refs.
 * Pricing section cut. Trial CTAs replaced with email-for-engagement.
 */

const MODULES = [
  { id: 'PM', name: 'Producer metadata',     range: 'PM-001 to PM-014', rules: 14, ex: 'Producer string mismatch. Asserted MYOB, found macOS Pages. Signature shared with 3 cases.' },
  { id: 'IC', name: 'Identity coherence',    range: 'IC-001 to IC-009', rules: 9,  ex: 'Payslip BSB 062-001 vs bank statement BSB 062-006. Branch mismatch.' },
  { id: 'IA', name: 'Income arithmetic',     range: 'IA-001 to IA-011', rules: 11, ex: 'Gross minus PAYG should equal net. Off by $47.20.' },
  { id: 'EV', name: 'Employer verification', range: 'EV-001 to EV-007', rules: 7,  ex: 'Employer ABN cancelled 2024-08-12. No BAS lodged since 2024-Q2.' },
  { id: 'NC', name: 'Network clustering',    range: 'NC-001 to NC-005', rules: 5,  ex: 'Font subset hash appears in 4 cases across one broker in 60 days.' },
]

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false)
  useEffect(() => {
    // Legacy ?trial=1 deep link: route to email instead of the
    // (now removed) trial signup modal.
    const params = new URLSearchParams(window.location.search)
    if (params.get('trial') === '1') {
      window.location.href = 'mailto:hello@trutina.com.au?subject=Trutina%20engagement%20enquiry'
    }
  }, [])

  const lineCount = 280

  return (
    <>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
      <SiteHeader active="index" onSignIn={() => setLoginOpen(true)} />

      <main className="page" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="line-numbers" aria-hidden="true">
          {Array.from({ length: lineCount }, (_, n) => (
            <span key={n}>{String(n + 1).padStart(2, '0')}</span>
          ))}
        </div>

        {/* Hero — portfolio framing */}
        <section id="hero" className="mk-section hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="disclosure">
                <span className="pip" />
                <span>
                  <b>2026-02 Commonwealth Bank:</b> self-reported ~A$1B in suspected fraudulent mortgage applications.
                  Fake payslips and bank statements submitted through broker channels. Westpac and ANZ flagged similar internally.<sup><a className="cite-link" href="#refs">[1]</a></sup>
                  {' '}This system was designed to detect them.
                </span>
              </div>

              <h1>
                Forensic mortgage<br />
                fraud detection.
              </h1>

              <p className="lede">
                Trutina is a five-module rule engine built to detect AI-generated payslips, forged bank statements, and invalid ABNs in Australian mortgage applications. Forty-six rules, each cited. Every flag drills to a SHA-256 evidence ledger retained seven years per APRA CPG 234. Methods paper and worked specimens below. Source available on request.
              </p>

              <div className="actions">
                <Link href="/demo" className="btn btn-primary">Open the worked specimens</Link>
                <a href="/methods-paper.pdf" target="_blank" rel="noopener" className="btn btn-secondary">
                  Methods paper (PDF, single page)
                </a>
              </div>

              <p className="t-caption" style={{ marginTop: 14, color: 'var(--ink-40)' }}>
                Independent project by <a href="https://github.com/m4cd4r4" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>Macdara</a>{' '}from Perth.{' '}
                For engagements:{' '}
                <a className="mono" href="mailto:hello@trutina.com.au?subject=Trutina%20engagement%20enquiry" style={{ color: 'var(--accent)' }}>hello@trutina.com.au</a>
              </p>
            </div>

            <div className="hero-preview">
              <HeroSpecimenPreview />
            </div>
          </div>

          <CalibrationTickRule />

          {/* What-you-get strip. Same structure, portfolio framing in the captions. */}
          <div className="trust-strip" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            <div className="cell">
              <span className="k">Detection modules</span>
              <span className="v">5</span>
              <span className="src">producer / identity / arithmetic / employer / network</span>
            </div>
            <div className="cell">
              <span className="k">Cited rules</span>
              <span className="v">46</span>
              <span className="src">each with id, test definition, worked example</span>
            </div>
            <div className="cell">
              <span className="k">Regulatory alignment</span>
              <span className="v" style={{ fontSize: 16 }}>APRA CPG 234</span>
              <span className="src">+ APP 11 . Privacy Act 1988</span>
            </div>
            <div className="cell">
              <span className="k">Worked specimens</span>
              <span className="v">5</span>
              <span className="src">clean / AI-fake / cancelled ABN / forged statement / broker pattern</span>
            </div>
            <div className="cell">
              <span className="k">Status</span>
              <span className="v" style={{ fontSize: 16 }}>Portfolio</span>
              <span className="src">commercial path available on request</span>
            </div>
          </div>
        </section>

        {/* Measurements */}
        <section id="measurements" className="mk-section">
          <div className="sec-label"><span style={{ fontWeight: 600, color: 'var(--ink-80)' }}>01</span><span>What the system measures</span></div>
          <h2>Producer, identity, arithmetic.</h2>
          <p className="standfirst">
            A payslip is a PDF. It has metadata, a layout, and an arithmetic structure. Trutina reads the PDF as a forensic file before it reads it as a document. Three of the four properties below cost the borrower nothing to produce honestly. The fourth, arithmetic, cannot be faked without leaving a trace.
          </p>

          <div className="measure-grid">
            <div className="measure-card">
              <div className="ord">PM . PRODUCER METADATA</div>
              <h3>What tool made this file?</h3>
              <p>
                Every PDF carries a producer string, a font subset hash, and an object-stream fingerprint. A legitimate payslip from MYOB AccountRight has a different signature from a payslip drawn in macOS Pages or LibreOffice.
              </p>
              <div className="example">
                Producer: &quot;Mac OS X 10.14.4 Quartz&quot;<br />
                Expected from MYOB: &quot;MYOB AccountRight 2023.6&quot;<br />
                <span style={{ color: 'var(--risk-crit)' }}>Mismatch. Three other applications in 60 days share this producer.</span>
              </div>
            </div>

            <div className="measure-card">
              <div className="ord">IC . IDENTITY COHERENCE</div>
              <h3>Do the fields agree across files?</h3>
              <p>
                Name, BSB, account number, employer ABN, and address appear in the payslip, the bank statement, the employer letter, and the application form. If they disagree, one of those documents is wrong, and which one tells you why.
              </p>
              <div className="example">
                Payslip BSB: 062-001 (CBA Sydney CBD)<br />
                Bank statement BSB: 062-006 (CBA Haymarket)<br />
                <span style={{ color: 'var(--risk-high)' }}>Branch divergence. Bank statement may be unrelated to the deposit account.</span>
              </div>
            </div>

            <div className="measure-card">
              <div className="ord">IA . INCOME ARITHMETIC</div>
              <h3>Does the math close?</h3>
              <p>
                Gross minus PAYG must equal net. Super at the SG rate (11.5% from 2024-07-01, 12.0% from 2025-07-01) must apply to the right base. YTD must reconcile against current. If any of these fail, the payslip was edited after it was generated.
              </p>
              <div className="example">
                Gross 4,820.00 . PAYG 1,184.00 . Net <b>3,636.00</b><br />
                Stated net: <b style={{ color: 'var(--risk-crit)' }}>3,683.20</b>. Off by $47.20.<br />
                <span style={{ color: 'var(--ink-40)' }}>Super calculated against gross less RFBA. Wrong base.</span>
              </div>
            </div>
          </div>

          <h4 style={{ marginTop: 56, marginBottom: 0 }}>What the system does not measure</h4>
          <div className="never-list">
            <div className="item">The borrower&apos;s character.</div>
            <div className="item">Spending category from transaction descriptions.</div>
            <div className="item">Anything inferred from the borrower&apos;s name.</div>
            <div className="item">Anything from a credit bureau score.</div>
            <div className="item">Postcode-level risk priors.</div>
            <div className="item">Broker affiliation as a feature on the case score.</div>
          </div>
        </section>

        {/* Modules table */}
        <section id="methods" className="mk-section">
          <div className="sec-label"><span style={{ fontWeight: 600, color: 'var(--ink-80)' }}>02</span><span>The detection modules</span></div>
          <h2>Five modules. Forty-six rules. Each rule cited.</h2>
          <p className="standfirst">
            There are no black-box scores. Each module is a finite list of rules. Each rule has an ID, a defined test, a citation, and a worked example. A reviewer can drill from &quot;Critical 78&quot; to the rule that fired, to the field in the source file the rule looked at. APRA can read it.
          </p>

          <table className="module-table">
            <thead>
              <tr>
                <th style={{ width: 240 }}>Module</th>
                <th style={{ width: 80 }}>Rules</th>
                <th>Worked example</th>
              </tr>
            </thead>
            <tbody>
              {MODULES.map(m => (
                <tr key={m.id}>
                  <td>
                    <div className="name">{m.name}</div>
                    <div className="id">{m.range}</div>
                  </td>
                  <td><span className="t-mono" style={{ fontSize: 14 }}>{m.rules}</span></td>
                  <td><div className="ex">{m.ex}</div></td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="t-prose" style={{ marginTop: 28 }}>
            The five modules do not vote on a single score; they each return their own. The case score is the max of the module scores, not their average. One Critical module is enough to make a Critical case. A reviewer who disagrees with the top score sees the next-highest and the rule behind it.
          </p>
        </section>

        {/* Demo link */}
        <section id="demo" className="mk-section">
          <div className="sec-label"><span style={{ fontWeight: 600, color: 'var(--ink-80)' }}>03</span><span>Worked specimens</span></div>
          <h2>Five redacted Australian cases.</h2>
          <p className="standfirst">
            Clean applications next to fabricated ones, all five submitted through Australian broker channels. Each specimen shows the source PDFs, the named rules that fired, and the audit packet that would be produced. No live system to upload to: the engine and the rules are the artefact.
          </p>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 28 }}>
            <Link href="/demo" className="btn btn-primary">Open the specimens</Link>
            <span className="t-caption">No sign-in. Read-only. Synthetic data.</span>
          </div>
        </section>

        {/* Methods + integration sketch */}
        <section id="methods-paper" className="mk-section">
          <div className="sec-label"><span style={{ fontWeight: 600, color: 'var(--ink-80)' }}>04</span><span>Methods and integration</span></div>
          <h2>How a working deployment would receive a case.</h2>
          <p className="standfirst">
            The design contemplates an LOS integration: POST a case bundle, receive a verdict and an evidence packet, decide. Data residency Australia, encryption AES-256, evidence ledger retained seven years. This portfolio site does not run the engine against uploaded files. The shape of the integration is below.
          </p>

          <div className="split-2">
            <div className="spec-list">
              <div className="item"><span className="k">Hosting design</span><span>AWS ap-southeast-2 (Sydney). Multi-AZ. No data leaves AU jurisdiction.</span></div>
              <div className="item"><span className="k">Encryption</span><span>AES-256 at rest. TLS 1.3 in transit. Keys in AWS KMS, customer-managed CMK optional.</span></div>
              <div className="item"><span className="k">Identity</span><span>SAML 2.0, OIDC, SCIM. MFA enforced.</span></div>
              <div className="item"><span className="k">Audit log</span><span>Every reviewer action, every export, every config change. WORM 7 years.<sup><a className="cite-link" href="#refs">[3]</a></sup></span></div>
              <div className="item"><span className="k">Connectors</span><span>nCino . Sandstone . LendApp . Lendi . AFG . Connective. SFTP if required.</span></div>
              <div className="item"><span className="k">Latency target</span><span>P95 verdict under 60s end-to-end from POST to webhook.</span></div>
            </div>

            <div>
              <div className="t-caption" style={{ marginBottom: 8, letterSpacing: '0.06em' }}>POST /v1/cases . sample request</div>
              <div className="codeblock">
                <div><span className="k">POST</span> https://api.trutina.com.au/v1/cases</div>
                <div><span className="k">Authorization</span>: Bearer <span className="s">&quot;sk_live_...&quot;</span></div>
                <div><span className="k">Content-Type</span>: application/json</div>
                <div>&nbsp;</div>
                <div>{`{`}</div>
                <div>{`  `}<span className="k">&quot;case_ref&quot;</span>: <span className="s">&quot;WBS-2026-04-08-00128&quot;</span>,</div>
                <div>{`  `}<span className="k">&quot;applicant&quot;</span>: {`{`} <span className="k">&quot;name_hash&quot;</span>: <span className="s">&quot;sha256:9a4...&quot;</span> {`}`},</div>
                <div>{`  `}<span className="k">&quot;documents&quot;</span>: [</div>
                <div>{`    `}{`{`} <span className="k">&quot;kind&quot;</span>: <span className="s">&quot;payslip&quot;</span>, <span className="k">&quot;uri&quot;</span>: <span className="s">&quot;s3://...&quot;</span>, <span className="k">&quot;sha256&quot;</span>: <span className="s">&quot;7f2a91...&quot;</span> {`}`},</div>
                <div>{`    `}{`{`} <span className="k">&quot;kind&quot;</span>: <span className="s">&quot;bank_statement&quot;</span>, <span className="k">&quot;uri&quot;</span>: <span className="s">&quot;s3://...&quot;</span> {`}`},</div>
                <div>{`    `}{`{`} <span className="k">&quot;kind&quot;</span>: <span className="s">&quot;employer_letter&quot;</span>, <span className="k">&quot;uri&quot;</span>: <span className="s">&quot;s3://...&quot;</span> {`}`}</div>
                <div>{`  `}],</div>
                <div>{`  `}<span className="k">&quot;webhook&quot;</span>: <span className="s">&quot;https://example.com.au/los/webhooks/trutina&quot;</span></div>
                <div>{`}`}</div>
                <div>&nbsp;</div>
                <div><span className="c"># 200 OK</span></div>
                <div>{`{`} <span className="k">&quot;case_id&quot;</span>: <span className="s">&quot;TRU-2026-04812&quot;</span>, <span className="k">&quot;score&quot;</span>: <span className="s">78</span>, <span className="k">&quot;tier&quot;</span>: <span className="s">&quot;critical&quot;</span> {`}`}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Engagements */}
        <section id="engagements" className="mk-section">
          <div className="sec-label"><span style={{ fontWeight: 600, color: 'var(--ink-80)' }}>05</span><span>Engagements</span></div>
          <h2>Available for genuine enquiries.</h2>
          <p className="standfirst">
            The Trutina engine, the rule library, and the audit packet design are available for assessment by Australian lenders, aggregators, and credit-risk teams. Source and methods paper available on request. Bespoke engagements rather than a SaaS subscription.
          </p>
          <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginTop: 28, flexWrap: 'wrap' }}>
            <a href="mailto:hello@trutina.com.au?subject=Trutina%20engagement%20enquiry" className="btn btn-primary">Email me about an engagement</a>
            <a href="/methods-paper.pdf" target="_blank" rel="noopener" className="btn-text">Methods paper (PDF)</a>
            <span className="t-caption" style={{ color: 'var(--ink-40)' }}>
              Built in Perth by <a href="https://github.com/m4cd4r4" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>Macdara</a>. Independent project.
            </span>
          </div>
        </section>

        {/* Footnotes */}
        <section id="refs" className="mk-section" style={{ paddingBottom: 96 }}>
          <div className="sec-label"><span style={{ fontWeight: 600, color: 'var(--ink-80)' }}>06</span><span>Citations</span></div>
          <h2 style={{ fontSize: 22 }}>References on this page</h2>
          <div className="footnotes">
            <div className="fn"><span className="n">[1]</span><span>Commonwealth Bank of Australia, half-year results commentary February 2026. Self-reported A$1 billion exposure to suspected fraudulent mortgage applications submitted through broker channels.</span></div>
            <div className="fn"><span className="n">[2]</span><span>NAB &quot;Penthouse Syndicate&quot; matter, charged 2025. ~A$105M exposure across fabricated payslip applications.</span></div>
            <div className="fn"><span className="n">[3]</span><span>APRA Prudential Practice Guide CPG 234 (Information Security), November 2019. <code>apra.gov.au/cpg-234-information-security</code>.</span></div>
            <div className="fn"><span className="n">[4]</span><span>Australian Privacy Principle 11 (Security of personal information), Privacy Act 1988. <code>oaic.gov.au/privacy/australian-privacy-principles/11</code>.</span></div>
            <div className="fn"><span className="n">[5]</span><span>Producer string field as defined in ISO 32000-1:2008, table 317.</span></div>
            <div className="fn"><span className="n">[6]</span><span>ATO Super Guarantee rate schedule. 11.5% from 2024-07-01. 12.0% from 2025-07-01. <code>ato.gov.au/super-guarantee-rate</code>.</span></div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
