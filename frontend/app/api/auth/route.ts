import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE } from '@/lib/auth'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3004'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  // Admin backdoor — static password from env var
  if (password === process.env.LOGIN_PASSWORD) {
    return setAuthCookie(NextResponse.json({ ok: true }))
  }

  // Trial access code — validate against backend DB
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/trial/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_code: password }),
    })

    if (res.ok) {
      return setAuthCookie(NextResponse.json({ ok: true }))
    }
  } catch (err) {
    console.error('[AUTH] Backend validation failed:', err)
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(AUTH_COOKIE)
  return res
}

function setAuthCookie(res: NextResponse): NextResponse {
  res.cookies.set(AUTH_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
