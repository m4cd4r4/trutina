import { NextResponse } from 'next/server'
import { sendTrialNotification, sendTrialConfirmation } from '@/lib/email'

export async function POST(req: Request) {
  const { name, email, company } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  console.log('[TRIAL SIGNUP]', { name, email, company, at: new Date().toISOString() })

  await Promise.all([
    sendTrialNotification({ name, email, company }),
    sendTrialConfirmation({ name, email }),
  ])

  return NextResponse.json({ ok: true })
}
