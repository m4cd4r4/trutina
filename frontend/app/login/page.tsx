'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

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
      router.push('/')
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a1210]"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(13,148,136,0.10) 0%, #0a1210 60%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo href="" className="text-3xl justify-center" />
          <p className="text-white/40 mt-2 text-sm">AI Lending Fraud Detection</p>
        </div>

        {!showResend ? (
          <form onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 p-8"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
            <h2 className="text-white font-semibold mb-6">Sign in</h2>

            <div className="space-y-4">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-1 block">Access Code</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50 focus:bg-white/8 transition"
                  placeholder="TRUT-XXXX-XXXX"
                  autoFocus
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setShowResend(true); setResendStatus('idle'); setResendError('') }}
                  className="text-white/40 hover:text-white/60 transition"
                >
                  Forgot your code?
                </button>
                <Link href="/?trial=1" className="text-teal-400 hover:text-teal-300 transition font-medium">
                  Start free trial
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-white/10 p-8"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>

            {resendStatus === 'sent' ? (
              <div className="text-center space-y-4">
                <div className="text-3xl">&#9993;</div>
                <h2 className="text-white font-semibold">Code sent!</h2>
                <p className="text-white/50 text-sm">
                  Check your inbox for an email with your access code.
                </p>
                <button
                  onClick={() => { setShowResend(false); setResendStatus('idle') }}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 rounded-lg transition"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleResend} className="space-y-4">
                <h2 className="text-white font-semibold">Resend access code</h2>
                <p className="text-white/50 text-sm">
                  Enter the email you signed up with and we&apos;ll resend your access code.
                </p>
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-1 block">Email</label>
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={e => setResendEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-teal-500/50 focus:bg-white/8 transition"
                    placeholder="you@company.com"
                    autoFocus
                    required
                  />
                </div>

                {resendError && <p className="text-red-400 text-sm">{resendError}</p>}

                <button
                  type="submit"
                  disabled={resendStatus === 'loading'}
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
                >
                  {resendStatus === 'loading' ? 'Sending...' : 'Resend my code'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowResend(false)}
                  className="w-full text-white/40 hover:text-white/60 text-sm py-2 transition"
                >
                  Back to sign in
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
