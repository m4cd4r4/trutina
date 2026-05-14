'use client'

import Link from 'next/link'
import { Logo } from '@/components/Logo'

interface SiteHeaderProps {
  active?: 'index' | 'methods' | 'demo' | 'integration' | 'pricing' | null
  onSignIn?: () => void
}

const NAV: { key: NonNullable<SiteHeaderProps['active']>; label: string; href: string }[] = [
  { key: 'methods',     label: 'Methods',     href: '/#methods' },
  { key: 'demo',        label: 'Specimens',   href: '/demo' },
  { key: 'integration', label: 'Integration', href: '/#integration' },
  { key: 'pricing',     label: 'Pricing',     href: '/#pricing' },
]

export default function SiteHeader({ active = 'index', onSignIn }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="inner">
        <Link href="/" className="brand">
          <Logo variant="wordmark" height={28} href="" />
        </Link>
        <nav>
          {NAV.map(n => (
            <Link key={n.key} href={n.href} className={active === n.key ? 'active' : ''}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="auth">
          <span className="filed">APRA CPG 234 ALIGNED</span>
          {onSignIn ? (
            <button type="button" className="signin" onClick={onSignIn}>Sign in</button>
          ) : (
            <Link href="/login" className="signin">Sign in</Link>
          )}
          <Link href="/demo" className="btn btn-secondary btn-sm">Open a specimen</Link>
        </div>
      </div>
    </header>
  )
}
