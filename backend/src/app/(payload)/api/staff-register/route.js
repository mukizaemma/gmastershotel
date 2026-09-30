import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../../payload.config.js'
import { withCors, handleOptions } from '../../../../core/security/cors.js'
import { assertPublicFormRateLimit } from '../../../../core/security/rateLimit.js'

export const OPTIONS = handleOptions

function json(data, status = 200) {
  return withCors(NextResponse.json(data, { status }))
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request) {
  if (!assertPublicFormRateLimit(request)) {
    return json({ error: 'Too many attempts. Try again in a few minutes.' }, 429)
  }

  const body = await request.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  const name = String(body.name || '').trim().slice(0, 80)

  if (!isEmail(email)) return json({ error: 'Enter a valid email.' }, 400)
  if (password.length < 8 || password.length > 128) {
    return json({ error: 'Use a password of at least 8 characters.' }, 400)
  }

  try {
    const payload = await getPayload({ config })
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.totalDocs) {
      return json(
        { error: 'That email is already registered. Contact Ireme Tech if you still need admin access.' },
        409,
      )
    }

    const [firstName, ...rest] = name.split(/\s+/).filter(Boolean)
    await payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        email,
        password,
        firstName: firstName || '',
        lastName: rest.join(' '),
        role: 'editor',
        status: 'inactive',
      },
    })

    try {
      if (process.env.RESEND_API_KEY || process.env.SMTP_HOST) {
        await payload.sendEmail({
          to: 'info@iremetech.com',
          subject: `Staff registration waiting for admin access — ${email}`,
          html: `<p>${name || email} registered on the handover page and is waiting for admin access.</p><p>Email: ${email}</p><p>Set the account to Active and Administrator in Admin accounts before they can sign in.</p>`,
        })
      }
    } catch (error) {
      payload.logger?.error?.(error)
    }

    return json({
      ok: true,
      message:
        'Your account was created. Contact Ireme Tech so they can assign admin access. You cannot sign in until that is done.',
    })
  } catch {
    return json({ error: 'Could not create the account. Try again in a few minutes.' }, 500)
  }
}
