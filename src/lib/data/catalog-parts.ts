import { slugify } from '@/lib/utils'

/**
 * Canonical parts table — the single source of truth for parts that are
 * reachable from the search bar's autocomplete.
 *
 * The part is the central entity; NSN, CAGE Code, Part Number, Manufacturer and
 * NIIN are all properties of it. Searching by any one of them resolves to the
 * one part that owns it, so both the suggestion index (suggestions.ts) and the
 * part-detail page (parts.ts `findPart`) read from this list. Values are
 * authored once and kept internally consistent — `niin` is the `nsn` minus its
 * 4-digit FSC prefix, and each `cageCode` is unique to a single part.
 *
 * Kept dependency-light (only `slugify`) so both parts.ts and suggestions.ts can
 * import it without a cycle.
 */
export interface CatalogPart {
  partNo: string
  /** Must be a value in MANUFACTURERS (parts.ts) so the slug round-trips. */
  manufacturer: string
  /** Category slug: 'electronic' | 'aviation' | 'nsn' | 'standard' | 'connectors' | 'featured'. */
  category: string
  description: string
  /** National Stock Number: FSC(4)-NIIN. */
  nsn: string
  /** National Item Identification Number — the NSN minus its FSC prefix. */
  niin: string
  /** Commercial and Government Entity code — unique per part here. */
  cageCode: string
}

export const CATALOG_PARTS: CatalogPart[] = [
  { partNo: 'MS27039-1-08', manufacturer: 'National Aerospace Standards Co', category: 'standard', description: 'Screw, Machine, Pan Head', nsn: '5305-00-984-6210', niin: '00-984-6210', cageCode: '80205' },
  { partNo: 'MS21042-3', manufacturer: 'Kapco Valtec', category: 'standard', description: 'Nut, Self-Locking, Hexagon', nsn: '5310-00-167-0793', niin: '00-167-0793', cageCode: '96906' },
  { partNo: 'MS21919WDG4', manufacturer: 'Parker Hannifin', category: 'standard', description: 'Clamp, Loop, Cushioned', nsn: '5340-01-682-1508', niin: '01-682-1508', cageCode: '0MFN7' },
  { partNo: 'MS35338-42', manufacturer: 'National Aerospace Standards Co', category: 'standard', description: 'Washer, Lock, Spring', nsn: '5310-00-407-9566', niin: '00-407-9566', cageCode: '21335' },
  { partNo: 'NAS1149F0332P', manufacturer: 'National Aerospace Standards Co', category: 'standard', description: 'Washer, Flat', nsn: '5310-00-166-1094', niin: '00-166-1094', cageCode: '8H625' },
  { partNo: 'NAS1352-3-8', manufacturer: 'National Aerospace Standards Co', category: 'standard', description: 'Screw, Cap, Socket Head', nsn: '5305-01-054-2318', niin: '01-054-2318', cageCode: '5J982' },
  { partNo: 'NAS6204-8', manufacturer: 'National Aerospace Standards Co', category: 'standard', description: 'Bolt, Close Tolerance', nsn: '5306-01-234-7788', niin: '01-234-7788', cageCode: '3M129' },
  { partNo: 'AN960-10', manufacturer: 'Kapco Valtec', category: 'standard', description: 'Washer, Flat', nsn: '5310-00-167-0820', niin: '00-167-0820', cageCode: '7X354' },
  { partNo: 'AN3-4A', manufacturer: 'Kapco Valtec', category: 'standard', description: 'Bolt, Machine, Aircraft', nsn: '5306-00-204-2624', niin: '00-204-2624', cageCode: '1KL20' },
  { partNo: 'BACB30LN6K', manufacturer: 'The Boeing Company', category: 'standard', description: 'Bolt, Shear, Hi-Lok', nsn: '5306-01-447-3392', niin: '01-447-3392', cageCode: '81205' },
  { partNo: 'BACB28AT6', manufacturer: 'The Boeing Company', category: 'standard', description: 'Bolt, Tension', nsn: '5306-01-389-5540', niin: '01-389-5540', cageCode: '2B998' },
  { partNo: 'D38999/26WB35PN', manufacturer: 'Amphenol', category: 'connectors', description: 'Connector, Circular, Plug', nsn: '5935-01-197-6634', niin: '01-197-6634', cageCode: '77820' },
  { partNo: 'D38999/20WB35SN', manufacturer: 'Amphenol', category: 'connectors', description: 'Connector, Circular, Receptacle', nsn: '5935-01-197-6701', niin: '01-197-6701', cageCode: '06324' },
  { partNo: 'M83248/1-908', manufacturer: 'Parker Hannifin', category: 'aviation', description: 'Packing, Preformed, O-Ring', nsn: '5330-00-165-9089', niin: '00-165-9089', cageCode: '4P557' },
  { partNo: 'M39029/56-348', manufacturer: 'TE Connectivity', category: 'connectors', description: 'Contact, Electrical, Socket', nsn: '5935-01-166-3482', niin: '01-166-3482', cageCode: '00779' },
  { partNo: 'M85049/38S15N', manufacturer: 'Amphenol', category: 'connectors', description: 'Backshell, Connector', nsn: '5935-01-337-8155', niin: '01-337-8155', cageCode: '5T619' },
  { partNo: 'CFM56-7B', manufacturer: 'GE Aviation', category: 'aviation', description: 'Turbine Engine Assembly', nsn: '2840-01-476-2200', niin: '01-476-2200', cageCode: '07482' },
  { partNo: 'LM358N', manufacturer: 'Fujitsu', category: 'electronic', description: 'Amplifier, Operational, Dual', nsn: '5962-01-146-3580', niin: '01-146-3580', cageCode: '34649' },
  { partNo: '2N2222A', manufacturer: 'Winbond Electronics', category: 'electronic', description: 'Transistor, NPN, Switching', nsn: '5961-00-892-2220', niin: '00-892-2220', cageCode: '18324' },
  { partNo: '1N4148', manufacturer: 'Fujitsu', category: 'electronic', description: 'Diode, Small Signal, Fast', nsn: '5961-00-892-4148', niin: '00-892-4148', cageCode: '1A148' },
  { partNo: 'SN74LS00N', manufacturer: 'Fujitsu', category: 'electronic', description: 'IC, Quad NAND Gate', nsn: '5962-01-234-5678', niin: '01-234-5678', cageCode: '61535' },
  { partNo: 'LM7805CT', manufacturer: 'Winbond Electronics', category: 'electronic', description: 'Regulator, Voltage, +5V', nsn: '5961-01-078-0500', niin: '01-078-0500', cageCode: '78051' },
]

/** Look up a canonical part by the segments in a part-detail URL. */
export function findCatalogPart(
  category: string,
  mfrSlug: string,
  partNo: string,
): CatalogPart | undefined {
  return CATALOG_PARTS.find(
    (p) => p.category === category && slugify(p.manufacturer) === mfrSlug && p.partNo === partNo,
  )
}

/** First category a manufacturer's parts appear under, for manufacturer listing links. */
export function categoryForManufacturer(name: string): string {
  return CATALOG_PARTS.find((p) => p.manufacturer === name)?.category ?? 'electronic'
}
