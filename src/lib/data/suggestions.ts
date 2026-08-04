import { MANUFACTURERS } from './parts'
import { CATALOG_PARTS, categoryForManufacturer } from './catalog-parts'
import { slugify } from '@/lib/utils'

/**
 * Type-scoped autocomplete for the search bar.
 *
 * The catalog has no live search index — parts are generated deterministically
 * (see parts.ts), so there is nothing to query as the user types. Instead we
 * build a small curated, in-memory suggestion index from the canonical parts
 * table (catalog-parts.ts) and filter it client-side. Which slice of the index
 * we search is driven by the type dropdown next to the input — "Manufacturer"
 * surfaces manufacturer names, "Part Number" surfaces part numbers, and so on.
 *
 * Every specific suggestion (Part Number / NSN / CAGE Code) points back to the
 * one part that owns it, so selecting a row deep-links to that part's detail
 * page via `href`. A Manufacturer row instead links to that manufacturer's
 * listing.
 */

export type SuggestionType = 'Part Number' | 'NSN' | 'CAGE Code' | 'Manufacturer'

export interface Suggestion {
  /** Text inserted into the input and used as the search query. */
  value: string
  /** Secondary line — description or FSC label. */
  hint?: string
  /** Manufacturer this part is sourced from; shown on the row's trailing column. */
  mfr?: string
  /** Which index this came from; drives the row badge + mono styling. */
  type: SuggestionType
  /** Where selecting this row navigates — the specific part, or a manufacturer listing. */
  href: string
}

/** Part-detail URL for a canonical part. */
function partHref(category: string, manufacturer: string, partNo: string): string {
  return `/catalog/${category}/quote/${slugify(manufacturer)}/${encodeURIComponent(partNo)}`
}

interface PoolEntry {
  value: string
  hint?: string
  mfr?: string
  href: string
}

// ── Pools derived from the canonical parts table ────────────────
// Each specific pool is one row per part, keyed on a different property, all
// pointing at the same part-detail page.
const PART_NUMBER_POOL: PoolEntry[] = CATALOG_PARTS.map((p) => ({
  value: p.partNo,
  hint: p.description,
  mfr: p.manufacturer,
  href: partHref(p.category, p.manufacturer, p.partNo),
}))

const NSN_POOL: PoolEntry[] = CATALOG_PARTS.map((p) => ({
  value: p.nsn,
  hint: p.description,
  mfr: p.manufacturer,
  href: partHref(p.category, p.manufacturer, p.partNo),
}))

const CAGE_POOL: PoolEntry[] = CATALOG_PARTS.map((p) => ({
  value: p.cageCode,
  hint: p.description,
  mfr: p.manufacturer,
  href: partHref(p.category, p.manufacturer, p.partNo),
}))

const MANUFACTURER_POOL: PoolEntry[] = MANUFACTURERS.map((name) => ({
  value: name,
  href: `/catalog/${categoryForManufacturer(name)}/list/${slugify(name)}`,
}))

function poolFor(type: string): PoolEntry[] {
  switch (type) {
    case 'Manufacturer':
      return MANUFACTURER_POOL
    case 'NSN':
      return NSN_POOL
    case 'CAGE Code':
      return CAGE_POOL
    default:
      return PART_NUMBER_POOL
  }
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

/**
 * Rank suggestions for `query` within the index slice named by `type`.
 * Prefix matches rank first, then substring matches on the value, then matches
 * that only hit the hint (description / manufacturer / FSC label).
 */
export function searchSuggestions(query: string, type: string, limit = 6): Suggestion[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const nq = norm(query)
  const kind = (['Part Number', 'NSN', 'CAGE Code', 'Manufacturer'].includes(type) ? type : 'Part Number') as SuggestionType

  return poolFor(type)
    .map((s) => {
      const val = s.value.toLowerCase()
      const nval = norm(s.value)
      const hint = s.hint?.toLowerCase() ?? ''
      const mfr = s.mfr?.toLowerCase() ?? ''
      let score = -1
      if (val.startsWith(q) || (nq && nval.startsWith(nq))) score = 0
      else if (val.includes(q) || (nq && nval.includes(nq))) score = 1
      else if (hint.includes(q) || mfr.includes(q)) score = 2
      return { s, score }
    })
    .filter((x) => x.score >= 0)
    .sort((a, b) => a.score - b.score || a.s.value.localeCompare(b.s.value))
    .slice(0, limit)
    .map((x) => ({ value: x.s.value, hint: x.s.hint, mfr: x.s.mfr, type: kind, href: x.s.href }))
}
