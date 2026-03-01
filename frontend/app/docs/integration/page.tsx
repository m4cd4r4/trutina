'use client'

import { useState } from 'react'
import Link from 'next/link'

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
        className="absolute top-3 right-3 px-2 py-1 text-[10px] uppercase tracking-wider rounded border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition opacity-0 group-hover:opacity-100 no-print"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre
        className="overflow-x-auto rounded-lg p-4 text-[13px] leading-relaxed font-mono"
        style={{ background: 'rgba(0,0,0,0.4)' }}
      >
        <code className="text-white/80" data-language={language}>{code}</code>
      </pre>
    </div>
  )
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-bold mt-12 mb-4 pt-4 border-t border-white/5 scroll-mt-24">
      {children}
    </h2>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="text-[13px] font-mono px-1.5 py-0.5 rounded text-blue-300"
      style={{ background: 'rgba(59,130,246,0.1)' }}
    >
      {children}
    </code>
  )
}

export default function IntegrationGuide() {
  const [activeTab, setActiveTab] = useState<TabKey>('python')

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          pre { white-space: pre-wrap !important; word-break: break-all; }
        }
      `}</style>

      <div
        className="min-h-screen text-white"
        style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(30,27,75,0.9) 0%, #0a0a1a 50%)' }}
      >
        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/5 no-print">
          <Link href="/" className="text-xl font-bold">
            Tru<span className="text-blue-400">tina</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/docs" className="text-white/50 hover:text-white/80 text-sm transition">
              Docs
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          {/* Header */}
          <div className="mb-10">
            <Link href="/docs" className="text-white/30 hover:text-white/50 text-xs uppercase tracking-wider transition no-print">
              Documentation
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2 mb-3">API Integration Guide</h1>
            <p className="text-white/50 max-w-2xl">
              Technical reference for integrating Trutina&rsquo;s document analysis API into your loan origination system.
              One endpoint, base64 documents in, risk score out.
            </p>
          </div>

          {/* Table of Contents */}
          <div
            className="rounded-xl border border-white/10 p-5 mb-10 no-print"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">On this page</h2>
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
                ['support', 'Support'],
              ].map(([id, label]) => (
                <a key={id} href={`#${id}`} className="text-blue-400 hover:text-blue-300 transition">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Overview */}
          <SectionHeading id="overview">Overview</SectionHeading>
          <div className="text-white/60 text-sm leading-relaxed space-y-3">
            <p>
              Trutina exposes a single webhook endpoint for document analysis.
              Submit one or more base64-encoded documents and receive a comprehensive risk assessment
              with individual flags, severity scores, and a recommended action.
            </p>
            <div
              className="rounded-lg border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <span className="px-2.5 py-1 bg-emerald-600/30 text-emerald-300 text-xs font-mono rounded shrink-0 w-fit">POST</span>
              <code className="text-blue-300 text-sm font-mono break-all">/api/v1/webhooks/ingest</code>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="rounded-lg border border-white/10 p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Authentication</p>
                <p className="text-white/80 text-sm"><InlineCode>X-Api-Key</InlineCode> header</p>
              </div>
              <div className="rounded-lg border border-white/10 p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Content Type</p>
                <p className="text-white/80 text-sm"><InlineCode>application/json</InlineCode></p>
              </div>
              <div className="rounded-lg border border-white/10 p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Response Time</p>
                <p className="text-white/80 text-sm">~60 seconds (full analysis)</p>
              </div>
            </div>
          </div>

          {/* Authentication */}
          <SectionHeading id="authentication">Authentication</SectionHeading>
          <div className="text-white/60 text-sm leading-relaxed space-y-3">
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
              className="rounded-lg border border-amber-500/20 p-4 text-amber-200/80 text-xs"
              style={{ background: 'rgba(245,158,11,0.06)' }}
            >
              <strong>Security note:</strong> Store your API key in environment variables or a secrets manager. Never commit API keys to source control.
            </div>
          </div>

          {/* Request Format */}
          <SectionHeading id="request">Request Format</SectionHeading>
          <div className="text-white/60 text-sm leading-relaxed space-y-3">
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

            <h3 className="text-white/80 font-semibold text-sm mt-6 mb-2">Document Types</h3>
            <div className="flex flex-wrap gap-2">
              {DOC_TYPES.map(t => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs font-mono rounded border border-white/10 text-white/60"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {t}
                </span>
              ))}
            </div>

            <h3 className="text-white/80 font-semibold text-sm mt-6 mb-2">Field Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-2 pr-4 text-white/40 font-medium">Field</th>
                    <th className="py-2 pr-4 text-white/40 font-medium">Type</th>
                    <th className="py-2 pr-4 text-white/40 font-medium">Required</th>
                    <th className="py-2 text-white/40 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-blue-300">applicant_name</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Full name of the applicant</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-blue-300">loan_amount</td>
                    <td className="py-2 pr-4">number</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Loan amount in AUD (no decimals)</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-blue-300">broker_abn</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">No</td>
                    <td className="py-2">11-digit ABN for broker risk profiling</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-blue-300">documents</td>
                    <td className="py-2 pr-4">array</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">One or more documents to analyse</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-blue-300">documents[].type</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">One of the supported document types</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-blue-300">documents[].filename</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2 pr-4">Yes</td>
                    <td className="py-2">Original filename (for logging)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-blue-300">documents[].content_base64</td>
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
          <div className="text-white/60 text-sm leading-relaxed space-y-3">
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

            <h3 className="text-white/80 font-semibold text-sm mt-6 mb-2">Risk Levels</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { level: 'clear', range: '0-20', color: 'text-emerald-400', bg: 'rgba(16,185,129,0.08)' },
                { level: 'low', range: '21-40', color: 'text-blue-400', bg: 'rgba(59,130,246,0.08)' },
                { level: 'medium', range: '41-60', color: 'text-amber-400', bg: 'rgba(245,158,11,0.08)' },
                { level: 'high', range: '61-80', color: 'text-orange-400', bg: 'rgba(249,115,22,0.08)' },
              ].map(r => (
                <div
                  key={r.level}
                  className="rounded-lg border border-white/10 p-3 text-center"
                  style={{ background: r.bg }}
                >
                  <p className={`text-sm font-semibold capitalize ${r.color}`}>{r.level}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{r.range}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 mt-1">
              <div
                className="rounded-lg border border-red-500/20 p-3 text-center"
                style={{ background: 'rgba(239,68,68,0.08)' }}
              >
                <p className="text-sm font-semibold text-red-400">Critical</p>
                <p className="text-[10px] text-white/30 mt-0.5">81-100 &mdash; reject or escalate immediately</p>
              </div>
            </div>

            <h3 className="text-white/80 font-semibold text-sm mt-6 mb-2">Recommended Actions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-2 pr-4 text-white/40 font-medium">Action</th>
                    <th className="py-2 text-white/40 font-medium">Meaning</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-emerald-400">approve</td>
                    <td className="py-2">No flags detected, proceed normally</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-amber-400">review</td>
                    <td className="py-2">Minor flags, manual review recommended</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-orange-400">escalate</td>
                    <td className="py-2">Significant flags, escalate to fraud team</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-red-400">reject</td>
                    <td className="py-2">High-confidence fraud indicators detected</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Code Samples */}
          <SectionHeading id="code-samples">Code Samples</SectionHeading>
          <div className="text-white/60 text-sm leading-relaxed space-y-3">
            <p>
              Complete working examples for submitting a document and reading the result.
              Replace the API URL and key with your instance details.
            </p>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-white/10 no-print">
              {(Object.keys(CODE_SAMPLES) as TabKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
                    activeTab === key
                      ? 'text-blue-400 border-blue-400'
                      : 'text-white/40 border-transparent hover:text-white/60'
                  }`}
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
                  <h4 className="text-white/80 font-semibold text-sm mb-2">{CODE_SAMPLES[key].label}</h4>
                  <CodeBlock language={key} code={CODE_SAMPLES[key].code} />
                </div>
              ))}
            </div>
          </div>

          {/* Error Codes */}
          <SectionHeading id="errors">Error Codes</SectionHeading>
          <div className="text-white/60 text-sm leading-relaxed">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-2.5 pr-6 text-white/40 font-medium">Status</th>
                    <th className="py-2.5 text-white/40 font-medium">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {ERROR_CODES.map(e => (
                    <tr key={e.status} className="border-b border-white/5">
                      <td className="py-2.5 pr-6">
                        <span
                          className={`font-mono font-semibold ${
                            e.status === '200' ? 'text-emerald-400'
                            : e.status.startsWith('4') ? 'text-amber-400'
                            : 'text-red-400'
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-white/60">{e.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rate Limits */}
          <SectionHeading id="rate-limits">Rate Limits</SectionHeading>
          <div className="text-white/60 text-sm leading-relaxed space-y-3">
            <p>
              Rate limits are enforced per API key. Exceeding limits returns a <InlineCode>429</InlineCode> status code.
              Contact us if you need higher limits.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-2.5 pr-6 text-white/40 font-medium">Plan</th>
                    <th className="py-2.5 pr-6 text-white/40 font-medium">Concurrent</th>
                    <th className="py-2.5 text-white/40 font-medium">Monthly Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {RATE_LIMITS.map(r => (
                    <tr key={r.plan} className="border-b border-white/5">
                      <td className="py-2.5 pr-6 text-white/80 font-medium">{r.plan}</td>
                      <td className="py-2.5 pr-6 font-mono text-white/60">{r.concurrent}</td>
                      <td className="py-2.5 font-mono text-white/60">{r.monthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Webhooks */}
          <SectionHeading id="webhooks">Webhooks (Optional)</SectionHeading>
          <div className="text-white/60 text-sm leading-relaxed space-y-3">
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
              className="rounded-lg border border-white/10 p-4 text-white/50 text-xs"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <strong className="text-white/70">Verification:</strong> Validate the <InlineCode>X-Trutina-Signature</InlineCode> header
              by computing an HMAC-SHA256 of the raw request body using your webhook secret. Reject any requests with
              invalid signatures.
            </div>
          </div>

          {/* Support */}
          <SectionHeading id="support">Support</SectionHeading>
          <div className="text-white/60 text-sm leading-relaxed space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-xl border border-white/10 p-5"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <h3 className="text-white/80 font-semibold mb-2">Email Support</h3>
                <a href="mailto:hello@trutina.com.au" className="text-blue-400 hover:text-blue-300 transition">
                  hello@trutina.com.au
                </a>
                <div className="mt-3 text-xs text-white/40 space-y-1">
                  <p>Starter: response within 24 hours</p>
                  <p>Professional: response within 4 hours</p>
                  <p>Enterprise: response within 1 hour</p>
                </div>
              </div>
              <div
                className="rounded-xl border border-white/10 p-5"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <h3 className="text-white/80 font-semibold mb-2">Integration Help</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  Professional and Enterprise plans include dedicated integration support.
                  We can join your Slack, provide sandbox environments, and assist with
                  UAT testing against your loan origination system.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-14 pt-6 border-t border-white/5 text-center text-white/20 text-xs">
            <p>&copy; {new Date().getFullYear()} Trutina &mdash; AI Mortgage Fraud Detection</p>
            <p className="mt-1">
              <Link href="/docs" className="text-blue-400 hover:text-blue-300 transition">All documentation</Link>
              {' '}&middot;{' '}
              <a href="mailto:hello@trutina.com.au" className="text-blue-400 hover:text-blue-300 transition">hello@trutina.com.au</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
