'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ScanSearch, X } from 'lucide-react'
import { api } from '@/lib/api'

const DOC_TYPES = [
  { value: 'payslip', label: 'Payslip' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'employment_letter', label: 'Employment Letter' },
  { value: 'tax_return', label: 'Tax Return' },
  { value: 'id_document', label: 'ID Document' },
  { value: 'other', label: 'Other' },
]

export default function NewCase() {
  const router = useRouter()
  const [step, setStep] = useState<'details' | 'upload' | 'analysing'>('details')
  const [caseId, setCaseId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [form, setForm] = useState({
    applicant_name: '',
    loan_amount: '',
    property_address: '',
    broker_name: '',
    broker_abn: '',
  })

  // Upload state
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
      // Upload each document type group
      const byType: Record<string, File[]> = {}
      for (const u of uploads) {
        if (!byType[u.doc_type]) byType[u.doc_type] = []
        byType[u.doc_type].push(u.file)
      }
      for (const [dt, files] of Object.entries(byType)) {
        await api.documents.upload(caseId, files, dt)
      }

      // Trigger analysis
      await api.cases.triggerAnalysis(caseId)
      setStep('analysing')

      // Poll until complete
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
    <div className="min-h-screen bg-[#0a1210] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-white/40 hover:text-white/70 text-sm">Dashboard</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/70 text-sm">New Case</span>
        </div>

        <h1 className="text-xl font-bold mb-6">New Fraud Analysis Case</h1>

        {/* Step: Case Details */}
        {step === 'details' && (
          <form onSubmit={handleCreateCase}
            className="rounded-xl border border-white/10 p-6 space-y-4"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <h2 className="font-semibold text-white/80">Case Details</h2>
            {[
              { key: 'applicant_name', label: 'Applicant Name', placeholder: 'John Smith' },
              { key: 'loan_amount', label: 'Loan Amount (AUD)', placeholder: '750000', type: 'number' },
              { key: 'property_address', label: 'Property Address', placeholder: '1 Example St, Perth WA 6000' },
              { key: 'broker_name', label: 'Broker Name', placeholder: 'ABC Finance' },
              { key: 'broker_abn', label: 'Broker ABN', placeholder: '12 345 678 901' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  value={(form as any)[field.key]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50 transition text-sm"
                />
              </div>
            ))}

            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition">
              {loading ? 'Creating...' : 'Create Case & Upload Documents →'}
            </button>
          </form>
        )}

        {/* Step: Upload Documents */}
        {step === 'upload' && caseId && (
          <div className="rounded-xl border border-white/10 p-6 space-y-4"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white/80">Upload Documents</h2>
              <span className="text-xs text-emerald-400 font-mono">Case: {caseId.slice(0, 8)}…</span>
            </div>

            {/* Dropzone */}
            <label className="block border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-teal-500/50 transition">
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={addFile} />
              <div className="text-white/40 text-sm">Drop PDF/image files here or click to browse</div>
              <div className="text-white/20 text-xs mt-1">Max 20MB per file</div>
            </label>

            {/* Uploaded files */}
            {uploads.length > 0 && (
              <div className="space-y-2">
                {uploads.map((u, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-white/70 text-sm flex-1 truncate">{u.file.name}</span>
                    <select
                      value={u.doc_type}
                      onChange={e => setUploads(prev => prev.map((p, j) => j === i ? { ...p, doc_type: e.target.value } : p))}
                      className="bg-white/10 border border-white/10 rounded px-2 py-1 text-white/80 text-xs focus:outline-none"
                    >
                      {DOC_TYPES.map(dt => (
                        <option key={dt.value} value={dt.value}>{dt.label}</option>
                      ))}
                    </select>
                    <button onClick={() => setUploads(prev => prev.filter((_, j) => j !== i))}
                      className="text-white/30 hover:text-red-400 transition"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}

            {/* Credit quota note */}
            <div className="flex items-start gap-2.5 rounded-lg border border-teal-500/15 px-4 py-3"
              style={{ background: 'rgba(59,130,246,0.06)' }}>
              <span className="text-teal-400 text-sm mt-0.5">&#9889;</span>
              <div className="text-xs leading-relaxed">
                <span className="text-teal-300/80">Each analysis uses 1 credit from your trial.</span>
                <span className="text-white/30 mx-1">&middot;</span>
                <span className="text-white/40">Free trial includes 5 analyses.</span>
                <span className="text-white/30 mx-1">&middot;</span>
                <a href="mailto:hello@trutina.com.au?subject=Trutina%20%E2%80%94%20Credit%20Inquiry"
                  className="text-teal-400 hover:text-teal-300 transition">
                  Need more?
                </a>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleUploadAndAnalyse}
              disabled={uploads.length === 0 || loading}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Uploading...' : `Analyse ${uploads.length} document${uploads.length !== 1 ? 's' : ''} →`}
            </button>
          </div>
        )}

        {/* Step: Analysing */}
        {step === 'analysing' && (
          <div className="rounded-xl border border-white/10 p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <ScanSearch className="w-10 h-10 text-teal-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-lg font-semibold text-white mb-2">Analysing Documents</h2>
            <p className="text-white/40 text-sm">Running PDF forensics, AI detection, and cross-reference checks…</p>
            <p className="text-white/20 text-xs mt-2">This takes 15–45 seconds. Redirecting when complete.</p>
          </div>
        )}
      </div>
    </div>
  )
}
