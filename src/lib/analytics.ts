// Lead analytics — minimal, dependency-free.
//
// This site has no GA4/gtag bundle wired in on this branch, so `trackLead`
// pushes a `generate_lead` event onto `window.dataLayer` (creating it if a tag
// manager has not already). When GTM/GA4 is added later it will pick these up
// with zero changes here; until then the push is a harmless no-op on the server
// and a queued event in the browser. `method` distinguishes the lane the lead
// came through (e.g. "rfq" for a normal quote, "aog" for an AOG request).

export interface LeadEvent {
  method: string
  /** Server- or client-authoritative reference id shown to the user. */
  ref?: string
}

export function trackLead(params: LeadEvent) {
  trackEvent('generate_lead', { ...params })
}

/** Generic dataLayer push — same no-op-until-GTM behavior as trackLead. */
export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...(params ?? {}) })
}
