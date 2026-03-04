import { NextResponse } from 'next/server'
import { sendTrialWelcome } from '@/lib/email'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3004'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/trial/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'No account found for this email' },
        { status: 404 },
      )
    }

    const { access_code, name } = await res.json()

    await sendTrialWelcome({
      name,
      email,
      accessCode: access_code,
      isNew: false,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[RESEND] Failed:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
