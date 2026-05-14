'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Logo } from '@/components/Logo'

interface NavLink {
  href: string
  label: string
  section: 'today' | 'population' | 'regulatory' | 'demo'
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
    queue?: number
    cases?: number
    brokers?: number
    crit?: number
  }
}

export default function AppShell({ crumbs, children, navCounts = {} }: AppShellProps) {
  const pathname = usePathname() ?? ''
  const links: NavLink[] = [
    { href: '/dashboard', label: 'Queue',          section: 'today',      count: navCounts.queue,   pip: (navCounts.crit ?? 0) > 0 },
    { href: '/cases',     label: 'All cases',      section: 'today',      count: navCounts.cases },
    { href: '/brokers',   label: 'Brokers',        section: 'population', count: navCounts.brokers },
    { href: '/audit',     label: 'Audit exports',  section: 'regulatory' },
    { href: '/demo',      label: 'Specimens',      section: 'demo' },
  ]

  const sections: { id: NavLink['section']; title: string }[] = [
    { id: 'today',      title: 'Today' },
    { id: 'population', title: 'Population' },
    { id: 'regulatory', title: 'Regulatory' },
    { id: 'demo',       title: 'Demo' },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo variant="mark" height={32} href="/dashboard" />
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
        </div>
        <div className="content">{children}</div>
      </main>
    </div>
  )
}
