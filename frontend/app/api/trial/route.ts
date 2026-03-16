import { NextResponse } from 'next/server'
import { sendTrialNotification, sendTrialWelcome } from '@/lib/email'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3004'

export async function POST(req: Request) {
  const { name, email, company } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  console.log('[TRIAL SIGNUP]', { name, email, company, at: new Date().toISOString() })

  // Provision account in backend DB
  const provisionRes = await fetch(`${BACKEND_URL}/api/v1/trial/provision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, company }),
  })

  if (!provisionRes.ok) {
    console.error('[TRIAL] Backend provision failed:', await provisionRes.text())
    return NextResponse.json({ error: 'Failed to create trial account' }, { status: 500 })
  }

  const { access_code } = await provisionRes.json()

  // Send emails in parallel
  await Promise.all([
    sendTrialNotification({ name, email, company }),
    sendTrialWelcome({ name, email, accessCode: access_code, isNew: true }),
  ])

  return NextResponse.json({ ok: true })
}
