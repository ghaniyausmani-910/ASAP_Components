import { describe, it, expect } from 'vitest'
import {
  parseBomText,
  parseBomFile,
  bomRowsForCart,
  bomRowProblem,
  normaliseQty,
  BOM_ACCEPT,
} from '@/lib/rfq/parseBom'

describe('parseBomText — headers + column detection', () => {
  it('parses a standard header CSV', () => {
    const out = parseBomText('Part Number,Qty,Manufacturer\nMS21042-3,10,Kapco\nAN960-10,5,Boeing')
    if ('error' in out) throw new Error(out.error)
    expect(out.rows).toEqual([
      { partNumber: 'MS21042-3', quantity: '10', manufacturer: 'Kapco', problem: null },
      { partNumber: 'AN960-10', quantity: '5', manufacturer: 'Boeing', problem: null },
    ])
  })

  it('handles reordered columns via the alias table', () => {
    const out = parseBomText('MFG,QUANTITY,PART NO\nBoeing,3,BACB30LN6K')
    if ('error' in out) throw new Error(out.error)
    expect(out.rows[0]).toMatchObject({ partNumber: 'BACB30LN6K', quantity: '3', manufacturer: 'Boeing' })
  })

  it('treats a headerless file as part numbers in column 0', () => {
    const out = parseBomText('MS21042-3\nAN960-10\nNAS1149F0332P')
    if ('error' in out) throw new Error(out.error)
    expect(out.rows.map((r) => r.partNumber)).toEqual(['MS21042-3', 'AN960-10', 'NAS1149F0332P'])
    // No qty column → each defaults-to-1 with the informational problem.
    expect(out.rows[0].problem).toBe('No quantity, defaults to 1')
  })
})

describe('parseBomText — delimiters + quoting', () => {
  it('detects tab, semicolon, and pipe delimiters', () => {
    expect((parseBomText('Part\tQty\nMS21042-3\t2') as { rows: unknown[] }).rows).toBeTruthy()
    const semi = parseBomText('part;qty\nAN3-4A;7')
    const pipe = parseBomText('part|qty\nAN3-4A|9')
    if ('error' in semi || 'error' in pipe) throw new Error('delimiter not detected')
    expect(semi.rows[0]).toMatchObject({ partNumber: 'AN3-4A', quantity: '7' })
    expect(pipe.rows[0]).toMatchObject({ partNumber: 'AN3-4A', quantity: '9' })
  })

  it('keeps quoted fields containing the delimiter intact', () => {
    const out = parseBomText('Part,Description,Qty\n"D38999/26WB35PN","Connector, circular, plug",4')
    if ('error' in out) throw new Error(out.error)
    expect(out.rows[0]).toMatchObject({ partNumber: 'D38999/26WB35PN', quantity: '4' })
  })

  it('unescapes doubled quotes', () => {
    const out = parseBomText('Part,Qty\n"AN""3""-4A",2')
    if ('error' in out) throw new Error(out.error)
    expect(out.rows[0].partNumber).toBe('AN"3"-4A')
  })
})

describe('normaliseQty', () => {
  it('strips units, rounds, and rejects non-positive', () => {
    expect(normaliseQty('10 ea')).toBe('10')
    expect(normaliseQty('2.6')).toBe('3')
    expect(normaliseQty('0')).toBe('')
    expect(normaliseQty('abc')).toBe('')
    expect(normaliseQty('')).toBe('')
  })
})

describe('parseBomText — errors', () => {
  it('errors on an empty file', () => {
    expect(parseBomText('   \n  ')).toEqual({ error: 'That file has no rows in it.' })
  })

  it('errors when no part-number column resolves', () => {
    // Header matches a qty alias but every part cell is blank.
    const out = parseBomText('qty\n5\n6')
    expect('error' in out && out.error).toBe('We could not find a part-number column in that file.')
  })
})

describe('bomRowsForCart', () => {
  it('drops blank-part rows, coerces qty to >=1, nulls empty manufacturer', () => {
    const rows = [
      { partNumber: 'MS21042-3', quantity: '10', manufacturer: 'Kapco', problem: null },
      { partNumber: '  ', quantity: '3', manufacturer: '', problem: 'x' },
      { partNumber: 'AN960-10', quantity: '', manufacturer: '', problem: null },
    ]
    expect(bomRowsForCart(rows)).toEqual([
      { partNumber: 'MS21042-3', quantity: 10, manufacturer: 'Kapco' },
      { partNumber: 'AN960-10', quantity: 1, manufacturer: null },
    ])
  })
})

describe('bomRowProblem (live re-validation)', () => {
  it('flags missing part number, then missing quantity, else null', () => {
    expect(bomRowProblem({ partNumber: '', quantity: '5' })).toBe('No part number in this row')
    expect(bomRowProblem({ partNumber: 'X', quantity: '' })).toBe('No quantity, defaults to 1')
    expect(bomRowProblem({ partNumber: 'X', quantity: '2' })).toBeNull()
  })
})

describe('parseBomFile — extension gating (no FileReader needed)', () => {
  const fake = (name: string) => ({ name }) as File

  it('rejects export-controlled / barred formats with the compliance note', async () => {
    const r = await parseBomFile(fake('drawing.pdf'))
    expect(r.kind).toBe('error')
    expect(r.kind === 'error' && r.message).toMatch(/not accepted/i)
    expect(r.kind === 'error' && r.message).toMatch(/export-controlled/i)
  })

  it('rejects unknown formats, listing accepted types', async () => {
    const r = await parseBomFile(fake('list.docx'))
    expect(r.kind).toBe('error')
    expect(r.kind === 'error' && r.message).toContain(BOM_ACCEPT)
  })

  it('accepts xls/xlsx as attached-but-not-parsed', async () => {
    const r = await parseBomFile(fake('parts.xlsx'))
    expect(r.kind).toBe('attached')
    expect(r.kind === 'attached' && r.fileName).toBe('parts.xlsx')
  })
})
