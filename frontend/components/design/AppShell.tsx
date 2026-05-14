'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
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
  // Workflow-keyed nav (Inbox / Assigned to me / Watching) takes the top of the
  // sidebar where action lives; population + regulatory reference views sit
  // below. Replaces the prior taxonomic Today / Population / Regulatory / Demo
  // grouping which read as a table of contents rather than a workflow surface.
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
