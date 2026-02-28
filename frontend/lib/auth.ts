export const AUTH_COOKIE = 'mortgageshield_auth'

export function isAuthenticated(req: Request): boolean {
  const cookie = req.headers.get('cookie') || ''
  return cookie.includes(`${AUTH_COOKIE}=authenticated`)
}
