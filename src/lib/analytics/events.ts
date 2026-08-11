/**
 * Typed catalogue of every CRO funnel event we send to GA4.
 *
 * The keys are the GA4 event names; the values are the allowed parameter
 * shapes. Adding an event here is the single source of truth — `track()`
 * (see ./index.ts) will only accept a name/param combo defined below, so a
 * typo or a wrong param is a compile error rather than a silently-dropped hit.
 *
 * `generate_lead` is the North-Star conversion (a completed RFQ / quote
 * request). Everything else is a micro-conversion used to diagnose drop-off.
 */
export interface AnalyticsEventParams {
  /** Top-of-funnel: a search was performed. */
  search: { query: string; results_count?: number; source?: 'searchbar' | 'command_palette' }
  /** A part detail / quote page was viewed. */
  view_item: { part_no?: string; manufacturer?: string; category?: string }
  /** A part was added to the quote cart. */
  add_to_cart: { part_no?: string; manufacturer?: string; quantity?: number }
  /** A mini-form (hero / inline / quick-quote) routed the user into the RFQ page. */
  rfq_start: { source: string; part_no?: string }
  /** The user began filling the RFQ form (first field interaction). */
  rfq_form_start: { variant?: 'full' | 'compact' }
  /** A BOM file was attached to an RFQ. */
  bom_upload: { file_name?: string; parts_count?: number; format?: string }
  /** PRIMARY CONVERSION — a completed RFQ / quote request. */
  generate_lead: { method: 'rfq' | 'cart' | 'bom'; parts_count?: number; aog?: boolean; reference?: string }
  /** The contact form was submitted. */
  contact_submit: { topic?: string }
  /** A phone number link was clicked. */
  tel_click: { location?: string }
  /** An email (mailto) link was clicked. */
  mailto_click: { location?: string }
  /** The chat widget was opened. */
  chat_open: { location?: string }
}

export type AnalyticsEvent = keyof AnalyticsEventParams
