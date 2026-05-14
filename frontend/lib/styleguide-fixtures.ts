// Synthetic data fixtures for the /_styleguide routes used in visual
// regression testing. Ported and adapted from
//   I:/Scratch/trutina/design/Trutina Design System (2)/ui_kits/app/data.js
// Shaped to the live CaseDetail / Broker / FraudFlag types so the same
// components render against fixtures and real data without branching.

import type { CaseDetail, Broker, FraudFlag } from './types'

function flag(
  id: string,
  category: FraudFlag['category'],
  code: string,
  title: string,
  description: string,
  severity: FraudFlag['severity'],
  weight: number,
  evidence: Record<string, unknown> = {},
  document_id: string | null = null,
): FraudFlag {
  return { id, category, code, title, description, severity, weight, evidence, document_id }
}

// One richly-populated case for the case-detail screenshot diff.
export const FIXTURE_CASE: CaseDetail = {
  id: 'TRU-2026-04812',
  reference: 'TRU-2026-04812',
  applicant_name: 'A. R. (redacted)',
  loan_amount: 612500,
  status: 'complete',
  risk_score: 82,
  risk_level: 'critical',
  recommended_action: 'reject',
  submitted_at: '2026-04-09T09:14:22+10:00',
  analysed_at: '2026-04-09T09:14:31+10:00',
  property_address: '14 Banksia Drive, Cremorne NSW 2090',
  broker: {
    id: 'AGG-118-4421',
    broker_name: 'Helena Sandakov',
    broker_abn: '11 002 458 991',
    risk_score: 62,
  },
  document_count: 2,
  flag_counts: { critical: 3, high: 1, medium: 1, low: 0 },
  documents: [
    { id: 'd1', doc_type: 'payslip', filename: 'payslip-04812-westmark.pdf', status: 'analysed', page_count: 2 },
    { id: 'd2', doc_type: 'employer_letter', filename: 'employer-letter-04812-westmark.pdf', status: 'analysed', page_count: 1 },
  ],
  summary: 'Payslip producer signature matches three prior unrelated applications submitted through AGG-118-4421 within the last 60 days. Net pay does not equal gross minus PAYG (off by $47.20). PDF metadata identifies the producer as macOS Pages 13.2, not the asserted MYOB AccountRight.',
  flags: [
    flag('F1', 'pdf_forensics', 'PM-007',
      'Payslip producer signature seen on three prior unrelated applications',
      'All four applications cite different employers but share the same PDF producer fingerprint and embedded font subset hash.',
      'critical', 30,
      {
        sha256: '7f2a91c0d4e9b1a63a8e004cc721',
        page: 1,
        crop: { x: 0.04, y: 0.78, w: 0.92, h: 0.18 },
        byte_offset: '0x00008a4c - 0x00008b21',
        fired_at: '2026-04-09 09:14:31.412 AEST',
        fired_ms: 18,
      },
      'd1'),
    flag('F2', 'consistency', 'IA-002',
      'Net pay does not equal gross minus PAYG',
      'Off by $47.20. The super contribution is computed against ordinary time earnings minus salary sacrifice; expected base is OTE.',
      'critical', 25,
      {
        page: 1,
        crop: { x: 0.51, y: 0.34, w: 0.46, h: 0.22 },
        byte_offset: '0x0000414e - 0x000044d0',
        fired_at: '2026-04-09 09:14:31.488 AEST',
        fired_ms: 11,
      },
      'd1'),
    flag('F3', 'pdf_forensics', 'PM-002',
      'PDF object stream lacks the producer hash expected from MYOB AccountRight',
      'Employer payroll is asserted as MYOB AccountRight v2024.3. MYOB-emitted payslips include a producer hash beginning with /Producer (MYOB...). This file does not.',
      'high', 18,
      {
        page: 1,
        crop: { x: 0.00, y: 0.00, w: 1.00, h: 0.06 },
        byte_offset: '0x00000211 - 0x0000023f',
        fired_at: '2026-04-09 09:14:31.414 AEST',
        fired_ms: 4,
      },
      'd1'),
    flag('F4', 'broker_risk', 'NC-003',
      'Same employer ABN appears on five applications by this broker in 11 days',
      'Five applications cite Westmark Logistics Pty Ltd (ABN 51 824 753 556) between 2026-03-29 and 2026-04-09. Westmark is a 4-employee entity per ASIC.',
      'critical', 22,
      {
        sha256: '0c41dd9e2a6b884c9712',
        page: 1,
        crop: { x: 0.08, y: 0.18, w: 0.50, h: 0.08 },
        byte_offset: '0x00001a02 - 0x00001a3c',
        fired_at: '2026-04-09 09:14:31.521 AEST',
        fired_ms: 33,
      },
      'd2'),
    flag('F5', 'pdf_forensics', 'PM-011',
      'Submitted within 14 minutes of opening hours on a public holiday',
      'Application 04812 was lodged at 09:14 AEST on Easter Monday 2026. Westmark Logistics payroll runs Wednesdays; producer timestamp does not match the asserted payroll cycle.',
      'medium', 8,
      {
        page: 1,
        crop: { x: 0.04, y: 0.18, w: 0.40, h: 0.06 },
        byte_offset: '0x00000aa4 - 0x00000ad9',
        fired_at: '2026-04-09 09:14:31.456 AEST',
        fired_ms: 2,
      },
      'd1'),
  ],
}

// Sixty-case queue for the dashboard screenshot.
export const FIXTURE_QUEUE: CaseDetail[] = (() => {
  const brokers = [
    { id: 'AGG-118-4421', broker_name: 'Helena Sandakov',  broker_abn: '11 002 458 991', risk_score: 62 },
    { id: 'AGG-204-0117', broker_name: 'Marcus Whitlam',   broker_abn: '24 008 113 045', risk_score: 18 },
    { id: 'AGG-091-2240', broker_name: 'Priya Adwani',     broker_abn: '92 165 700 184', risk_score: 24 },
    { id: 'AGG-330-9912', broker_name: 'Dean Holroyd',     broker_abn: '63 011 522 880', risk_score: 4 },
    { id: 'AGG-118-7702', broker_name: 'Sienna Pereira',   broker_abn: '88 044 776 312', risk_score: 11 },
    { id: 'AGG-204-1855', broker_name: 'Jiang Wei',        broker_abn: '17 309 882 540', risk_score: 33 },
  ]
  const employerNames = ['Westmark Logistics Pty Ltd', 'Coles Group Limited', 'BlueScope Steel Limited', 'Hudson Civil Pty Ltd', 'Greenacre Childcare', 'Atlassian Pty Ltd']
  const TIER_PATTERN: ('critical' | 'high' | 'medium' | 'low')[] = ['low','low','low','low','medium','medium','medium','high','high','critical','critical','low']
  const startId = 4810
  return Array.from({ length: 60 }, (_, i) => {
    const tier = TIER_PATTERN[(i * 7 + 3) % TIER_PATTERN.length]
    const score = tier === 'low' ? 6 + (i % 8) : tier === 'medium' ? 30 + (i % 12) : tier === 'high' ? 55 + (i % 10) : 70 + (i % 14)
    const broker = brokers[i % brokers.length]
    const employerName = employerNames[i % employerNames.length]
    void employerName
    const hh = String(7 + Math.floor(i / 4)).padStart(2, '0')
    const mm = String((i * 13) % 60).padStart(2, '0')
    const submitted = `2026-04-09T${hh}:${mm}:00+10:00`
    const loan = 320000 + ((i * 47000) % 700000)
    const flagsCount = tier === 'low' ? 0 : tier === 'medium' ? 1 : tier === 'high' ? 3 : 5
    return {
      id: `TRU-2026-${String(startId + i).padStart(5, '0')}`,
      reference: `TRU-2026-${String(startId + i).padStart(5, '0')}`,
      applicant_name: 'A. R. (redacted)',
      loan_amount: loan,
      status: 'complete',
      risk_score: Math.min(99, score),
      risk_level: tier,
      recommended_action: tier === 'critical' ? 'reject' : tier === 'high' ? 'manual_review' : tier === 'medium' ? 'manual_review' : 'approve',
      submitted_at: submitted,
      analysed_at: submitted,
      property_address: null,
      broker,
      document_count: 2,
      flag_counts: {
        critical: tier === 'critical' ? Math.min(flagsCount, 3) : 0,
        high: tier === 'high' ? Math.min(flagsCount, 2) : tier === 'critical' ? 1 : 0,
        medium: tier === 'medium' ? 1 : tier === 'critical' ? 1 : 0,
        low: 0,
      },
      documents: [],
      flags: [],
      summary: null,
    } as CaseDetail
  })
})()

// Broker fixture for the broker page screenshot.
export const FIXTURE_BROKERS: Broker[] = [
  { id: 'AGG-118-4421', broker_name: 'Helena Sandakov',  broker_abn: '11 002 458 991', broker_license: '472003', submission_count: 84,  fraud_flag_count: 5, risk_score: 62, first_seen_at: '2022-08-14T00:00:00Z', last_seen_at: '2026-04-09T09:14:00Z' },
  { id: 'AGG-204-0117', broker_name: 'Marcus Whitlam',   broker_abn: '24 008 113 045', broker_license: '500128', submission_count: 211, fraud_flag_count: 4, risk_score: 18, first_seen_at: '2021-03-02T00:00:00Z', last_seen_at: '2026-04-08T16:45:00Z' },
  { id: 'AGG-091-2240', broker_name: 'Priya Adwani',     broker_abn: '92 165 700 184', broker_license: '481117', submission_count: 142, fraud_flag_count: 3, risk_score: 24, first_seen_at: '2020-11-19T00:00:00Z', last_seen_at: '2026-04-09T08:22:00Z' },
  { id: 'AGG-330-9912', broker_name: 'Dean Holroyd',     broker_abn: '63 011 522 880', broker_license: '465019', submission_count: 318, fraud_flag_count: 1, risk_score: 4,  first_seen_at: '2019-06-04T00:00:00Z', last_seen_at: '2026-04-09T07:55:00Z' },
  { id: 'AGG-118-7702', broker_name: 'Sienna Pereira',   broker_abn: '88 044 776 312', broker_license: '492700', submission_count: 92,  fraud_flag_count: 1, risk_score: 11, first_seen_at: '2023-01-22T00:00:00Z', last_seen_at: '2026-04-09T09:01:00Z' },
  { id: 'AGG-204-1855', broker_name: 'Jiang Wei',        broker_abn: '17 309 882 540', broker_license: '477844', submission_count: 67,  fraud_flag_count: 2, risk_score: 33, first_seen_at: '2022-05-30T00:00:00Z', last_seen_at: '2026-04-09T08:48:00Z' },
]
