import { NextRequest, NextResponse } from 'next/server'
import { CSRF_COOKIE, TENANT_COOKIE } from '@/lib/auth'

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

  const tenantId = req.cookies.get(TENANT_COOKIE)?.value || ''
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
