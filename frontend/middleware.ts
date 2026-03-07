import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'trutina_auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow the login page and auth API
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Gate defaults to ENABLED — set SITE_GATE=false to explicitly disable
  const gateDisabled = process.env.SITE_GATE === 'false'
  if (gateDisabled) {
    const appRoutes = ['/dashboard', '/cases', '/brokers']
    const isAppRoute = appRoutes.some(
      (r) => pathname === r || pathname.startsWith(r + '/'),
    )
    if (!isAppRoute) return NextResponse.next()
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
