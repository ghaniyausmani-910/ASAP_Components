// Lead analytics — minimal, dependency-free.
//
// This site has no GA4/gtag bundle wired in on this branch, so every helper
// pushes onto `window.dataLayer` (creating it if a tag manager has not already).
// When GTM/GA4 is added later it will pick these up with zero changes here;
// until then the push is a harmless no-op on the server and a queued event in
// the browser.

export interface LeadEvent {
  method: string
  /** Server- or client-authoritative reference id shown to the user. */
  ref?: string
}

export function trackLead(params: LeadEvent) {
  trackEvent('generate_lead', { ...params })
}

// ── Typed funnel: search → view_item → rfq_start → rfq_form_start → generate_lead
//
// A8 · every `search` must carry `results_count` so the miss rate is
// measurable. `query_type` (Part Number / NSN / CAGE / Manufacturer) rides
// alongside so the miss rate can be sliced by the field the user chose.
export function trackSearch(query: string, resultsCount: number, queryType?: string) {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
    query_type: queryType,
  })
}

/** Fired when a part-detail page mounts. */
export function trackViewItem(part: { partNo: string; manufacturer: string; category?: string }) {
  trackEvent('view_item', {
    item_id: part.partNo,
    item_brand: part.manufacturer,
    item_category: part.category,
  })
}

/** Fired when the user lands on an RFQ intake surface. `source` tags entry (search-miss, part-detail, header, aog-page). */
export function trackRfqStart(source: string, part?: { partNo?: string; manufacturer?: string }) {
  trackEvent('rfq_start', {
    source,
    item_id: part?.partNo,
    item_brand: part?.manufacturer,
  })
}

/** Fired on first interaction with an RFQ form (first focus or first keystroke). Idempotent per-session. */
let rfqFormStartFired = false
export function trackRfqFormStart(method: string) {
  if (rfqFormStartFired) return
  rfqFormStartFired = true
  trackEvent('rfq_form_start', { method })
}

/** Generic dataLayer push — same no-op-until-GTM behavior. */
export function trackEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...(params ?? {}) })
}
