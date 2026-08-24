import { CATALOG_PARTS, type CatalogPart } from '@/lib/data/catalog-parts'
import { norm } from '@/lib/data/suggestions'

/**
 * Layer 1 — pure, UI-free bulk-paste parser for the search bar.
 *
 * When a user pastes many part identifiers at once (one per line, or comma /
 * semicolon / tab separated), we intercept the paste, classify every token
 * against the catalog, and hand the result to the review panel. These functions
 * do no DOM work, no routing, and no cart mutation — they are unit-tested in
 * isolation (see __tests__/bulkPaste.test.ts).
 */

/** Which catalog field a token was recognised as (display hint only). */
export type DetectedType = 'Part Number' | 'NSN' | 'CAGE Code'

export type BulkStatus = 'match' | 'ambiguous' | 'unknown' | 'duplicate'

export interface BulkToken {
  /** 1-based position in the kept (post-truncation) list. */
  index: number
  /** Original token, trimmed — shown verbatim to the user. */
  raw: string
  /** Uppercased, inner-whitespace-stripped form used for dedupe + display. */
  normalized: string
  /** Best guess at what kind of identifier this is. */
  detectedType: DetectedType
  status: BulkStatus
  /** Attached when status === 'match' — the one catalog record it resolves to. */
  record?: CatalogPart
  /** Attached when status === 'ambiguous' — how many records it hit. */
  matchCount?: number
  /** Attached when status === 'duplicate' — 1-based index of the first occurrence. */
  duplicateOf?: number
}

export interface BulkParseResult {
  tokens: BulkToken[]
  /** True when the paste exceeded the cap and was trimmed to the first CAP items. */
  truncated: boolean
  /** Token count BEFORE truncation, so the UI can show "Capped at 100 of N". */
  rawCount: number
}

/** Hard ceiling on how many pasted items we process in one go. */
export const BULK_PASTE_CAP = 100

/**
 * Decide whether a paste should switch the input into bulk mode.
 *
 * Triggers ONLY when the text contains a newline or tab AND yields ≥2 non-empty
 * segments when split on runs of newlines/tabs. A single line is never a
 * trigger — critically, a lone part number containing dashes or spaces
 * (e.g. "AN-123-45") must paste normally into the field.
 */
export function shouldTriggerBulkPaste(text: string): boolean {
  if (!/[\n\r\t]/.test(text)) return false
  const segments = text.split(/[\n\r\t]+/).map((s) => s.trim()).filter(Boolean)
  return segments.length >= 2
}

/** Uppercase + strip inner whitespace (punctuation preserved) — dedupe/display key. */
function normalizeToken(raw: string): string {
  return raw.toUpperCase().replace(/\s+/g, '')
}

/** Rough identifier-kind guess for tokens that don't resolve to a record. */
function guessType(normalized: string): DetectedType {
  const bare = normalized.replace(/-/g, '')
  if (/^\d+$/.test(bare) && (bare.length === 13 || bare.length === 9)) return 'NSN'
  if (/^[A-Z0-9]{5}$/.test(normalized) && !/^\d{5}$/.test(normalized)) return 'CAGE Code'
  return 'Part Number'
}

/** All catalog records a token resolves to, with the field that matched. */
function findMatches(raw: string, catalog: CatalogPart[]): { part: CatalogPart; field: DetectedType }[] {
  const key = norm(raw)
  if (!key) return []
  const out: { part: CatalogPart; field: DetectedType }[] = []
  for (const p of catalog) {
    if (norm(p.partNo) === key) out.push({ part: p, field: 'Part Number' })
    else if (norm(p.nsn) === key || norm(p.niin) === key) out.push({ part: p, field: 'NSN' })
    else if (norm(p.cageCode) === key) out.push({ part: p, field: 'CAGE Code' })
  }
  return out
}

/**
 * Parse pasted text into classified tokens.
 *
 * Splitting is wider than the trigger — once we're in bulk mode, commas and
 * semicolons also separate. Tokens beyond the cap are dropped (truncation, not
 * an error); `rawCount` reports the pre-truncation total. Matching is
 * punctuation/case-insensitive against part number, NSN/NIIN, and CAGE code.
 */
export function parseBulkPaste(text: string, catalog: CatalogPart[] = CATALOG_PARTS): BulkParseResult {
  const rawSegments = text.split(/[\n\r\t,;]+/).map((s) => s.trim()).filter(Boolean)
  const rawCount = rawSegments.length
  const truncated = rawCount > BULK_PASTE_CAP
  const kept = rawSegments.slice(0, BULK_PASTE_CAP)

  const firstSeen = new Map<string, number>() // normalized → 1-based index
  const tokens: BulkToken[] = kept.map((raw, i) => {
    const index = i + 1
    const normalized = normalizeToken(raw)

    const duplicateOf = firstSeen.get(normalized)
    if (duplicateOf !== undefined) {
      return { index, raw, normalized, detectedType: guessType(normalized), status: 'duplicate', duplicateOf }
    }
    firstSeen.set(normalized, index)

    const matches = findMatches(raw, catalog)
    if (matches.length === 1) {
      return { index, raw, normalized, detectedType: matches[0].field, status: 'match', record: matches[0].part }
    }
    if (matches.length > 1) {
      return { index, raw, normalized, detectedType: matches[0].field, status: 'ambiguous', matchCount: matches.length }
    }
    return { index, raw, normalized, detectedType: guessType(normalized), status: 'unknown' }
  })

  return { tokens, truncated, rawCount }
}

/**
 * Tokens that can be committed to an RFQ. Matches always count; unknowns count
 * too — the desk can still quote a part we don't stock, so a paste of only
 * unknown items is still sendable (never a dead end). Ambiguous and duplicate
 * tokens are excluded.
 */
export function committableTokens(tokens: BulkToken[]): BulkToken[] {
  return tokens.filter((t) => t.status === 'match' || t.status === 'unknown')
}

/** Distinct (non-duplicate) normalized tokens, for the "Search all" action. */
export function uniqueNormalizedTokens(tokens: BulkToken[]): string[] {
  return tokens.filter((t) => t.status !== 'duplicate').map((t) => t.normalized)
}
