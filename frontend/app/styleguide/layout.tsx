import { notFound } from 'next/navigation'
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
 * Hidden from production builds via the VERCEL_ENV check. In dev or
 * preview, the styleguide is reachable.
 */
export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === 'production') {
    notFound()
  }
  return <>{children}</>
}
