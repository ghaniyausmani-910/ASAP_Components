import { describe, it, expect } from 'vitest'
import { facetCounts, partSeries, applyFacets, sortByKey } from '@/lib/facets'

type Row = { partNo: string; manufacturer: string; description?: string }

const rows: Row[] = [
  { partNo: 'MS27039-1-08', manufacturer: 'Boeing', description: 'Screw' },
  { partNo: 'MS21042-3', manufacturer: 'Boeing', description: 'Nut' },
  { partNo: 'NAS1802-3-10', manufacturer: 'Amphenol', description: 'Screw' },
  { partNo: 'D38999/26WB35PN', manufacturer: 'Amphenol' },
  { partNo: '5305-00-984-6210', manufacturer: 'Others', description: 'Screw' },
]

describe('facetCounts', () => {
  it('tallies distinct values, sorted by count desc then value asc', () => {
    expect(facetCounts(rows, (r) => r.manufacturer)).toEqual([
      { value: 'Amphenol', count: 2 },
      { value: 'Boeing', count: 2 },
      { value: 'Others', count: 1 },
    ])
  })

  it('skips blank / missing values', () => {
    const counts = facetCounts(rows, (r) => r.description)
    expect(counts).toEqual([
      { value: 'Screw', count: 3 },
      { value: 'Nut', count: 1 },
    ])
  })
})

describe('partSeries', () => {
  it('uses a multi-letter standard prefix', () => {
    expect(partSeries('MS27039-1-08')).toBe('MS')
    expect(partSeries('NAS1802-3-10')).toBe('NAS')
    expect(partSeries('bac27-3')).toBe('BAC')
  })

  it('keeps a single leading letter together with its number run', () => {
    expect(partSeries('D38999/26WB35PN')).toBe('D38999')
  })

  it('groups pure-numeric part numbers by their first segment', () => {
    expect(partSeries('5305-00-984-6210')).toBe('5305')
  })

  it('handles blank input', () => {
    expect(partSeries('   ')).toBe('')
  })
})

describe('applyFacets', () => {
  it('returns a copy of all items when nothing is selected', () => {
    const out = applyFacets(rows, [{ accessor: (r) => r.manufacturer, selected: new Set() }])
    expect(out).toHaveLength(rows.length)
    expect(out).not.toBe(rows)
  })

  it('ORs within a facet', () => {
    const out = applyFacets(rows, [
      { accessor: (r) => r.manufacturer, selected: new Set(['Boeing', 'Others']) },
    ])
    expect(out.map((r) => r.partNo)).toEqual(['MS27039-1-08', 'MS21042-3', '5305-00-984-6210'])
  })

  it('ANDs across facets', () => {
    const out = applyFacets(rows, [
      { accessor: (r) => r.manufacturer, selected: new Set(['Boeing']) },
      { accessor: (r) => r.description, selected: new Set(['Screw']) },
    ])
    expect(out.map((r) => r.partNo)).toEqual(['MS27039-1-08'])
  })
})

describe('sortByKey', () => {
  it('sorts ascending with natural numeric ordering', () => {
    const out = sortByKey(rows, 'partNo', 'asc')
    expect(out.map((r) => r.partNo)).toEqual([
      '5305-00-984-6210',
      'D38999/26WB35PN',
      'MS21042-3',
      'MS27039-1-08',
      'NAS1802-3-10',
    ])
  })

  it('sorts descending', () => {
    const out = sortByKey(rows, 'manufacturer', 'desc')
    expect(out[0].manufacturer).toBe('Others')
  })

  it('is stable for equal keys and does not mutate the input', () => {
    const before = rows.map((r) => r.partNo)
    const out = sortByKey(rows, 'manufacturer', 'asc')
    // Boeing rows keep their original relative order
    const boeing = out.filter((r) => r.manufacturer === 'Boeing').map((r) => r.partNo)
    expect(boeing).toEqual(['MS27039-1-08', 'MS21042-3'])
    expect(rows.map((r) => r.partNo)).toEqual(before)
  })
})
