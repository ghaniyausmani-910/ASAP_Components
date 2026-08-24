import { describe, it, expect } from 'vitest'
import type { CatalogPart } from '@/lib/data/catalog-parts'
import {
  shouldTriggerBulkPaste,
  parseBulkPaste,
  committableTokens,
  uniqueNormalizedTokens,
  BULK_PASTE_CAP,
} from '@/lib/search/bulkPaste'

// A tiny fixed catalog so tests don't depend on the real 22-row table.
// `NSN12345` deliberately collides (it's DUP-1's partNo AND DUP-2's cageCode)
// so we can exercise the 'ambiguous' branch.
const CATALOG: CatalogPart[] = [
  { partNo: 'AN960-10', manufacturer: 'Kapco Valtec', category: 'standard', description: 'Washer, Flat', nsn: '5310-00-167-0820', niin: '00-167-0820', cageCode: '7X354' },
  { partNo: 'MS21042-3', manufacturer: 'Kapco Valtec', category: 'standard', description: 'Nut', nsn: '5310-00-167-0793', niin: '00-167-0793', cageCode: '96906' },
  { partNo: 'NSN12345', manufacturer: 'Acme', category: 'standard', description: 'Collider A', nsn: '1111-11-111-1111', niin: '11-111-1111', cageCode: 'ZZZZZ' },
  { partNo: 'OTHER-1', manufacturer: 'Acme', category: 'standard', description: 'Collider B', nsn: '2222-22-222-2222', niin: '22-222-2222', cageCode: 'NSN12345' },
]

describe('shouldTriggerBulkPaste', () => {
  it('does NOT trigger on a single line (even with dashes/spaces)', () => {
    expect(shouldTriggerBulkPaste('AN-123-45')).toBe(false)
    expect(shouldTriggerBulkPaste('MS21042 3')).toBe(false)
    expect(shouldTriggerBulkPaste('')).toBe(false)
  })

  it('triggers on a newline with ≥2 non-empty segments', () => {
    expect(shouldTriggerBulkPaste('AN960-10\nMS21042-3')).toBe(true)
    expect(shouldTriggerBulkPaste('AN960-10\r\nMS21042-3\r\n')).toBe(true)
  })

  it('triggers on tab-separated values', () => {
    expect(shouldTriggerBulkPaste('AN960-10\tMS21042-3')).toBe(true)
  })

  it('does NOT trigger when a newline yields only one real segment', () => {
    expect(shouldTriggerBulkPaste('AN960-10\n\n')).toBe(false)
    expect(shouldTriggerBulkPaste('\nAN960-10')).toBe(false)
  })
})

describe('parseBulkPaste — splitting', () => {
  it('splits on newlines and reports counts', () => {
    const r = parseBulkPaste('AN960-10\nMS21042-3\nOTHER-1', CATALOG)
    expect(r.rawCount).toBe(3)
    expect(r.truncated).toBe(false)
    expect(r.tokens.map((t) => t.raw)).toEqual(['AN960-10', 'MS21042-3', 'OTHER-1'])
    expect(r.tokens.map((t) => t.index)).toEqual([1, 2, 3])
  })

  it('splits on commas and semicolons in bulk mode', () => {
    const r = parseBulkPaste('AN960-10, MS21042-3; OTHER-1', CATALOG)
    expect(r.tokens).toHaveLength(3)
    expect(r.tokens.map((t) => t.raw)).toEqual(['AN960-10', 'MS21042-3', 'OTHER-1'])
  })

  it('drops blank segments from mixed/adjacent separators', () => {
    const r = parseBulkPaste('AN960-10,,\n\t;MS21042-3', CATALOG)
    expect(r.tokens.map((t) => t.raw)).toEqual(['AN960-10', 'MS21042-3'])
  })
})

describe('parseBulkPaste — cap + truncation', () => {
  it('caps at BULK_PASTE_CAP and reports pre-truncation rawCount', () => {
    const text = Array.from({ length: 130 }, (_, i) => `PN-${i}`).join('\n')
    const r = parseBulkPaste(text, CATALOG)
    expect(r.rawCount).toBe(130)
    expect(r.truncated).toBe(true)
    expect(r.tokens).toHaveLength(BULK_PASTE_CAP)
    expect(r.tokens[BULK_PASTE_CAP - 1].raw).toBe(`PN-${BULK_PASTE_CAP - 1}`)
  })

  it('does not flag truncation at exactly the cap', () => {
    const text = Array.from({ length: BULK_PASTE_CAP }, (_, i) => `PN-${i}`).join('\n')
    const r = parseBulkPaste(text, CATALOG)
    expect(r.truncated).toBe(false)
    expect(r.tokens).toHaveLength(BULK_PASTE_CAP)
  })
})

describe('parseBulkPaste — classification', () => {
  it('classifies an exact catalog hit as "match" with the record + field', () => {
    const [t] = parseBulkPaste('MS21042-3', CATALOG).tokens
    expect(t.status).toBe('match')
    expect(t.record?.partNo).toBe('MS21042-3')
    expect(t.detectedType).toBe('Part Number')
  })

  it('matches punctuation/case-insensitively and by NSN + CAGE', () => {
    const r = parseBulkPaste('ms21042 3\n5310-00-167-0820\n7X354', CATALOG)
    expect(r.tokens[0].status).toBe('match') // lowercase + space → MS21042-3
    expect(r.tokens[0].record?.partNo).toBe('MS21042-3')
    expect(r.tokens[1].status).toBe('match') // by NSN
    expect(r.tokens[1].detectedType).toBe('NSN')
    expect(r.tokens[2].status).toBe('match') // by CAGE
    expect(r.tokens[2].detectedType).toBe('CAGE Code')
  })

  it('classifies a value hitting >1 record as "ambiguous" with matchCount', () => {
    const [t] = parseBulkPaste('NSN12345', CATALOG).tokens
    expect(t.status).toBe('ambiguous')
    expect(t.matchCount).toBe(2)
  })

  it('classifies a value with no hits as "unknown"', () => {
    const [t] = parseBulkPaste('ZZ-NOPE-999', CATALOG).tokens
    expect(t.status).toBe('unknown')
    expect(t.record).toBeUndefined()
  })

  it('flags a repeat (same normalized form) as "duplicate" pointing at the first occurrence', () => {
    const r = parseBulkPaste('MS21042-3\nOTHER-1\nms21042-3', CATALOG)
    expect(r.tokens[2].status).toBe('duplicate')
    expect(r.tokens[2].duplicateOf).toBe(1)
  })
})

describe('commit helpers', () => {
  it('committableTokens keeps match + unknown, drops ambiguous + duplicate', () => {
    const r = parseBulkPaste('MS21042-3\nNSN12345\nZZ-NOPE-999\nMS21042-3', CATALOG)
    const committable = committableTokens(r.tokens)
    expect(committable.map((t) => t.status).sort()).toEqual(['match', 'unknown'])
  })

  it('uniqueNormalizedTokens excludes duplicates and uppercases the value', () => {
    const r = parseBulkPaste('an960-10\nMS21042-3\nAN960-10', CATALOG)
    expect(uniqueNormalizedTokens(r.tokens)).toEqual(['AN960-10', 'MS21042-3'])
  })
})
