import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'trutina_auth'
const PUBLIC_PATHS = ['/', '/login', '/api/auth']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith('/api/auth'))) {
    return NextResponse.next()
  }

  const auth = req.cookies.get(AUTH_COOKIE)?.value
  if (auth !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/cases/:path*', '/brokers'],
}
