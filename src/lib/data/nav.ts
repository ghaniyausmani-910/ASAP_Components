import { CATEGORIES } from '@/lib/data/catalog'
import { MANUFACTURERS } from '@/lib/data/parts'
import { slugify } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Header navigation — three orthogonal browse axes that replace
// the six per-category dropdowns. Everything here references
// existing catalog slugs so every href resolves to a real
// /catalog/[category]/[axis] (or /list/[term]) route. We add no
// new routes. (see plans/would-like-a-mockup-squishy-pancake.md)
// ─────────────────────────────────────────────────────────────

export interface NavLink {
  label: string
  href: string
  /** one-line supporting copy shown under the label in the mega menu */
  desc?: string
}

export interface NavGroup {
  heading: string
  links: NavLink[]
}

const axis = (catSlug: string, axisSlug: string) => `/catalog/${catSlug}/${axisSlug}`

// ── Categories — browse by market. The 6 domains, each linking to
// its most representative directory: the first part-type axis if the
// category has one (electronic/nsn/aviation/connectors), else its
// first item (standard → BAC, featured → aircraft windows).
export const CATEGORY_NAV: NavLink[] = CATEGORIES.map((c) => {
  const primary = c.items.find((i) => i.kind === 'part-type') ?? c.items[0]
  return { label: c.label, href: `/catalog/${c.slug}/${primary.slug}`, desc: c.blurb }
})

// ── Products — browse by part type. Grouped columns across categories.
export const PRODUCT_NAV: NavGroup[] = [
  {
    heading: 'By part type',
    links: [
      { label: 'Electronic Part Types', href: axis('electronic', 'part-types'), desc: 'Resistors, capacitors, ICs' },
      { label: 'NSN Part Types', href: axis('nsn', 'part-types'), desc: 'Standardized NATO supply items' },
      { label: 'Aviation Part Types', href: axis('aviation', 'part-types'), desc: 'Civil and military aircraft' },
      { label: 'Connector Types', href: axis('connectors', 'types'), desc: 'Circular, rectangular, RF, fiber' },
    ],
  },
  {
    heading: 'Aviation hardware',
    links: [
      { label: 'Bearings', href: axis('aviation', 'bearings'), desc: 'Commercial and defense grades' },
      { label: 'Fasteners', href: axis('aviation', 'fasteners'), desc: 'Bolts, nuts, rivets, hardware' },
    ],
  },
  {
    heading: 'Standards',
    links: [
      { label: 'BAC Standard', href: axis('standard', 'bac'), desc: 'Boeing Aircraft Company' },
      { label: 'MS Standard', href: axis('standard', 'ms'), desc: 'Military Standard / Mil-Spec' },
      { label: 'AS Standard', href: axis('standard', 'as'), desc: 'Aerospace Standard' },
      { label: 'NAS Standard', href: axis('standard', 'nas'), desc: 'National Aerospace Standard' },
    ],
  },
  {
    heading: 'Featured',
    links: [
      { label: 'Aircraft Windows', href: axis('featured', 'aircraft-windows'), desc: 'Windshields, cabin, storm' },
      { label: 'Aircraft Engine', href: axis('featured', 'aircraft-engine'), desc: 'New and aftermarket parts' },
      { label: 'Instruments & Avionics', href: axis('featured', 'aircraft-instruments'), desc: 'Indicators, gauges, avionics' },
    ],
  },
]

// ── Manufacturers — browse by brand. The per-category manufacturer
// directories, plus a curated set of top brands. Each brand links to
// its /list/[term] page under a representative category. Names are all
// drawn from MANUFACTURERS in parts.ts.
export const MANUFACTURER_DIRECTORIES: NavLink[] = [
  { label: 'Electronic Manufacturers', href: axis('electronic', 'manufacturers'), desc: 'Board-level component brands' },
  { label: 'NSN Manufacturers', href: axis('nsn', 'manufacturers'), desc: 'Defense and aerospace suppliers' },
  { label: 'Aviation Manufacturers', href: axis('aviation', 'manufacturers'), desc: 'Aircraft parts manufacturers' },
  { label: 'Connector Manufacturers', href: axis('connectors', 'manufacturers'), desc: 'Connector brands worldwide' },
]

// canonical "everything" entry — the electronic manufacturers A–Z index
export const MANUFACTURERS_BROWSE_ALL = axis('electronic', 'manufacturers')

const brand = (name: string, catSlug: string): NavLink => ({
  label: name,
  href: `/catalog/${catSlug}/list/${slugify(name)}`,
})

export const TOP_BRANDS: NavLink[] = [
  brand('The Boeing Company', 'aviation'),
  brand('Airbus', 'aviation'),
  brand('Lockheed Martin', 'aviation'),
  brand('Honeywell', 'aviation'),
  brand('Collins Aerospace', 'aviation'),
  brand('GE Aviation', 'aviation'),
  brand('Parker Hannifin', 'aviation'),
  brand('Raytheon Company', 'aviation'),
  brand('Pratt & Whitney', 'aviation'),
  brand('Amphenol', 'connectors'),
  brand('TE Connectivity', 'connectors'),
  brand('Molex', 'connectors'),
]

// guard: keep TOP_BRANDS honest against the source list in dev
if (process.env.NODE_ENV !== 'production') {
  const unknown = TOP_BRANDS.filter(
    (b) => !MANUFACTURERS.some((m) => slugify(m) === b.href.split('/').pop()),
  )
  if (unknown.length) {
    // eslint-disable-next-line no-console
    console.warn('[nav] TOP_BRANDS not in MANUFACTURERS:', unknown.map((b) => b.label))
  }
}
