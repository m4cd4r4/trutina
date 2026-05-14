'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.com.au',
  'hotmail.com', 'hotmail.com.au', 'outlook.com', 'live.com', 'live.com.au',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com',
  'proton.me', 'mail.com', 'zoho.com', 'ymail.com', 'msn.com',
  'fastmail.com', 'tutanota.com', 'gmx.com', 'inbox.com',
])

function isWorkEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return !!domain && !PERSONAL_DOMAINS.has(domain)
}

interface LoginModalProps {
  open: boolean
  onClose: () => void
  mode?: 'signin' | 'trial'
  onSwitchMode?: (mode: 'signin' | 'trial') => void
}

export default function LoginModal({ open, onClose, mode = 'signin', onSwitchMode }: LoginModalProps) {
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  if (!open) return null

  async function handleSignIn(e: React.FormEvent) {
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
        setError('Invalid password')
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  async function handleTrial(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!isWorkEmail(email)) {
      setError('Please use your work email. Personal addresses (Gmail, Hotmail, etc.) are not accepted.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company }),
      })
      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      style={{ background: 'rgba(20, 22, 24, 0.45)' }}
    >
      <div
        className="relative w-full max-w-sm mx-4"
        style={{
          background: 'var(--bg-print-white)',
          border: '1px solid var(--ink-25)',
          padding: '28px 28px 24px',
          boxShadow: 'var(--shadow-float)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3"
          aria-label="Close"
          style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--ink-40)', padding: 4, fontSize: 16, lineHeight: 1 }}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <Logo variant="wordmark" height={26} href="" />
          <p style={{ color: 'var(--ink-60)', marginTop: 8, fontSize: 13 }}>
            {mode === 'trial' ? 'Start your 30-day trial' : 'Sign in to continue'}
          </p>
        </div>

        {mode === 'trial' && submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <p style={{ color: 'var(--ink-100)', fontWeight: 600, marginBottom: 6 }}>You&apos;re on the list.</p>
            <p style={{ color: 'var(--ink-60)', fontSize: 13 }}>
              Login credentials will be sent to <span style={{ color: 'var(--ink-100)' }}>{email}</span> shortly.
            </p>
          </div>
        ) : mode === 'trial' ? (
          <form onSubmit={handleTrial}>
            <FormField label="Name">
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                required autoFocus placeholder="Your name"
                style={INPUT_STYLE}
              />
            </FormField>
            <FormField label="Work email">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@company.com.au"
                style={INPUT_STYLE}
              />
            </FormField>
            <FormField label="Organisation">
              <input
                type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                placeholder="Your organisation"
                style={INPUT_STYLE}
              />
            </FormField>

            {error && <p style={{ color: 'var(--risk-crit)', fontSize: 13, marginTop: 8 }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '10px 14px' }}>
              {loading ? 'Submitting…' : 'Start trial'}
            </button>

            <p style={{ color: 'var(--ink-40)', fontSize: 11, textAlign: 'center', marginTop: 10 }}>
              No credit card. 5 documents included.
            </p>

            {onSwitchMode && (
              <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-60)', marginTop: 8 }}>
                Already have an account?{' '}
                <button type="button" onClick={() => onSwitchMode('signin')} style={LINK_BTN}>Sign in</button>
              </p>
            )}
          </form>
        ) : (
          <form onSubmit={handleSignIn}>
            <FormField label="Password">
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                autoFocus placeholder="Enter password"
                style={INPUT_STYLE}
              />
            </FormField>

            {error && <p style={{ color: 'var(--risk-crit)', fontSize: 13, marginTop: 8 }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '10px 14px' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            {onSwitchMode && (
              <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-60)', marginTop: 12 }}>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => onSwitchMode('trial')} style={LINK_BTN}>Start a trial</button>
              </p>
            )}
          </form>
        )}
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

const INPUT_STYLE: React.CSSProperties = {
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
