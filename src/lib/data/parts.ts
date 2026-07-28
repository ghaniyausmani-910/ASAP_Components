import type { Part, DirectoryKind } from '@/lib/types'
import { seededRand, slugify, pick } from '@/lib/utils'

// ── Manufacturers (aerospace / defense / electronic) ────────────
export const MANUFACTURERS: string[] = [
  'The Boeing Company', 'Airbus', 'Lockheed Martin', 'GE Aviation', 'Honeywell',
  'Goodrich', 'Parker Hannifin', 'Eaton', 'Raytheon Company', 'Collins Aerospace',
  'Bombardier Aerospace', 'Bell Industries', 'Gulfstream Aerospace', 'McCauley',
  'Textron Inc', 'Hawker Beechcraft', 'Safran', 'Rolls-Royce', 'Pratt & Whitney',
  'Moog Inc', 'Curtiss-Wright', 'TransDigm', 'Meggitt', 'Woodward Inc',
  'Amphenol', 'TE Connectivity', 'Molex', 'Harwin', 'Cannon', 'Klixon',
  'Ohmcraft', 'Radio Shack', 'Pioneer', 'Autosplice', 'Bosch Rexroth',
  'National Aerospace Standards Co', 'Zodiac Aerospace', 'Kapco Valtec',
  'Entrom Helicopter', 'Alder', 'Raltron', 'Winbond Electronics', 'Fujitsu',
]

export function manufacturerList(): { name: string; slug: string }[] {
  return MANUFACTURERS.map((name) => ({ name, slug: slugify(name) }))
}

// ── Part-type name pools ────────────────────────────────────────
export const AVIATION_PART_TYPES: string[] = [
  'Adapter Bearing', 'Air Cycle Machine', 'Aileron Assembly', 'Bracket Relay',
  'Bearing Sleeve', 'Cabin Window', 'Cable Assembly', 'Clamp Loop', 'Cover Plate',
  'Drive Gear', 'Ducting Section', 'Elbow Fitting', 'Fuel Nozzle', 'Fastener Clip',
  'Gasket Seal', 'Gauge Assembly', 'Hinge Bracket', 'Housing Cover', 'Indicator Light',
  'Insulation Blanket', 'Jack Screw', 'Landing Gear Strut', 'Lever Control',
  'Manifold Assembly', 'Nut Plate', 'Outflow Valve', 'Panel Fastener', 'Pressure Sensor',
  'Quill Shaft', 'Retainer Ring', 'Seal Ring', 'Switch Toggle', 'Turbine Blade',
  'Terminal Block', 'Union Fitting', 'Valve Actuator', 'Washer Flat', 'Wire Harness',
  'Yoke Assembly', 'Zone Controller',
]

export const ELECTRONIC_PART_TYPES: string[] = [
  'Adjustable Power Resistor', 'Analog to Digital Converter IC', 'Audio Speaker',
  'Array Network Resistor', 'Battery Product', 'Board Stacking Connector',
  'Buffer Amplifier IC', 'Carbon Film Resistor', 'Ceramic Capacitor', 'Circuit Breaker',
  'Chip Resistor', 'Development Kit', 'Diode', 'DC-DC Power Supply', 'Ferrite Bead',
  'Fiber Optic IC', 'Fixed Value Inductor', 'Hall Effect Sensor', 'Heat Sink',
  'Header Connector', 'Inductor Coil', 'Integrated Circuit', 'LCD Display Module',
  'Linear Voltage Regulator', 'Logic IC', 'Metal Film Resistor', 'Microprocessor',
  'Memory Card Module', 'Optocoupler', 'Power Connector', 'Relay', 'RF Coaxial Connector',
  'Signal Relay', 'Surge Component', 'Terminal Block', 'Thick Film Resistor',
  'Transistor', 'Voltage Dependent Resistor', 'Wirewound Resistor', 'Zener Diode',
]

export const CONNECTOR_TYPES: string[] = [
  'AC Power Plug', 'AC-DC Power Supply', 'Audio Transformer', 'Backplane Connector',
  'Barrel Power Connector', 'Blind Mate Connector', 'Board Stacking Connector',
  'Circular Housing', 'Coaxial RF Connector', 'D-Sub Contact', 'DC Power Connector',
  'Ethernet Telecom Connector', 'Fiber Optic Adapter', 'Flat Ribbon Cable Connector',
  'General Purpose Relay', 'Heavy Duty Contact', 'Header Connector', 'I/O Module Rack',
  'Interconnect Socket', 'Junction System', 'Keystone Insert', 'Lamp Socket',
  'Loudspeaker Connector', 'Memory Card Socket', 'Modular Accessory', 'Optocoupler',
  'PC Board Connector', 'Power Entry Module', 'Rectangular Header', 'Reed Relay',
  'RF Coaxial Connector', 'Solid State Relay', 'Terminal Adapter', 'Terminal Block',
  'USB Connector', 'Wire and Cable Crimper', 'Zero Insertion Force Socket', 'Zigbee Module',
]

export function partTypePool(categorySlug: string, axisSlug: string): string[] {
  if (categorySlug === 'electronic') return ELECTRONIC_PART_TYPES
  if (categorySlug === 'connectors') return CONNECTOR_TYPES
  return AVIATION_PART_TYPES
}

// ── A–Z / numeric directory grouping ────────────────────────────
export interface DirectoryGroup {
  key: string // "A", "0" ...
  entries: { label: string; slug: string }[]
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function groupAlphabetical(items: string[]): DirectoryGroup[] {
  const map = new Map<string, { label: string; slug: string }[]>()
  for (const it of items) {
    const k = it[0].toUpperCase()
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push({ label: it, slug: slugify(it) })
  }
  return LETTERS.filter((l) => map.has(l)).map((l) => ({
    key: l,
    entries: map.get(l)!.sort((a, b) => a.label.localeCompare(b.label)),
  }))
}

/** Numeric directory (NIIN / NSN) — grouped by leading digit. */
export function numericGroups(kind: 'niin' | 'nsn', seedBase: string): DirectoryGroup[] {
  const digits = kind === 'niin' ? '0123456789'.split('') : '123456789'.split('')
  return digits.map((d) => {
    const rand = seededRand(seedBase + d)
    const entries = Array.from({ length: 10 }, () => {
      const n = kind === 'niin' ? niin(rand) : nsn(rand)
      return { label: n, slug: n.replace(/[^0-9]/g, '') }
    })
    return { key: d, entries }
  })
}

function digits(rand: () => number, n: number): string {
  let s = ''
  for (let i = 0; i < n; i++) s += Math.floor(rand() * 10)
  return s
}
function niin(rand: () => number): string {
  const d = digits(rand, 9)
  return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`
}
function nsn(rand: () => number): string {
  const d = digits(rand, 13)
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 9)}-${d.slice(9)}`
}

// ── FSC codes ───────────────────────────────────────────────────
export const FSC_CODES: { code: string; label: string; count: number }[] = [
  { code: '1560', label: 'Airframe Structural Components', count: 18204 },
  { code: '1650', label: 'Aircraft Hydraulic, Vacuum & De-Icing System Components', count: 9231 },
  { code: '1680', label: 'Miscellaneous Aircraft Accessories & Components', count: 12876 },
  { code: '2915', label: 'Engine Fuel System Components, Nonaircraft', count: 4410 },
  { code: '2925', label: 'Engine Electrical System Components, Aircraft', count: 6620 },
  { code: '3010', label: 'Torque Converters & Speed Changers', count: 3120 },
  { code: '3040', label: 'Miscellaneous Power Transmission Equipment', count: 8845 },
  { code: '3110', label: 'Bearings, Antifriction, Unmounted', count: 15003 },
  { code: '4730', label: 'Fittings & Specialties; Hose, Pipe & Tube', count: 21740 },
  { code: '5310', label: 'Nuts & Washers', count: 30012 },
  { code: '5320', label: 'Rivets', count: 9980 },
  { code: '5935', label: 'Connectors, Electrical', count: 26550 },
  { code: '5961', label: 'Semiconductor Devices & Associated Hardware', count: 14002 },
  { code: '6150', label: 'Miscellaneous Electric Power & Distribution Equipment', count: 7420 },
]

// ── CAGE codes ──────────────────────────────────────────────────
export function cageRows(seedBase: string, count: number): { code: string; manufacturer: string }[] {
  const rand = seededRand(seedBase)
  return Array.from({ length: count }, () => {
    const code = (Math.floor(rand() * 90000) + 10000).toString(36).toUpperCase().padStart(5, '0').slice(0, 5)
    return { code, manufacturer: pick(rand, MANUFACTURERS) }
  })
}

// ── Part number + record generation ─────────────────────────────
const PREFIX_BY_SLUG: Record<string, string> = {
  bac: 'BAC', ms: 'MS', as: 'AS', nas: 'NAS',
  'aircraft-windows': 'LAV', 'aircraft-engine': 'ENG', 'aircraft-instruments': 'INS',
}

export function partNumberFor(slug: string, rand: () => number): string {
  const p = PREFIX_BY_SLUG[slug] ?? 'PN'
  const body = Array.from({ length: 3 + Math.floor(rand() * 3) }, () =>
    rand() < 0.5 ? Math.floor(rand() * 10) : String.fromCharCode(65 + Math.floor(rand() * 26)),
  ).join('')
  return `${p}-${body}-${Math.floor(rand() * 900) + 100}`
}

const AIRCRAFT_MODELS = ['Boeing 737', 'Boeing 787', 'Airbus A320', 'C-130', 'F-16', 'Bell 407', 'Gulfstream G650']
const ENGINE_NOS = ['CFM56-7', 'CFM56-5B', 'V2500', 'CF6-80C2', 'PW4000', 'GE90', 'Trent 1000']

export function generateParts(seedKey: string, count: number, opts?: { withDescription?: boolean; extra?: string }): Part[] {
  const rand = seededRand(seedKey)
  const pool = seedKey.includes('electronic') || seedKey.includes('connector')
    ? ELECTRONIC_PART_TYPES
    : AVIATION_PART_TYPES
  return Array.from({ length: count }, (_, i) => {
    const partNo = partNumberFor(seedKey.split(':')[1] ?? 'pn', rand)
    const mfr = pick(rand, MANUFACTURERS)
    const part: Part = {
      partNo,
      altPartNo: partNo.replace(/-/g, ''),
      manufacturer: rand() < 0.25 ? 'Others' : mfr,
      qty: 'Avl',
      nsn: `${1000 + Math.floor(rand() * 8999)}-${Math.floor(rand() * 90) + 10}-${Math.floor(rand() * 900) + 100}-${Math.floor(rand() * 9000) + 1000}`,
      cageCode: rand() < 0.5 ? (Math.floor(rand() * 90000) + 10000).toString(36).toUpperCase().slice(0, 5) : undefined,
    }
    if (opts?.withDescription) part.description = pick(rand, pool)
    if (opts?.extra === 'aircraftModel') part.aircraftModel = pick(rand, AIRCRAFT_MODELS)
    if (opts?.extra === 'engineNo') part.engineNo = pick(rand, ENGINE_NOS)
    return part
  })
}

/** Find a single part by number (for the part-detail page). */
export function findPart(category: string, manufacturerSlug: string, partNo: string): Part {
  const rand = seededRand(`detail:${category}:${manufacturerSlug}:${partNo}`)
  const mfr = MANUFACTURERS.find((m) => slugify(m) === manufacturerSlug) ?? 'The Boeing Company'
  const pool = category === 'electronic' || category === 'connectors' ? ELECTRONIC_PART_TYPES : AVIATION_PART_TYPES
  return {
    partNo,
    altPartNo: partNo.replace(/-/g, ''),
    manufacturer: mfr,
    description: pick(rand, pool),
    nsn: `${1000 + Math.floor(rand() * 8999)}-${Math.floor(rand() * 90) + 10}-${Math.floor(rand() * 900) + 100}-${Math.floor(rand() * 9000) + 1000}`,
    cageCode: (Math.floor(rand() * 90000) + 10000).toString(36).toUpperCase().slice(0, 5),
    qty: 'Avl',
  }
}

// ── Global search — single exact-match result ───────────────────
// Categories the facet sidebar / result assignment can draw from.
// (Kept in sync with CATEGORIES in catalog.ts by slug.)
const SEARCH_CATEGORY_SLUGS = ['electronic', 'nsn', 'aviation', 'standard', 'connectors', 'featured'] as const

/**
 * Build the single deterministic exact-match part for a global search query.
 * Returns the part (partNo = the query, verbatim) plus the category slug it is
 * assigned to, so the results page can render a facet sidebar with a count of 1
 * against that category and 0 against the rest.
 */
export function searchResult(query: string, type?: string): { part: Part; categorySlug: string } {
  const rand = seededRand(`search:${query}:${type ?? ''}`)
  const categorySlug = pick(rand, SEARCH_CATEGORY_SLUGS as unknown as string[])
  const pool =
    categorySlug === 'electronic' || categorySlug === 'connectors'
      ? ELECTRONIC_PART_TYPES
      : AVIATION_PART_TYPES
  const part: Part = {
    partNo: query,
    altPartNo: query.replace(/[^a-zA-Z0-9]/g, ''),
    manufacturer: type === 'Manufacturer' ? query : pick(rand, MANUFACTURERS),
    description: pick(rand, pool),
    nsn: `${1000 + Math.floor(rand() * 8999)}-${Math.floor(rand() * 90) + 10}-${Math.floor(rand() * 900) + 100}-${Math.floor(rand() * 9000) + 1000}`,
    cageCode: (Math.floor(rand() * 90000) + 10000).toString(36).toUpperCase().slice(0, 5),
    qty: 'Avl',
  }
  return { part, categorySlug }
}

export function relatedParts(category: string, partNo: string, count = 16): Part[] {
  const rand = seededRand(`related:${category}:${partNo}`)
  const pool = category === 'electronic' || category === 'connectors' ? ELECTRONIC_PART_TYPES : AVIATION_PART_TYPES
  const prefix = partNo.split('-')[0]
  return Array.from({ length: count }, () => {
    const pn = `${prefix}-${partNumberFor('x', rand).split('-').slice(1).join('-')}`
    return {
      partNo: pn,
      manufacturer: rand() < 0.3 ? 'Others' : pick(rand, MANUFACTURERS),
      description: pick(rand, pool),
      nsn: `${1000 + Math.floor(rand() * 8999)}-${Math.floor(rand() * 90) + 10}-${Math.floor(rand() * 900) + 100}-${Math.floor(rand() * 9000) + 1000}`,
      qty: 'Avl',
    }
  })
}
