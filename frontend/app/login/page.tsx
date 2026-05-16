'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { CalibrationTickRule } from '@/components/design/atoms'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [resendError, setResendError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('Invalid access code')
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend(e: React.FormEvent) {
    e.preventDefault()
    setResendStatus('loading')
    setResendError('')
    try {
      const res = await fetch('/api/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      })
      if (!res.ok) {
        const data = await res.json()
        setResendError(data.error || 'No account found for this email')
        setResendStatus('error')
        return
      }
      setResendStatus('sent')
    } catch {
      setResendError('Connection error')
      setResendStatus('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--bg)', padding: 'clamp(56px, 16vh, 160px) 24px 48px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Logo variant="wordmark" height={44} href="/" />
          <p className="t-caption" style={{ marginTop: 10 }}>Mortgage fraud detection for Australian lenders.</p>
        </div>

        <CalibrationTickRule />

        {!showResend ? (
          <form onSubmit={handleSubmit} style={CARD}>
            <h3 className="t-section" style={{ marginBottom: 16 }}>Sign in</h3>

            <FormField label="Access code">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="TRUT-XXXX-XXXX"
                autoFocus
                style={INPUT}
              />
            </FormField>

            {error && <p style={{ color: 'var(--risk-crit)', fontSize: 13, marginTop: 8 }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '10px 14px' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 12.5 }}>
              <button
                type="button"
                onClick={() => { setShowResend(true); setResendStatus('idle'); setResendError('') }}
                style={LINK_BTN}
              >
                Forgot your code?
              </button>
              <a href="mailto:hello@trutina.com.au?subject=Trutina%20engagement" style={{ color: 'var(--accent)' }}>
                Email about engagement
              </a>
            </div>
          </form>
        ) : (
          <div style={CARD}>
            {resendStatus === 'sent' ? (
              <div style={{ textAlign: 'center' }}>
                <div className="t-section" style={{ marginBottom: 8 }}>Code sent</div>
                <p style={{ color: 'var(--ink-60)', fontSize: 13, marginBottom: 16 }}>
                  Check your inbox. Code typically arrives in 30s.
                </p>
                <button
                  onClick={() => { setShowResend(false); setResendStatus('idle') }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleResend}>
                <h3 className="t-section" style={{ marginBottom: 12 }}>Resend access code</h3>
                <p style={{ color: 'var(--ink-60)', fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>
                  Enter the email you signed up with and we&apos;ll resend your access code.
                </p>
                <FormField label="Email">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={e => setResendEmail(e.target.value)}
                    placeholder="you@company.com.au"
                    autoFocus
                    required
                    style={INPUT}
                  />
                </FormField>

                {resendError && <p style={{ color: 'var(--risk-crit)', fontSize: 13, marginTop: 8 }}>{resendError}</p>}

                <button
                  type="submit"
                  disabled={resendStatus === 'loading'}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '10px 14px' }}
                >
                  {resendStatus === 'loading' ? 'Sending…' : 'Resend my code'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowResend(false)}
                  style={{ ...LINK_BTN, display: 'block', width: '100%', textAlign: 'center', marginTop: 12, fontSize: 12.5 }}
                >
                  Back to sign in
                </button>
              </form>
            )}
          </div>
        )}

        <p className="t-caption" style={{ textAlign: 'center', marginTop: 18, color: 'var(--ink-40)' }}>
          APRA CPG 234 aligned. AU-hosted. SOC 2 Type II.
        </p>
      </div>
    </div>
  )
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
  padding: '24px 24px 22px',
  boxShadow: 'var(--shadow-print)',
}

const INPUT: React.CSSProperties = {
  width: '100%',
  background: 'var(--paper-0)',
  border: '1px solid var(--ink-25)',
  borderRadius: 'var(--radius-1)',
  padding: '9px 12px',
  color: 'var(--ink-100)',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  outline: 'none',
}

const LINK_BTN: React.CSSProperties = {
  background: 'none', border: 0, padding: 0,
  color: 'var(--accent)', cursor: 'pointer',
  textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit',
}
