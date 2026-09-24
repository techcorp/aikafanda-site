import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || ''))
const clean = (v, max = 4000) => String(v || '').trim().slice(0, max)

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Send valid JSON.' }, { status: 400 })
  }

  // Honeypot: real people leave this empty.
  if (clean(body.website)) return NextResponse.json({ ok: true })

  const payload = {
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    company: clean(body.company, 160),
    service: clean(body.service, 60),
    budget: clean(body.budget, 60),
    message: clean(body.message),
  }

  if (!payload.name || !payload.message) {
    return NextResponse.json({ error: 'Add your name and a message.' }, { status: 400 })
  }
  if (!isEmail(payload.email)) {
    return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 })
  }

  const to = process.env.CONTACT_TO_EMAIL || 'technicalcorp700@gmail.com'
  const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'
  const key = process.env.RESEND_API_KEY

  // No mail provider configured: log it so nothing is silently lost.
  if (!key) {
    console.log('[contact] new enquiry (no RESEND_API_KEY set):', payload)
    return NextResponse.json({ ok: true, delivered: false })
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `AI ka Fanda <${from}>`,
        to: [to],
        reply_to: payload.email,
        subject: `New enquiry — ${payload.name}${payload.company ? ` (${payload.company})` : ''}`,
        text: [
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `Company: ${payload.company || '—'}`,
          `Service: ${payload.service || '—'}`,
          `Budget: ${payload.budget || '—'}`,
          '',
          payload.message,
        ].join('\n'),
      }),
    })

    if (!res.ok) {
      console.error('[contact] resend failed', await res.text())
      return NextResponse.json({ error: 'Could not send right now. Email us directly.' }, { status: 502 })
    }
    return NextResponse.json({ ok: true, delivered: true })
  } catch (err) {
    console.error('[contact] send error', err)
    return NextResponse.json({ error: 'Could not send right now. Email us directly.' }, { status: 502 })
  }
}
