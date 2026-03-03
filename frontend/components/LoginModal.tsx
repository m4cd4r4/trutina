'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Check } from 'lucide-react'
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
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" data-testid="modal-backdrop" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl border border-white/10 p-8 animate-in fade-in zoom-in-95 duration-200"
        style={{ background: 'rgba(15,15,35,0.95)', backdropFilter: 'blur(30px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <Logo variant="mark" height={40} href="" className="mx-auto" />
          <p className="text-white/40 mt-2 text-sm">
            {mode === 'trial' ? 'Start your free trial' : 'Sign in to continue'}
          </p>
        </div>

        {mode === 'trial' && submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-white font-semibold mb-2">You&apos;re on the list</p>
            <p className="text-white/40 text-sm">
              We&apos;ll send your login credentials to <span className="text-white/60">{email}</span> shortly.
            </p>
          </div>
        ) : mode === 'trial' ? (
          <form onSubmit={handleTrial}>
            <div className="space-y-3">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1 block">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition"
                  placeholder="Your name"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1 block">Work email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition"
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1 block">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition"
                  placeholder="Your organisation"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? 'Submitting...' : 'Start free trial'}
              </button>

              <p className="text-white/20 text-xs text-center">
                No credit card required. 5 documents included.
              </p>

              {onSwitchMode && (
                <p className="text-center text-sm text-white/40 pt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('signin')}
                    className="text-blue-400 hover:text-blue-300 transition font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignIn}>
            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition"
                  placeholder="Enter password"
                  autoFocus
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              {onSwitchMode && (
                <p className="text-center text-sm text-white/40">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('trial')}
                    className="text-blue-400 hover:text-blue-300 transition font-medium"
                  >
                    Start free trial
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
