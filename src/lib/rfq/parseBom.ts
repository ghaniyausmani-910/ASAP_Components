import { describePartNo } from '@/lib/data/parts'
import { lookupPartByNumber } from '@/lib/data/catalog-parts'

/**
 * A single line item parsed out of an uploaded BOM / parts list. Shaped to drop
 * straight into the cart (see `CartLine` in cart/CartContext) after the user
 * reviews it — `quantity` is already clamped to a whole number ≥ 1 and
 * `description` is best-effort resolved so the review table never shows a blank.
 */
export interface ParsedBomRow {
  partNo: string
  manufacturer: string
  description: string
  quantity: number
}

export interface BomParseResult {
  rows: ParsedBomRow[]
  /** Rows that carried no part number (blank spacer lines, totals, etc.). */
  skipped: number
  /** True when a recognizable header row was detected and consumed. */
  headerDetected: boolean
}

/** The columns we try to fill from a BOM, in match-priority order. */
type Field = 'partNo' | 'manufacturer' | 'quantity' | 'description'

/**
 * Header-cell aliases → field. Real-world BOM exports label the same column a
 * dozen ways; we normalize each header cell (lowercase + collapsed whitespace)
 * and match it against these. Order of the outer keys is the tie-break priority
 * when one header could match more than one field.
 */
const HEADER_ALIASES: Record<Field, string[]> = {
  partNo: [
    'part number', 'part no', 'partno', 'part', 'part #', 'part#', 'mpn',
    'mfr part no', 'mfr part number', 'mfg part number', 'manufacturer part number',
    'p/n', 'pn', 'number',
  ],
  manufacturer: ['manufacturer', 'mfr', 'mfg', 'make', 'brand', 'supplier', 'mfr name', 'manufacturer name'],
  quantity: ['quantity', 'qty', 'qty (ea)', 'qty ea', 'qnty', 'count', 'ea', 'amount'],
  description: ['description', 'desc', 'item name', 'name', 'item', 'details'],
}

type ColumnMap = Partial<Record<Field, number>>

/** Lowercase + collapse runs of whitespace so header matching is forgiving. */
function normHeader(cell: string): string {
  return cell.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Tokenize CSV/TSV text into a grid of string cells. A small state machine so
 * quoted fields may contain the delimiter, newlines, and escaped `""` quotes.
 * Handles both `\r\n` and `\n` line endings.
 */
function tokenize(text: string, delimiter: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++ // consume the escaped quote
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
    } else if (ch === delimiter) {
      row.push(field)
      field = ''
    } else if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (ch === '\r') {
      // Swallow; the paired '\n' (or EOF below) ends the row.
    } else {
      field += ch
    }
  }
  // Flush the trailing field/row if the file didn't end with a newline.
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

/** Pick the delimiter from the first non-empty line: tabs win only if present and commas aren't. */
function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/).find((l) => l.trim() !== '') ?? ''
  if (firstLine.includes('\t') && !firstLine.includes(',')) return '\t'
  return ','
}

/**
 * Try to read the first row as a header. Returns the column map plus whether it
 * looked like a header at all (≥1 recognized alias). We match each field to the
 * first column whose normalized text is one of its aliases, and never reuse a
 * column for two fields.
 */
function detectHeader(headerRow: string[]): { map: ColumnMap; detected: boolean } {
  const map: ColumnMap = {}
  const taken = new Set<number>()
  const cells = headerRow.map(normHeader)

  for (const field of Object.keys(HEADER_ALIASES) as Field[]) {
    const aliases = HEADER_ALIASES[field]
    const idx = cells.findIndex((c, i) => !taken.has(i) && aliases.includes(c))
    if (idx !== -1) {
      map[field] = idx
      taken.add(idx)
    }
  }

  // A header is "detected" only if we could place at least the part number or
  // enough other columns to be confident row 0 isn't real data.
  const detected = map.partNo !== undefined || Object.keys(map).length >= 2
  return { map, detected }
}

/** Clamp a raw quantity cell to a whole number ≥ 1 (default 1 when unparseable). */
function parseQty(raw: string | undefined): number {
  if (!raw) return 1
  // parseFloat reads a leading number (ignoring surrounding text / units like
  // "12 ea"); strip thousands separators first so "1,000" survives. Floor to a
  // whole count, and fall back to 1 for anything non-positive or unparseable.
  const n = Math.floor(parseFloat(raw.replace(/,/g, '')))
  if (!Number.isFinite(n) || n < 1) return 1
  return n
}

const at = (row: string[], idx: number | undefined): string =>
  idx === undefined ? '' : (row[idx] ?? '').trim()

/**
 * Parse the text of an uploaded CSV/TXT BOM into reviewable line items.
 *
 * Auto-detects a header row and maps common column-name aliases (Part Number /
 * MPN, Manufacturer / Mfr, Qty / Quantity, Description). When no header is
 * recognized it falls back to positional columns: part no, manufacturer, qty,
 * description. Rows without a part number are skipped (counted in `skipped`),
 * quantities are clamped to ≥ 1, and a missing item name is resolved from the
 * catalog (`describePartNo`) so the review table is never blank.
 */
export function parseBomText(text: string): BomParseResult {
  const grid = tokenize(text, detectDelimiter(text)).filter((r) => r.some((c) => c.trim() !== ''))
  if (grid.length === 0) return { rows: [], skipped: 0, headerDetected: false }

  const { map, detected } = detectHeader(grid[0])
  const columns: Required<ColumnMap> = detected
    ? { partNo: map.partNo ?? 0, manufacturer: map.manufacturer ?? 1, quantity: map.quantity ?? 2, description: map.description ?? -1 }
    : { partNo: 0, manufacturer: 1, quantity: 2, description: 3 }

  const dataRows = detected ? grid.slice(1) : grid

  const rows: ParsedBomRow[] = []
  let skipped = 0

  for (const raw of dataRows) {
    const partNo = at(raw, columns.partNo)
    if (!partNo) {
      skipped++
      continue
    }
    const manufacturer = at(raw, columns.manufacturer)
    const descCell = columns.description >= 0 ? at(raw, columns.description) : ''
    rows.push({
      partNo,
      manufacturer,
      description: descCell || describePartNo(partNo),
      quantity: parseQty(columns.quantity >= 0 ? raw[columns.quantity] : undefined),
    })
  }

  return { rows, skipped, headerDetected: detected }
}

/** A row is ready to add to the cart once it has both a part number and a manufacturer. */
export function isRowValid(row: ParsedBomRow): boolean {
  return row.partNo.trim() !== '' && row.manufacturer.trim() !== ''
}

/** Re-resolve a row's item name from the catalog after its part number is edited. */
export function resolveDescription(partNo: string): string {
  const trimmed = partNo.trim()
  if (!trimmed) return ''
  return lookupPartByNumber(trimmed)?.description ?? describePartNo(trimmed)
}
