import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'trutina_auth'

// Public pages and API routes that never require authentication
const PUBLIC_ROUTES = ['/', '/login', '/demo', '/docs', '/styleguide']
const PUBLIC_API_PREFIXES = ['/api/auth', '/api/trial', '/api/resend-code']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow public pages, auth-related APIs, and static demo assets
  if (
    PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    pathname.startsWith('/demo-docs/') ||
    PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
  ) {
    return NextResponse.next()
  }

  // Check for session cookie (non-empty value)
  // Full cryptographic validation happens in the proxy/API routes
  const sessionToken = req.cookies.get(AUTH_COOKIE)?.value
  if (!sessionToken || sessionToken.length < 32) {
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
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|eot)).*)',
  ],
}
