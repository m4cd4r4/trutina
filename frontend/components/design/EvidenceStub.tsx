'use client'

import { useState } from 'react'
import type { FraudFlag } from '@/lib/types'
import { citationBlock, type EvidenceView } from '@/lib/case-modules'

interface EvidenceStubProps {
  caseRef: string
  flag: FraudFlag
  ev: EvidenceView
}

/**
 * Inline evidence panel that opens below a flag row. Renders only fields
 * that actually exist on the flag.evidence payload. No fabricated SHAs or
 * crop coordinates.
 *
 * The head (rule id + title) and foot (immutable ledger statement) always
 * render. The body splits into a crop preview + ledger when a crop and at
 * least one ledger field exist; otherwise the ledger takes full width.
 */
export default function EvidenceStub({ caseRef, flag, ev }: EvidenceStubProps) {
  const [copied, setCopied] = useState(false)
  const onCopy = () => {
    const block = citationBlock(caseRef, flag, ev)
    if (navigator.clipboard) navigator.clipboard.writeText(block).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  const hasLedger =
    ev.filename || ev.sha256 || ev.page != null || ev.byteOffset || ev.firedAt
  const hasCrop = ev.crop != null && ev.filename != null

  return (
    <div className="evidence-stub">
      <div className="es-head">
        <div className="es-head-left">
          {ev.ruleId ? <div className="es-rule-id">{ev.ruleId}</div> : null}
          <div>
            <div className="es-title">Source . {flag.title}</div>
            {ev.ruleDesc ? <div className="es-rule-desc">{ev.ruleDesc}</div> : null}
          </div>
        </div>
        <div className="es-head-right">
          <button
            type="button"
            className={`btn btn-secondary btn-sm${copied ? ' is-copied' : ''}`}
            onClick={onCopy}
          >
            {copied ? 'Citation copied' : 'Copy citation block'}
          </button>
        </div>
      </div>

      {hasLedger ? (
        <div className={`es-body${hasCrop ? '' : ' no-crop'}`}>
          {hasCrop && ev.crop && ev.filename ? (
            <CropPanel
              filename={ev.filename}
              page={ev.page}
              pageCount={ev.pageCount}
              crop={ev.crop}
              ruleId={ev.ruleId ?? flag.code}
            />
          ) : null}
          <Ledger ev={ev} flag={flag} />
        </div>
      ) : (
        <div className="es-body no-crop">
          <Ledger ev={ev} flag={flag} />
        </div>
      )}

      <div className="es-foot">
        <span className="mono" style={{ color: 'var(--ink-40)' }}>
          ledger entry {caseRef}.{flag.id}{ev.ruleId ? `.${ev.ruleId}` : ''} . immutable . retained 7y per APRA CPG 234
        </span>
      </div>
    </div>
  )
}

function CropPanel({
  filename, page, pageCount, crop, ruleId,
}: {
  filename: string
  page: number | null
  pageCount: number | null
  crop: { x: number; y: number; w: number; h: number }
  ruleId: string | null
}) {
  return (
    <div className="es-crop">
      <div className="es-crop-head">
        <span>Source page</span>
        <span className="mono src">
          {filename}{page != null ? ` . p.${page}${pageCount != null ? ` / ${pageCount}` : ''}` : ''}
        </span>
      </div>
      <div className="es-page" aria-hidden="true">
        <div className="es-page-rules">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={{ width: `${50 + ((i * 37) % 40)}%` }} />
          ))}
        </div>
        <div
          className="es-crop-box"
          style={{
            left:   `${crop.x * 100}%`,
            top:    `${crop.y * 100}%`,
            width:  `${crop.w * 100}%`,
            height: `${crop.h * 100}%`,
          }}
        >
          <span className="cr-corner tl" /><span className="cr-corner tr" />
          <span className="cr-corner bl" /><span className="cr-corner br" />
          <span className="cr-label">CROP{ruleId ? ` . rule ${ruleId}` : ''}</span>
        </div>
        <div className="es-page-ruler" aria-hidden="true">
          {Array.from({ length: 21 }).map((_, i) => (
            <span key={i} className={i % 5 === 0 ? 'major' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Ledger({ ev, flag }: { ev: EvidenceView; flag: FraudFlag }) {
  return (
    <div className="es-ledger">
      {ev.filename ? (
        <LedgerRow k="File" v={<span className="mono">{ev.filename}</span>} />
      ) : (
        <LedgerRow k="File" v={<span style={{ color: 'var(--ink-40)' }}>Source document not linked</span>} />
      )}
      {ev.sha256 ? <LedgerRow k="SHA-256" v={<span className="mono" style={{ fontSize: 11 }}>{ev.sha256}</span>} /> : null}
      {ev.page != null ? (
        <LedgerRow
          k="Page"
          v={<span className="mono">{ev.page}{ev.pageCount != null ? ` of ${ev.pageCount}` : ''}</span>}
        />
      ) : null}
      {ev.byteOffset ? <LedgerRow k="Byte offset" v={<span className="mono">{ev.byteOffset}</span>} /> : null}
      {ev.ruleId ? (
        <LedgerRow
          k="Rule fired"
          v={
            <span>
              <span className="mono">{ev.ruleId}</span>
              {ev.firedMs != null ? <span style={{ color: 'var(--ink-40)' }}> . evaluated in {ev.firedMs}ms</span> : null}
            </span>
          }
        />
      ) : null}
      {ev.firedAt ? <LedgerRow k="Timestamp" v={<span className="mono">{ev.firedAt}</span>} /> : null}
      <LedgerRow
        k="Decision"
        v={
          <span style={{ color: `var(--risk-${sevToTier(flag.severity)})`, fontWeight: 600 }}>
            FIRED . {flag.severity.toUpperCase()} . contributes weight {flag.weight}
          </span>
        }
      />
    </div>
  )
}

function LedgerRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="es-ledger-row">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  )
}

function sevToTier(sev: string): string {
  if (sev === 'critical') return 'crit'
  if (sev === 'medium') return 'med'
  if (sev === 'high') return 'high'
  return 'low'
}
