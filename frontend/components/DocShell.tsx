// Shared shell for /docs/* subpages.
// Standardises: root div, SiteHeader, container width (max-w-4xl),
// back-to-docs nav, h1, optional intro, footer, SiteFooter.
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
    <div className="min-h-screen docs-page print-page">
      <SiteHeader active="docs" />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="mb-10">
          <Link href="/docs" className="text-white/30 hover:text-white/50 text-xs uppercase tracking-wider transition no-print">
            Back to Docs
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">{title}</h1>
          {intro ? (
            <p className="text-white/50 max-w-2xl">{intro}</p>
          ) : null}
        </div>

        {children}

        <div className="mt-12 pt-6 border-t border-white/5 text-center text-white/20 text-xs">
          {updated ? <p>Last updated: {updated}</p> : null}
          <p className="mt-1">&copy; Trutina &mdash; AI Lending Fraud Detection</p>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
