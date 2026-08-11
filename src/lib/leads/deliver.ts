// Server-only module: imported exclusively by the /api route handlers, so the
// RESEND_API_KEY / webhook secrets never reach the client bundle.
export type LeadType = 'rfq' | 'cart' | 'contact'

export interface LeadPayload {
  type: LeadType
  reference: string
  submittedAt: string
  /** Raw submitted fields (contact info, part details, comments, …). */
  fields: Record<string, string>
}

/** Human-readable subject line for the notification email. */
function subjectFor(lead: LeadPayload): string {
  const label = lead.type === 'contact' ? 'Contact message' : 'RFQ'
  const who = lead.fields.email || lead.fields.company || 'new lead'
  return `New ${label} ${lead.reference} — ${who}`
}

/** Plain-text body: every submitted field, one per line, plus the reference. */
function bodyFor(lead: LeadPayload): string {
  const lines = Object.entries(lead.fields)
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(([k, v]) => `${k}: ${v}`)
  return [
    `Reference: ${lead.reference}`,
    `Type: ${lead.type}`,
    `Submitted: ${lead.submittedAt}`,
    '',
    ...lines,
  ].join('\n')
}

/**
 * Deliver a captured lead. Transport is chosen by which env vars are set, so the
 * same code works from local dev through production without changes:
 *
 *  1. RESEND_API_KEY + LEAD_NOTIFY_EMAIL → email via the Resend HTTP API.
 *  2. LEAD_WEBHOOK_URL                   → POST the lead JSON (Zapier/Make/CRM).
 *  3. neither                            → log server-side and resolve (dev).
 *
 * Throws only when a configured transport actually fails, so the API route can
 * surface a real error instead of silently dropping a lead.
 */
export async function deliverLead(lead: LeadPayload): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const notify = process.env.LEAD_NOTIFY_EMAIL
  const webhook = process.env.LEAD_WEBHOOK_URL

  if (resendKey && notify) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || 'ASAP Components <onboarding@resend.dev>',
        to: notify.split(',').map((s) => s.trim()),
        reply_to: lead.fields.email || undefined,
        subject: subjectFor(lead),
        text: bodyFor(lead),
      }),
    })
    if (!res.ok) {
      throw new Error(`Resend delivery failed: ${res.status} ${await res.text().catch(() => '')}`)
    }
    return
  }

  if (webhook) {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
    if (!res.ok) throw new Error(`Webhook delivery failed: ${res.status}`)
    return
  }

  // No transport configured yet — keep the funnel working and make the lead
  // visible in server logs so nothing is lost during setup.
  console.log('[lead] No delivery transport configured. Captured lead:\n' + bodyFor(lead))
}
