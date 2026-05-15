'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, type ReactNode } from 'react'
import { Logo } from '@/components/Logo'

interface NavLink {
  href: string
  label: string
  section: 'work' | 'reference' | 'regulatory'
  count?: number
  pip?: boolean
}

interface Crumb {
  href?: string
  label: string
}

interface AppShellProps {
  crumbs: Crumb[]
  children: ReactNode
  navCounts?: {
    inbox?: number
    assigned?: number
    watching?: number
    brokers?: number
    crit?: number
  }
}

export default function AppShell({ crumbs, children, navCounts = {} }: AppShellProps) {
  const pathname = usePathname() ?? ''
  const [moreOpen, setMoreOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    if (!moreOpen && !searchOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMoreOpen(false); setSearchOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [moreOpen, searchOpen])

  // Workflow-keyed nav (Inbox / Assigned to me / Watching) takes the top of the
  // sidebar where action lives; population + regulatory reference views sit
  // below.
  const links: NavLink[] = [
    { href: '/dashboard',           label: 'Inbox',           section: 'work',       count: navCounts.inbox,    pip: (navCounts.crit ?? 0) > 0 },
    { href: '/dashboard?mine=1',    label: 'Assigned to me',  section: 'work',       count: navCounts.assigned },
    { href: '/dashboard?watch=1',   label: 'Watching',        section: 'work',       count: navCounts.watching },
    { href: '/brokers',             label: 'Brokers',         section: 'reference',  count: navCounts.brokers },
    { href: '/demo',                label: 'Specimens',       section: 'reference' },
    { href: '/audit',               label: 'Audit exports',   section: 'regulatory' },
  ]

  const sections: { id: NavLink['section']; title: string }[] = [
    { id: 'work',       title: 'Work' },
    { id: 'reference',  title: 'Reference' },
    { id: 'regulatory', title: 'Regulatory' },
  ]

  // Mobile bottom-bar: 4 tabs (Inbox · Brokers · Specimens · More).
  // The "More" tab opens a bottom sheet exposing Assigned / Watching /
  // Audit exports. Active state matches the route prefix.
  const isInbox = pathname === '/dashboard' || pathname.startsWith('/cases')
  const isBrokers = pathname.startsWith('/brokers')
  const isSpecimens = pathname.startsWith('/demo')
  // "More" is "active" only while its sheet is open; it does not own a route.

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo variant="mark" height={48} href="/dashboard" />
        </div>
        {sections.map(sec => {
          const items = links.filter(l => l.section === sec.id)
          if (!items.length) return null
          return (
            <div key={sec.id}>
              <div className="sidebar-section">{sec.title}</div>
              {items.map(l => {
                const active = pathname === l.href || pathname.startsWith(l.href + '/')
                return (
                  <Link key={l.href} href={l.href} className={`nav-item${active ? ' active' : ''}`}>
                    {l.label}
                    {l.pip ? <span className="pip" style={{ marginLeft: 'auto' }} /> : null}
                    {l.count != null ? (
                      <span className="count" style={{ marginLeft: l.pip ? 6 : 'auto' }}>{l.count}</span>
                    ) : null}
                  </Link>
                )
              })}
            </div>
          )
        })}
        <div className="sidebar-foot">
          v0.41 . evidence schema 2026.04
        </div>
      </aside>
      <main>
        <div className="topbar">
          <Link href="/dashboard" className="topbar-brand" aria-label="Trutina home">
            <Logo variant="mark" height={28} href="" />
          </Link>
          <div className="crumbs">
            {crumbs.map((c, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {i > 0 ? <span className="sep">/</span> : null}
                {i < crumbs.length - 1 && c.href
                  ? <Link href={c.href} style={{ color: 'inherit', textDecoration: 'none' }}>{c.label}</Link>
                  : <span className="cur">{c.label}</span>}
              </span>
            ))}
          </div>
          <div className="search">
            <input placeholder="Search case, broker, ABN, BSB, hash..." aria-label="Search" />
            <span className="kbd">/</span>
          </div>
          <button
            type="button"
            className="topbar-search-btn"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="10" cy="10" r="6" />
              <path d="m15 15 4 4" />
            </svg>
          </button>
        </div>
        <div className="content">{children}</div>
      </main>

      {/* Mobile fullscreen search overlay. Hidden via CSS above 1024px. */}
      <div className={`search-overlay${searchOpen ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!searchOpen}>
        <div className="search-overlay-head">
          <button type="button" className="search-overlay-close" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 6 10 10M16 6 6 16" />
            </svg>
          </button>
          <input
            type="search"
            className="search-overlay-input"
            placeholder="Search case, broker, ABN, BSB, hash..."
            aria-label="Search query"
            autoFocus={searchOpen}
          />
        </div>
        <div className="search-overlay-hint">
          Search is wired to the SaaS shell only on this portfolio build. In a deployment it queries the case index, broker registry, ABN lookups, and the SHA-256 ledger.
        </div>
      </div>

      {/* Mobile bottom-bar nav. Hidden via CSS above 1024px. */}
      <nav className="bottom-bar" aria-label="Primary mobile">
        <Link href="/dashboard" className={`bb-tab${isInbox ? ' is-active' : ''}`} aria-label="Inbox">
          <span className="bb-ico" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h16v10H3z"/><path d="M3 11h5l1 2h4l1-2h5"/></svg>
          </span>
          <span className="bb-label">Inbox</span>
          {(navCounts.crit ?? 0) > 0 ? <span className="bb-pip" aria-hidden="true" /> : null}
        </Link>
        <Link href="/brokers" className={`bb-tab${isBrokers ? ' is-active' : ''}`} aria-label="Brokers">
          <span className="bb-ico" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="7" r="3"/><path d="M4 19c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
          </span>
          <span className="bb-label">Brokers</span>
        </Link>
        <Link href="/demo" className={`bb-tab${isSpecimens ? ' is-active' : ''}`} aria-label="Specimens">
          <span className="bb-ico" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h9l4 4v12H5z"/><path d="M14 3v4h4"/><path d="M8 11h6M8 14h6"/></svg>
          </span>
          <span className="bb-label">Specimens</span>
        </Link>
        <button type="button" className={`bb-tab${moreOpen ? ' is-active' : ''}`} aria-label="More" aria-expanded={moreOpen} onClick={() => setMoreOpen(v => !v)}>
          <span className="bb-ico" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="11" r="1.2"/><circle cx="11" cy="11" r="1.2"/><circle cx="16" cy="11" r="1.2"/></svg>
          </span>
          <span className="bb-label">More</span>
        </button>
      </nav>

      {/* "More" sheet — slides up from bottom, exposes the secondary nav. */}
      <div className={`more-sheet${moreOpen ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="More navigation" aria-hidden={!moreOpen}>
        <div className="more-sheet-handle" aria-hidden="true" />
        <div className="more-sheet-section">Work</div>
        <Link href="/dashboard?mine=1" className="more-sheet-link" onClick={() => setMoreOpen(false)}>
          Assigned to me
          {navCounts.assigned != null ? <span className="count">{navCounts.assigned}</span> : null}
        </Link>
        <Link href="/dashboard?watch=1" className="more-sheet-link" onClick={() => setMoreOpen(false)}>
          Watching
          {navCounts.watching != null ? <span className="count">{navCounts.watching}</span> : null}
        </Link>
        <div className="more-sheet-section">Regulatory</div>
        <Link href="/audit" className="more-sheet-link" onClick={() => setMoreOpen(false)}>
          Audit exports
        </Link>
        <div className="more-sheet-foot">v0.41 · evidence schema 2026.04</div>
      </div>
      {moreOpen ? <div className="more-sheet-backdrop" onClick={() => setMoreOpen(false)} aria-hidden="true" /> : null}
    </div>
  )
}
