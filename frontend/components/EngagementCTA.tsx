// Shared engagement CTA block. Two visual variants:
// - 'saas'      renders on the marketing landing (/.  Uses .engagement-cta + .engagement-sub classes.
// - 'editorial' renders on demo pages. Uses the inline-box layout with .btn .btn-primary + .btn-text.

export function EngagementCTA({ variant }: { variant: 'saas' | 'editorial' }) {
  if (variant === 'saas') {
    return (
      <>
        <a
          href="mailto:hello@trutina.com.au?subject=Trutina%20engagement%20enquiry"
          className="engagement-cta"
        >
          Email me about an engagement <span aria-hidden="true">→</span>
        </a>
        <p className="engagement-sub">
          Replies within 48 hours from Perth (AWST).
        </p>
      </>
    )
  }

  return (
    <div style={{ marginTop: 48, padding: 32, background: 'var(--paper-1)', border: '1px solid var(--rule)', textAlign: 'center' }}>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Assess against your portfolio</h2>
      <p style={{ color: 'var(--ink-60)', maxWidth: 480, margin: '0 auto 16px' }}>
        For Australian lenders, aggregators, and credit-risk teams. Source and methods paper available on request.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <a href="mailto:hello@trutina.com.au?subject=Trutina%20engagement%20enquiry" className="btn btn-primary">Email about an engagement</a>
        <a href="/methods-paper.pdf" target="_blank" rel="noopener" className="btn-text">Methods paper (PDF)</a>
      </div>
    </div>
  )
}
