// Shared shell for /docs/* subpages.
// Emits the editorial scaffold (mirrors app/docs/page.tsx): .page container,
// forensic margin, serif heading, editorial tokens. No Tailwind dark utilities.
// NOTE: pitch/page.tsx is a fullscreen slide deck and is excluded.

import type { ReactNode } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/design/SiteHeader'
import SiteFooter from '@/components/design/SiteFooter'

interface DocShellProps {
  title: string
  intro?: string
  updated?: string
  children: ReactNode
}

export default function DocShell({ title, intro, updated, children }: DocShellProps) {
  return (
    <div className="min-h-screen docs-page">
      <SiteHeader active="docs" />

      <main className="page" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <header style={{ borderBottom: '1px solid var(--rule)', paddingBottom: 28, marginBottom: 40 }}>
          <Link
            href="/docs"
            className="t-section no-print"
            style={{ color: 'var(--ink-40)', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}
          >
            &larr; Back to Docs
          </Link>
          <h1 style={{ fontSize: 40, lineHeight: 1.1, marginBottom: intro ? 14 : 0, fontVariationSettings: '"opsz" 36', textWrap: 'balance' }}>
            {title}
          </h1>
          {intro ? (
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--ink-80)', lineHeight: 1.55, maxWidth: '62ch', fontVariationSettings: '"opsz" 16' }}>
              {intro}
            </p>
          ) : null}
        </header>

        {children}

        <div
          className="t-caption"
          style={{ marginTop: 56, paddingTop: 18, borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}
        >
          {updated ? <span>Last updated: {updated}</span> : <span />}
          <span>&copy; Trutina &mdash; AI Lending Fraud Detection</span>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
