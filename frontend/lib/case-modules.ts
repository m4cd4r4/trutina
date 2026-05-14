// Bridges the live FraudFlag / CaseDetail / Broker schema to the Claude
// Design system's module-drill / evidence-stub / broker-cadence UI.
// Decisions documented in docs/design/SCHEMA-MAPPING.md.
//
// Two rules govern this file:
//   1. Never fabricate data. Missing -> null, render as fallback.
//   2. Source of truth for category -> module mapping. No other file maps
//      categories to modules; everything imports from here.

import type {
  Case,
  CaseDetail,
  FlagCategory,
  FraudFlag,
  RiskLevel,
  Broker,
  DocumentSummary,
} from './types'

// ---------------------------------------------------------------------------
// Tier tokens
// ---------------------------------------------------------------------------

export type TierToken = 'crit' | 'high' | 'med' | 'low'

export function tierToken(level: RiskLevel | null | undefined): TierToken {
  if (level === 'critical') return 'crit'
  if (level === 'medium') return 'med'
  if (level === 'high') return 'high'
  return 'low'
}

const TIER_RANK: Record<TierToken, number> = { crit: 4, high: 3, med: 2, low: 1 }

export function maxTier(tiers: TierToken[]): TierToken {
  if (!tiers.length) return 'low'
  return tiers.reduce((best, t) => (TIER_RANK[t] > TIER_RANK[best] ? t : best), 'low' as TierToken)
}

// ---------------------------------------------------------------------------
// Module taxonomy
// ---------------------------------------------------------------------------

export type ModuleId =
  | 'producer_metadata'
  | 'identity_coherence'
  | 'income_arithmetic'
  | 'employer_verification'
  | 'network_clustering'

export interface ModuleDef {
  id: ModuleId
  name: string
  shortCode: string
}

export const MODULES: ModuleDef[] = [
  { id: 'producer_metadata',     name: 'Producer metadata',     shortCode: 'PM' },
  { id: 'identity_coherence',    name: 'Identity coherence',    shortCode: 'IC' },
  { id: 'income_arithmetic',     name: 'Income arithmetic',     shortCode: 'IA' },
  { id: 'employer_verification', name: 'Employer verification', shortCode: 'EV' },
  { id: 'network_clustering',    name: 'Network clustering',    shortCode: 'NC' },
]

// pdf_forensics + ai_content collapse into Producer metadata.
const CATEGORY_TO_MODULE: Record<FlagCategory, ModuleId> = {
  pdf_forensics:   'producer_metadata',
  ai_content:      'producer_metadata',
  identity:        'identity_coherence',
  consistency:     'income_arithmetic',
  cross_reference: 'employer_verification',
  broker_risk:     'network_clustering',
}

export function moduleForCategory(cat: FlagCategory): ModuleId {
  return CATEGORY_TO_MODULE[cat]
}

// ---------------------------------------------------------------------------
// Per-module aggregates derived from flag.weight + flag.severity
// ---------------------------------------------------------------------------

export interface ModuleAggregate {
  id: ModuleId
  name: string
  shortCode: string
  score: number          // sum(weight) clamped 0..100
  severity: TierToken    // max severity over flags in this module
  flagCount: number
  flags: FraudFlag[]
}

export function aggregateModules(flags: FraudFlag[]): ModuleAggregate[] {
  return MODULES.map(m => {
    const own = flags.filter(f => moduleForCategory(f.category) === m.id)
    const score = Math.min(100, own.reduce((s, f) => s + (f.weight ?? 0), 0))
    const severity = maxTier(own.map(f => tierToken(f.severity)))
    return {
      id: m.id,
      name: m.name,
      shortCode: m.shortCode,
      score,
      severity,
      flagCount: own.length,
      flags: own,
    }
  })
}

// ---------------------------------------------------------------------------
// Evidence-stub adapter
// ---------------------------------------------------------------------------

export interface EvidenceView {
  ruleId: string | null
  ruleDesc: string | null
  filename: string | null
  page: number | null
  pageCount: number | null
  sha256: string | null
  crop: { x: number; y: number; w: number; h: number } | null
  byteOffset: string | null
  firedAt: string | null
  firedMs: number | null
}

function readNumber(ev: Record<string, unknown>, key: string): number | null {
  const v = ev[key]
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

function readString(ev: Record<string, unknown>, key: string): string | null {
  const v = ev[key]
  return typeof v === 'string' && v.length > 0 ? v : null
}

function readCrop(ev: Record<string, unknown>): EvidenceView['crop'] {
  const raw = ev.crop
  if (!raw || typeof raw !== 'object') return null
  const c = raw as Record<string, unknown>
  const x = typeof c.x === 'number' ? c.x : null
  const y = typeof c.y === 'number' ? c.y : null
  const w = typeof c.w === 'number' ? c.w : null
  const h = typeof c.h === 'number' ? c.h : null
  if (x == null || y == null || w == null || h == null) return null
  return { x, y, w, h }
}

export function evidenceView(
  flag: FraudFlag,
  doc: DocumentSummary | null,
): EvidenceView {
  const ev = flag.evidence ?? {}
  return {
    ruleId: flag.code || null,
    ruleDesc: flag.description || null,
    filename: doc?.filename ?? null,
    page: readNumber(ev, 'page'),
    pageCount: doc?.page_count ?? null,
    sha256: readString(ev, 'sha256'),
    crop: readCrop(ev),
    byteOffset: readString(ev, 'byte_offset'),
    firedAt: readString(ev, 'fired_at'),
    firedMs: readNumber(ev, 'fired_ms'),
  }
}

export function citationBlock(
  caseRef: string,
  flag: FraudFlag,
  ev: EvidenceView,
): string {
  const lines: string[] = []
  lines.push(`Trutina case ${caseRef} . flag ${flag.id} . rule ${ev.ruleId ?? flag.code}`)
  if (ev.filename) {
    const sha = ev.sha256 ? ` . sha256:${ev.sha256}` : ''
    lines.push(`Source: ${ev.filename}${sha}`)
  }
  if (ev.page != null && ev.pageCount != null) {
    const off = ev.byteOffset ? ` . byte offset ${ev.byteOffset}` : ''
    lines.push(`Page ${ev.page} of ${ev.pageCount}${off}`)
  }
  if (ev.firedAt) {
    const ms = ev.firedMs != null ? ` . evaluated in ${ev.firedMs}ms` : ''
    lines.push(`Fired ${ev.firedAt}${ms}`)
  }
  if (ev.ruleDesc) lines.push(`Rule: ${ev.ruleDesc}`)
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Broker view adapters
// ---------------------------------------------------------------------------

export interface BrokerCadenceWeek {
  l: number
  m: number
  h: number
  c: number
}

export interface BrokerView {
  id: string
  name: string
  abn: string | null
  license: string | null
  submissionCount: number
  fraudFlagCount: number
  fraudRate: number | null    // 0..1 or null when submissionCount = 0
  fraudRateTier: TierToken
  riskScore: number
  firstSeenAt: string
  lastSeenAt: string
}

export function brokerView(b: Broker): BrokerView {
  const rate = b.submission_count > 0 ? b.fraud_flag_count / b.submission_count : null
  const tier: TierToken =
    rate == null     ? 'low' :
    rate > 0.04      ? 'crit' :
    rate > 0.025     ? 'high' :
    rate > 0.015     ? 'med' :
                       'low'
  return {
    id: b.id,
    name: b.broker_name,
    abn: b.broker_abn,
    license: b.broker_license,
    submissionCount: b.submission_count,
    fraudFlagCount: b.fraud_flag_count,
    fraudRate: rate,
    fraudRateTier: tier,
    riskScore: b.risk_score,
    firstSeenAt: b.first_seen_at,
    lastSeenAt: b.last_seen_at,
  }
}

/**
 * Bucket a list of broker-attached cases into 24 weekly tier breakdowns,
 * ending at `now`. Returns null when there is too little data to draw a
 * meaningful chart (<4 weeks of submissions).
 */
export function cadenceWeeks(
  cases: { submitted_at: string; risk_level: RiskLevel | null }[],
  weeks = 24,
  now: Date = new Date(),
): BrokerCadenceWeek[] | null {
  if (cases.length < 4) return null
  const MS_WEEK = 7 * 24 * 60 * 60 * 1000
  const buckets: BrokerCadenceWeek[] = Array.from({ length: weeks }, () => ({ l: 0, m: 0, h: 0, c: 0 }))
  const end = now.getTime()
  for (const c of cases) {
    const t = new Date(c.submitted_at).getTime()
    if (Number.isNaN(t)) continue
    const ageWeeks = Math.floor((end - t) / MS_WEEK)
    if (ageWeeks < 0 || ageWeeks >= weeks) continue
    const idx = weeks - 1 - ageWeeks
    const tk = tierToken(c.risk_level)
    if (tk === 'crit') buckets[idx].c += 1
    else if (tk === 'high') buckets[idx].h += 1
    else if (tk === 'med') buckets[idx].m += 1
    else buckets[idx].l += 1
  }
  return buckets
}

// ---------------------------------------------------------------------------
// Case-level conveniences
// ---------------------------------------------------------------------------

export function caseTierToken(c: Pick<Case, 'risk_level'>): TierToken {
  return tierToken(c.risk_level)
}

export function findDocForFlag(
  c: Pick<CaseDetail, 'documents'>,
  flag: FraudFlag,
): DocumentSummary | null {
  if (!flag.document_id) return null
  return c.documents.find(d => d.id === flag.document_id) ?? null
}
