import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../../../payload.config.js'
import { corsHeaders, handleOptions, withCors } from '../../../../../core/security/cors.js'
import { buildInvoicePdf } from '../../../../../modules/hotel/hosting/invoicePdf.js'
import { presentedInvoice, userFromRequest } from '../../../../../modules/hotel/hosting/service.js'

export const OPTIONS = handleOptions

export async function GET(request) {
  try {
    const payload = await getPayload({ config })
    const user = await userFromRequest(payload, request)
    if (!user) {
      return withCors(NextResponse.json({ error: 'Sign in required.' }, { status: 401 }))
    }

    const number = new URL(request.url).searchParams.get('number') || ''
    const invoice = await presentedInvoice(payload, number)
    if (!invoice) {
      return withCors(NextResponse.json({ error: 'Invoice not found.' }, { status: 404 }))
    }

    const pdf = buildInvoicePdf(invoice)
    const filename = `${number.replace(/[^\w.-]+/g, '-')}.pdf`
    const headers = corsHeaders()
    headers['Content-Type'] = 'application/pdf'
    headers['Content-Disposition'] = `attachment; filename="${filename}"`
    headers['Cache-Control'] = 'no-store'
    return new NextResponse(new Uint8Array(pdf), { headers })
  } catch {
    return withCors(NextResponse.json({ error: 'Could not build the invoice.' }, { status: 500 }))
  }
}
