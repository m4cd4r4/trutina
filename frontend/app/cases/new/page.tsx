'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import AppShell from '@/components/design/AppShell'

const DOC_TYPES = [
  { value: 'payslip', label: 'Payslip' },
  { value: 'bank_statement', label: 'Bank statement' },
  { value: 'employment_letter', label: 'Employer letter' },
  { value: 'tax_return', label: 'Tax return' },
  { value: 'id_document', label: 'ID document' },
  { value: 'other', label: 'Other' },
]

type Step = 'details' | 'upload' | 'analysing'

export default function NewCase() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('details')
  const [caseId, setCaseId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    applicant_name: '',
    loan_amount: '',
    property_address: '',
    broker_name: '',
    broker_abn: '',
  })

  const [uploads, setUploads] = useState<{ file: File; doc_type: string }[]>([])

  async function handleCreateCase(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const created = await api.cases.create({
        applicant_name: form.applicant_name || undefined,
        loan_amount: form.loan_amount ? Number(form.loan_amount) : undefined,
        property_address: form.property_address || undefined,
        broker_name: form.broker_name || undefined,
        broker_abn: form.broker_abn || undefined,
      })
      setCaseId(created.id)
      setStep('upload')
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleUploadAndAnalyse() {
    if (!caseId) return
    setLoading(true)
    setError('')
    try {
      const byType: Record<string, File[]> = {}
      for (const u of uploads) {
        if (!byType[u.doc_type]) byType[u.doc_type] = []
        byType[u.doc_type].push(u.file)
      }
      for (const [dt, files] of Object.entries(byType)) {
        await api.documents.upload(caseId, files, dt)
      }
      await api.cases.triggerAnalysis(caseId)
      setStep('analysing')

      const interval = setInterval(async () => {
        const status = await api.cases.pollStatus(caseId)
        if (status.status !== 'pending' && status.status !== 'processing') {
          clearInterval(interval)
          router.push(`/cases/${caseId}`)
        }
      }, 2000)
    } catch (err) {
      setError(String(err))
      setLoading(false)
    }
  }

  function addFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setUploads(prev => [...prev, ...files.map(f => ({ file: f, doc_type: 'payslip' }))])
    e.target.value = ''
  }

  return (
    <AppShell crumbs={[{ href: '/dashboard', label: 'Inbox' }, { label: 'New case' }]}>
      <div className="toolbar">
        <div className="tb-left">
          <span className="tb-title">New case</span>
          <span className="tb-count">{stepLabel(step)}</span>
        </div>
      </div>

      <div style={{ maxWidth: 640, marginTop: 18 }}>
        {step === 'details' && (
          <form onSubmit={handleCreateCase} style={CARD}>
            <h4 className="t-section" style={{ marginBottom: 14 }}>Case details</h4>

            {[
              { key: 'applicant_name', label: 'Applicant name', placeholder: 'A. R. (or redacted)' },
              { key: 'loan_amount', label: 'Loan amount (AUD)', placeholder: '750000', type: 'number' },
              { key: 'property_address', label: 'Property address', placeholder: '1 Example St, Perth WA 6000' },
              { key: 'broker_name', label: 'Broker name', placeholder: 'Pacific Finance Brokers' },
              { key: 'broker_abn', label: 'Broker ABN', placeholder: '12 345 678 901' },
            ].map(field => (
              <FormField key={field.key} label={field.label}>
                <input
                  type={field.type || 'text'}
                  value={(form as unknown as Record<string, string>)[field.key]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={INPUT}
                />
              </FormField>
            ))}

            {error && <p style={{ color: 'var(--risk-crit)', fontSize: 13, marginTop: 8 }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '10px 14px' }}>
              {loading ? 'Creating…' : 'Create case → upload documents'}
            </button>
          </form>
        )}

        {step === 'upload' && caseId && (
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <h4 className="t-section">Upload documents</h4>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-40)' }}>case {caseId.slice(0, 8)}…</span>
            </div>

            <label style={DROPZONE}>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={addFile} />
              <div style={{ fontSize: 13, color: 'var(--ink-80)' }}>Drop PDFs or images, or click to browse</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 4 }}>20MB per file max</div>
            </label>

            {uploads.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {uploads.map((u, i) => (
                  <div key={i} style={UPLOAD_ROW}>
                    <span style={{ fontSize: 12.5, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.file.name}</span>
                    <select
                      value={u.doc_type}
                      onChange={e => setUploads(prev => prev.map((p, j) => j === i ? { ...p, doc_type: e.target.value } : p))}
                      style={SELECT}
                    >
                      {DOC_TYPES.map(dt => (
                        <option key={dt.value} value={dt.value}>{dt.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setUploads(prev => prev.filter((_, j) => j !== i))}
                      type="button"
                      style={REMOVE_BTN}
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={QUOTA_NOTE}>
              <span className="mono" style={{ color: 'var(--accent)' }}>1 credit / analysis</span>
              <span className="dot-sep">.</span>
              <span style={{ color: 'var(--ink-60)' }}>Free trial includes 5 analyses</span>
              <span className="dot-sep">.</span>
              <a href="mailto:hello@trutina.com.au?subject=Trutina%20credits" style={{ color: 'var(--accent)' }}>Need more?</a>
            </div>

            {error && <p style={{ color: 'var(--risk-crit)', fontSize: 13, marginTop: 8 }}>{error}</p>}

            <button
              onClick={handleUploadAndAnalyse}
              disabled={uploads.length === 0 || loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '10px 14px' }}
              type="button"
            >
              {loading ? 'Uploading…' : `Analyse ${uploads.length} document${uploads.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        )}

        {step === 'analysing' && (
          <div style={{ ...CARD, textAlign: 'center', padding: '48px 24px' }}>
            <h4 className="t-section" style={{ marginBottom: 8 }}>Analysing documents</h4>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--ink-100)', lineHeight: 1.55, maxWidth: 380, margin: '0 auto 8px' }}>
              Running producer metadata, identity coherence, income arithmetic, employer verification, and network clustering rules.
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--ink-40)' }}>
              Typical verdict time 15–45s. Redirecting on completion.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function stepLabel(step: Step): string {
  if (step === 'details') return 'step 1 of 3 . case details'
  if (step === 'upload')  return 'step 2 of 3 . upload documents'
  return 'step 3 of 3 . analysing'
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label className="t-section" style={{ display: 'block', marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  )
}

const CARD: React.CSSProperties = {
  background: 'var(--bg-print-white)',
  border: '1px solid var(--ink-25)',
  padding: '20px 22px',
  boxShadow: 'var(--shadow-print)',
}

const INPUT: React.CSSProperties = {
  width: '100%',
  background: 'var(--paper-0)',
  border: '1px solid var(--ink-25)',
  borderRadius: 'var(--radius-1)',
  padding: '8px 11px',
  color: 'var(--ink-100)',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  outline: 'none',
}

const SELECT: React.CSSProperties = {
  ...INPUT, padding: '4px 8px', fontSize: 11.5, minWidth: 140, flexShrink: 0,
}

const REMOVE_BTN: React.CSSProperties = {
  background: 'none', border: '1px solid var(--ink-15)', color: 'var(--ink-60)',
  width: 22, height: 22, lineHeight: 1, fontSize: 15, cursor: 'pointer',
  borderRadius: 'var(--radius-1)', flexShrink: 0,
}

const DROPZONE: React.CSSProperties = {
  display: 'block', textAlign: 'center', cursor: 'pointer',
  border: '1px dashed var(--ink-25)', padding: '28px 16px',
  background: 'var(--paper-1)',
}

const UPLOAD_ROW: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  background: 'var(--paper-1)', border: '1px solid var(--rule-soft)',
  padding: '6px 10px',
}

const QUOTA_NOTE: React.CSSProperties = {
  marginTop: 12, padding: '10px 12px',
  background: 'var(--paper-2)', borderLeft: '2px solid var(--accent)',
  fontSize: 11.5, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap',
}
