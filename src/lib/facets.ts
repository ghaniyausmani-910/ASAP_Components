// ─────────────────────────────────────────────────────────────
// Faceted-filter toolkit — pure, framework-agnostic helpers shared
// by the catalog listing tables (see PartsListingTable, CageTable).
// ─────────────────────────────────────────────────────────────

export interface FacetOption {
  value: string
  count: number
}

/**
 * Tally distinct values of `accessor` across `items`, dropping blanks.
 * Sorted by count (desc) then value (asc) so the busiest facets surface first.
 */
export function facetCounts<T>(
  items: readonly T[],
  accessor: (item: T) => string | undefined | null,
): FacetOption[] {
  const map = new Map<string, number>()
  for (const item of items) {
    const v = accessor(item)
    if (v == null || v === '') continue
    map.set(v, (map.get(v) ?? 0) + 1)
  }
  return Array.from(map, ([value, count]) => ({ value, count })).sort(
    (a, b) => b.count - a.count || a.value.localeCompare(b.value),
  )
}

/**
 * Derive a part-number "series" prefix used as a coarse grouping facet, e.g.
 *   MS27039-1-08   → "MS"      (multi-letter standard prefix)
 *   NAS1802-3-10   → "NAS"
 *   D38999/26WB35  → "D38999"  (single letter + its number run: a real series)
 *   5305-00-984-…  → "5305"    (pure numeric: leading segment / FSC)
 */
export function partSeries(partNo: string): string {
  const s = partNo.trim().toUpperCase()
  if (!s) return ''
  const alpha = s.match(/^[A-Z]+/)?.[0] ?? ''
  if (alpha.length >= 2) return alpha
  if (alpha.length === 1) {
    const digits = s.slice(1).match(/^\d+/)?.[0] ?? ''
    return digits ? alpha + digits : alpha
  }
  // No leading letters — group by the first separator-delimited segment.
  return s.split(/[-/ ]/)[0] || s
}

export interface FacetDef<T> {
  accessor: (item: T) => string | undefined | null
  /** Currently-selected values for this facet; empty = no refinement. */
  selected: ReadonlySet<string>
}

/**
 * Keep items matching EVERY active facet (AND across facets), where a facet
 * matches when the item's value is one of its selected values (OR within a facet).
 * Facets with no selection are ignored.
 */
export function applyFacets<T>(items: readonly T[], defs: readonly FacetDef<T>[]): T[] {
  const active = defs.filter((d) => d.selected.size > 0)
  if (active.length === 0) return items.slice()
  return items.filter((item) =>
    active.every((d) => {
      const v = d.accessor(item)
      return v != null && d.selected.has(v)
    }),
  )
}

export type SortKey = 'partNo' | 'manufacturer'
export type SortDir = 'asc' | 'desc'

/** Stable, natural-order sort by a string-valued key (numeric-aware). Returns a new array. */
export function sortByKey<T>(items: readonly T[], key: keyof T, dir: SortDir = 'asc'): T[] {
  const factor = dir === 'asc' ? 1 : -1
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const av = String(a.item[key] ?? '')
      const bv = String(b.item[key] ?? '')
      const cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' })
      return cmp !== 0 ? factor * cmp : a.index - b.index
    })
    .map(({ item }) => item)
}
