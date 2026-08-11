import { NextResponse } from 'next/server'
import { makeReference } from '@/lib/leads/reference'
import { deliverLead } from '@/lib/leads/deliver'

export const runtime = 'nodejs'

/**
 * Receives a contact-form message, issues a reference, and delivers the lead.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const fields = coerceFields(body)
  if (!fields.email || !/.+@.+\..+/.test(fields.email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 422 })
  }

  const reference = makeReference()

  try {
    await deliverLead({ type: 'contact', reference, submittedAt: new Date().toISOString(), fields })
  } catch (err) {
    console.error('[api/contact] lead delivery failed', err)
    return NextResponse.json({ error: 'We could not send your message. Please try again.' }, { status: 502 })
  }

  return NextResponse.json({ reference })
}

function coerceFields(body: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (body && typeof body === 'object') {
    for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
      if (v == null) continue
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') out[k] = String(v)
    }
  }
  return out
}
