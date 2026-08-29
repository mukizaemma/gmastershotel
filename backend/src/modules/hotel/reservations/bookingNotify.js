import { nightsBetween } from './pricing.js'

const DATE = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Kigali' }

const STATUS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
}

const PAYMENT = {
  unpaid: 'Unpaid',
  paid: 'Paid',
  failed: 'Failed',
  'awaiting-manual-confirmation': 'Awaiting manual confirmation',
}

const PAYMENT_METHOD = {
  'pay-at-hotel': 'Pay on arrival',
  stripe: 'Card',
  momo: 'Mobile Money',
  'western-union': 'Western Union',
}

function snapshot(value) {
  return JSON.stringify(value ?? null)
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

function formatDay(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-GB', DATE)
}

function money(amount, currency = 'USD') {
  const n = Number(amount)
  if (!Number.isFinite(n)) return '—'
  if (currency === 'RWF') return `RWF ${Math.round(n).toLocaleString('en-US')}`
  return `$${n.toFixed(2)}`
}

function guestChanged(previousDoc, doc) {
  const keys = ['firstName', 'lastName', 'mobile', 'email', 'country', 'specialRequests']
  return keys.some((key) => (previousDoc?.guest?.[key] || '') !== (doc?.guest?.[key] || ''))
}

export function shouldNotifyBookingChange(previousDoc, doc) {
  if (!previousDoc) return true
  const fields = [
    'status',
    'paymentStatus',
    'checkIn',
    'checkOut',
    'adults',
    'children',
    'total',
    'currency',
    'paymentMethod',
    'confirmationMethod',
  ]
  if (fields.some((key) => snapshot(previousDoc[key]) !== snapshot(doc[key]))) return true
  if (snapshot(previousDoc.rooms) !== snapshot(doc.rooms)) return true
  if (snapshot(previousDoc.experiences) !== snapshot(doc.experiences)) return true
  return guestChanged(previousDoc, doc)
}

function wrap(title, intro, body) {
  return `
    <div style="font-family:Georgia,serif;background:#f7f5f1;padding:32px">
      <div style="max-width:560px;margin:0 auto;background:#fff;padding:28px 32px;border:1px solid #e6e9f0">
        <p style="color:#c4a574;letter-spacing:0.14em;text-transform:uppercase;font-size:12px;margin:0 0 8px">${title}</p>
        <p style="color:#5c6578;line-height:1.6;margin:0 0 20px">${intro}</p>
        ${body}
      </div>
    </div>
  `
}

function detailsHtml(doc, hotel) {
  const nights = nightsBetween(doc.checkIn, doc.checkOut)
  const rooms = (doc.rooms || [])
    .map((row) => `<li>${escapeHtml(row.name)} — ${money(row.pricePerNight, doc.currency)} / night</li>`)
    .join('')
  const experiences = (doc.experiences || [])
    .map((row) => `<li>${escapeHtml(row.name)}${row.price != null ? ` — ${money(row.price, doc.currency)}` : ''}</li>`)
    .join('')
  const guest = doc.guest || {}
  const name = escapeHtml(doc.guestName || `${guest.firstName || ''} ${guest.lastName || ''}`.trim() || 'Guest')
  const hotelName = escapeHtml(hotel)

  return `
    <table style="width:100%;border-collapse:collapse;color:#1a2b4b;font-size:15px">
      <tr><td style="padding:6px 0;color:#8a8172">Hotel</td><td>${hotelName}</td></tr>
      <tr><td style="padding:6px 0;color:#8a8172">Guest</td><td>${name}</td></tr>
      <tr><td style="padding:6px 0;color:#8a8172">Dates</td><td>${formatDay(doc.checkIn)} → ${formatDay(doc.checkOut)} (${nights} night${nights === 1 ? '' : 's'})</td></tr>
      <tr><td style="padding:6px 0;color:#8a8172">Guests</td><td>${doc.adults || 1} adult(s), ${doc.children || 0} child(ren)</td></tr>
      <tr><td style="padding:6px 0;color:#8a8172">Status</td><td>${STATUS[doc.status] || escapeHtml(doc.status) || 'Pending'}</td></tr>
      <tr><td style="padding:6px 0;color:#8a8172">Payment</td><td>${PAYMENT[doc.paymentStatus] || escapeHtml(doc.paymentStatus) || 'Unpaid'} · ${PAYMENT_METHOD[doc.paymentMethod] || escapeHtml(doc.paymentMethod) || 'Pay on arrival'}</td></tr>
      <tr><td style="padding:6px 0;color:#8a8172">Total</td><td>${money(doc.total, doc.currency)}</td></tr>
      ${guest.mobile ? `<tr><td style="padding:6px 0;color:#8a8172">Mobile</td><td>${escapeHtml(guest.mobile)}</td></tr>` : ''}
      ${guest.email ? `<tr><td style="padding:6px 0;color:#8a8172">Email</td><td>${escapeHtml(guest.email)}</td></tr>` : ''}
    </table>
    ${rooms ? `<p style="margin:20px 0 6px;color:#8a8172">Rooms</p><ul style="margin:0;padding-left:18px;color:#1a2b4b">${rooms}</ul>` : ''}
    ${experiences ? `<p style="margin:20px 0 6px;color:#8a8172">Experiences</p><ul style="margin:0;padding-left:18px;color:#1a2b4b">${experiences}</ul>` : ''}
    ${guest.specialRequests ? `<p style="margin:20px 0 6px;color:#8a8172">Special requests</p><p style="margin:0;color:#1a2b4b">${escapeHtml(guest.specialRequests)}</p>` : ''}
  `
}

async function adminRecipients(payload) {
  const extras = String(process.env.BOOKING_NOTIFY_EMAIL || '')
    .split(',')
    .map((value) => value.trim())

  let companyEmail = ''
  try {
    const company = await payload.findGlobal({ slug: 'company', overrideAccess: true })
    companyEmail = company?.email || ''
  } catch {
    companyEmail = ''
  }

  let staff = []
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

  return uniqueEmails([...extras, companyEmail, ...staff])
}

async function sendOne(payload, { to, subject, html }) {
  try {
    await payload.sendEmail({ to, subject, html })
  } catch (error) {
    payload.logger?.error?.({ err: error, to, subject }, 'Booking email failed')
  }
}

export async function notifyBookingChange({ payload, doc, operation }) {
  if (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) return

  const hotel = process.env.SMTP_FROM_NAME || process.env.RESEND_FROM_NAME || 'G Masters Hotel'
  const created = operation === 'create'
  const guest = doc.guest || {}
  const guestName = doc.guestName || `${guest.firstName || ''} ${guest.lastName || ''}`.trim() || 'Guest'
  const details = detailsHtml(doc, hotel)
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5174'
  const server = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001'

  const guestIntro = created
    ? `We received your reservation at ${hotel}. The team will confirm availability and follow up if anything is needed.`
    : `Your reservation at ${hotel} was updated.`

  if (isEmail(guest.email)) {
    await sendOne(payload, {
      to: guest.email.trim(),
      subject: created
        ? `Your booking request at ${hotel}`
        : `Your reservation was updated — ${hotel}`,
      html: wrap(
        created ? 'Booking received' : 'Reservation updated',
        guestIntro,
        `${details}<p style="color:#8a8172;font-size:13px;margin:24px 0 0">Questions? Reply to this email or call the hotel.</p>`,
      ),
    })
  }

  const admins = await adminRecipients(payload)
  const adminIntro = created
    ? `A new reservation was placed${guestName !== 'Guest' ? ` by ${guestName}` : ''}.`
    : `A reservation was updated${guestName !== 'Guest' ? ` for ${guestName}` : ''}.`
  const adminLinks = `
    <p style="margin:24px 0 0">
      <a href="${server}/admin/collections/bookings/${doc.id}" style="display:inline-block;background:#1a2b4b;color:#fff;text-decoration:none;padding:12px 18px;font-weight:700">Open in CMS</a>
    </p>
    <p style="color:#8a8172;font-size:13px">Staff desk: <a href="${frontend}/staff/reservations">${frontend}/staff/reservations</a></p>
  `

  await Promise.all(
    admins.map((to) =>
      sendOne(payload, {
        to,
        subject: created
          ? `New reservation — ${guestName}`
          : `Reservation updated — ${guestName} (${STATUS[doc.status] || doc.status || 'updated'})`,
        html: wrap(created ? 'New reservation' : 'Reservation updated', adminIntro, `${details}${adminLinks}`),
      }),
    ),
  )
}
