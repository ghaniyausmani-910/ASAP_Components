import { describe, it, expect } from 'vitest'
import { parseBomText, isRowValid, resolveDescription } from '@/lib/rfq/parseBom'

describe('parseBomText — delimiter detection', () => {
  it('parses comma-delimited CSV by default', () => {
    const { rows, headerDetected } = parseBomText('Part Number,Manufacturer,Qty\nAN3-4A,Boeing,5')
    expect(headerDetected).toBe(true)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ partNo: 'AN3-4A', manufacturer: 'Boeing', quantity: 5 })
  })

  it('parses tab-delimited input when tabs are present and commas are not', () => {
    const { rows } = parseBomText('Part Number\tManufacturer\tQty\nAN3-4A\tBoeing\t5')
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ partNo: 'AN3-4A', manufacturer: 'Boeing', quantity: 5 })
  })
})

describe('parseBomText — quoted-field state machine', () => {
  it('keeps a delimiter inside a quoted cell', () => {
    const { rows } = parseBomText('pn,mfr,qty\nAN3-4A,"Kapco, Valtec",5')
    expect(rows[0].manufacturer).toBe('Kapco, Valtec')
  })

  it('keeps an embedded newline inside a quoted cell', () => {
    const { rows } = parseBomText('pn,mfr\n"AN3\n4A",Boeing')
    expect(rows[0].partNo).toBe('AN3\n4A')
  })

  it('unescapes doubled quotes to a literal quote', () => {
    const { rows } = parseBomText('pn,mfr,desc\nAN3,Boeing,"a ""b"" c"')
    expect(rows[0].description).toBe('a "b" c')
  })

  it('handles CRLF line endings', () => {
    const { rows } = parseBomText('pn,mfr\r\nAN3-4A,Boeing\r\n')
    expect(rows).toHaveLength(1)
    expect(rows[0].partNo).toBe('AN3-4A')
  })

  it('flushes the final row when the file has no trailing newline', () => {
    const { rows } = parseBomText('pn,mfr\nAN3-4A,Boeing')
    expect(rows).toHaveLength(1)
    expect(rows[0].partNo).toBe('AN3-4A')
  })
})

describe('parseBomText — header detection & alias mapping', () => {
  it('maps common header aliases to fields', () => {
    const { rows, headerDetected } = parseBomText('MPN,Mfr,Qty (ea),Desc\nAN3-4A,Boeing,3,Bolt')
    expect(headerDetected).toBe(true)
    expect(rows[0]).toEqual({ partNo: 'AN3-4A', manufacturer: 'Boeing', description: 'Bolt', quantity: 3 })
  })

  it('falls back to positional columns when no header is recognized', () => {
    const text = 'AN960-10,Kapco Valtec,5,Washer\nAN3-4A,Kapco Valtec,10,Bolt'
    const { rows, headerDetected } = parseBomText(text)
    expect(headerDetected).toBe(false) // row 0 is treated as data, not consumed
    expect(rows).toHaveLength(2)
    expect(rows[0]).toEqual({ partNo: 'AN960-10', manufacturer: 'Kapco Valtec', description: 'Washer', quantity: 5 })
  })
})

describe('parseBomText — skipped rows & quantity clamping', () => {
  it('skips rows with no part number and counts them', () => {
    const { rows, skipped } = parseBomText('pn,mfr\n,Boeing\nAN3-4A,Boeing')
    expect(rows).toHaveLength(1)
    expect(skipped).toBe(1)
  })

  it('clamps quantities to a whole number >= 1', () => {
    // Quote the cell so a value can legally contain the comma delimiter.
    const qtyOf = (raw: string) => parseBomText(`pn,mfr,qty\nAN3-4A,Boeing,"${raw}"`).rows[0].quantity
    expect(qtyOf('1,000')).toBe(1000) // thousands separator stripped
    expect(qtyOf('12 ea')).toBe(12) // leading number wins, unit ignored
    expect(qtyOf('3.9')).toBe(3) // floored
    expect(qtyOf('0')).toBe(1)
    expect(qtyOf('-3')).toBe(1)
    expect(qtyOf('abc')).toBe(1)
  })
})

describe('parseBomText — description resolution & empty input', () => {
  it('resolves a missing description from the catalog so it is never blank', () => {
    // AN960-10 is a canonical part → 'Washer, Flat'. No description column present.
    const { rows } = parseBomText('pn,mfr,qty\nAN960-10,Kapco Valtec,1')
    expect(rows[0].description).toBe('Washer, Flat')
  })

  it('returns an empty result for empty input', () => {
    expect(parseBomText('')).toEqual({ rows: [], skipped: 0, headerDetected: false })
  })
})

describe('isRowValid', () => {
  const base = { description: '', quantity: 1 }
  it('is true only when both part number and manufacturer are non-blank', () => {
    expect(isRowValid({ ...base, partNo: 'AN3', manufacturer: 'Boeing' })).toBe(true)
    expect(isRowValid({ ...base, partNo: '', manufacturer: 'Boeing' })).toBe(false)
    expect(isRowValid({ ...base, partNo: 'AN3', manufacturer: '   ' })).toBe(false)
  })
})

describe('resolveDescription', () => {
  it('resolves a canonical part number to its curated description', () => {
    expect(resolveDescription('AN960-10')).toBe('Washer, Flat')
    expect(resolveDescription('  an960-10  ')).toBe('Washer, Flat') // trims + case-insensitive
  })

  it('returns a non-empty fallback for an unknown part and empty for blank', () => {
    expect(resolveDescription('ZZ-NOT-A-PART-XYZ')).not.toBe('')
    expect(resolveDescription('   ')).toBe('')
  })
})
