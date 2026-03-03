import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cases',
  robots: { index: false, follow: false },
}

export default function CasesLayout({ children }: { children: React.ReactNode }) {
  return children
}
