import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page">
        <div className="row1">
          <div>
            <Logo variant="wordmark" height={48} href="" />
            <div className="t-caption" style={{ maxWidth: 320, color: 'var(--ink-60)', marginTop: 14 }}>
              Trutina is an independent project by Macdara from Perth. A five-module rule engine for mortgage fraud, modelled on APRA CPG 234.
            </div>
          </div>
          <div>
            <h5>Artefact</h5>
            <ul>
              <li><Link href="/#methods">Methods</Link></li>
              <li><Link href="/demo">Specimens</Link></li>
              <li><Link href="/docs/integration">API</Link></li>
              <li><Link href="/docs">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h5>Provenance</h5>
            <ul>
              <li><a href="/methods-paper.pdf">Methods paper (PDF)</a></li>
              <li><a>Source: available on request</a></li>
              <li><a>Modelled on APRA CPG 234</a></li>
              <li><a>No data retention (not deployed)</a></li>
            </ul>
          </div>
          <div>
            <h5>Engagement</h5>
            <ul>
              <li><a href="mailto:hello@trutina.com.au?subject=Trutina%20engagement">Email Macdara</a></li>
              <li><Link href="/#engagements">Engagement shapes</Link></li>
              <li><a href="https://trutina.com.au">trutina.com.au</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>Built in Perth. Independent project by Macdara. Source available on request.</span>
          <span>hello@trutina.com.au</span>
        </div>
      </div>
    </footer>
  )
}
