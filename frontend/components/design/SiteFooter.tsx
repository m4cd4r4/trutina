import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page">
        <div className="row1">
          <div>
            <Logo variant="wordmark" height={32} href="" />
            <div className="t-caption" style={{ maxWidth: 320, color: 'var(--ink-60)', marginTop: 14 }}>
              Trutina. Mortgage fraud detection for Australian lenders. APRA CPG 234 aligned.
            </div>
          </div>
          <div>
            <h5>Product</h5>
            <ul>
              <li><Link href="/#methods">Methods</Link></li>
              <li><Link href="/demo">Specimens</Link></li>
              <li><Link href="/#integration">Integration</Link></li>
              <li><Link href="/#pricing">Pricing</Link></li>
              <li><Link href="/docs">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h5>Trust</h5>
            <ul>
              <li><a>Security (SOC 2 Type II)</a></li>
              <li><a>Data residency (AU)</a></li>
              <li><a>Privacy policy</a></li>
              <li><a>Information Security Manual</a></li>
              <li><a>Sub-processors</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="mailto:hello@trutina.com.au">Contact</a></li>
              <li><a>About</a></li>
              <li><a>Methods paper</a></li>
              <li><a>Press</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>(c) 2026 Trutina . Document fraud detection for Australian lenders</span>
          <span>hello@trutina.com.au</span>
        </div>
      </div>
    </footer>
  )
}
