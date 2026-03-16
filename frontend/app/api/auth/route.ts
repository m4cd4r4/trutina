import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, CSRF_COOKIE, createSessionToken, generateCsrfToken } from '@/lib/auth'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3004'

// In-memory rate limiter (per warm instance - not perfect for serverless
// but catches naive brute-force; use Upstash Redis for production hardening)
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  entry.count++
  if (entry.count > MAX_ATTEMPTS) return true
  return false
}

// Periodic cleanup to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of loginAttempts) {
    if (now > entry.resetAt) loginAttempts.delete(ip)
  }
}, 60_000)

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again in a minute.' },
      { status: 429 },
    )
  }

  const { password } = await req.json()

  // Admin login - static password from env var
  if (password === process.env.LOGIN_PASSWORD) {
    return setSessionCookies(NextResponse.json({ ok: true }), 'admin')
  }

  // Trial access code - validate against backend DB
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/trial/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_code: password }),
    })

    if (res.ok) {
      const data = await res.json()
      return setSessionCookies(NextResponse.json({ ok: true }), data.id)
    }
  } catch (err) {
    console.error('[AUTH] Backend validation failed:', err)
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(AUTH_COOKIE)
  res.cookies.delete(CSRF_COOKIE)
  return res
}

function setSessionCookies(res: NextResponse, tenantId: string): NextResponse {
  const isProd = process.env.NODE_ENV === 'production'
  const sessionToken = createSessionToken(tenantId)

  res.cookies.set(AUTH_COOKIE, sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  res.cookies.set(CSRF_COOKIE, generateCsrfToken(), {
    httpOnly: false,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
