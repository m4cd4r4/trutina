'use client'

import { useState } from 'react'
import AppShell from '@/components/design/AppShell'
import ModuleCard from '@/components/design/ModuleCard'
import EvidenceStub from '@/components/design/EvidenceStub'
import { RiskBadge, ScoreOnScale, RejectStamp } from '@/components/design/atoms'
import { aggregateModules, evidenceView, findDocForFlag, tierToken, type ModuleId } from '@/lib/case-modules'
import { FIXTURE_CASE } from '@/lib/styleguide-fixtures'

export default function StyleguideCaseDetail() {
  const c = FIXTURE_CASE
  // Pre-select Producer metadata so the drill state is visible in the screenshot.
  const [activeModule, setActiveModule] = useState<ModuleId | null>('producer_metadata')
  const [expandedFlag, setExpandedFlag] = useState<string | null>('F1')

  const t = tierToken(c.risk_level)
  const modules = aggregateModules(c.flags)
  const activeFlags = activeModule == null ? c.flags : modules.find(m => m.id === activeModule)?.flags ?? []
  const otherFlags = activeModule == null ? [] : c.flags.filter(f => !activeFlags.includes(f))

  return (
    <AppShell crumbs={[
      { href: '/dashboard', label: 'Inbox' },
      { label: c.reference },
    ]}>
      <header className={`case-header${t === 'crit' ? ' is-crit' : ''}`}>
        <div className="case-header-row">
          <div className="left">
            <div className="case-id">
              <span className="mono">{c.reference}</span>
              <span className="dot-sep">.</span>
              <span className="mono" style={{ color: 'var(--ink-100)' }}>{c.broker?.broker_name}</span>
            </div>
            <h2 className="title">Payslip does not reconcile to MYOB producer signature</h2>
            <div className="sub">
              Applicant {c.applicant_name} <span className="dot-sep">.</span>
              loan ${(c.loan_amount! / 1000).toFixed(1)}k <span className="dot-sep">.</span>
              submitted 2026-04-09 09:14 AEST
            </div>
          </div>
          <div className="score-stack">
            <RiskBadge tier={t} stark score={c.risk_score!} />
            <div style={{ marginTop: 4 }}>
              <span className="n tier-ink-crit">{c.risk_score}</span>
              <span className="of">/100</span>
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: -8 }}>{c.flags.length} flags</div>
          </div>
        </div>
        <div className="actions" style={{ marginTop: 18 }}>
          <button type="button" className="btn btn-primary">Confirm and reject</button>
          <button type="button" className="btn btn-secondary">Request originals</button>
          <button type="button" className="btn btn-secondary">Export packet (PDF)</button>
          <button type="button" className="btn btn-ghost" style={{ marginLeft: 'auto', color: 'var(--risk-crit)' }}>Escalate to APRA</button>
        </div>
        <div style={{ position: 'absolute', right: -8, top: -28, transform: 'rotate(-4deg) scale(0.85)', transformOrigin: 'top right', pointerEvents: 'none' }}>
          <RejectStamp tier="crit" sub={`${c.reference} . 2026-04-09`}>REJECT</RejectStamp>
        </div>
      </header>

      {/* Sticky status strip */}
      <div className="case-status">
        <div className="item"><span className="k">Status</span><span className="v">awaiting reviewer</span></div>
        <div className="item"><span className="k">Assigned</span><span className="v">M. Okafor</span></div>
        <div className="item"><span className="k">Age</span><span className="v mono warn">23h</span></div>
        <div className="item"><span className="k">Last activity</span><span className="v mono">4m ago</span></div>
        <div className="actions-overflow">
          <button type="button" className="btn btn-ghost btn-sm">Reassign</button>
          <button type="button" className="btn btn-ghost btn-sm">Watch</button>
        </div>
      </div>

      <div style={{ margin: '32px 0 8px' }}>
        <div className="t-section" style={{ marginBottom: 22 }}>Score on scale</div>
        <ScoreOnScale value={c.risk_score!} />
      </div>

      <div className="drill" style={{ marginTop: 36 }}>
        <div className="drill-head">
          <span className="t-section">Module breakdown</span>
          <span className="drill-hint">Showing flags from <b style={{ color: 'var(--ink-100)' }}>Producer metadata</b>.
            <button type="button" className="drill-clear" onClick={() => setActiveModule(null)}>Show all</button>
          </span>
        </div>
        <div className="modules-grid">
          {modules.map(m => (
            <ModuleCard
              key={m.id}
              module={m}
              isActive={activeModule === m.id}
              isMuted={activeModule != null && activeModule !== m.id}
              onClick={() => setActiveModule(activeModule === m.id ? null : m.id)}
            />
          ))}
        </div>
        <div className="drill-rule" aria-hidden="true">
          {activeModule != null ? (
            <span className="drill-rule-tab" style={{ left: `calc(${modules.findIndex(m => m.id === activeModule) * 20}% + 10%)` }} />
          ) : null}
        </div>
        <div className="flag-list">
          {activeFlags.map(f => {
            const doc = findDocForFlag(c, f)
            const ev = evidenceView(f, doc)
            const isOpen = expandedFlag === f.id
            const sevTier = tierToken(f.severity)
            return (
              <div key={f.id} className={`flag-row${isOpen ? ' is-open' : ''}`}>
                <div className="num">{f.id}</div>
                <button type="button" onClick={() => setExpandedFlag(isOpen ? null : f.id)} className="body" style={{ background: 'none', border: 0, padding: '2px 0 0', cursor: 'pointer', textAlign: 'left' }}>
                  <div className="ttl">{f.title}</div>
                  <div className="det">{f.description}</div>
                </button>
                <div className="module-tag">
                  <RiskBadge tier={sevTier} />
                  <div style={{ marginTop: 6 }}>{f.code}</div>
                  <button type="button" className="cite" onClick={() => setExpandedFlag(isOpen ? null : f.id)}>
                    {isOpen ? 'Hide source' : 'View source'}
                  </button>
                </div>
                {isOpen ? <EvidenceStub caseRef={c.reference} flag={f} ev={ev} /> : null}
              </div>
            )
          })}
          {otherFlags.length > 0 ? (
            <div className="other-flags">
              <div className="other-flags-head">
                <span>Flags in other modules</span>
                <span className="mono ct">{otherFlags.length}</span>
              </div>
              {otherFlags.map(f => {
                const sevTier = tierToken(f.severity)
                return (
                  <div key={f.id} className="flag-row is-muted">
                    <div className="num">{f.id}</div>
                    <div className="body">
                      <div className="ttl">{f.title}</div>
                      <div className="det">{f.description}</div>
                    </div>
                    <div className="module-tag">
                      <RiskBadge tier={sevTier} />
                      <div style={{ marginTop: 6 }}>{f.code}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  )
}
