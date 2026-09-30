import { formatLong, formatRwf, HOSTING_SLUG, kigaliToday, reconcile, reminderPlan } from './logic.js'
import { loadHosting } from './service.js'

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function uniqueEmails(values) {
  const seen = new Set()
  const out = []
  for (const raw of values) {
    const email = String(raw || '').trim().toLowerCase()
    if (!isEmail(email) || seen.has(email)) continue
    seen.add(email)
    out.push(email)
  }
  return out
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST)
}

async function recipientEmails(payload) {
  let companyEmail = ''
  let staff = []
  try {
    const company = await payload.findGlobal({ slug: 'company', overrideAccess: true })
    companyEmail = company?.email || ''
  } catch {
    companyEmail = ''
  }
  try {
    const users = await payload.find({
      collection: 'users',
      where: { status: { equals: 'active' } },
      limit: 50,
      depth: 0,
      overrideAccess: true,
    })
    staff = (users.docs || []).map((user) => user.email)
  } catch {
    staff = []
  }
  return uniqueEmails([companyEmail, ...staff])
}

function messageFor(plan) {
  const when = formatLong(plan.expiresOn)
  const amount = plan.next?.totalRwf ? `${formatRwf(plan.next.totalRwf)} RWF` : 'the amount on the renewal invoice'
  if (plan.kind === '30') {
    return {
      subject: `Website hosting expires in 30 days (${when})`,
      intro: `Your website hosting expires on ${when}, 30 days from today. The renewal invoice is ${escapeHtml(plan.next.invoiceNumber)} for ${escapeHtml(amount)}.`,
    }
  }
  if (plan.kind === '15') {
    return {
      subject: `Website hosting expires in 15 days (${when})`,
      intro: `Your website hosting expires on ${when}, 15 days from today. The renewal invoice is ${escapeHtml(plan.next.invoiceNumber)} for ${escapeHtml(amount)}.`,
    }
  }
  if (plan.kind === 'overdue') {
    return {
      subject: `Website hosting expired on ${when}`,
      intro: `Your website hosting expired on ${when} and invoice ${escapeHtml(plan.next.invoiceNumber)} is still unpaid. Hosting stays expired until a super admin confirms payment.`,
    }
  }
  return {
    subject: `Website hosting expires today (${when})`,
    intro: `Your website hosting expires today, ${when}. Invoice ${escapeHtml(plan.next.invoiceNumber)} is still unpaid. Please arrange ${escapeHtml(amount)} so the renewal can be confirmed.`,
  }
}

function emailHtml(intro) {
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5174'
  const link = `${frontend}/staff/hosting`
  return `
    <div style="font-family:Georgia,serif;background:#f7f5f1;padding:32px">
      <div style="max-width:560px;margin:0 auto;background:#fff;padding:28px 32px;border:1px solid #e6e9f0">
        <p style="color:#c4a574;letter-spacing:0.14em;text-transform:uppercase;font-size:12px;margin:0 0 8px">Hosting renewal</p>
        <h1 style="color:#1a2b4b;font-size:22px;margin:0 0 12px">Website hosting</h1>
        <p style="color:#5c6578;line-height:1.6">${intro}</p>
        <p style="margin:24px 0">
          <a href="${link}" style="display:inline-block;background:#1a2b4b;color:#fff;text-decoration:none;padding:12px 18px;font-weight:700">View the invoice</a>
        </p>
        <p style="color:#8a8172;font-size:13px">Ireme Technologies Ltd · info@iremetech.com</p>
      </div>
    </div>
  `
}

export async function runHostingReminders(payload) {
  await loadHosting(payload)
  if (!emailConfigured()) return

  const today = kigaliToday()
  const doc = await payload.findGlobal({ slug: HOSTING_SLUG, overrideAccess: true, showHiddenFields: true })
  const stored = reconcile({ usdRate: doc?.usdRate, invoices: doc?.invoices }, { today })
  const plan = reminderPlan(stored.invoices, today)
  if (!plan) return

  const recipients = await recipientEmails(payload)
  if (!recipients.length) return

  const { subject, intro } = messageFor(plan)
  const html = emailHtml(intro)
  let sent = 0
  for (const to of recipients) {
    try {
      await payload.sendEmail({ to, subject, html })
      sent += 1
    } catch (error) {
      payload.logger?.error?.({ err: error, to, subject }, 'Hosting reminder failed')
    }
  }
  if (!sent) return

  await payload.updateGlobal({
    slug: HOSTING_SLUG,
    overrideAccess: true,
    showHiddenFields: true,
    data: { usdRate: stored.usdRate || undefined },
    context: { reminder: { invoiceNumber: plan.invoiceNumber, key: plan.key } },
  })
}

export function startHostingReminders(payload) {
  if (globalThis.__hostingReminderStarted) return
  globalThis.__hostingReminderStarted = true
  const run = () => {
    runHostingReminders(payload).catch((error) => payload.logger?.error?.(error))
  }
  run()
  const timer = setInterval(run, 6 * 60 * 60 * 1000)
  timer.unref?.()
}
