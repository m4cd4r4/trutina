import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Presentation, Calculator, Code, BarChart3, Zap, Shield, Scale } from 'lucide-react'
import SiteHeader from '@/components/design/SiteHeader'
import SiteFooter from '@/components/design/SiteFooter'

export const metadata: Metadata = {
  title: 'Documentation & resources',
  description: 'Technical documentation, integration guides, risk score methodology, ROI calculator, and compliance briefs for Trutina mortgage fraud detection.',
  alternates: { canonical: '/docs' },
}

interface DocEntry {
  href: string
  icon: React.ReactNode
  title: string
  desc: string
  audience: string
}

const ICON_PROPS = { className: 'w-5 h-5', style: { color: 'var(--ink-60)' } } as const

const GROUPS: { id: string; title: string; intent: string; entries: DocEntry[] }[] = [
  {
    id: 'sales',
    title: 'Sales artefacts',
    intent: 'For prospects, board calls, and procurement reviews.',
    entries: [
      {
        href: '/docs/one-pager',
        icon: <FileText {...ICON_PROPS} />,
        title: 'One-pager',
        desc: 'Leave-behind PDF summarising the fraud problem, what Trutina measures, and pricing.',
        audience: 'Prospects, meeting follow-ups',
      },
      {
        href: '/docs/pitch',
        icon: <Presentation {...ICON_PROPS} />,
        title: 'Pitch deck',
        desc: 'Eight slides covering the industry problem, the five detection modules, a live demo walkthrough, and pricing.',
        audience: 'Demo calls, board presentations',
      },
      {
        href: '/docs/roi',
        icon: <Calculator {...ICON_PROPS} />,
        title: 'ROI calculator',
        desc: 'Interactive calculator. Application volume + fraud rate in, annual savings out.',
        audience: 'Decision-makers, CFOs',
      },
    ],
  },
  {
    id: 'engineering',
    title: 'Engineering',
    intent: 'For LOS integration teams and engineering reviews.',
    entries: [
      {
        href: '/docs/quickstart',
        icon: <Zap {...ICON_PROPS} />,
        title: 'Quick-start guide',
        desc: 'Upload your first document and read the risk report in under five minutes.',
        audience: 'New customers, trial users',
      },
      {
        href: '/docs/integration',
        icon: <Code {...ICON_PROPS} />,
        title: 'API integration guide',
        desc: 'Webhook API reference. Base64 documents in, risk score out. Code samples in Python, Node.js, and C#.',
        audience: 'Engineering teams',
      },
    ],
  },
  {
    id: 'risk',
    title: 'Risk and compliance',
    intent: 'For credit analysts, CISOs, procurement, and regulators.',
    entries: [
      {
        href: '/docs/risk-scores',
        icon: <BarChart3 {...ICON_PROPS} />,
        title: 'Risk score guide',
        desc: 'How to read risk scores, the four severity tiers, and the recommended action for each.',
        audience: 'Credit analysts, compliance officers',
      },
      {
        href: '/docs/security',
        icon: <Shield {...ICON_PROPS} />,
        title: 'Security and privacy',
        desc: 'Data residency, encryption, retention windows, and the no-training-on-customer-data guarantee.',
        audience: 'CISOs, procurement, compliance',
      },
      {
        href: '/docs/compliance',
        icon: <Scale {...ICON_PROPS} />,
        title: 'APRA / ASIC compliance brief',
        desc: 'How explainable risk scoring meets APRA CPS 220, CPS 234, and ASIC RG 209 requirements.',
        audience: 'Compliance officers, regulators',
      },
    ],
  },
]

export default function DocsHub() {
  return (
    <div className="min-h-screen docs-page">
      <SiteHeader active="docs" />

      <main className="page" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <header style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 28, marginBottom: 40 }}>
          <div className="t-section" style={{ marginBottom: 10 }}>Documentation</div>
          <h1 style={{ fontSize: 44, lineHeight: 1.08, marginBottom: 14, maxWidth: 16 + 'ch', fontVariationSettings: '"opsz" 40' }}>
            Eight documents. Three audiences.
          </h1>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--ink-80)', lineHeight: 1.55, maxWidth: '56ch', fontVariationSettings: '"opsz" 16' }}>
            Everything you need to evaluate, integrate, and deploy Trutina. Each document is printable.
            Cmd-P (or Ctrl-P) on any page saves it as a regulator-ready PDF.
          </p>
        </header>

        {GROUPS.map(group => (
          <section key={group.id} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--rule-soft)' }}>
              <span className="t-section">{group.title}</span>
              <span className="t-caption" style={{ color: 'var(--ink-40)' }}>{group.intent}</span>
            </div>

            <div
              className={group.entries.length === 3 ? 'docs-group-grid docs-group-grid-3' : 'docs-group-grid docs-group-grid-2'}
              style={{
                gap: 0,
                borderTop: '1px solid var(--rule-soft)',
                borderLeft: '1px solid var(--rule-soft)',
              }}
            >
              {group.entries.map(d => (
                <Link
                  key={d.href}
                  href={d.href}
                  style={{
                    padding: '18px 20px 16px',
                    background: 'var(--bg-print-white)',
                    borderRight: '1px solid var(--rule-soft)',
                    borderBottom: '1px solid var(--rule-soft)',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    minHeight: 132,
                    transition: 'background var(--dur-fast) var(--ease)',
                  }}
                  className="doc-entry"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {d.icon}
                    <span className="t-subtitle" style={{ fontSize: 15 }}>{d.title}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink-60)', lineHeight: 1.5, margin: 0, flex: 1 }}>{d.desc}</p>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-40)', letterSpacing: '0.04em' }}>
                    {d.audience}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div style={{ marginTop: 48, padding: '20px 0', borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="t-caption">Need something else?</span>
          <a href="mailto:hello@trutina.com.au" className="mono" style={{ fontSize: 13, color: 'var(--accent)' }}>hello@trutina.com.au</a>
        </div>
      </main>

      <SiteFooter />

      {/* eslint-disable-next-line react/no-unknown-property */}
      <style>{`
        .doc-entry:hover {
          background: var(--paper-1) !important;
        }
        .doc-entry:hover .t-subtitle {
          color: var(--accent);
        }
      `}</style>
    </div>
  )
}
