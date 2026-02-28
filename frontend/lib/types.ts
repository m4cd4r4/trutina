export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type CaseStatus = 'pending' | 'processing' | 'complete' | 'failed' | 'flagged_for_review'
export type FlagCategory = 'pdf_forensics' | 'ai_content' | 'cross_reference' | 'consistency' | 'broker_risk' | 'identity'

export interface FlagCounts {
  critical: number
  high: number
  medium: number
  low: number
}

export interface BrokerSummary {
  id: string
  broker_name: string
  broker_abn: string | null
  risk_score: number
}

export interface FraudFlag {
  id: string
  category: FlagCategory
  code: string
  title: string
  description: string
  severity: RiskLevel
  weight: number
  evidence: Record<string, unknown>
  document_id: string | null
}

export interface DocumentSummary {
  id: string
  doc_type: string
  filename: string
  status: string
  page_count: number | null
}

export interface Case {
  id: string
  reference: string
  applicant_name: string | null
  loan_amount: number | null
  status: CaseStatus
  risk_score: number | null
  risk_level: RiskLevel | null
  recommended_action: 'approve' | 'manual_review' | 'reject' | null
  submitted_at: string
  analysed_at: string | null
  broker: BrokerSummary | null
  document_count: number
  flag_counts: FlagCounts
}

export interface CaseDetail extends Case {
  property_address: string | null
  summary: string | null
  documents: DocumentSummary[]
  flags: FraudFlag[]
}

export interface Broker {
  id: string
  broker_name: string
  broker_abn: string | null
  broker_license: string | null
  submission_count: number
  fraud_flag_count: number
  risk_score: number
  first_seen_at: string
  last_seen_at: string
}
