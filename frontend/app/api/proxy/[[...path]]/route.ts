import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, CSRF_COOKIE, validateSessionToken } from '@/lib/auth'

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3004'
const API_KEY = process.env.SHIELDAPI_KEY || ''

async function proxy(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path: pathParts } = await params
  const path = pathParts?.join('/') ?? ''
  const qs = req.nextUrl.search
  const url = `${BACKEND}/api/v1/${path}${qs}`

  // CSRF validation on state-changing requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const cookieToken = req.cookies.get(CSRF_COOKIE)?.value
    const headerToken = req.headers.get('x-csrf-token')
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return NextResponse.json({ error: 'CSRF token mismatch' }, { status: 403 })
    }
  }

  // Validate session and extract tenant ID from encrypted token
  const sessionToken = req.cookies.get(AUTH_COOKIE)?.value
  if (!sessionToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const session = validateSessionToken(sessionToken)
  if (!session) {
    return NextResponse.json({ error: 'Session expired or invalid' }, { status: 401 })
  }

  const tenantId = session.tenantId
  const init: RequestInit = {
    method: req.method,
    headers: {
      'X-Api-Key': API_KEY,
      'X-Tenant-Id': tenantId,
      'Content-Type': req.headers.get('content-type') || 'application/json',
    },
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer()
  }

  const res = await fetch(url, init)
  const body = await res.arrayBuffer()
  return new NextResponse(body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
  })
}

export const GET = proxy
export const POST = proxy
export const PATCH = proxy
export const DELETE = proxy
