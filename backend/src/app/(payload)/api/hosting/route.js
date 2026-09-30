import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../../payload.config.js'
import { withCors, handleOptions } from '../../../../core/security/cors.js'
import { loadHosting, markInvoicePaid, saveRate, userFromRequest } from '../../../../modules/hotel/hosting/service.js'

export const OPTIONS = handleOptions

function json(data, status = 200) {
  return withCors(NextResponse.json(data, { status }))
}

async function authorize(request) {
  const payload = await getPayload({ config })
  const user = await userFromRequest(payload, request)
  return { payload, user }
}

export async function GET(request) {
  try {
    const { payload, user } = await authorize(request)
    if (!user) return json({ error: 'Sign in required.' }, 401)
    return json(await loadHosting(payload))
  } catch {
    return json({ error: 'Could not load hosting.' }, 500)
  }
}

export async function POST(request) {
  try {
    const { payload, user } = await authorize(request)
    if (!user) return json({ error: 'Sign in required.' }, 401)
    const body = await request.json().catch(() => ({}))

    if (body.action === 'rate') {
      return json(await saveRate(payload, body.usdRate))
    }

    if (body.action === 'mark-paid') {
      if (user.role !== 'super-admin') return json({ error: 'Only a super admin can confirm payment.' }, 403)
      return json(await markInvoicePaid(payload, body.invoiceNumber))
    }

    return json({ error: 'Unknown action.' }, 400)
  } catch (error) {
    const status = error?.status || 500
    return json({ error: status === 500 ? 'Could not update hosting.' : error.message }, status)
  }
}
