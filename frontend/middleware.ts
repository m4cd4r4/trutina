import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE } from './lib/auth'

const PUBLIC_PATHS = ['/', '/login', '/api/auth']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/api/auth'))) {
    return NextResponse.next()
  }

  const auth = req.cookies.get(AUTH_COOKIE)?.value
  if (auth !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
