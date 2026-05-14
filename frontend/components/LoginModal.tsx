'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
          <Logo variant="wordmark" height={40} href="" />
          <p style={{ color: 'var(--ink-60)', marginTop: 8, fontSize: 13 }}>
            Sign in to continue
          </p>
        </div>

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

          <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-60)', marginTop: 12 }}>
            For engagement enquiries,{' '}
            <a href="mailto:hello@trutina.com.au?subject=Trutina%20engagement" style={LINK}>email Macdara</a>.
          </p>
        </form>
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

const LINK: React.CSSProperties = {
  color: 'var(--accent)',
  textDecoration: 'underline',
}
