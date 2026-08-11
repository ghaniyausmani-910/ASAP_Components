import { NextResponse } from 'next/server'
import { makeReference } from '@/lib/leads/reference'
import { deliverLead, type LeadType } from '@/lib/leads/deliver'

export const runtime = 'nodejs'

/**
 * Receives an RFQ (standard, BOM-attached, or cart quote-request), issues a
 * server-side reference, and delivers the lead. Returns `{ reference }` on
 * success — the client shows that authoritative reference to the customer.
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const fields = coerceFields(body)
  // Minimal validation — email is the one field we truly need to follow up.
  if (!fields.email || !/.+@.+\..+/.test(fields.email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 422 })
  }

  const type: LeadType = fields.method === 'cart' ? 'cart' : 'rfq'
  const reference = makeReference()

  try {
    await deliverLead({ type, reference, submittedAt: new Date().toISOString(), fields })
  } catch (err) {
    console.error('[api/rfq] lead delivery failed', err)
    return NextResponse.json({ error: 'We could not submit your RFQ. Please try again.' }, { status: 502 })
  }

  return NextResponse.json({ reference })
}

/** Flatten an unknown JSON body into a string map, dropping non-primitives. */
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
