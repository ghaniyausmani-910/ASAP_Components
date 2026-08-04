import { MANUFACTURERS, FSC_CODES } from './parts'
import { seededRand } from '@/lib/utils'

/**
 * Type-scoped autocomplete for the search bar.
 *
 * The catalog has no live search index — parts are generated deterministically
 * (see parts.ts), so there is nothing to query as the user types. Instead we
 * build a small curated, in-memory suggestion index from the same seed data the
 * rest of the site draws on (manufacturers, FSC codes, part-number families) and
 * filter it client-side. Which slice of the index we search is driven by the
 * type dropdown next to the input — "Manufacturer" surfaces manufacturer names,
 * "Part Number" surfaces part numbers, and so on.
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
}

// ── Part-number pool ────────────────────────────────────────────
// Realistic aerospace / defense / electronic part numbers grouped by family so
// typing a family prefix ("MS", "NAS", "D38999"…) surfaces the whole set.
const PART_NUMBERS: { value: string; hint: string; mfr: string }[] = [
  { value: 'MS27039-1-08', hint: 'Screw, Machine, Pan Head', mfr: 'National Aerospace Standards Co' },
  { value: 'MS21042-3', hint: 'Nut, Self-Locking, Hexagon', mfr: 'Kapco Valtec' },
  { value: 'MS21919WDG4', hint: 'Clamp, Loop, Cushioned', mfr: 'Parker Hannifin' },
  { value: 'MS35338-42', hint: 'Washer, Lock, Spring', mfr: 'National Aerospace Standards Co' },
  { value: 'NAS1149F0332P', hint: 'Washer, Flat', mfr: 'National Aerospace Standards Co' },
  { value: 'NAS1352-3-8', hint: 'Screw, Cap, Socket Head', mfr: 'National Aerospace Standards Co' },
  { value: 'NAS6204-8', hint: 'Bolt, Close Tolerance', mfr: 'National Aerospace Standards Co' },
  { value: 'AN960-10', hint: 'Washer, Flat', mfr: 'Kapco Valtec' },
  { value: 'AN3-4A', hint: 'Bolt, Machine, Aircraft', mfr: 'Kapco Valtec' },
  { value: 'BACB30LN6K', hint: 'Bolt, Shear, Hi-Lok', mfr: 'The Boeing Company' },
  { value: 'BACB28AT6', hint: 'Bolt, Tension', mfr: 'The Boeing Company' },
  { value: 'D38999/26WB35PN', hint: 'Connector, Circular, Plug', mfr: 'Amphenol' },
  { value: 'D38999/20WB35SN', hint: 'Connector, Circular, Receptacle', mfr: 'Amphenol' },
  { value: 'M83248/1-908', hint: 'Packing, Preformed, O-Ring', mfr: 'Parker Hannifin' },
  { value: 'M39029/56-348', hint: 'Contact, Electrical, Socket', mfr: 'TE Connectivity' },
  { value: 'M85049/38S15N', hint: 'Backshell, Connector', mfr: 'Amphenol' },
  { value: 'CFM56-7B', hint: 'Turbine Engine Assembly', mfr: 'GE Aviation' },
  { value: 'LM358N', hint: 'Amplifier, Operational, Dual', mfr: 'Fujitsu' },
  { value: '2N2222A', hint: 'Transistor, NPN, Switching', mfr: 'Winbond Electronics' },
  { value: '1N4148', hint: 'Diode, Small Signal, Fast', mfr: 'Fujitsu' },
  { value: 'SN74LS00N', hint: 'IC, Quad NAND Gate', mfr: 'Fujitsu' },
  { value: 'LM7805CT', hint: 'Regulator, Voltage, +5V', mfr: 'Winbond Electronics' },
]

// ── Numeric pools (deterministic so rows are stable across renders) ──
function numericPool(kind: 'nsn' | 'cage'): { value: string; hint: string }[] {
  const rand = seededRand(`suggest:${kind}`)
  return Array.from({ length: 14 }, () => {
    if (kind === 'nsn') {
      const fsc = FSC_CODES[Math.floor(rand() * FSC_CODES.length)]
      const niin = `${String(Math.floor(rand() * 90) + 10)}-${String(Math.floor(rand() * 900) + 100)}-${String(Math.floor(rand() * 9000) + 1000)}`
      return { value: `${fsc.code}-${niin}`, hint: fsc.label }
    }
    const code = (Math.floor(rand() * 90000) + 10000).toString(36).toUpperCase().padStart(5, '0').slice(0, 5)
    const mfr = MANUFACTURERS[Math.floor(rand() * MANUFACTURERS.length)]
    return { value: code, hint: mfr }
  })
}

const NSN_POOL = numericPool('nsn')
const CAGE_POOL = numericPool('cage')
const MANUFACTURER_POOL: { value: string; hint?: string }[] = MANUFACTURERS.map((name) => ({ value: name }))

function poolFor(type: string): { value: string; hint?: string; mfr?: string }[] {
  switch (type) {
    case 'Manufacturer':
      return MANUFACTURER_POOL
    case 'NSN':
      return NSN_POOL
    case 'CAGE Code':
      return CAGE_POOL
    default:
      return PART_NUMBERS
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
    .map((x) => ({ value: x.s.value, hint: x.s.hint, mfr: x.s.mfr, type: kind }))
}
