import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { name, email, company } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  // Log trial sign-up (visible in Vercel function logs)
  console.log('[TRIAL SIGNUP]', { name, email, company, at: new Date().toISOString() })

  // TODO: Send notification email via Resend when RESEND_API_KEY is set
  // TODO: Store in database when backend is deployed

  return NextResponse.json({ ok: true })
}
