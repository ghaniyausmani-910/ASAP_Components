import { describe, it, expect } from 'vitest'
import { norm, searchSuggestions, hasCatalogMatch, searchTargetHref } from '@/lib/data/suggestions'

describe('norm', () => {
  it('lowercases and strips non-alphanumerics', () => {
    expect(norm('5935-01-123-4567')).toBe('5935011234567')
    expect(norm('D38999/26WB35PN')).toBe('d3899926wb35pn')
  })
})

describe('searchSuggestions', () => {
  it('returns [] for an empty query', () => {
    expect(searchSuggestions('', 'Part Number')).toEqual([])
  })

  it('searches the part-number pool by default and tags the type', () => {
    const results = searchSuggestions('D38999', 'Part Number')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((r) => r.type === 'Part Number')).toBe(true)
    expect(results.every((r) => r.value.startsWith('D38999'))).toBe(true)
  })

  it('switches to the manufacturer pool for type "Manufacturer"', () => {
    const results = searchSuggestions('Amph', 'Manufacturer')
    expect(results.some((r) => r.value === 'Amphenol')).toBe(true)
    expect(results.every((r) => r.type === 'Manufacturer')).toBe(true)
  })

  it('falls back to the part-number pool for an unknown type', () => {
    const results = searchSuggestions('D38999', 'Nonsense')
    expect(results.every((r) => r.type === 'Part Number')).toBe(true)
  })

  it('respects the limit', () => {
    expect(searchSuggestions('M', 'Part Number', 3).length).toBeLessThanOrEqual(3)
  })
})

describe('hasCatalogMatch', () => {
  it('is true for a real catalog part and false for junk', () => {
    expect(hasCatalogMatch('D38999/26WB35PN')).toBe(true)
    expect(hasCatalogMatch('ZZ-NOT-A-PART-XYZ')).toBe(false)
  })
})

describe('searchTargetHref', () => {
  it('routes a catalog match to the results page', () => {
    const href = searchTargetHref('D38999/26WB35PN', 'Part Number')
    expect(href).not.toBeNull()
    expect(href!.startsWith('/search?q=')).toBe(true)
    expect(href).toContain('type=Part%20Number')
  })

  it('routes a miss straight into a pre-filled RFQ, URL-encoded', () => {
    expect(searchTargetHref('ZZ NOT A PART', 'Part Number')).toBe('/rfq/search?partno=ZZ%20NOT%20A%20PART')
  })

  it('returns null for an empty query', () => {
    expect(searchTargetHref('   ', 'Part Number')).toBeNull()
  })
})
