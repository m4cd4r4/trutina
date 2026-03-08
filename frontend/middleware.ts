import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'trutina_auth'

// Public pages that never require authentication
const PUBLIC_ROUTES = ['/', '/login', '/demo', '/docs']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow public pages, auth API, and static demo assets
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/demo-docs/') ||
    PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
  ) {
    return NextResponse.next()
  }

  const auth = req.cookies.get(AUTH_COOKIE)?.value
  if (auth !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, images, fonts
     * - API routes other than auth (let them handle their own auth)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|eot)).*)',
  ],
}
