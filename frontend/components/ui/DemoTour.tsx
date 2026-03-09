'use client'

import { useEffect, useState, useCallback } from 'react'
import { driver, type DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'

const CASE_DETAIL_STEPS: DriveStep[] = [
  {
    element: '[data-tour="score-gauge"]',
    popover: {
      title: 'Risk Score',
      description: 'Trutina calculates a composite score from 0-100 based on all flags detected. Green (0-19) = safe, amber (20-44) = review, orange (45-69) = elevated risk, red (70-100) = reject.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="case-header"]',
    popover: {
      title: 'Case Overview',
      description: 'Each case shows the applicant, loan amount, document count, and the broker who submitted it. All of this metadata is cross-referenced during analysis.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="recommended-action"]',
    popover: {
      title: 'Recommended Action',
      description: 'Based on the risk score and flag severity, Trutina recommends Approve, Manual Review, or Reject. This is an explainable recommendation — the bank makes the final call.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="analysis-summary"]',
    popover: {
      title: 'AI-Generated Summary',
      description: 'A plain-English narrative explaining what was found. Written for bank officers and auditors — meets ASIC/APRA explainability requirements.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="document-viewer"]',
    popover: {
      title: 'Source Documents',
      description: 'View the original uploaded documents alongside their fraud flags. Click any document to see the actual PDF that was analysed.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="fraud-flags"]',
    popover: {
      title: 'Fraud Flags',
      description: 'Every flag includes a severity level, detailed description, and specific evidence. Flags are grouped by detection module: PDF forensics, AI content, cross-reference, consistency, and broker risk.',
      side: 'top',
      align: 'center',
    },
  },
]

const CASE_LIST_STEPS: DriveStep[] = [
  {
    element: '[data-tour="demo-header"]',
    popover: {
      title: 'Welcome to the Trutina Demo',
      description: 'These are 5 pre-analysed mortgage applications showing how Trutina catches AI-generated documents, invalid ABNs, forged bank statements, and suspicious broker patterns.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="case-card-0"]',
    popover: {
      title: 'Clean Application',
      description: 'This legitimate application passes all checks with a low risk score. The green gauge means it can be approved through standard processing.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="case-card-1"]',
    popover: {
      title: 'AI-Generated Payslip',
      description: 'This is the critical case — an AI-fabricated payslip caught by multiple detection modules. The red gauge and "Reject" badge mean automatic escalation.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="case-card-4"]',
    popover: {
      title: 'Broker Network Pattern',
      description: 'Trutina tracks broker behaviour across all submissions. This case was flagged because the broker submitted 4 applications with the same employer in 7 days — a network clustering pattern.',
      side: 'top',
      align: 'start',
    },
  },
  {
    popover: {
      title: 'Try It Yourself',
      description: 'Click any case to see the full breakdown — risk score, source documents, and every fraud flag with evidence. All data is synthetic.',
    },
  },
]

const DASHBOARD_STEPS: DriveStep[] = [
  {
    element: '[data-tour="dash-stats"]',
    popover: {
      title: 'Your Overview',
      description: 'These stats update in real-time as you process cases. Track total submissions, high-risk flags, and your average risk score across all analyses.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="dash-credits"]',
    popover: {
      title: 'Trial Credits',
      description: 'Your free trial includes 5 document analyses. Each case submission uses one credit. Need more? Contact us to upgrade.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="dash-filters"]',
    popover: {
      title: 'Filter & Search',
      description: 'Filter cases by status (pending, complete, flagged) or risk level. Use the search bar to find specific applicants or case references.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="dash-cases"]',
    popover: {
      title: 'Case List',
      description: 'All your submitted cases appear here. Click any case reference to see the full fraud analysis report with risk score, flags, and recommended action.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="dash-new-case"]',
    popover: {
      title: 'Create a Case',
      description: 'Ready to analyse a loan application? Click here to upload documents — payslips, bank statements, or ID documents. Analysis takes about 60 seconds.',
      side: 'left',
      align: 'center',
    },
  },
]

interface Props {
  page: 'case-list' | 'case-detail' | 'dashboard'
}

export default function DemoTour({ page }: Props) {
  const [hasRun, setHasRun] = useState(false)
  const storageKey = `trutina-tour-${page}`

  const startTour = useCallback(() => {
    const steps = page === 'dashboard' ? DASHBOARD_STEPS : page === 'case-list' ? CASE_LIST_STEPS : CASE_DETAIL_STEPS
    const d = driver({
      showProgress: true,
      steps,
      nextBtnText: 'Next',
      prevBtnText: 'Back',
      doneBtnText: 'Got it',
      progressText: '{{current}} of {{total}}',
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      popoverClass: 'trutina-tour-popover',
      onDestroyStarted: () => {
        d.destroy()
        setHasRun(true)
        try { localStorage.setItem(storageKey, '1') } catch {}
      },
    })
    d.drive()
  }, [page, storageKey])

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey)) {
        setHasRun(true)
      }
    } catch {}
  }, [storageKey])

  return (
    <button
      onClick={startTour}
      className={`fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition flex items-center gap-2 ${
        hasRun
          ? 'bg-white/10 hover:bg-white/20 text-white/40 hover:text-white/70 text-xs px-3 py-1.5 border border-white/10'
          : 'bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-5 py-3 animate-pulse'
      }`}
    >
      <svg className={hasRun ? 'w-3 h-3' : 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {hasRun ? 'Tour' : 'Start Guided Tour'}
    </button>
  )
}
