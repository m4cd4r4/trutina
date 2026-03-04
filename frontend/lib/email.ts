import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = 'Trutina <noreply@trutina.com.au>'
const ADMIN_EMAIL = 'hello@trutina.com.au'

export async function sendTrialNotification(data: {
  name: string
  email: string
  company?: string
}): Promise<boolean> {
  if (!resend) {
    console.log('[EMAIL] Skipped (no RESEND_API_KEY)', data)
    return true
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `New Trutina trial signup: ${data.name}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New Trial Signup</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.company ? `<tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0;">${data.company}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #666;">Time</td><td style="padding: 8px 0;">${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' })}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">Sent from trutina.com.au</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send trial notification:', error)
    return false
  }
}

export async function sendTrialWelcome(data: {
  name: string
  email: string
  accessCode: string
  isNew: boolean
}): Promise<boolean> {
  if (!resend) {
    console.log('[EMAIL] Skipped welcome (no RESEND_API_KEY)', data)
    return true
  }

  const subject = data.isNew
    ? 'Your Trutina access code — start analysing documents now'
    : 'Your Trutina access code (resent)'

  try {
    await resend.emails.send({
      from: FROM,
      to: data.email,
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0a0a1a 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Tru<span style="color: #60a5fa;">tina</span></h1>
            <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 14px;">AI Lending Fraud Detection</p>
          </div>

          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px;">Hi ${data.name},</p>
            <p>Your Trutina trial account is ready. Use the access code below to sign in:</p>

            <div style="background: #1e293b; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
              <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Your Access Code</p>
              <p style="color: #60a5fa; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 3px; font-family: 'Courier New', monospace;">${data.accessCode}</p>
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <a href="https://trutina.com.au/login" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Sign in to Trutina</a>
            </div>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="font-weight: 600; margin: 0 0 12px; color: #111;">Your trial includes:</p>
              <table style="width: 100%;">
                <tr><td style="padding: 4px 0;">&#10003; 5 document analyses</td></tr>
                <tr><td style="padding: 4px 0;">&#10003; Full six-layer fraud detection</td></tr>
                <tr><td style="padding: 4px 0;">&#10003; Explainable risk scores</td></tr>
                <tr><td style="padding: 4px 0;">&#10003; PDF forensics + AI content detection</td></tr>
              </table>
            </div>

            <p style="color: #666; font-size: 14px;">Need help getting started? Check out the <a href="https://trutina.com.au/docs/quickstart" style="color: #2563eb;">Quick-Start Guide</a>.</p>
            <p style="color: #666; font-size: 14px;">Questions? Just reply to this email.</p>

            <p style="margin-top: 24px;">— The Trutina Team</p>
          </div>

          <div style="padding: 16px; text-align: center; border-radius: 0 0 8px 8px; background: #f3f4f6;">
            <p style="color: #999; font-size: 11px; margin: 0;">Trutina Pty Ltd | <a href="https://trutina.com.au" style="color: #999;">trutina.com.au</a></p>
          </div>
        </div>
      `,
      replyTo: ADMIN_EMAIL,
    })
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send trial welcome:', error)
    return false
  }
}
