import 'server-only'

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

export async function sendActivationEmail(params: {
  to: string
  name?: string
  defaultUsername: string
  defaultPassword: string
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
  const username = escapeHtml(params.defaultUsername)
  const password = escapeHtml(params.defaultPassword)

  const htmlContent = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Poppins,Segoe UI,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
          <tr><td style="background:#0D2352;padding:28px 32px;color:#ffffff;">
            <div style="font-size:26px;font-weight:700;letter-spacing:-0.5px;">CareConnect</div>
            <div style="font-size:13px;opacity:.85;margin-top:4px;">Your Health, Our priority</div>
          </td></tr>
          <tr><td style="padding:32px;color:#0f172a;">
            <h1 style="margin:0 0 12px;font-size:22px;color:#0f172a;font-weight:700;">Activate your account</h1>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">${greeting}</p>
            <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">
              Your CareConnect employee account has been created. Here are your temporary login details:
            </p>

            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:18px 20px;margin:0 0 24px 0;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.8px;">Your Default Credentials</p>
              <div style="margin-bottom:10px;font-size:14px;color:#334155;">
                <span style="display:inline-block;width:140px;color:#64748B;font-weight:500;">Default Username:</span>
                <strong style="font-family:Consolas,monospace;background:#E2E8F0;padding:3px 10px;border-radius:6px;color:#0F172A;font-size:14px;">${username}</strong>
              </div>
              <div style="font-size:14px;color:#334155;">
                <span style="display:inline-block;width:140px;color:#64748B;font-weight:500;">Default Password:</span>
                <strong style="font-family:Consolas,monospace;background:#E2E8F0;padding:3px 10px;border-radius:6px;color:#0F172A;font-size:14px;">${password}</strong>
              </div>
            </div>

            <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#475569;">
              For security, please click the button below to activate your account and replace these default credentials with your own <strong>Username</strong> and <strong>Password</strong>:
            </p>

            <p style="margin:0 0 28px;text-align:center;">
              <a href="${url}" style="display:inline-block;background:#2563EB;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:14px 36px;border-radius:999px;box-shadow:0 4px 14px rgba(37,99,235,0.3);">Activate Account & Set Password</a>
            </p>

            <p style="margin:0 0 8px;font-size:12px;color:#64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="margin:0 0 24px;font-size:12px;word-break:break-all;color:#2563EB;">${url}</p>
            <hr style="border:none;border-top:1px solid #E2E8F0;margin:20px 0;" />
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">This activation link can only be used once. If you did not request this account activation, please contact your CareConnect administrator.</p>
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
      subject: 'Activate your CareConnect account & credentials',
      htmlContent,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Brevo request failed (${res.status}): ${detail}`)
  }
}
