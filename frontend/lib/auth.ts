export const AUTH_COOKIE = 'trutina_auth'
export const CSRF_COOKIE = 'trutina_csrf'

export function isAuthenticated(req: Request): boolean {
  const cookie = req.headers.get('cookie') || ''
  return cookie.includes(`${AUTH_COOKIE}=authenticated`)
}

export function generateCsrfToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}
