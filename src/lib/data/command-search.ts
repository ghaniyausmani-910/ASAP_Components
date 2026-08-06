import { CATALOG_PARTS } from './catalog-parts'
import { CATEGORIES } from './catalog'
import { norm, type Suggestion } from './suggestions'
import { slugify } from '@/lib/utils'

/**
 * Search backing the global command palette (⌘K). Unlike the header
 * autocomplete — which is scoped to one field via the type dropdown
 * (suggestions.ts) — the palette searches everything at once and groups the
 * results: catalog **parts** (matched across every field) and site **pages**.
 */

/** Part-detail URL for a canonical part (mirrors suggestions.ts `partHref`). */
function partHref(category: string, manufacturer: string, partNo: string): string {
  return `/catalog/${category}/quote/${slugify(manufacturer)}/${encodeURIComponent(partNo)}`
}

export interface PageResult {
  label: string
  /** Secondary line — the parent category, or a short descriptor. */
  hint?: string
  href: string
}

// ── Page index ──────────────────────────────────────────────────
// Top-level destinations plus every catalog sub-page (built from the same
// CATEGORIES table that drives the header mega-menu), so "manufacturers",
// "bearings", "NSN", "quality" etc. all resolve to a real route.
const TOP_PAGES: PageResult[] = [
  { label: 'Home', href: '/' },
  { label: 'About ASAP', hint: 'Company', href: '/about-us' },
  { label: 'Quality & Certifications', hint: 'Company', href: '/quality' },
  { label: 'Blog', hint: 'Resources', href: '/blog' },
  { label: 'Contact Us', hint: 'Company', href: '/contact-us' },
  { label: 'Instant RFQ', hint: 'Request a quote', href: '/instant-rfq' },
  { label: 'Sitemap', hint: 'Resources', href: '/sitemap' },
]

const CATALOG_PAGES: PageResult[] = CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({
    label: item.label,
    hint: cat.label,
    href: `/catalog/${cat.slug}/${item.slug}`,
  })),
)

const PAGE_INDEX: PageResult[] = [...TOP_PAGES, ...CATALOG_PAGES]

/**
 * Rank catalog parts against `query`, matching across every field (part number,
 * NSN, NIIN, CAGE code, manufacturer, description) but always titling the row
 * with the part number. Same prefix(0)/substring(1)/secondary(2) ranking as
 * `searchSuggestions`.
 */
export function searchParts(query: string, limit = 6): Suggestion[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const nq = norm(query)

  return CATALOG_PARTS.map((p) => {
    // Primary keys — a hit here means the row title (part number) or a close
    // identifier matched, so it ranks above description-only matches.
    const primary = [p.partNo, p.nsn, p.niin, p.cageCode]
    const nprimary = primary.map(norm)
    const secondary = [p.manufacturer, p.description].map((s) => s.toLowerCase())

    let score = -1
    if (primary.some((v) => v.toLowerCase().startsWith(q)) || (nq && nprimary.some((v) => v.startsWith(nq)))) {
      score = 0
    } else if (primary.some((v) => v.toLowerCase().includes(q)) || (nq && nprimary.some((v) => v.includes(nq)))) {
      score = 1
    } else if (secondary.some((v) => v.includes(q))) {
      score = 2
    }
    return { p, score }
  })
    .filter((x) => x.score >= 0)
    .sort((a, b) => a.score - b.score || a.p.partNo.localeCompare(b.p.partNo))
    .slice(0, limit)
    .map(
      ({ p }): Suggestion => ({
        value: p.partNo,
        hint: p.description,
        mfr: p.manufacturer,
        type: 'Part Number',
        href: partHref(p.category, p.manufacturer, p.partNo),
      }),
    )
}

/** Rank site pages against `query` (label first, then the category hint). */
export function searchPages(query: string, limit = 5): PageResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const nq = norm(query)

  return PAGE_INDEX.map((page) => {
    const label = page.label.toLowerCase()
    const nlabel = norm(page.label)
    const hint = page.hint?.toLowerCase() ?? ''
    let score = -1
    if (label.startsWith(q) || (nq && nlabel.startsWith(nq))) score = 0
    else if (label.includes(q) || (nq && nlabel.includes(nq))) score = 1
    else if (hint.includes(q)) score = 2
    return { page, score }
  })
    .filter((x) => x.score >= 0)
    .sort((a, b) => a.score - b.score || a.page.label.localeCompare(b.page.label))
    .slice(0, limit)
    .map((x) => x.page)
}

export interface CommandResults {
  parts: Suggestion[]
  pages: PageResult[]
}

/** Grouped results for the command palette. */
export function searchCommand(query: string): CommandResults {
  return { parts: searchParts(query), pages: searchPages(query) }
}
