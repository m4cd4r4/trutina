import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brokers',
  robots: { index: false, follow: false },
}

export default function BrokersLayout({ children }: { children: React.ReactNode }) {
  return children
}
