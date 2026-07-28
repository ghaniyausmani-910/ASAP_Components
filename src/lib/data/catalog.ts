import type { Category } from '@/lib/types'

// ─────────────────────────────────────────────────────────────
// Catalog structure — the 6 header categories and their
// dropdown item-pages. Drives the mega-menu AND the dynamic
// /catalog/[category]/[axis] routes. (see REDESIGN-PLAN Part C)
// ─────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  {
    slug: 'electronic',
    label: 'Board Level Components',
    blurb: 'Resistors, capacitors, ICs, connectors, switches, filters and power supplies.',
    items: [
      {
        slug: 'part-types',
        label: 'Part Types',
        type: 'directory',
        kind: 'part-type',
        heading: 'Electronic Part Types Catalog',
        intro:
          'Electronic components are the foundation of every electrical and electronic system. Browse our part-type catalog to quickly locate the exact component your application requires, then submit an RFQ for competitive pricing.',
      },
      {
        slug: 'manufacturers',
        label: 'Manufacturers',
        type: 'directory',
        kind: 'manufacturer',
        heading: 'Electronic Components Manufacturers Directory',
        intro:
          'Browse electronic component manufacturers alphabetically, or search by manufacturer name to discover new, surplus, obsolete and hard-to-find inventory from leading brands.',
      },
    ],
  },
  {
    slug: 'nsn',
    label: 'NSN Parts',
    blurb: 'National Stock Number parts by NIIN, FSC, NSN, manufacturer, CAGE code and part type.',
    items: [
      {
        slug: 'niin',
        label: 'Parts By NIIN',
        type: 'directory',
        kind: 'niin',
        heading: 'NIIN Complete Lookup',
        intro:
          'A NIIN (National Item Identification Number) is a unique nine-digit code identifying standardized supply items within the NATO Stock Number system. Look up NIIN-linked parts for aerospace, aviation, defense and military applications.',
      },
      {
        slug: 'fsc',
        label: 'Parts By FSC',
        type: 'directory',
        kind: 'fsc',
        heading: 'Federal Supply Group and Codes Catalog',
        intro:
          'Federal Supply Classification (FSC) codes group related items across defense and aerospace logistics. Browse by supply group to narrow your search to the exact class of component you need.',
      },
      {
        slug: 'nsn',
        label: 'Parts By NSN',
        type: 'directory',
        kind: 'nsn',
        heading: 'Search by National Stock Number',
        intro:
          'National Stock Numbers (NSNs) are 13-digit identification codes used by NATO countries to standardize procurement of military, aerospace and defense components. Search our extensive NSN inventory.',
      },
      {
        slug: 'manufacturers',
        label: 'Manufacturers',
        type: 'directory',
        kind: 'manufacturer',
        heading: 'NSN Manufacturers Complete Catalog',
        intro:
          'Browse NSN part manufacturers alphabetically or search by name. We hold inventory sourced from thousands of trusted manufacturers across the aerospace and defense industries.',
      },
      {
        slug: 'cage-code',
        label: 'Cage Code',
        type: 'directory',
        kind: 'cage',
        heading: 'CAGE Codes Lookup Online',
        intro:
          'CAGE (Commercial and Government Entity) codes identify suppliers with government and defense organizations. Cross-reference a CAGE code with its manufacturer and available part numbers.',
      },
      {
        slug: 'part-types',
        label: 'Part Types',
        type: 'directory',
        kind: 'part-type',
        heading: 'Top List of NSN Components',
        intro:
          'Browse NSN part types alphabetically. Our user-friendly database makes it easy to search efficiently for the exact component category you require.',
      },
    ],
  },
  {
    slug: 'aviation',
    label: 'Aviation Parts',
    blurb: 'Aircraft and aviation parts by type, plus curated bearings and fasteners catalogs.',
    items: [
      {
        slug: 'part-types',
        label: 'Aviation Part Types',
        type: 'directory',
        kind: 'part-type',
        heading: 'Aviation and Aircraft Parts Online Catalog',
        intro:
          'ASAP Components is your premier source for a wide range of aviation and aircraft parts. Browse our extensive part-type catalog to find the components you need for civil and military aircraft.',
      },
      {
        slug: 'bearings',
        label: 'Bearings',
        type: 'directory',
        kind: 'part-type',
        heading: 'Explore a Diverse Selection of Aviation Bearings',
        intro:
          'Specializing in the supply of diverse aviation bearing solutions for commercial and defense operations. Browse our comprehensive bearing part-type catalog on this page.',
      },
      {
        slug: 'fasteners',
        label: 'Fasteners',
        type: 'directory',
        kind: 'part-type',
        heading: 'Browse an Extensive Collection of Aviation Fasteners',
        intro:
          'We keep our inventory replete with an array of fasteners covering diverse assembly and maintenance requirements. Submit a request online, or contact our team directly for tailored options.',
      },
      {
        slug: 'manufacturers',
        label: 'Manufacturers',
        type: 'directory',
        kind: 'manufacturer',
        heading: 'Aircraft Parts Manufacturers Online Catalog',
        intro:
          'A collection of aviation parts manufacturers from leading names across the aerospace industry. Browse alphabetically or search by manufacturer name.',
      },
    ],
  },
  {
    slug: 'standard',
    label: 'Standard Parts',
    blurb: 'BAC, MS, AS and NAS standard parts — ready to ship from a trusted, fully traceable supply chain.',
    items: [
      {
        slug: 'bac',
        label: 'BAC Standard',
        type: 'listing',
        heading: 'List of Boeing Aircraft Company (BAC) Standard Parts',
        intro:
          'We maintain a large database of Boeing BAC standard parts such as cover, terminal board, band, retaining, bolt, shear, cable assembly, special purpose and more. Submit an RFQ to get started.',
      },
      {
        slug: 'ms',
        label: 'MS Standard',
        type: 'listing',
        heading: 'Military Standard (MS) Standard Parts Complete Catalog',
        intro:
          'Military Standard (MS) parts and Mil-Spec components in stock and ready to ship. Use our website search tool to look up part numbers and find the exact parts you are looking for.',
      },
      {
        slug: 'as',
        label: 'AS Standard',
        type: 'listing',
        heading: 'Browse Complete List of Aerospace Standards (AS) Parts',
        intro:
          'An extensive cache of aviation standard parts, ready to ship. Search for specific AS part numbers so you can quickly find the exact part you need.',
      },
      {
        slug: 'nas',
        label: 'NAS Standard',
        type: 'listing',
        heading: 'National Aerospace Standards (NAS) Parts Catalog',
        intro:
          'A leading source of National Aerospace Standard (NAS) parts, presenting highly sought-after items readily available for quote at any time.',
      },
    ],
  },
  {
    slug: 'connectors',
    label: 'Electrical Connectors',
    blurb: 'Connector part types and manufacturers — circular, rectangular, RF, fiber optic and more.',
    items: [
      {
        slug: 'manufacturers',
        label: 'Connectors Manufacturers',
        type: 'directory',
        kind: 'manufacturer',
        heading: 'Electrical Connector Manufacturers Listing',
        intro:
          'Connector parts from suppliers across the world. Browse manufacturers alphabetically or search by name to discover in-stock connector inventory.',
      },
      {
        slug: 'types',
        label: 'Connector Types',
        type: 'directory',
        kind: 'part-type',
        heading: 'Browse Electrical Connectors Part Types Database',
        intro:
          'A comprehensive supply chain of electrical connector parts — power supplies, automotive and industrial connectors and more — in stock and ready to ship.',
      },
    ],
  },
  {
    slug: 'featured',
    label: 'Featured Parts',
    blurb: 'Curated aircraft windows, engine, and instruments & avionics part catalogs.',
    items: [
      {
        slug: 'aircraft-windows',
        label: 'Aircraft Windows Parts',
        type: 'listing-enhanced',
        heading: 'Aircraft Windows Parts Listing',
        intro:
          'ASAP Components stocks aircraft window parts including storm windows, cabin windows and windshields. Every part is available for quote — submit an RFQ today.',
        extraColumns: [{ key: 'aircraftModel', label: 'Aircraft Model' }],
      },
      {
        slug: 'aircraft-engine',
        label: 'Aircraft Engine Parts',
        type: 'listing-enhanced',
        heading: 'Buy Aircraft Engine Parts',
        intro:
          'A premier distributor of new and aftermarket aircraft engine parts for the aerospace and defense industries. All parts undergo quality-control checks before shipping.',
        extraColumns: [{ key: 'engineNo', label: 'Engine No.' }],
      },
      {
        slug: 'aircraft-instruments',
        label: 'Aircraft Instruments & Avionic Parts',
        type: 'listing-enhanced',
        heading: 'Search Aircraft Instruments and Avionics Parts Catalog',
        intro:
          'Aircraft instruments and avionics parts including flow indicators, tank units, turn coordinators, quantity indicators and more. Submit an RFQ for a fast, competitive quote.',
      },
    ],
  },
]

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getAxis(categorySlug: string, axisSlug: string) {
  const cat = getCategory(categorySlug)
  if (!cat) return undefined
  const item = cat.items.find((i) => i.slug === axisSlug)
  if (!item) return undefined
  return { category: cat, item }
}
