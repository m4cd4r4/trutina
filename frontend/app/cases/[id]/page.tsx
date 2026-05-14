'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { exportCasePDF } from '@/lib/export-pdf'
import type { CaseDetail } from '@/lib/types'
import AppShell from '@/components/design/AppShell'
import ModuleCard from '@/components/design/ModuleCard'
import EvidenceStub from '@/components/design/EvidenceStub'
import { RiskBadge, ScoreOnScale, RejectStamp } from '@/components/design/atoms'
import {
  aggregateModules,
  evidenceView,
  findDocForFlag,
  tierToken,
  type ModuleId,
} from '@/lib/case-modules'

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null)
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null)
  const [stampVisible, setStampVisible] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.cases.get(id).then(setCaseData).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!caseData) return
    const t = setTimeout(() => setStampVisible(true), 380)
    return () => clearTimeout(t)
  }, [caseData?.id])

  if (loading) {
    return (
      <AppShell crumbs={[{ href: '/dashboard', label: 'Inbox' }, { label: 'Loading…' }]}>
        <div style={{ padding: 64, textAlign: 'center', color: 'var(--ink-40)' }}>Loading case…</div>
      </AppShell>
    )
  }
  if (!caseData) {
    return (
      <AppShell crumbs={[{ href: '/dashboard', label: 'Inbox' }, { label: 'Not found' }]}>
        <div style={{ padding: 64, textAlign: 'center', color: 'var(--risk-crit)' }}>Case not found.</div>
      </AppShell>
    )
  }

  const t = tierToken(caseData.risk_level)
  const score = caseData.risk_score ?? 0
  const modules = aggregateModules(caseData.flags)
  const activeFlags = activeModule == null
    ? caseData.flags
    : caseData.flags.filter(f => {
        const mod = modules.find(m => m.id === activeModule)
        return mod?.flags.includes(f) ?? false
      })
  const otherFlags = activeModule == null
    ? []
    : caseData.flags.filter(f => !activeFlags.includes(f))

  const isAnalysed = caseData.status !== 'pending' && caseData.status !== 'processing'

  return (
    <AppShell crumbs={[
      { href: '/dashboard', label: 'Inbox' },
      { href: '/cases', label: 'Cases' },
      { label: caseData.reference },
    ]}>
      <header className={`case-header${t === 'crit' ? ' is-crit' : ''}`}>
        <div className="case-header-row">
          <div className="left">
            <div className="case-id">
              <span className="mono">{caseData.reference}</span>
              {caseData.broker ? <>
                <span className="dot-sep">.</span>
                <Link href={`/brokers`} className="mono" style={{ color: 'var(--accent)' }}>
                  {caseData.broker.broker_name}
                </Link>
              </> : null}
            </div>
            <h2 className="title">
              {caseData.applicant_name ?? 'Applicant redacted'}
            </h2>
            <div className="sub">
              {caseData.loan_amount != null ? <>Loan ${caseData.loan_amount.toLocaleString('en-AU')}<span className="dot-sep">.</span></> : null}
              Submitted {new Date(caseData.submitted_at).toLocaleString('en-AU')}
              {caseData.property_address ? <><span className="dot-sep">.</span>{caseData.property_address}</> : null}
            </div>
          </div>
          <div className="score-stack">
            <RiskBadge tier={t} stark score={score} />
            <div style={{ marginTop: 4 }}>
              <span className="n" style={{ color: t === 'crit' ? 'var(--risk-crit)' : t === 'high' ? 'var(--risk-high)' : 'var(--ink-100)' }}>{score}</span>
              <span className="of">/100</span>
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: -8 }}>
              {caseData.flags.length} flag{caseData.flags.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        {/* Action hierarchy: exactly ONE primary CTA per tier. The next
         * action that was previously also-filled (Escalate to APRA on
         * crit; Export PDF on med/high) drops to ghost-secondary so the
         * reviewer's eye lands on one move at a time. */}
        <div className="actions" style={{ marginTop: 18 }}>
          {isAnalysed && t === 'crit' && (
            <button type="button" className="btn btn-primary">Confirm and reject</button>
          )}
          {isAnalysed && (t === 'high' || t === 'med') && (
            <button type="button" className="btn btn-primary">Send to manual review</button>
          )}
          {isAnalysed && t === 'low' && (
            <button type="button" className="btn btn-primary">Approve</button>
          )}
          {isAnalysed && t !== 'low' && (
            <button type="button" className="btn btn-secondary">Request originals</button>
          )}
          {isAnalysed && (
            <button type="button" className="btn btn-secondary" onClick={() => exportCasePDF(caseData)}>
              Export packet (PDF)
            </button>
          )}
          {isAnalysed && t === 'crit' && (
            <button type="button" className="btn btn-ghost" style={{ marginLeft: 'auto', color: 'var(--risk-crit)' }}>Escalate to APRA</button>
          )}
        </div>

        {t === 'crit' ? (
          // Stamp sits in the top-right margin above the score-stack so it
          // reads as a document annotation, not an overprint that obscures
          // the 82/100 numeral.
          <div style={{
            position: 'absolute', right: -8, top: -28,
            opacity: stampVisible ? 1 : 0,
            transform: stampVisible ? 'rotate(-4deg) scale(0.85)' : 'rotate(-4deg) scale(0.78)',
            transformOrigin: 'top right',
            transition: 'opacity 280ms var(--ease), transform 280ms var(--ease)',
            pointerEvents: 'none',
          }}>
            <RejectStamp tier="crit" sub={`${caseData.reference} . ${new Date(caseData.submitted_at).toISOString().slice(0, 10)}`}>REJECT</RejectStamp>
          </div>
        ) : null}
      </header>

      {/* Sticky workflow status strip — fills the SaaS gap the editorial
       * case-header doesn't cover (assignee, age, last activity, SLA). */}
      <div className="case-status">
        <div className="item">
          <span className="k">Status</span>
          <span className="v">{caseData.status.replace('_', ' ')}</span>
        </div>
        <div className="item">
          <span className="k">Assigned</span>
          <span className="v">M. Okafor</span>
        </div>
        <div className="item">
          <span className="k">Age</span>
          <span className={`v mono${ageHoursLabel(caseData.submitted_at).warn ? ' warn' : ''}`}>{ageHoursLabel(caseData.submitted_at).label}</span>
        </div>
        <div className="item">
          <span className="k">Last activity</span>
          <span className="v mono">{lastActivityLabel(caseData.analysed_at ?? caseData.submitted_at)}</span>
        </div>
        <div className="actions-overflow">
          <button type="button" className="btn btn-ghost btn-sm">Reassign</button>
          <button type="button" className="btn btn-ghost btn-sm">Watch</button>
        </div>
      </div>

      {/* Calibration gauge */}
      <div style={{ margin: '32px 0 8px' }}>
        <div className="t-section" style={{ marginBottom: 22 }}>Score on scale</div>
        <ScoreOnScale value={score} />
      </div>

      {/* Drill */}
      <div className="drill" style={{ marginTop: 36 }}>
        <div className="drill-head">
          <span className="t-section">Module breakdown</span>
          <span className="drill-hint">
            {activeModule == null
              ? <>Select a module to filter the flag list below.</>
              : <>Showing flags from <b style={{ color: 'var(--ink-100)' }}>{modules.find(m => m.id === activeModule)?.name}</b>.
                  <button type="button" className="drill-clear" onClick={() => setActiveModule(null)}>Show all flags</button>
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
            <FlagRow
              key={f.id}
              flag={f}
              caseData={caseData}
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
                <FlagRow
                  key={f.id}
                  flag={f}
                  caseData={caseData}
                  isExpanded={expandedFlag === f.id}
                  muted
                  onToggle={() => setExpandedFlag(expandedFlag === f.id ? null : f.id)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {caseData.summary ? (
        <div style={{ marginTop: 36 }}>
          <div className="t-section" style={{ marginBottom: 8 }}>Reviewer summary</div>
          <p className="t-prose">{caseData.summary}</p>
        </div>
      ) : null}
    </AppShell>
  )
}

function FlagRow({
  flag, caseData, isExpanded, muted = false, onToggle,
}: {
  flag: CaseDetail['flags'][number]
  caseData: CaseDetail
  isExpanded: boolean
  muted?: boolean
  onToggle: () => void
}) {
  const doc = findDocForFlag(caseData, flag)
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
      {isExpanded ? <EvidenceStub caseRef={caseData.reference} flag={flag} ev={ev} /> : null}
    </div>
  )
}

// Age and last-activity helpers for the sticky status strip. The "warn"
// flag fires at 36h+ so cases approaching the implicit 48h review SLA
// surface in oxblood.
function ageHoursLabel(submittedAt: string): { label: string; warn: boolean } {
  const ms = Date.now() - new Date(submittedAt).getTime()
  const h = Math.floor(ms / 3_600_000)
  if (h < 1) return { label: `${Math.max(1, Math.floor(ms / 60_000))}m`, warn: false }
  if (h < 24) return { label: `${h}h`, warn: h >= 18 }
  const d = Math.floor(h / 24)
  return { label: `${d}d ${h % 24}h`, warn: true }
}

function lastActivityLabel(at: string): string {
  const ms = Date.now() - new Date(at).getTime()
  if (ms < 60_000) return 'just now'
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h ago`
  return `${Math.floor(ms / 86_400_000)}d ago`
}
