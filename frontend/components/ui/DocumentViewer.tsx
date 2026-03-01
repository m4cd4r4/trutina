'use client'

import { useState } from 'react'
import { FileText, X, ExternalLink, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import type { DocumentSummary, FraudFlag } from '@/lib/types'

const DEMO_PDFS = new Set([
  'sharma_payslip_jan2026.pdf',
  'sharma_nab_dec2025.pdf',
  'kowalski_payslip_jan2026.pdf',
  'thompson_payslip_jan2026.pdf',
  'thompson_employment_letter.pdf',
  'chen_payslip_jan2026.pdf',
  'chen_cba_dec2025.pdf',
  'mitchell_payslip_jan2026.pdf',
])

const DOC_TYPE_LABELS: Record<string, string> = {
  payslip: 'Payslip',
  bank_statement: 'Bank Statement',
  employment_letter: 'Employment Letter',
  tax_return: 'Tax Return',
  id_document: 'ID Document',
}

interface Props {
  documents: DocumentSummary[]
  flags: FraudFlag[]
}

export default function DocumentViewer({ documents, flags }: Props) {
  const [activeDoc, setActiveDoc] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)

  const activeDocument = documents.find(d => d.id === activeDoc)
  const hasPdf = (filename: string) => DEMO_PDFS.has(filename)

  function getFlagsForDoc(docId: string) {
    return flags.filter(f => f.document_id === docId)
  }

  return (
    <div className="rounded-xl border border-white/10 mb-8 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)' }}>

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition"
      >
        <h2 className="text-white font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Source Documents
          <span className="text-white/30 text-sm font-normal ml-1">
            (click to view originals)
          </span>
        </h2>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-white/30" />
          : <ChevronDown className="w-4 h-4 text-white/30" />
        }
      </button>

      {expanded && (
        <div className="px-6 pb-6">
          {/* Document tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {documents.map(d => {
              const docFlags = getFlagsForDoc(d.id)
              const hasCritical = docFlags.some(f => f.severity === 'critical')
              const hasHigh = docFlags.some(f => f.severity === 'high')
              const isActive = activeDoc === d.id

              return (
                <button
                  key={d.id}
                  onClick={() => setActiveDoc(isActive ? null : d.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition border ${
                    isActive
                      ? 'bg-blue-500/15 border-blue-500/40 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{d.filename}</div>
                    <div className="text-xs opacity-60">
                      {DOC_TYPE_LABELS[d.doc_type] || d.doc_type}
                      {docFlags.length > 0 && (
                        <span className={`ml-2 ${hasCritical ? 'text-red-400' : hasHigh ? 'text-orange-400' : 'text-amber-400'}`}>
                          {docFlags.length} flag{docFlags.length !== 1 && 's'}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active document viewer */}
          {activeDocument && (
            <div className="space-y-3">
              {/* PDF embed or fallback */}
              {hasPdf(activeDocument.filename) ? (
                <div className="rounded-lg overflow-hidden border border-white/10 bg-white">
                  <iframe
                    src={`/demo-docs/${activeDocument.filename}`}
                    className="w-full"
                    style={{ height: '600px' }}
                    title={activeDocument.filename}
                  />
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
                    <span className="text-gray-500 text-xs">
                      {DOC_TYPE_LABELS[activeDocument.doc_type] || activeDocument.doc_type}
                      {' '}&middot;{' '}
                      {activeDocument.page_count} page{activeDocument.page_count !== 1 && 's'}
                    </span>
                    <a
                      href={`/demo-docs/${activeDocument.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 text-xs hover:text-blue-500 transition"
                    >
                      Open in new tab <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 p-8 text-center bg-white/5">
                  <FileText className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <div className="text-white/40 text-sm">
                    PDF preview not available for this demo document
                  </div>
                </div>
              )}

              {/* Flags for this document */}
              {getFlagsForDoc(activeDocument.id).length > 0 && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300 text-sm font-medium">
                      Flags detected in this document
                    </span>
                  </div>
                  <div className="space-y-2">
                    {getFlagsForDoc(activeDocument.id).map(f => (
                      <div key={f.id} className="flex items-start gap-2 text-sm">
                        <span className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                          f.severity === 'critical' ? 'bg-red-500' :
                          f.severity === 'high' ? 'bg-orange-500' :
                          f.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <div>
                          <span className="text-white/70">{f.title}</span>
                          <span className="text-white/30 ml-2 text-xs font-mono">{f.code}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prompt if no doc selected */}
          {!activeDoc && (
            <div className="rounded-lg border border-dashed border-white/10 p-6 text-center">
              <div className="text-white/30 text-sm">
                Select a document above to view the original PDF and see which fraud flags were detected in it
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
