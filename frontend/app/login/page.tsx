'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
        setError('Invalid password')
        return
      }
      router.push('/')
    } catch {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(30,27,75,0.8) 0%, #0a0a1a 60%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo variant="wordmark" height={48} href="" />
          <p className="text-white/40 mt-2 text-sm">AI Lending Fraud Detection</p>
        </div>

        <form onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 p-8"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
          <h2 className="text-white font-semibold mb-6">Sign in</h2>

          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-xs uppercase tracking-wider mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition"
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

            <p className="text-center text-sm text-white/40">
              Don&apos;t have an account?{' '}
              <Link href="/?trial=1" className="text-blue-400 hover:text-blue-300 transition font-medium">
                Start free trial
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
