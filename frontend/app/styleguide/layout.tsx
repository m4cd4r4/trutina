import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Style guide',
  robots: { index: false, follow: false },
}

/**
 * /styleguide/* is the visual-regression fixture surface. Each route
 * renders one of the six design-system reference screens against
 * synthetic data so Playwright can diff at a known viewport size.
 *
 * Reachable on production: noindex prevents search exposure, but the
 * routes are part of the portfolio artefact and visual-regression CI
 * runs against live URLs.
 */
export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
