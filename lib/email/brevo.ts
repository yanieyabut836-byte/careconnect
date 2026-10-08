import 'server-only'

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

export async function sendActivationEmail(params: {
  to: string
  name?: string
  activationUrl: string
}) {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || 'CareConnect'
  if (!apiKey || !senderEmail) {
    throw new Error('Missing BREVO_API_KEY or BREVO_SENDER_EMAIL.')
  }

  const greeting = params.name ? `Hi ${escapeHtml(params.name)},` : 'Hello,'
  const url = escapeHtml(params.activationUrl)

  const htmlContent = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Poppins,Segoe UI,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;">
          <tr><td style="background:#0D2352;padding:28px 32px;color:#ffffff;">
            <div style="font-size:26px;font-weight:500;">CareConnect</div>
            <div style="font-size:13px;opacity:.8;margin-top:4px;">Your Health, Our priority</div>
          </td></tr>
          <tr><td style="padding:32px;color:#0f172a;">
            <h1 style="margin:0 0 12px;font-size:22px;">Activate your account</h1>
            <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">${greeting}</p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
              Your CareConnect account is ready. Click the button below to activate it and set a new password.
            </p>
            <p style="margin:0 0 24px;">
              <a href="${url}" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;font-size:16px;font-weight:500;padding:14px 32px;border-radius:999px;">Activate Account</a>
            </p>
            <p style="margin:0 0 8px;font-size:13px;color:#64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="margin:0 0 24px;font-size:12px;word-break:break-all;color:#2563EB;">${url}</p>
            <p style="margin:0;font-size:12px;color:#94a3b8;">This link can only be used once and expires soon. If you didn't request this, you can ignore this email.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`

  const res = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: params.to, ...(params.name ? { name: params.name } : {}) }],
      subject: 'Activate your CareConnect account',
      htmlContent,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Brevo request failed (${res.status}): ${detail}`)
  }
}
