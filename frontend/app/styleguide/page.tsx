'use client'

import Link from 'next/link'

/**
 * Styleguide index. Links to the six fixture routes that Playwright
 * diffs against design system screenshots.
 */
export default function StyleguideIndex() {
  const routes = [
    { href: '/styleguide/queue',        label: '01 . Queue (dashboard)',           diff: '01-queue.png' },
    { href: '/styleguide/case-detail',  label: '02 . Case detail with drill',      diff: '02-case-detail.png' },
    { href: '/styleguide/broker',       label: '03 . Broker profile',              diff: '03-broker.png' },
    { href: '/styleguide/audit',        label: '04 . Audit packet',                diff: '04-audit.png' },
    { href: '/styleguide/demo',         label: '05 . Demo specimens',              diff: '05-demo.png' },
    { href: '/styleguide/marketing',    label: '06 . Marketing landing',           diff: '06-marketing.png' },
    { href: '/styleguide/atoms',        label: 'Atoms (badges, gauge, modules, stamp)', diff: null },
  ]
  return (
    <main style={{ padding: 64, maxWidth: 720, margin: '0 auto' }}>
      <h1>Design system styleguide</h1>
      <p className="t-prose" style={{ marginTop: 12 }}>
        Each route below mounts a redesigned surface against synthetic data,
        for Playwright visual-regression against the reference screenshots in
        <code> design/Trutina Design System (2)/screenshots/</code>.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 32 }}>
        {routes.map(r => (
          <li key={r.href} style={{ padding: '10px 0', borderBottom: '1px solid var(--rule-soft)' }}>
            <Link href={r.href} style={{ color: 'var(--accent)' }}>{r.label}</Link>
            {r.diff ? <span className="mono derived" style={{ marginLeft: 14, fontSize: 11 }}>diff: {r.diff}</span> : null}
          </li>
        ))}
      </ul>
    </main>
  )
}
