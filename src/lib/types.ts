// ─────────────────────────────────────────────────────────────
// ASAP Components — domain types (see REDESIGN-PLAN.md)
// ─────────────────────────────────────────────────────────────

export type AxisType = 'directory' | 'listing' | 'listing-enhanced'
export type DirectoryKind = 'part-type' | 'manufacturer' | 'niin' | 'nsn' | 'fsc' | 'cage'

export interface DropdownItem {
  /** URL slug segment under the category, e.g. "manufacturers" */
  slug: string
  label: string
  /** which template renders this page */
  type: AxisType
  /** for directory pages, what kind of index */
  kind?: DirectoryKind
  /** page heading */
  heading: string
  /** SEO/intro copy */
  intro: string
  /** extra listing columns for enhanced listings */
  extraColumns?: { key: string; label: string }[]
}

export interface Category {
  /** URL slug, e.g. "electronic" */
  slug: string
  /** header label, e.g. "Board Level Components" */
  label: string
  /** short blurb for category landing / mega-menu */
  blurb: string
  items: DropdownItem[]
}

export interface Part {
  partNo: string
  altPartNo?: string
  manufacturer: string
  description?: string
  nsn?: string
  cageCode?: string
  qty: string // e.g. "Avl"
  aircraftModel?: string
  engineNo?: string
}

export interface Manufacturer {
  name: string
  slug: string
}

export interface BlogPost {
  slug: string
  title: string
  category: string
  date: string // ISO
  author: string
  readingTime: number
  excerpt: string
  image: string // gradient key
  body: BlogBlock[]
}

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: { lead: string; text: string }[] }

export interface Certification {
  name: string
  short: string
  detail: string
  img: string
}

export interface Benefit {
  title: string
  desc: string
  icon: string
}
