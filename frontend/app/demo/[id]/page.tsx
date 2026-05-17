'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDemoCase } from '@/lib/demo-data'
import SiteHeader from '@/components/design/SiteHeader'
import SiteFooter from '@/components/design/SiteFooter'
import ModuleCard from '@/components/design/ModuleCard'
import EvidenceStub from '@/components/design/EvidenceStub'
import { RiskBadge, ScoreOnScale } from '@/components/design/atoms'
import {
  aggregateModules,
  evidenceView,
  findDocForFlag,
  tierToken,
  type ModuleId,
} from '@/lib/case-modules'
import type { FraudFlag } from '@/lib/types'
import { EngagementCTA } from '@/components/EngagementCTA'

export default function DemoCaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const c = getDemoCase(id)
  if (!c) notFound()

  const [activeModule, setActiveModule] = useState<ModuleId | null>(null)
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null)

  const t = tierToken(c.risk_level)
  const score = c.risk_score ?? 0
  const modules = aggregateModules(c.flags)
  const activeFlags = activeModule == null
    ? c.flags
    : modules.find(m => m.id === activeModule)?.flags ?? []
  const otherFlags = activeModule == null
    ? []
    : c.flags.filter(f => !activeFlags.includes(f))

  return (
    <>
      <SiteHeader active="demo" />

      <main className="page" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <div style={{ marginBottom: 12, fontSize: 12.5, color: 'var(--ink-60)' }}>
          <Link href="/demo" style={{ color: 'inherit', textDecoration: 'none' }}>Specimens</Link>
          <span className="dot-sep">/</span>
          <span style={{ color: 'var(--ink-100)' }}>{c.reference}</span>
        </div>

        <header className={`case-header${t === 'crit' ? ' is-crit' : ''}`}>
          <div className="case-header-row">
            <div className="left">
              <div className="case-id">
                <span className="mono">{c.reference}</span>
                {c.broker ? <>
                  <span className="dot-sep">.</span>
                  <span className="mono">{c.broker.broker_name}</span>
                </> : null}
              </div>
              <h2 className="title">{c.applicant_name}</h2>
              <div className="sub">{c.headline}</div>
            </div>
            <div className="score-stack">
              <RiskBadge tier={t} stark score={score} />
              <div style={{ marginTop: 4 }}>
                <span className="n" style={{ color: t === 'crit' ? 'var(--risk-crit)' : t === 'high' ? 'var(--risk-high)' : t === 'med' ? 'var(--risk-med)' : 'var(--ink-100)' }}>{score}</span>
                <span className="of">/100</span>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: -8 }}>{c.flags.length} flag{c.flags.length === 1 ? '' : 's'}</div>
            </div>
          </div>
        </header>

        <div style={{ margin: '32px 0 8px' }}>
          <div className="t-section" style={{ marginBottom: 22 }}>Score on scale</div>
          <ScoreOnScale value={score} />
        </div>

        <div style={{ marginTop: 32, padding: '12px 14px', background: 'var(--paper-1)', borderLeft: '2px solid var(--ink-25)', fontSize: 13, color: 'var(--ink-80)', lineHeight: 1.55, maxWidth: 780 }}>
          {c.summary}
        </div>

        <div className="drill" style={{ marginTop: 36 }}>
          <div className="drill-head">
            <span className="t-section">Module breakdown</span>
            <span className="drill-hint">
              {activeModule == null
                ? <>Click a module to filter the flag list.</>
                : <>Showing flags from <b style={{ color: 'var(--ink-100)' }}>{modules.find(m => m.id === activeModule)?.name}</b>.
                    <button type="button" className="drill-clear" onClick={() => setActiveModule(null)}>Show all</button>
                  </>}
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
              <span
                className="drill-rule-tab"
                style={{ left: `calc(${modules.findIndex(m => m.id === activeModule) * 20}% + 10%)` }}
              />
            ) : null}
          </div>

          <div className="flag-list">
            {activeFlags.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ink-40)', fontSize: 13 }}>
                No flags in this module.
              </div>
            ) : activeFlags.map(f => (
              <DemoFlagRow
                key={f.id}
                flag={f}
                caseRef={c.reference}
                doc={findDocForFlag(c, f)}
                isExpanded={expandedFlag === f.id}
                onToggle={() => setExpandedFlag(expandedFlag === f.id ? null : f.id)}
              />
            ))}

            {otherFlags.length > 0 ? (
              <div className="other-flags">
                <div className="other-flags-head">
                  <span>Flags in other modules</span>
                  <span className="mono ct">{otherFlags.length}</span>
                </div>
                {otherFlags.map(f => (
                  <DemoFlagRow
                    key={f.id}
                    flag={f}
                    caseRef={c.reference}
                    doc={findDocForFlag(c, f)}
                    isExpanded={expandedFlag === f.id}
                    muted
                    onToggle={() => setExpandedFlag(expandedFlag === f.id ? null : f.id)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <EngagementCTA variant="editorial" />

        <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--ink-40)', fontSize: 11 }}>
          All sample data is synthetic. No real applicant data shown.
        </div>
      </main>

      <SiteFooter />
    </>
  )
}

function DemoFlagRow({
  flag, caseRef, doc, isExpanded, muted = false, onToggle,
}: {
  flag: FraudFlag
  caseRef: string
  doc: ReturnType<typeof findDocForFlag>
  isExpanded: boolean
  muted?: boolean
  onToggle: () => void
}) {
  const ev = evidenceView(flag, doc)
  const sevTier = tierToken(flag.severity)
  return (
    <div className={`flag-row${isExpanded ? ' is-open' : ''}${muted ? ' is-muted' : ''}`}>
      <div className="num">{flag.id.slice(-2).toUpperCase()}</div>
      <button
        type="button"
        onClick={onToggle}
        className="body"
        style={{ background: 'none', border: 0, padding: '2px 0 0', cursor: 'pointer', textAlign: 'left' }}
      >
        <div className="ttl">{flag.title}</div>
        <div className="det">{flag.description}</div>
      </button>
      <div className="module-tag">
        <RiskBadge tier={sevTier} />
        <div style={{ marginTop: 6 }}>{flag.code}</div>
        <button type="button" className="cite" onClick={onToggle}>
          {isExpanded ? 'Hide source' : 'View source'}
        </button>
      </div>
      {isExpanded ? <EvidenceStub caseRef={caseRef} flag={flag} ev={ev} /> : null}
    </div>
  )
}
