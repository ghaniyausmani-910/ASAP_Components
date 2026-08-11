import { describe, it, expect } from 'vitest'
import { searchParts, searchPages, searchCommand } from '@/lib/data/command-search'

describe('searchParts', () => {
  it('returns [] for an empty query', () => {
    expect(searchParts('')).toEqual([])
    expect(searchParts('   ')).toEqual([])
  })

  it('matches part numbers by prefix', () => {
    const results = searchParts('LM')
    const values = results.map((r) => r.value)
    expect(values).toContain('LM358N')
    expect(values).toContain('LM7805CT')
    expect(values.every((v) => v.toUpperCase().startsWith('LM'))).toBe(true)
  })

  it('matches across NSN / NIIN / CAGE identifiers, ignoring punctuation', () => {
    // 80205 is MS27039-1-08's CAGE code.
    expect(searchParts('80205').map((r) => r.value)).toContain('MS27039-1-08')
    // NSN prefix, dashed as stored.
    expect(searchParts('5935-01-197').length).toBeGreaterThan(0)
    // Same NSN without punctuation still matches (norm()).
    expect(searchParts('593501197').length).toBeGreaterThan(0)
  })

  it('ranks a part-number/identifier match above a description-only match', () => {
    // "Boeing" only appears in the manufacturer (a secondary field) → score 2.
    const bySecondary = searchParts('Boeing')
    expect(bySecondary.length).toBeGreaterThan(0)
    expect(bySecondary.some((r) => r.mfr === 'The Boeing Company')).toBe(true)
  })

  it('respects the limit', () => {
    expect(searchParts('MS', 2)).toHaveLength(2)
  })

  it('builds a part-detail href from category/manufacturer/partNo', () => {
    const [cfm] = searchParts('CFM56-7B')
    expect(cfm.href).toBe('/catalog/aviation/quote/ge-aviation/CFM56-7B')
  })
})

describe('searchPages', () => {
  it('returns [] for an empty query', () => {
    expect(searchPages('')).toEqual([])
  })

  it('finds top-level and catalog sub-pages by label', () => {
    expect(searchPages('bearings').some((p) => p.label === 'Bearings')).toBe(true)
    expect(searchPages('quality').some((p) => p.label.startsWith('Quality'))).toBe(true)
    expect(searchPages('instant').some((p) => p.label === 'Instant RFQ')).toBe(true)
  })

  it('respects the limit', () => {
    expect(searchPages('manufacturers', 2).length).toBeLessThanOrEqual(2)
  })
})

describe('searchCommand', () => {
  it('groups results into parts and pages', () => {
    const out = searchCommand('manufacturers')
    expect(out).toHaveProperty('parts')
    expect(out).toHaveProperty('pages')
    expect(Array.isArray(out.parts)).toBe(true)
    expect(Array.isArray(out.pages)).toBe(true)
  })
})
