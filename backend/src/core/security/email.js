import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'

export function createEmailAdapter() {
  const fromAddress =
    process.env.RESEND_FROM || process.env.SMTP_FROM || 'noreply@gmastershotel.com'
  const fromName = process.env.RESEND_FROM_NAME || process.env.SMTP_FROM_NAME || 'G Masters Hotel'

  if (process.env.RESEND_API_KEY) {
    return resendAdapter({
      defaultFromAddress: fromAddress,
      defaultFromName: fromName,
      apiKey: process.env.RESEND_API_KEY,
    })
  }

  if (process.env.SMTP_HOST) {
    return nodemailerAdapter({
      defaultFromAddress: fromAddress,
      defaultFromName: fromName,
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      },
    })
  }

  // Local/dev without Resend: Ethereal inbox. Preview URL prints in the terminal.
  return nodemailerAdapter({
    defaultFromAddress: fromAddress,
    defaultFromName: fromName,
  })
}
