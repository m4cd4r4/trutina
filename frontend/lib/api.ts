import type { Broker, Case, CaseDetail } from './types'

// All API calls go through the Next.js proxy to keep the API key server-side
const BASE = ''

function getCsrfToken(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(?:^|;\s*)trutina_csrf=([^;]+)/)
  return match?.[1] ?? ''
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const isWrite = init?.method && init.method !== 'GET' && init.method !== 'HEAD'
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(isWrite ? { 'X-Csrf-Token': getCsrfToken() } : {}),
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
    list: (params?: { status?: string; risk_level?: string; limit?: number; search?: string }) => {
      const qs = new URLSearchParams()
      if (params?.status) qs.set('status', params.status)
      if (params?.risk_level) qs.set('risk_level', params.risk_level)
      if (params?.limit) qs.set('limit', String(params.limit))
      return req<Case[]>(`/api/proxy/cases?${qs}`)
    },
    get: (id: string) => req<CaseDetail>(`/api/proxy/cases/${id}`),
    create: (body: {
      applicant_name?: string
      loan_amount?: number
      property_address?: string
      broker_name?: string
      broker_abn?: string
    }) => req<Case>('/api/proxy/cases', { method: 'POST', body: JSON.stringify(body) }),
    triggerAnalysis: (id: string) =>
      req<{ job_id: string; status: string }>(`/api/proxy/cases/${id}/analyse`, { method: 'POST' }),
    pollStatus: (id: string) =>
      req<{ status: string; risk_score: number | null; risk_level: string | null }>(`/api/proxy/cases/${id}/analyse/status`),
    audit: (id: string) => req<unknown[]>(`/api/proxy/cases/${id}/audit`),
    patch: (id: string, body: { status?: string; notes?: string }) =>
      req<{ ok: boolean }>(`/api/proxy/cases/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  },

  documents: {
    upload: async (caseId: string, files: File[], docType: string) => {
      const form = new FormData()
      files.forEach(f => form.append('files', f))
      const res = await fetch(`/api/proxy/cases/${caseId}/documents?doc_type=${encodeURIComponent(docType)}`, {
        method: 'POST',
        headers: { 'X-Csrf-Token': getCsrfToken() },
        body: form,
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
  },

  brokers: {
    list: () => req<Broker[]>('/api/proxy/brokers'),
    get: (id: string) => req<Broker>(`/api/proxy/brokers/${id}`),
    cases: (id: string) => req<Case[]>(`/api/proxy/brokers/${id}/cases`),
  },
}
