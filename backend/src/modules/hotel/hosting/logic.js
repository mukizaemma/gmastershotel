/** Website hosting renews on 1 August. Amounts on a paid invoice stay fixed. */

export const HOSTING_SLUG = 'hosting'

export const ANNUAL_HOSTING_USD = 80
export const ANNUAL_SUPPORT_RWF = 500000
export const BILLING_TO = 'Bethel Hotel Ltd'

export const ISSUER = {
  name: 'Ireme Technologies Ltd',
  lines: ['KG 622 ST, Fair View Building, 4th Floor', 'Kimihurura - Gasabo - Kigali City'],
  tel: '+250 783 807 409',
  email: 'info@iremetech.com',
  preparedBy: 'Emma TWAGIRUMUKIZA',
  bankAccount: '4491274576',
  bankName: 'BPR',
  bankNames: 'Ireme Technologies',
  momoCode: '20033',
  momoNames: 'Ireme Technologies',
}

export const HOSTING_NOTE =
  'Ireme Technologies would like to kindly remind you about the payment request for website annual hosting renewal.'

const SERVICE_DESCRIPTION = 'Domain renewal, hosting & SSL services renewal'
const SUPPORT_DESCRIPTION = 'Annual Support Fees'
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const INVOICE_KEYS = [
  'invoiceNumber',
  'billingTo',
  'periodStart',
  'periodEnd',
  'hostingFeeUsd',
  'hostingFeeRwf',
  'supportFeeRwf',
  'totalRwf',
  'status',
  'issuedOn',
  'paidAt',
  'rateSnapshot',
]

export function kigaliToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Kigali',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function addYears(iso, years) {
  const [year, month, day] = String(iso).split('-')
  return `${String(Number(year) + years).padStart(4, '0')}-${month}-${day}`
}

export function daysBetween(fromIso, toIso) {
  const from = Date.parse(`${fromIso}T00:00:00Z`)
  const to = Date.parse(`${toIso}T00:00:00Z`)
  return Math.round((to - from) / 86400000)
}

export function normalizeRate(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0 || n > 1000000) return null
  return Math.round(n * 100) / 100
}

export function formatRwf(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return Math.round(n).toLocaleString('en-US')
}

export function formatLong(iso) {
  if (!iso) return '—'
  const [year, month, day] = String(iso).split('-').map(Number)
  if (!year || !month || !day) return String(iso)
  return `${String(day).padStart(2, '0')} ${MONTHS[month - 1]}, ${year}`
}

export function formatPrepared(iso) {
  if (!iso) return '—'
  const [year, month, day] = String(iso).split('-').map(Number)
  if (!year || !month || !day) return String(iso)
  return `${day}/${MONTHS[month - 1]}/${year}`
}

function num(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function cloneInvoices(invoices) {
  return (Array.isArray(invoices) ? invoices : []).map((inv) => ({ ...inv }))
}

export function seedInvoices() {
  return [
    {
      invoiceNumber: 'IREME/BH005/WH-002/2026',
      billingTo: BILLING_TO,
      periodStart: '2026-08-01',
      periodEnd: '2027-08-01',
      flat: true,
      hostingFeeRwf: 130000,
      supportFeeRwf: 0,
      totalRwf: 130000,
      status: 'paid',
      issuedOn: '2026-07-08',
      paidAt: '2026-07-08',
      reminder30: false,
      reminder15: false,
      reminder0: false,
    },
    renewalInvoice('2027-08-01', 3),
  ]
}

function renewalInvoice(start, seq) {
  const year = String(start).slice(0, 4)
  return {
    invoiceNumber: `IREME/BH005/WH-${String(seq).padStart(3, '0')}/${year}`,
    billingTo: BILLING_TO,
    periodStart: start,
    periodEnd: addYears(start, 1),
    flat: false,
    hostingFeeUsd: ANNUAL_HOSTING_USD,
    supportFeeRwf: ANNUAL_SUPPORT_RWF,
    status: 'active',
    issuedOn: start,
    reminder30: false,
    reminder15: false,
    reminder0: false,
  }
}

function nextSeq(invoices) {
  let max = 2
  for (const inv of invoices) {
    const match = String(inv.invoiceNumber || '').match(/WH-(\d+)/)
    if (match) max = Math.max(max, Number(match[1]))
  }
  return max + 1
}

function applyRate(invoices, rate) {
  return invoices.map((inv) => {
    if (inv.status === 'paid' || inv.flat) return inv
    const next = {
      ...inv,
      hostingFeeUsd: ANNUAL_HOSTING_USD,
      supportFeeRwf: ANNUAL_SUPPORT_RWF,
    }
    if (!rate) {
      delete next.hostingFeeRwf
      delete next.totalRwf
      return next
    }
    const hostingFeeRwf = Math.round(ANNUAL_HOSTING_USD * rate)
    return {
      ...next,
      hostingFeeRwf,
      totalRwf: hostingFeeRwf + ANNUAL_SUPPORT_RWF,
    }
  })
}

function applyDue(invoices, today) {
  return invoices.map((inv) => {
    if (inv.status === 'paid') return inv
    return { ...inv, status: inv.periodStart <= today ? 'pending' : 'active' }
  })
}

function ensureNext(invoices) {
  const sorted = [...invoices].sort((a, b) => String(a.periodStart).localeCompare(String(b.periodStart)))
  const latest = sorted[sorted.length - 1]
  if (!latest || latest.status !== 'paid') return sorted
  if (sorted.some((inv) => inv.periodStart === latest.periodEnd)) return sorted
  sorted.push(renewalInvoice(latest.periodEnd, nextSeq(sorted)))
  return sorted
}

function markPaid(invoices, invoiceNumber, today, rate) {
  if (!invoiceNumber) return invoices
  return invoices.map((inv) => {
    if (inv.invoiceNumber !== invoiceNumber || inv.status === 'paid') return inv
    const hostingFeeRwf = inv.flat ? num(inv.hostingFeeRwf) : rate ? Math.round(ANNUAL_HOSTING_USD * rate) : num(inv.hostingFeeRwf)
    const supportFeeRwf = inv.flat ? 0 : ANNUAL_SUPPORT_RWF
    const totalRwf = hostingFeeRwf == null ? num(inv.totalRwf) : hostingFeeRwf + supportFeeRwf
    return {
      ...inv,
      status: 'paid',
      paidAt: today,
      rateSnapshot: inv.flat ? inv.rateSnapshot : rate,
      hostingFeeRwf,
      supportFeeRwf,
      totalRwf,
    }
  })
}

function applyReminder(invoices, reminder) {
  const key = reminder?.key
  if (!reminder?.invoiceNumber || !['reminder30', 'reminder15', 'reminder0'].includes(key)) return invoices
  return invoices.map((inv) => (inv.invoiceNumber === reminder.invoiceNumber ? { ...inv, [key]: true } : inv))
}

export function cleanInvoice(inv) {
  const out = {}
  if (inv?.id) out.id = inv.id
  for (const key of INVOICE_KEYS) {
    if (inv?.[key] !== undefined && inv?.[key] !== null && inv?.[key] !== '') out[key] = inv[key]
  }
  out.billingTo = inv?.billingTo || BILLING_TO
  out.flat = Boolean(inv?.flat)
  out.reminder30 = Boolean(inv?.reminder30)
  out.reminder15 = Boolean(inv?.reminder15)
  out.reminder0 = Boolean(inv?.reminder0)
  if (out.hostingFeeRwf != null) out.hostingFeeRwf = num(out.hostingFeeRwf)
  if (out.supportFeeRwf != null) out.supportFeeRwf = num(out.supportFeeRwf)
  if (out.totalRwf != null) out.totalRwf = num(out.totalRwf)
  if (out.hostingFeeUsd != null) out.hostingFeeUsd = num(out.hostingFeeUsd)
  if (out.rateSnapshot != null) out.rateSnapshot = num(out.rateSnapshot)
  return out
}

export function reconcile(input, { today = kigaliToday(), markPaid: paidNumber = null, reminder = null } = {}) {
  const usdRate = normalizeRate(input?.usdRate)
  let invoices = cloneInvoices(input?.invoices)
  if (!invoices.length) invoices = seedInvoices()
  invoices = invoices.map((inv) => (inv.invoiceNumber === 'IREME/BH005/WH-002/2026' ? { ...inv, flat: true } : inv))

  invoices = applyRate(invoices, usdRate)
  invoices = markPaid(invoices, paidNumber, today, usdRate)
  invoices = applyDue(invoices, today)
  invoices = ensureNext(invoices)
  invoices = applyRate(invoices, usdRate)
  invoices = applyDue(invoices, today)
  invoices = applyReminder(invoices, reminder)

  const service = deriveService(invoices, today)
  return {
    usdRate,
    serviceStatus: service.serviceStatus,
    invoices: invoices.map(cleanInvoice),
  }
}

export function deriveService(invoices, today) {
  const current = invoices.find((inv) => inv.periodStart <= today && today < inv.periodEnd)
  if (!current) {
    const overdue = [...invoices].reverse().find((inv) => inv.periodEnd <= today && inv.status !== 'paid')
    return {
      serviceStatus: 'expired',
      expiresOn: overdue?.periodEnd || null,
      daysUntilExpiry: overdue?.periodEnd ? daysBetween(today, overdue.periodEnd) : null,
    }
  }
  if (current.status === 'paid') {
    return {
      serviceStatus: 'active',
      expiresOn: current.periodEnd,
      daysUntilExpiry: daysBetween(today, current.periodEnd),
    }
  }
  return {
    serviceStatus: 'expired',
    expiresOn: current.periodStart,
    daysUntilExpiry: daysBetween(today, current.periodStart),
  }
}

export function reminderPlan(invoices, today) {
  const paid = invoices
    .filter((inv) => inv.status === 'paid' && inv.periodEnd)
    .sort((a, b) => String(a.periodEnd).localeCompare(String(b.periodEnd)))
  if (!paid.length) return null

  const upcoming = paid.find((inv) => daysBetween(today, inv.periodEnd) >= 0)
  const target = upcoming || paid[paid.length - 1]
  const next = invoices.find((inv) => inv.periodStart === target.periodEnd && inv.status !== 'paid')
  if (!next) return null

  const days = daysBetween(today, target.periodEnd)
  let kind = null
  let key = null
  if (days <= 0 && !target.reminder0) {
    kind = days < 0 ? 'overdue' : 'today'
    key = 'reminder0'
  } else if (days > 0 && days <= 15 && !target.reminder15) {
    kind = '15'
    key = 'reminder15'
  } else if (days > 15 && days <= 30 && !target.reminder30) {
    kind = '30'
    key = 'reminder30'
  }
  if (!kind) return null
  return {
    invoiceNumber: target.invoiceNumber,
    key,
    kind,
    days,
    expiresOn: target.periodEnd,
    next,
  }
}

function statusLabel(status) {
  if (status === 'paid') return 'Paid'
  if (status === 'pending') return 'Pending'
  return 'Active'
}

function presentInvoice(inv) {
  const hostingAmountLabel = num(inv.hostingFeeRwf) != null ? formatRwf(inv.hostingFeeRwf) : '—'
  const supportAmountLabel = num(inv.supportFeeRwf) ? formatRwf(inv.supportFeeRwf) : '—'
  const totalLabel = num(inv.totalRwf) != null ? formatRwf(inv.totalRwf) : '—'
  return {
    ...inv,
    periodLabel: `${formatLong(inv.periodStart)} - ${formatLong(inv.periodEnd)}`,
    statusLabel: statusLabel(inv.status),
    issuedOnLabel: formatPrepared(inv.issuedOn),
    hostingAmountLabel,
    supportAmountLabel,
    totalLabel,
    preparedBy: ISSUER.preparedBy,
    rows: [
      {
        index: '1',
        description: SERVICE_DESCRIPTION,
        period: `${formatLong(inv.periodStart)} - ${formatLong(inv.periodEnd)}`,
        amount: hostingAmountLabel,
      },
      {
        index: '2',
        description: SUPPORT_DESCRIPTION,
        period: '—',
        amount: supportAmountLabel,
      },
    ],
  }
}

function expiryHint(service) {
  if (service.serviceStatus === 'expired') return 'Expired'
  const days = service.daysUntilExpiry
  if (days === 0) return 'Expires today'
  if (days === 1) return 'Expires tomorrow'
  if (days > 1) return `Expires in ${days} days`
  return 'Expired'
}

export function present(input, today = kigaliToday()) {
  const stored = input?.invoices ? reconcile(input, { today }) : reconcile({ usdRate: input?.usdRate, invoices: [] }, { today })
  const invoices = stored.invoices.map(presentInvoice)
  const service = deriveService(stored.invoices, today)
  const next = invoices.find((inv) => inv.status !== 'paid') || null
  return {
    domainRegistrar: 'namecheap.com',
    hostingServer: 'DigitalOcean Linux server',
    supportIncludes:
      'Updating website content you send, keeping the site up and running, and following up on hosting renewals.',
    annualHostingUsd: ANNUAL_HOSTING_USD,
    annualSupportRwf: ANNUAL_SUPPORT_RWF,
    billingTo: BILLING_TO,
    usdRate: stored.usdRate,
    serviceStatus: service.serviceStatus,
    serviceStatusLabel: service.serviceStatus === 'active' ? 'Active' : 'Expired',
    expiresOn: service.expiresOn,
    expiresOnLabel: formatLong(service.expiresOn),
    daysUntilExpiry: service.daysUntilExpiry,
    expiryHint: expiryHint(service),
    renewalLabel: '1 August each year',
    nextInvoiceNumber: next?.invoiceNumber || null,
    amountToPay: next ? num(next.totalRwf) : null,
    amountToPayLabel: next?.totalLabel || '—',
    hostingFeeLabel: next?.hostingAmountLabel || '—',
    supportFeeLabel: formatRwf(ANNUAL_SUPPORT_RWF),
    note: HOSTING_NOTE,
    issuer: ISSUER,
    invoices,
  }
}

export function dataForSave(stored) {
  return {
    usdRate: stored.usdRate,
    serviceStatus: stored.serviceStatus,
    invoices: (stored.invoices || []).map(cleanInvoice),
  }
}

export function snapshot(doc) {
  return {
    usdRate: normalizeRate(doc?.usdRate),
    serviceStatus: doc?.serviceStatus || null,
    invoices: (doc?.invoices || [])
      .map((inv) => ({
        invoiceNumber: inv.invoiceNumber || '',
        periodStart: inv.periodStart || '',
        periodEnd: inv.periodEnd || '',
        flat: Boolean(inv.flat),
        hostingFeeUsd: num(inv.hostingFeeUsd),
        hostingFeeRwf: num(inv.hostingFeeRwf),
        supportFeeRwf: num(inv.supportFeeRwf),
        totalRwf: num(inv.totalRwf),
        status: inv.status || '',
        issuedOn: inv.issuedOn || '',
        paidAt: inv.paidAt || '',
        rateSnapshot: num(inv.rateSnapshot),
        reminder30: Boolean(inv.reminder30),
        reminder15: Boolean(inv.reminder15),
        reminder0: Boolean(inv.reminder0),
        billingTo: inv.billingTo || '',
      }))
      .sort((a, b) => a.periodStart.localeCompare(b.periodStart)),
  }
}

export function sameHosting(left, right) {
  return JSON.stringify(snapshot(left)) === JSON.stringify(snapshot(right))
}
