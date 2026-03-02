import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = 'Trutina <noreply@trutina.com.au>'
const ADMIN_EMAIL = 'macdara.work@gmail.com'

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

export async function sendTrialConfirmation(data: {
  name: string
  email: string
}): Promise<boolean> {
  if (!resend) {
    console.log('[EMAIL] Skipped confirmation (no RESEND_API_KEY)', data)
    return true
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: data.email,
      subject: 'Welcome to Trutina — Your trial is being prepared',
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0a0a1a 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Tru<span style="color: #60a5fa;">tina</span></h1>
            <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 14px;">AI Mortgage Fraud Detection</p>
          </div>
          <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 8px 8px;">
            <p>Hi ${data.name},</p>
            <p>Thanks for your interest in Trutina. We're setting up your trial account now.</p>
            <p>You'll receive your login credentials within 24 hours. In the meantime, you can explore our documentation at <a href="https://trutina.com.au/docs" style="color: #2563eb;">trutina.com.au/docs</a>.</p>
            <p>If you have any questions, just reply to this email.</p>
            <p style="margin-top: 24px;">— The Trutina Team</p>
          </div>
          <p style="text-align: center; color: #999; font-size: 11px; margin-top: 16px;">Trutina Pty Ltd | trutina.com.au</p>
        </div>
      `,
      replyTo: ADMIN_EMAIL,
    })
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send trial confirmation:', error)
    return false
  }
}
