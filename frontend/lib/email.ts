import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM = 'Trutina <noreply@trutina.com.au>'
const ADMIN_EMAIL = 'hello@trutina.com.au'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://trutina.com.au'

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

export async function sendAnalysisComplete(data: {
  email: string
  name: string
  caseReference: string
  caseId: string
  riskScore: number
  riskLevel: string
  recommendedAction: 'approve' | 'manual_review' | 'reject'
}): Promise<boolean> {
  if (!resend) {
    console.log('[EMAIL] Skipped analysis complete (no RESEND_API_KEY)', data)
    return true
  }

  const actionLabels: Record<string, { text: string; color: string; bg: string }> = {
    approve: { text: 'Approve', color: '#10b981', bg: '#10b98120' },
    manual_review: { text: 'Manual Review Required', color: '#f59e0b', bg: '#f59e0b20' },
    reject: { text: 'Reject - Escalate to Fraud Team', color: '#ef4444', bg: '#ef444420' },
  }

  const riskColors: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
  }

  const actionCfg = actionLabels[data.recommendedAction] || actionLabels.manual_review
  const riskColor = riskColors[data.riskLevel] || '#f59e0b'
  const caseUrl = `${APP_URL}/cases/${data.caseId}`

  try {
    await resend.emails.send({
      from: FROM,
      to: data.email,
      subject: `Analysis Complete: ${data.caseReference} — ${data.riskLevel.toUpperCase()} risk`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0a0a1a 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Tru<span style="color: #60a5fa;">tina</span></h1>
            <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 14px;">Analysis Complete</p>
          </div>

          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px;">Hi ${data.name},</p>
            <p>The fraud analysis for case <strong>${data.caseReference}</strong> has been completed.</p>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; width: 140px;">Case Reference</td>
                  <td style="padding: 10px 0; font-weight: 600; font-family: 'Courier New', monospace;">${data.caseReference}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Risk Score</td>
                  <td style="padding: 10px 0; font-weight: 700; font-size: 20px; color: ${riskColor};">${data.riskScore}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Risk Level</td>
                  <td style="padding: 10px 0;">
                    <span style="display: inline-block; background: ${riskColor}20; color: ${riskColor}; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 600; text-transform: uppercase;">
                      ${data.riskLevel}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;">Recommended Action</td>
                  <td style="padding: 10px 0;">
                    <span style="display: inline-block; background: ${actionCfg.bg}; color: ${actionCfg.color}; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 600;">
                      ${actionCfg.text}
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${caseUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">View Full Report</a>
            </div>

            <p style="color: #666; font-size: 14px;">The report includes detailed findings across all six fraud detection layers: PDF forensics, AI content detection, math &amp; date consistency, cross-reference checks, broker risk, and identity verification.</p>
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
    console.error('[EMAIL] Failed to send analysis complete:', error)
    return false
  }
}
