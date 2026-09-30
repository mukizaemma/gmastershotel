import {
  HOSTING_SLUG,
  dataForSave,
  kigaliToday,
  normalizeRate,
  present,
  reconcile,
  sameHosting,
} from './logic.js'

async function readDoc(payload) {
  try {
    return await payload.findGlobal({ slug: HOSTING_SLUG, overrideAccess: true, showHiddenFields: true })
  } catch {
    return {}
  }
}

export async function loadHosting(payload) {
  const today = kigaliToday()
  const doc = await readDoc(payload)
  const stored = reconcile({ usdRate: doc?.usdRate, invoices: doc?.invoices }, { today })
  if (!sameHosting(doc, stored)) {
    try {
      await payload.updateGlobal({
        slug: HOSTING_SLUG,
        overrideAccess: true,
        showHiddenFields: true,
        data: dataForSave(stored),
      })
    } catch (error) {
      payload.logger?.error?.(error)
    }
  }
  return present({ usdRate: stored.usdRate, invoices: stored.invoices }, today)
}

export async function saveRate(payload, usdRate) {
  const rate = normalizeRate(usdRate)
  if (!rate) {
    const error = new Error('Enter the current dollar rate in Rwandan francs.')
    error.status = 400
    throw error
  }
  await payload.updateGlobal({
    slug: HOSTING_SLUG,
    overrideAccess: true,
    showHiddenFields: true,
    data: { usdRate: rate },
  })
  return loadHosting(payload)
}

export async function markInvoicePaid(payload, invoiceNumber) {
  const number = String(invoiceNumber || '').trim()
  const today = kigaliToday()
  const doc = await readDoc(payload)
  const stored = reconcile({ usdRate: doc?.usdRate, invoices: doc?.invoices }, { today })
  const target = stored.invoices.find((inv) => inv.invoiceNumber === number)
  if (!target) {
    const error = new Error('Invoice not found.')
    error.status = 404
    throw error
  }
  if (target.status !== 'paid') {
    if (!target.flat && !stored.usdRate) {
      const error = new Error('Save the current dollar rate before confirming this invoice.')
      error.status = 400
      throw error
    }
    await payload.updateGlobal({
      slug: HOSTING_SLUG,
      overrideAccess: true,
      showHiddenFields: true,
      data: { usdRate: stored.usdRate || undefined },
      context: { markPaid: number },
    })
  }
  return loadHosting(payload)
}

export async function presentedInvoice(payload, invoiceNumber) {
  const hosting = await loadHosting(payload)
  return hosting.invoices.find((inv) => inv.invoiceNumber === invoiceNumber) || null
}

export async function userFromRequest(payload, request) {
  try {
    const auth = await payload.auth({ headers: request.headers })
    const user = auth?.user || null
    if (!user || user.status === 'inactive') return null
    return user
  } catch {
    return null
  }
}
