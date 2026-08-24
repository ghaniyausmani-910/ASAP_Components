/**
 * BOM (Bill of Materials) parser — pure, UI-free, hand-rolled (no CSV library).
 *
 * The parsing, alias table, delimiter detection, quote-aware splitting, quantity
 * normalization, and validation are ported verbatim from the source feature —
 * they encode real edge cases (reordered columns, headerless files, quoted
 * fields with embedded commas, messy quantities) and are unit-tested. Only the
 * injected constants and the row/cart shapes are adapted to this site.
 */

// ── Injected constants (this site's equivalents) ────────────────────────────
export const BOM_ACCEPT = '.csv,.txt,.xls,.xlsx'
// Export-controlled / drawing-bearing formats are refused: this is a defense &
// aerospace distributor (ITAR-registered), and these carry technical data.
export const BOM_BARRED = [
  'pdf', 'dwg', 'dxf', 'step', 'stp', 'iges', 'igs',
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tif', 'tiff',
  'zip', 'rar', '7z',
]
export const COMPLIANCE_NOTE =
  'Technical drawings and data files are export-controlled — please don’t upload them here. Send a tabular parts list only.'

// ── Types ───────────────────────────────────────────────────────────────────
export type BomRow = { partNumber: string; quantity: string; manufacturer: string; problem: string | null }
export type BomParseResult =
  | { kind: 'parsed'; rows: BomRow[]; fileName: string }
  | { kind: 'attached'; fileName: string; note: string } // xls/xlsx: valid, not browser-parseable
  | { kind: 'error'; message: string }

const ALIASES: Record<'partNumber' | 'quantity' | 'manufacturer', string[]> = {
  partNumber: ['part number', 'partnumber', 'part no', 'partno', 'part', 'mpn', 'manufacturer part number', 'pn', 'item', 'nsn'],
  quantity: ['quantity', 'qty', 'qnty', 'count', 'each', 'ea', 'req qty', 'quantity required'],
  manufacturer: ['manufacturer', 'mfg', 'mfr', 'brand', 'oem', 'make'],
}

function detectDelimiter(line: string): string {
  const counts: [string, number][] = [
    ['\t', (line.match(/\t/g) ?? []).length], [',', (line.match(/,/g) ?? []).length],
    [';', (line.match(/;/g) ?? []).length], ['|', (line.match(/\|/g) ?? []).length],
  ]
  counts.sort((a, b) => b[1] - a[1])
  return counts[0][1] > 0 ? counts[0][0] : ','
}

// Quote-aware: a description with a comma must not shift columns.
function splitRow(line: string, delim: string): string[] {
  const out: string[] = []; let cur = ''; let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { if (inQuotes && line[i + 1] === '"') { cur += '"'; i++ } else inQuotes = !inQuotes }
    else if (ch === delim && !inQuotes) { out.push(cur); cur = '' }
    else cur += ch
  }
  out.push(cur)
  return out.map((c) => c.trim().replace(/^"|"$/g, ''))
}

export function normaliseQty(raw: string): string {
  const digits = raw.replace(/[^\d.]/g, ''); if (!digits) return ''
  const n = Math.round(Number(digits))
  return Number.isFinite(n) && n > 0 ? String(n) : ''
}

export function parseBomText(text: string): { rows: BomRow[] } | { error: string } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length === 0) return { error: 'That file has no rows in it.' }
  const delim = detectDelimiter(lines[0])
  const header = splitRow(lines[0], delim).map((h) => h.toLowerCase())
  const findCol = (key: keyof typeof ALIASES) =>
    header.findIndex((h) => ALIASES[key].some((a) => h === a || h.includes(a)))
  let iPart = findCol('partNumber'); const iQty = findCol('quantity'); const iMfg = findCol('manufacturer')
  const hasHeader = iPart >= 0 || iQty >= 0
  if (!hasHeader) iPart = 0                        // headerless: col 0 is the part number
  const body = hasHeader ? lines.slice(1) : lines
  const rows: BomRow[] = body.map((line) => {
    const cells = splitRow(line, delim)
    const partNumber = (cells[iPart] ?? '').trim()
    const quantity = normaliseQty(iQty >= 0 ? (cells[iQty] ?? '') : '')
    const manufacturer = iMfg >= 0 ? (cells[iMfg] ?? '').trim() : ''
    return {
      partNumber, quantity, manufacturer,
      problem: !partNumber ? 'No part number in this row' : !quantity ? 'No quantity, defaults to 1' : null,
    }
  })
  if (rows.every((r) => !r.partNumber)) return { error: 'We could not find a part-number column in that file.' }
  return { rows }
}

export function parseBomFile(file: File): Promise<BomParseResult> {
  return new Promise((resolve) => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (BOM_BARRED.includes(ext)) { resolve({ kind: 'error', message: `${ext.toUpperCase()} files are not accepted. ${COMPLIANCE_NOTE}` }); return }
    if (!['csv', 'txt', 'xls', 'xlsx'].includes(ext)) { resolve({ kind: 'error', message: `Tabular list formats only: ${BOM_ACCEPT}.` }); return }
    if (ext === 'xls' || ext === 'xlsx') {
      resolve({ kind: 'attached', fileName: file.name, note: 'Spreadsheet accepted but not parsed here. Save it as CSV to review lines before sending, or a rep will process the sheet.' }); return
    }
    const reader = new FileReader()
    reader.onload = () => { const out = parseBomText(String(reader.result ?? '')); if ('error' in out) resolve({ kind: 'error', message: out.error }); else resolve({ kind: 'parsed', rows: out.rows, fileName: file.name }) }
    reader.onerror = () => resolve({ kind: 'error', message: 'That file could not be read.' })
    reader.readAsText(file)
  })
}

export function bomRowsForCart(rows: BomRow[]) {
  return rows.filter((r) => r.partNumber.trim()).map((r) => ({
    partNumber: r.partNumber.trim(),
    quantity: Math.max(1, Number(r.quantity) || 1),
    manufacturer: r.manufacturer.trim() || null,
  }))
}

// ── UI helper (live re-validation on edit) — same rule as parseBomText, kept
//    separate so the parser above stays a verbatim port. ──────────────────────
export function bomRowProblem(row: { partNumber: string; quantity: string }): string | null {
  if (!row.partNumber.trim()) return 'No part number in this row'
  if (!normaliseQty(row.quantity)) return 'No quantity, defaults to 1'
  return null
}
