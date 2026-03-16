import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto'

export const AUTH_COOKIE = 'trutina_auth'
export const CSRF_COOKIE = 'trutina_csrf'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function getEncryptionKey(): Buffer {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET env var is required (min 32 characters)')
  }
  return createHash('sha256').update(secret).digest()
}

export interface SessionPayload {
  tenantId: string
  sid: string
  iat: number
}

export function createSessionToken(tenantId: string): string {
  const key = getEncryptionKey()
  const iv = randomBytes(IV_LENGTH)
  const payload = JSON.stringify({
    tenantId,
    sid: randomBytes(16).toString('hex'),
    iat: Date.now(),
  })

  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return Buffer.concat([iv, authTag, encrypted]).toString('base64url')
}

export function validateSessionToken(token: string): SessionPayload | null {
  try {
    const key = getEncryptionKey()
    const data = Buffer.from(token, 'base64url')

    if (data.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) return null

    const iv = data.subarray(0, IV_LENGTH)
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
    const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH)

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

    const payload: SessionPayload = JSON.parse(decrypted.toString('utf8'))

    if (Date.now() - payload.iat > SESSION_MAX_AGE_MS) return null
    if (!payload.tenantId || !payload.sid) return null

    return payload
  } catch {
    return null
  }
}

export function generateCsrfToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}
