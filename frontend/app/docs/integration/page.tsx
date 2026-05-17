'use client'

import { useState } from 'react'
import Link from 'next/link'
import DocShell from '@/components/DocShell'

const CARD = { background: 'var(--bg-print-white)', border: '1px solid var(--rule-soft)' } as const

const CODE_SAMPLES = {
  python: {
    label: 'Python',
    code: `import requests, base64, json

API_URL = "https://your-instance.trutina.com.au/api/v1/webhooks/ingest"
API_KEY = "your-api-key"

with open("payslip.pdf", "rb") as f:
    doc_b64 = base64.b64encode(f.read()).decode()

response = requests.post(API_URL, json={
    "applicant_name": "John Smith",
    "loan_amount": 750000,
    "documents": [{
        "type": "payslip",
        "filename": "payslip.pdf",
        "content_base64": doc_b64
    }]
}, headers={"X-Api-Key": API_KEY})

result = response.json()
print(f"Risk: {result['risk_score']}/100 ({result['risk_level']})")
print(f"Action: {result['recommended_action']}")`,
  },
  nodejs: {
    label: 'Node.js',
    code: `const fs = require('fs');

const docB64 = fs.readFileSync('payslip.pdf').toString('base64');

const response = await fetch(
  'https://your-instance.trutina.com.au/api/v1/webhooks/ingest',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': 'your-api-key'
    },
    body: JSON.stringify({
      applicant_name: 'John Smith',
      loan_amount: 750000,
      documents: [{
        type: 'payslip',
        filename: 'payslip.pdf',
        content_base64: docB64
      }]
    })
  }
);

const result = await response.json();
console.log(\`Risk: \${result.risk_score}/100 (\${result.risk_level})\`);`,
  },
  csharp: {
    label: 'C#',
    code: `using var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-Api-Key", "your-api-key");

var docBytes = File.ReadAllBytes("payslip.pdf");
var payload = new {
    applicant_name = "John Smith",
    loan_amount = 750000,
    documents = new[] {
        new {
            type = "payslip",
            filename = "payslip.pdf",
            content_base64 = Convert.ToBase64String(docBytes)
        }
    }
};

var response = await client.PostAsync(
    "https://your-instance.trutina.com.au/api/v1/webhooks/ingest",
    new StringContent(
        JsonSerializer.Serialize(payload),
        Encoding.UTF8,
        "application/json"
    )
);
var result = await response.Content.ReadAsStringAsync();`,
  },
} as const

type TabKey = keyof typeof CODE_SAMPLES

const ERROR_CODES = [
  { status: '200', meaning: 'Analysis complete' },
  { status: '400', meaning: 'Invalid request (missing fields, invalid base64)' },
  { status: '401', meaning: 'Invalid or missing API key' },
  { status: '413', meaning: 'Document too large (max 20MB per document)' },
  { status: '429', meaning: 'Rate limit exceeded' },
  { status: '500', meaning: 'Internal error (retry with exponential backoff)' },
]

const RATE_LIMITS = [
  { plan: 'Starter', concurrent: '10', monthly: '200/month' },
  { plan: 'Professional', concurrent: '25', monthly: '1,000/month' },
  { plan: 'Enterprise', concurrent: 'Custom', monthly: 'Custom' },
]

const DOC_TYPES = [
  'payslip',
  'bank_statement',
  'employment_letter',
  'tax_return',
  'id_document',
  'other',
]

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 px-2 py-1 text-[10px] uppercase tracking-wider rounded transition opacity-0 group-hover:opacity-100 no-print"
        style={{ border: '1px solid var(--rule)', color: 'var(--ink-40)' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-80)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ink-25)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-40)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--rule)'
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre
        className="overflow-x-auto rounded-lg p-4 text-[13px] leading-relaxed font-mono"
        style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)', color: 'var(--ink-100)' }}
      >
        <code data-language={language}>{code}</code>
      </pre>
    </div>
  )
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-12 mb-4 pt-4 scroll-mt-24"
      style={{ marginBottom: 12, borderTop: '1px solid var(--rule-soft)' }}
    >
      {children}
    </h2>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="text-[13px] font-mono px-1.5 py-0.5 rounded"
      style={{ background: 'var(--paper-2)', color: 'var(--ink-100)' }}
    >
      {children}
    </code>
  )
}

export default function IntegrationGuide() {
  const [activeTab, setActiveTab] = useState<TabKey>('python')

  return (
    <DocShell
      title="API Integration Guide"
      intro="Technical reference for integrating Trutina's document analysis API into your loan origination system. One endpoint, base64 documents in, risk score out."
      active="api"
    >

          {/* Table of Contents */}
          <div
            className="rounded-xl p-5 mb-10 no-print"
            style={CARD}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ink-40)' }}>On this page</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-sm">
              {[
                ['overview', 'Overview'],
                ['authentication', 'Authentication'],
                ['request', 'Request Format'],
                ['response', 'Response Format'],
                ['code-samples', 'Code Samples'],
                ['errors', 'Error Codes'],
                ['rate-limits', 'Rate Limits'],
                ['webhooks', 'Webhooks'],
                ['support', 'Contact'],
              ].map(([id, label]) => (
                <a key={id} href={`#${id}`} style={{ color: 'var(--accent)' }} className="transition">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Overview */}
          <SectionHeading id="overview">Overview</SectionHeading>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--ink-60)' }}>
            <p>
              Trutina exposes a single webhook endpoint for document analysis.
              Submit one or more base64-encoded documents and receive a comprehensive risk assessment
              with individual flags, severity scores, and a recommended action.
            </p>
            <div
              className="rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              style={{ ...CARD }}
            >
              <span className="px-2.5 py-1 text-xs font-mono rounded shrink-0 w-fit" style={{ background: 'var(--accent-fill)', color: 'var(--accent-press)' }}>POST</span>
              <code className="text-sm font-mono break-all" style={{ color: 'var(--accent)' }}>/api/v1/webhooks/ingest</code>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="rounded-lg p-3" style={CARD}>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Authentication</p>
                <p className="text-sm" style={{ color: 'var(--ink-80)' }}><InlineCode>X-Api-Key</InlineCode> header</p>
              </div>
              <div className="rounded-lg p-3" style={CARD}>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Content Type</p>
                <p className="text-sm" style={{ color: 'var(--ink-80)' }}><InlineCode>application/json</InlineCode></p>
              </div>
              <div className="rounded-lg p-3" style={CARD}>
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--ink-40)' }}>Response Time</p>
                <p className="text-sm" style={{ color: 'var(--ink-80)' }}>~60 seconds (full analysis)</p>
              </div>
            </div>
          </div>

          {/* Authentication */}
          <SectionHeading id="authentication">Authentication</SectionHeading>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--ink-60)' }}>
            <p>
              All API requests must include your API key in the <InlineCode>X-Api-Key</InlineCode> header.
              API keys are issued when you sign up for a plan and can be rotated from your dashboard.
            </p>
            <CodeBlock
              language="http"
              code={`X-Api-Key: your-api-key-here
Content-Type: application/json`}
            />
            <div
              className="rounded-lg p-4 text-xs"
              style={{ background: 'var(--risk-med-fill)', border: '1px solid var(--risk-med-edge)', color: 'var(--ink-80)' }}
            >
              <strong style={{ color: 'var(--risk-med)' }}>Security note:</strong> Store your API key in environment variables or a secrets manager. Never commit API keys to source control.
            </div>
          </div>

          {/* Request Format */}
          <SectionHeading id="request">Request Format</SectionHeading>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--ink-60)' }}>
            <p>
              Submit an applicant&rsquo;s details along with one or more base64-encoded documents.
              Each document must specify a <InlineCode>type</InlineCode>, <InlineCode>filename</InlineCode>,
              and <InlineCode>content_base64</InlineCode>.
            </p>
            <CodeBlock
              language="json"
              code={`{
  "applicant_name": "John Smith",
  "loan_amount": 750000,
  "broker_abn": "12345678901",
  "documents": [
    {
      "type": "payslip",
      "filename": "payslip_jan2026.pdf",
      "content_base64": "JVBERi0xLjQK..."
    },
    {
      "type": "bank_statement",
      "filename": "statement_dec2025.pdf",
      "content_base64": "JVBERi0xLjQK..."
    }
  ]
}`}
            />

            <h3 className="font-semibold text-sm mt-6 mb-2" style={{ color: 'var(--ink-80)' }}>Document Types</h3>
            <div className="flex flex-wrap gap-2">
              {DOC_TYPES.map(t => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs font-mono rounded"
                  style={{ ...CARD, color: 'var(--ink-60)' }}
                >
                  {t}
                </span>
              ))}
            </div>

            <h3 className="font-semibold text-sm mt-6 mb-2" style={{ color: 'var(--ink-80)' }}>Field Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left" style={{ borderBottom: '1px solid var(--rule)' }}>
                    <th className="py-2 pr-4 font-medium" style={{ color: 'var(--ink-40)' }}>Field</th>
                    <th className="py-2 pr-4 font-medium" style={{ color: 'var(--ink-40)' }}>Type</th>
                    <th className="py-2 pr-4 font-medium" style={{ color: 'var(--ink-40)' }}>Required</th>
                    <th className="py-2 font-medium" style={{ color: 'var(--ink-40)' }}>Description</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--ink-60)' }}>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--accent)' }}>applicant_name</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Full name of the applicant</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--accent)' }}>loan_amount</td>
                    <td className="py-2 pr-4">number</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Loan amount in AUD (no decimals)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--accent)' }}>broker_abn</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">No</td>
                    <td className="py-2">11-digit ABN for broker risk profiling</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--accent)' }}>documents</td>
                    <td className="py-2 pr-4">array</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">One or more documents to analyse</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--accent)' }}>documents[].type</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">One of the supported document types</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--accent)' }}>documents[].filename</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Original filename (for logging)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--accent)' }}>documents[].content_base64</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Base64-encoded document content (max 20MB)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Response Format */}
          <SectionHeading id="response">Response Format</SectionHeading>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--ink-60)' }}>
            <p>
              A successful response includes a risk score (0-100), risk level, recommended action,
              and an array of individual flags with evidence.
            </p>
            <CodeBlock
              language="json"
              code={`{
  "case_id": "uuid",
  "reference": "TT-2026-00042",
  "risk_score": 82,
  "risk_level": "critical",
  "recommended_action": "reject",
  "flags": [
    {
      "category": "ai_content",
      "code": "AI_GENERATED_HIGH",
      "title": "High-confidence AI-generated content",
      "description": "Document exhibits statistical patterns consistent with large language model output, including uniform sentence structure and atypical font embedding.",
      "severity": "critical",
      "weight": 9
    }
  ],
  "summary": "High-confidence AI-generated document detected. PDF metadata indicates creation via an online generator with no print history. Employer ABN does not match ASIC records."
}`}
            />

            <h3 className="font-semibold text-sm mt-6 mb-2" style={{ color: 'var(--ink-80)' }}>Risk Levels</h3>
            {/* Risk-level grid: 5 named levels mapped to 4 risk tiers.
                clear (0-20)  -> risk-low
                low   (21-40) -> risk-low  (both sub-medium; collapsed per brief)
                medium (41-60) -> risk-med
                high  (61-80) -> risk-high
                critical (81-100) -> risk-crit */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { level: 'clear',  range: '0-20',  bg: 'var(--risk-low-fill)',  edge: 'var(--risk-low-edge)',  ink: 'var(--risk-low)' },
                { level: 'low',    range: '21-40', bg: 'var(--risk-low-fill)',  edge: 'var(--risk-low-edge)',  ink: 'var(--risk-low)' },
                { level: 'medium', range: '41-60', bg: 'var(--risk-med-fill)',  edge: 'var(--risk-med-edge)',  ink: 'var(--risk-med)' },
                { level: 'high',   range: '61-80', bg: 'var(--risk-high-fill)', edge: 'var(--risk-high-edge)', ink: 'var(--risk-high)' },
              ].map(r => (
                <div
                  key={r.level}
                  className="rounded-lg p-3 text-center"
                  style={{ background: r.bg, border: `1px solid ${r.edge}` }}
                >
                  <p className="text-sm font-semibold capitalize" style={{ color: r.ink }}>{r.level}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--ink-40)' }}>{r.range}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 mt-1">
              <div
                className="rounded-lg p-3 text-center"
                style={{ background: 'var(--risk-crit-fill)', border: '1px solid var(--risk-crit-edge)' }}
              >
                <p className="text-sm font-semibold" style={{ color: 'var(--risk-crit)' }}>Critical</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--ink-40)' }}>81-100 &mdash; reject or escalate immediately</p>
              </div>
            </div>

            <h3 className="font-semibold text-sm mt-6 mb-2" style={{ color: 'var(--ink-80)' }}>Recommended Actions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left" style={{ borderBottom: '1px solid var(--rule)' }}>
                    <th className="py-2 pr-4 font-medium" style={{ color: 'var(--ink-40)' }}>Action</th>
                    <th className="py-2 font-medium" style={{ color: 'var(--ink-40)' }}>Meaning</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--ink-60)' }}>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--risk-low)' }}>approve</td>
                    <td className="py-2">No flags detected, proceed normally</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--risk-med)' }}>review</td>
                    <td className="py-2">Minor flags, manual review recommended</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--risk-high)' }}>escalate</td>
                    <td className="py-2">Significant flags, escalate to fraud team</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--risk-crit)' }}>reject</td>
                    <td className="py-2">High-confidence fraud indicators detected</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Code Samples */}
          <SectionHeading id="code-samples">Code Samples</SectionHeading>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--ink-60)' }}>
            <p>
              Complete working examples for submitting a document and reading the result.
              Replace the API URL and key with your instance details.
            </p>

            {/* Tabs */}
            <div className="flex gap-0 no-print" style={{ borderBottom: '1px solid var(--rule)' }}>
              {(Object.keys(CODE_SAMPLES) as TabKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px"
                  style={
                    activeTab === key
                      ? { color: 'var(--accent)', borderColor: 'var(--accent)' }
                      : { color: 'var(--ink-40)', borderColor: 'transparent' }
                  }
                  onMouseEnter={e => {
                    if (activeTab !== key) {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-60)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeTab !== key) {
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-40)'
                    }
                  }}
                >
                  {CODE_SAMPLES[key].label}
                </button>
              ))}
            </div>

            <CodeBlock language={activeTab} code={CODE_SAMPLES[activeTab].code} />

            {/* Print: show all code samples */}
            <div className="hidden print:block space-y-4">
              {(Object.keys(CODE_SAMPLES) as TabKey[]).map(key => (
                <div key={key}>
                  <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--ink-80)' }}>{CODE_SAMPLES[key].label}</h4>
                  <CodeBlock language={key} code={CODE_SAMPLES[key].code} />
                </div>
              ))}
            </div>
          </div>

          {/* Error Codes */}
          <SectionHeading id="errors">Error Codes</SectionHeading>
          <div className="text-sm leading-relaxed" style={{ color: 'var(--ink-60)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ borderBottom: '1px solid var(--rule)' }}>
                    <th className="py-2.5 pr-6 font-medium" style={{ color: 'var(--ink-40)' }}>Status</th>
                    <th className="py-2.5 font-medium" style={{ color: 'var(--ink-40)' }}>Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {ERROR_CODES.map(e => (
                    <tr key={e.status} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                      <td className="py-2.5 pr-6">
                        <span
                          className="font-mono font-semibold"
                          style={{
                            color: e.status === '200' ? 'var(--risk-low)'
                              : e.status.startsWith('4') ? 'var(--risk-med)'
                              : 'var(--risk-crit)',
                          }}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="py-2.5" style={{ color: 'var(--ink-60)' }}>{e.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rate Limits */}
          <SectionHeading id="rate-limits">Rate Limits</SectionHeading>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--ink-60)' }}>
            <p>
              Rate limits are enforced per API key. Exceeding limits returns a <InlineCode>429</InlineCode> status code.
              Contact us if you need higher limits.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ borderBottom: '1px solid var(--rule)' }}>
                    <th className="py-2.5 pr-6 font-medium" style={{ color: 'var(--ink-40)' }}>Plan</th>
                    <th className="py-2.5 pr-6 font-medium" style={{ color: 'var(--ink-40)' }}>Concurrent</th>
                    <th className="py-2.5 font-medium" style={{ color: 'var(--ink-40)' }}>Monthly Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {RATE_LIMITS.map(r => (
                    <tr key={r.plan} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                      <td className="py-2.5 pr-6 font-medium" style={{ color: 'var(--ink-80)' }}>{r.plan}</td>
                      <td className="py-2.5 pr-6 font-mono" style={{ color: 'var(--ink-60)' }}>{r.concurrent}</td>
                      <td className="py-2.5 font-mono" style={{ color: 'var(--ink-60)' }}>{r.monthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Webhooks */}
          <SectionHeading id="webhooks">Webhooks (Optional)</SectionHeading>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--ink-60)' }}>
            <p>
              Instead of polling for results, configure a webhook URL in your dashboard to receive
              analysis results as soon as they are ready. Trutina will send a <InlineCode>POST</InlineCode> request
              to your webhook URL with the same response payload as the synchronous API.
            </p>
            <CodeBlock
              language="json"
              code={`// Webhook configuration (set in dashboard)
{
  "webhook_url": "https://your-system.com/webhooks/trutina",
  "webhook_secret": "your-webhook-signing-secret"
}

// Trutina sends POST to your URL with:
// Header:  X-Trutina-Signature: sha256=<HMAC of body>
// Body:    Same response format as synchronous API`}
            />
            <div
              className="rounded-lg p-4 text-xs"
              style={CARD}
            >
              <strong style={{ color: 'var(--ink-80)' }}>Verification:</strong>{' '}
              <span style={{ color: 'var(--ink-60)' }}>Validate the <InlineCode>X-Trutina-Signature</InlineCode> header
              by computing an HMAC-SHA256 of the raw request body using your webhook secret. Reject any requests with
              invalid signatures.</span>
            </div>
          </div>

          {/* Contact */}
          <SectionHeading id="support">Contact</SectionHeading>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--ink-60)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-xl p-5"
                style={CARD}
              >
                <h3 className="font-semibold mb-2" style={{ color: 'var(--ink-80)' }}>Email</h3>
                <a
                  href="mailto:hello@trutina.com.au?subject=Trutina%20engagement%20enquiry"
                  className="transition"
                  style={{ color: 'var(--accent)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-press)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)' }}
                >
                  hello@trutina.com.au
                </a>
                <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--ink-60)' }}>
                  Trutina is an independent portfolio project, not a subscription product.
                  No plans, no SLAs. Email for the methods paper, a walkthrough of the
                  worked specimens, or the source on request.
                </p>
              </div>
              <div
                className="rounded-xl p-5"
                style={CARD}
              >
                <h3 className="font-semibold mb-2" style={{ color: 'var(--ink-80)' }}>Engagement</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-60)' }}>
                  The integration shape documented here mirrors a real loan-origination
                  integration. To discuss applying the detection engine to your environment
                  (a review, a pilot, or a build), reach out and describe the use case.
                </p>
              </div>
            </div>
          </div>

    </DocShell>
  )
}
