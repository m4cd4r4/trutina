import jsPDF from 'jspdf'
import type { CaseDetail, FlagCategory, RiskLevel } from './types'

const CATEGORY_LABELS: Record<FlagCategory, string> = {
  pdf_forensics: 'PDF Forensics',
  ai_content: 'AI Content Detection',
  consistency: 'Math & Date Consistency',
  cross_reference: 'Cross-Reference Checks',
  broker_risk: 'Broker Risk',
  identity: 'Identity Verification',
}

const SEVERITY_ORDER: RiskLevel[] = ['critical', 'high', 'medium', 'low']

const RISK_COLORS: Record<RiskLevel, [number, number, number]> = {
  critical: [239, 68, 68],
  high: [249, 115, 22],
  medium: [245, 158, 11],
  low: [16, 185, 129],
}

const ACTION_LABELS: Record<string, string> = {
  approve: 'APPROVE',
  manual_review: 'MANUAL REVIEW REQUIRED',
  reject: 'REJECT — ESCALATE TO FRAUD TEAM',
}

export function exportCasePDF(c: CaseDetail) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pw = doc.internal.pageSize.getWidth()
  const margin = 15
  const cw = pw - margin * 2
  let y = margin

  const addPage = () => { doc.addPage(); y = margin }
  const checkPage = (need: number) => { if (y + need > 280) addPage() }

  // Header
  doc.setFillColor(10, 10, 26)
  doc.rect(0, 0, pw, 30, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text('Trutina', margin, 14)
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 180)
  doc.text('AI Lending Fraud Detection', margin, 20)
  doc.setFontSize(8)
  doc.text(`Case Report — ${c.reference}`, pw - margin, 14, { align: 'right' })
  doc.text(`Generated ${new Date().toLocaleString('en-AU')}`, pw - margin, 20, { align: 'right' })

  y = 38

  // Recommended action banner
  if (c.recommended_action) {
    const label = ACTION_LABELS[c.recommended_action] || c.recommended_action
    const color = c.recommended_action === 'approve' ? [16, 185, 129] :
      c.recommended_action === 'manual_review' ? [245, 158, 11] : [239, 68, 68]
    doc.setFillColor(color[0], color[1], color[2])
    doc.roundedRect(margin, y, cw, 10, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(label, pw / 2, y + 6.5, { align: 'center' })
    y += 16
  }

  // Risk score
  checkPage(30)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(40, 40, 60)
  doc.text('Risk Assessment', margin, y)
  y += 6
  const scoreStr = c.risk_score !== null ? String(c.risk_score) : '—'
  const riskColor = c.risk_level ? RISK_COLORS[c.risk_level] : [100, 100, 100]
  doc.setFontSize(28)
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2])
  doc.text(scoreStr, margin, y + 10)
  doc.setFontSize(10)
  doc.text(`/ 100`, margin + doc.getTextWidth(scoreStr) + 2, y + 10)
  if (c.risk_level) {
    doc.setFontSize(9)
    doc.text(c.risk_level.toUpperCase(), margin + doc.getTextWidth(scoreStr) + 18, y + 10)
  }
  y += 18

  // Case details table
  checkPage(50)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(40, 40, 60)
  doc.text('Case Details', margin, y)
  y += 6

  const details = [
    ['Reference', c.reference],
    ['Applicant', c.applicant_name || '—'],
    ['Loan Amount', c.loan_amount ? `$${c.loan_amount.toLocaleString()}` : '—'],
    ['Property', c.property_address || '—'],
    ['Broker', c.broker?.broker_name || '—'],
    ['Broker ABN', c.broker?.broker_abn || '—'],
    ['Submitted', new Date(c.submitted_at).toLocaleString('en-AU')],
    ['Analysed', c.analysed_at ? new Date(c.analysed_at).toLocaleString('en-AU') : '—'],
  ]

  for (const [label, value] of details) {
    checkPage(7)
    doc.setFillColor(y % 2 === 0 ? 248 : 255, y % 2 === 0 ? 248 : 255, y % 2 === 0 ? 252 : 255)
    doc.rect(margin, y - 3.5, cw, 6, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 140)
    doc.text(label, margin + 2, y)
    doc.setTextColor(40, 40, 60)
    doc.text(value, margin + 45, y)
    y += 6
  }
  y += 6

  // Flag summary
  checkPage(20)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(40, 40, 60)
  doc.text('Flag Summary', margin, y)
  y += 6

  for (const sev of SEVERITY_ORDER) {
    const count = c.flag_counts[sev] || 0
    const color = RISK_COLORS[sev]
    doc.setFillColor(color[0], color[1], color[2])
    doc.circle(margin + 3, y - 1, 1.5, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 60)
    doc.text(`${sev.charAt(0).toUpperCase() + sev.slice(1)}: ${count}`, margin + 8, y)
    y += 5
  }
  y += 4

  // Summary narrative
  if (c.summary) {
    checkPage(25)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 60)
    doc.text('Analysis Summary', margin, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 80)
    const lines = doc.splitTextToSize(c.summary, cw - 4)
    for (const line of lines) {
      checkPage(5)
      doc.text(line, margin + 2, y)
      y += 4.5
    }
    y += 6
  }

  // Documents
  if (c.documents.length > 0) {
    checkPage(20)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 60)
    doc.text('Documents Analysed', margin, y)
    y += 6
    for (const d of c.documents) {
      checkPage(6)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(60, 60, 80)
      doc.text(`• ${d.doc_type.replace(/_/g, ' ')} — ${d.filename} (${d.status})`, margin + 2, y)
      y += 5
    }
    y += 4
  }

  // Detailed flags by category
  const byCategory: Record<string, typeof c.flags> = {}
  for (const flag of c.flags) {
    if (!byCategory[flag.category]) byCategory[flag.category] = []
    byCategory[flag.category].push(flag)
  }
  for (const cat of Object.keys(byCategory)) {
    byCategory[cat].sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
  }

  if (c.flags.length > 0) {
    checkPage(15)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 60)
    doc.text(`Fraud Indicators (${c.flags.length})`, margin, y)
    y += 8

    for (const [cat, flags] of Object.entries(byCategory)) {
      checkPage(15)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 100)
      doc.text(CATEGORY_LABELS[cat as FlagCategory] || cat, margin, y)
      y += 6

      for (const flag of flags) {
        checkPage(20)
        const color = RISK_COLORS[flag.severity]
        doc.setFillColor(color[0], color[1], color[2])
        doc.circle(margin + 3, y - 1, 1.5, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(40, 40, 60)
        doc.text(`[${flag.severity.toUpperCase()}] ${flag.title}`, margin + 8, y)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7)
        doc.setTextColor(140, 140, 160)
        doc.text(flag.code, pw - margin, y, { align: 'right' })
        y += 5

        if (flag.description) {
          const descLines = doc.splitTextToSize(flag.description, cw - 12)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          doc.setTextColor(80, 80, 100)
          for (const line of descLines) {
            checkPage(4.5)
            doc.text(line, margin + 8, y)
            y += 4
          }
        }

        if (flag.evidence && Object.keys(flag.evidence).length > 0) {
          checkPage(8)
          doc.setFillColor(245, 245, 250)
          const evidenceStr = JSON.stringify(flag.evidence, null, 2)
          const evidenceLines = doc.splitTextToSize(evidenceStr, cw - 16)
          const blockH = evidenceLines.length * 3.5 + 4
          doc.roundedRect(margin + 8, y - 2, cw - 12, blockH, 1, 1, 'F')
          doc.setFont('courier', 'normal')
          doc.setFontSize(6.5)
          doc.setTextColor(100, 100, 120)
          for (const line of evidenceLines) {
            checkPage(4)
            doc.text(line, margin + 10, y + 1)
            y += 3.5
          }
          y += 4
        }
        y += 3
      }
      y += 4
    }
  }

  // Footer
  checkPage(15)
  y = Math.max(y, 270)
  doc.setDrawColor(200, 200, 220)
  doc.line(margin, y, pw - margin, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 170)
  doc.text('This report was generated by Trutina AI Lending Fraud Detection.', margin, y)
  doc.text('trutina.com.au', pw - margin, y, { align: 'right' })

  doc.save(`Trutina-${c.reference}.pdf`)
}
