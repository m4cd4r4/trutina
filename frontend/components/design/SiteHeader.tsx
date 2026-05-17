'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

interface SiteHeaderProps {
  active?: 'index' | 'methods' | 'demo' | 'api' | 'docs' | 'engagements' | null
  /** Retained for type-compat with existing call sites; no longer rendered. */
  onSignIn?: () => void
}

const NAV: { key: NonNullable<SiteHeaderProps['active']>; label: string; href: string }[] = [
  { key: 'methods',     label: 'Methods',     href: '/#methods' },
  { key: 'demo',        label: 'Specimens',   href: '/demo' },
  { key: 'api',         label: 'API',         href: '/docs/integration' },
  { key: 'docs',        label: 'Docs',        href: '/docs' },
  { key: 'engagements', label: 'Engagement',  href: '/#engagements' },
]

export default function SiteHeader({ active = 'index' }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close drawer on Escape; lock body scroll while open.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [menuOpen])

  return (
    <>
      <header className="site-header">
        <div className="inner">
          <Link href="/" className="brand">
            <Logo variant="wordmark" height={44} href="" />
          </Link>

          <nav className="nav-desktop" aria-label="Primary">
            {NAV.map(n => (
              <Link key={n.key} href={n.href} className={active === n.key ? 'active' : ''}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="auth">
            <span className="filed">APRA CPG 234 ALIGNED</span>
            <Link href="/demo" className="btn btn-secondary btn-sm hide-on-mobile">Open a specimen</Link>

            <button
              type="button"
              className="hamburger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              onClick={() => setMenuOpen(o => !o)}
            >
              <span className={`hamburger-bars${menuOpen ? ' is-open' : ''}`} aria-hidden="true">
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — sibling of <header> because the header has
          backdrop-filter which creates a containing block for fixed children. */}
      <div
        id="mobile-drawer"
        className={`mobile-drawer${menuOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!menuOpen}
      >
        <nav className="drawer-nav" aria-label="Primary mobile">
          {NAV.map(n => (
            <Link
              key={n.key}
              href={n.href}
              className={active === n.key ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="drawer-foot">
          <Link
            href="/demo"
            className="btn btn-primary"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            Open a specimen
          </Link>
          <a
            href="mailto:hello@trutina.com.au?subject=Trutina%20engagement%20enquiry"
            className="drawer-engage"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            hello@trutina.com.au
          </a>
        </div>
      </div>
      {menuOpen ? <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" /> : null}
    </>
  )
}
