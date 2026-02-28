import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3004'
const API_KEY = process.env.SHIELDAPI_KEY || 'dev-key-change-in-prod'

async function proxy(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path: pathParts } = await params
  const path = pathParts?.join('/') ?? ''
  const qs = req.nextUrl.search
  const url = `${BACKEND}/api/v1/${path}${qs}`

  const init: RequestInit = {
    method: req.method,
    headers: {
      'X-Api-Key': API_KEY,
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
