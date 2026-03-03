import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live Demo — See Fraud Detection in Action',
  description: 'Explore five pre-analysed loan applications demonstrating how Trutina catches AI-generated documents, invalid ABNs, forged bank statements, and suspicious broker patterns.',
  alternates: { canonical: '/demo' },
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}
