import type { Broker, Case, CaseDetail } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'dev-key-change-in-prod'

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'X-Api-Key': API_KEY,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status}: ${body}`)
  }
  return res.json()
}

export const api = {
  cases: {
    list: (params?: { status?: string; risk_level?: string; limit?: number }) => {
      const qs = new URLSearchParams()
      if (params?.status) qs.set('status', params.status)
      if (params?.risk_level) qs.set('risk_level', params.risk_level)
      if (params?.limit) qs.set('limit', String(params.limit))
      return req<Case[]>(`/api/v1/cases?${qs}`)
    },
    get: (id: string) => req<CaseDetail>(`/api/v1/cases/${id}`),
    create: (body: {
      applicant_name?: string
      loan_amount?: number
      property_address?: string
      broker_name?: string
      broker_abn?: string
    }) => req<Case>('/api/v1/cases', { method: 'POST', body: JSON.stringify(body) }),
    triggerAnalysis: (id: string) =>
      req<{ job_id: string; status: string }>(`/api/v1/cases/${id}/analyse`, { method: 'POST' }),
    pollStatus: (id: string) =>
      req<{ status: string; risk_score: number | null; risk_level: string | null }>(`/api/v1/cases/${id}/analyse/status`),
    audit: (id: string) => req<unknown[]>(`/api/v1/cases/${id}/audit`),
  },

  documents: {
    upload: async (caseId: string, files: File[], docType: string) => {
      const form = new FormData()
      files.forEach(f => form.append('files', f))
      const res = await fetch(`${BASE}/api/v1/cases/${caseId}/documents?doc_type=${docType}`, {
        method: 'POST',
        headers: { 'X-Api-Key': API_KEY },
        body: form,
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
  },

  brokers: {
    list: () => req<Broker[]>('/api/v1/brokers'),
    get: (id: string) => req<Broker>(`/api/v1/brokers/${id}`),
    cases: (id: string) => req<Case[]>(`/api/v1/brokers/${id}/cases`),
  },
}
