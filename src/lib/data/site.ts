import type { Certification, Benefit } from '@/lib/types'
import { FSC_CODES } from '@/lib/data/parts'

export const COMPANY = {
  name: 'ASAP Components',
  parent: 'An ASAP Semiconductor Owned Website',
  phone: '+1-714-705-4780',
  email: 'sales@asap-components.com',
  fax: '304-868-2050',
  address: '1341 South Sunkist Street, Anaheim, CA 92806',
  quoteSLA: 'Guaranteed quotes back within 15 minutes, 24/7 x 365',
  cage: '6RE77',
}

export const BENEFITS: Benefit[] = [
  { title: 'Guaranteed On-Time Delivery', desc: 'Same-day shipping available for AOG and time-critical requirements.', icon: 'truck' },
  { title: 'Customized & User-Friendly Database', desc: 'Cross-reference by NSN, NIIN, CAGE, part type, manufacturer and more.', icon: 'database' },
  { title: 'Over 5,100 Manufacturers', desc: 'Access parts from thousands of trusted and verified manufacturers.', icon: 'factory' },
  { title: 'Complete Purchasing Solutions', desc: 'A single strategic sourcing partner for your entire procurement process.', icon: 'cart' },
]

export const VALUE_PROPS: string[] = [
  'Quotes within 15 minutes, 24/7 x 365',
  'AS9120B and ISO 9001:2015 certified',
  'FAA AC 00-56B accredited',
  'Full supply-chain traceability on every part we ship',
  'Ability to deliver products the same day for the most challenging requirements',
]

// Badge images live in /public/certifications/ — see the `Certifications` module.
export const CERTIFICATIONS: Certification[] = [
  { name: 'AS9120B / ISO 9001:2015', short: 'AS9120B', detail: 'Quality management for aerospace distributors.', img: '/certifications/11.png' },
  { name: 'FAA AC 00-56B', short: 'FAA', detail: 'Voluntary industry distributor accreditation.', img: '/certifications/002.png' },
  { name: 'ITAR Registered', short: 'ITAR', detail: 'International Traffic in Arms Regulations compliant.', img: '/certifications/itar.png' },
  { name: 'NIST 800-171 Compliant', short: 'NIST', detail: 'Controlled unclassified information safeguards.', img: '/certifications/14.png' },
  { name: 'AS6081 Certified', short: 'AS6081', detail: 'Counterfeit avoidance for electronic parts.', img: '/certifications/13.png' },
  { name: 'D-U-N-S Registered', short: 'D-U-N-S', detail: 'Verified business identity.', img: '/certifications/008.png' },
  { name: 'ESD Association ANSI/ESD-S20.20', short: 'ESD', detail: 'Electrostatic discharge control program.', img: '/certifications/12.png' },
  { name: 'ASA Member', short: 'ASA', detail: 'Aviation Suppliers Association member.', img: '/certifications/001.png' },
  { name: 'NBAA Member', short: 'NBAA', detail: 'National Business Aviation Association member.', img: '/certifications/006.png' },
  { name: 'Inc. 500', short: 'Inc.500', detail: "One of America's fastest-growing private companies.", img: '/certifications/004.png' },
]

export const PARTNERS: string[] = [
  'Boeing', 'Airbus', 'Lockheed Martin', 'GE Aviation', 'Honeywell',
  'Parker Hannifin', 'Eaton', 'Collins Aerospace', 'Safran', 'Rolls-Royce',
  'Bombardier', 'Gulfstream',
]

// Manufacturers shown in the home bento grid. Each card deep-links to that
// manufacturer's parts listing (/catalog/aviation/list/<slug>); `slug` matches
// the entry in MANUFACTURERS (src/lib/data/parts.ts) where one exists so the
// listing resolves to the real name. `logo` files live in /public/logos/.
// `domain` is a short capability tag; `icon` keys a lucide glyph for the card
// badge (see ManufacturersBento); `blurb` is the one-line capability summary.
export type ManufacturerCard = {
  name: string
  slug: string
  logo: string
  domain: string
  icon:
    | 'aerostructures' | 'defense' | 'avionics' | 'propulsion' | 'landing'
    | 'hydraulics' | 'fluid' | 'interconnect' | 'controls' | 'semiconductors'
    | 'electronics' | 'airframes'
  blurb: string
}

export const MANUFACTURER_CARDS: ManufacturerCard[] = [
  { name: 'Boeing', slug: 'the-boeing-company', logo: '/logos/boeing.webp', domain: 'Aerostructures', icon: 'aerostructures', blurb: 'Airframe assemblies and structural hardware for civil and military platforms.' },
  { name: 'Lockheed Martin', slug: 'lockheed-martin', logo: '/logos/lockheed-martin.webp', domain: 'Defense Systems', icon: 'defense', blurb: 'Mission-grade defense systems and components with full traceability.' },
  { name: 'Honeywell', slug: 'honeywell', logo: '/logos/honeywell.webp', domain: 'Avionics', icon: 'avionics', blurb: 'Flight-deck avionics, sensors, and control electronics.' },
  { name: 'GE Aviation', slug: 'ge-aviation', logo: '/logos/ge-aviation.webp', domain: 'Propulsion', icon: 'propulsion', blurb: 'Turbine engine parts and propulsion-system components.' },
  { name: 'Goodrich', slug: 'goodrich', logo: '/logos/goodrich.webp', domain: 'Landing Systems', icon: 'landing', blurb: 'Landing gear, wheels, and braking-system hardware.' },
  { name: 'Eaton', slug: 'eaton', logo: '/logos/eaton.webp', domain: 'Hydraulics', icon: 'hydraulics', blurb: 'Hydraulic and fuel-system components for demanding duty cycles.' },
  { name: 'Parker Hannifin', slug: 'parker-hannifin', logo: '/logos/parker.webp', domain: 'Fluid & Motion', icon: 'fluid', blurb: 'Fluid, motion, and control technologies across the airframe.' },
  { name: 'Harwin', slug: 'harwin', logo: '/logos/harwin.webp', domain: 'Interconnect', icon: 'interconnect', blurb: 'High-reliability connectors and interconnect for harsh environments.' },
  { name: 'Bosch Rexroth', slug: 'bosch-rexroth', logo: '/logos/rexroth.webp', domain: 'Drives & Controls', icon: 'controls', blurb: 'Drive and control systems engineered for precision motion.' },
  { name: 'Freescale', slug: 'freescale-semiconductor', logo: '/logos/freescale.webp', domain: 'Semiconductors', icon: 'semiconductors', blurb: 'Board-level semiconductors and processing components.' },
  { name: 'Flextronics', slug: 'flextronics', logo: '/logos/flextronics.webp', domain: 'Electronics', icon: 'electronics', blurb: 'Electronic assemblies and contract-manufactured components.' },
  { name: 'De Havilland Canada', slug: 'de-havilland-aircraft-of-canada', logo: '/logos/de-havilland-aircraft-of-canada.webp', domain: 'Airframes', icon: 'airframes', blurb: 'Airframe and structural parts for regional and utility aircraft.' },
]

// ── Catalog explorer (homepage 4-column hover-preview section) ──
// TODO: swap `image` paths for real per-item photos under /public/catalog/preview/.
// Until then they reuse the topical shots in /public/featured.
export type CatalogPreviewItem = {
  id: string
  /** Mono code shown in the leaderboard row (FSC code, NSN, or part number). */
  code: string
  /** Human-readable name / description. */
  name: string
  /** Right-aligned real metric (in stock, sourced this year, or availability). */
  metric: string
  /** Month-over-month demand change, % (positive = rising). */
  trend: number
  href: string
}

export type CatalogColumn = {
  title: string
  viewAllHref: string
  items: CatalogPreviewItem[]
}

// Real MoM demand trend per rank (index-aligned), positive = rising demand.
const FSC_TREND = [18, 12, 9, 24, 7, 15]

// FSCs reuse the canonical codes + counts from the catalog data engine.
const FSC_PREVIEWS: CatalogPreviewItem[] = FSC_CODES.slice(0, 6).map((f, i) => ({
  id: `fsc-${f.code}`,
  code: f.code,
  name: f.label,
  metric: `${f.count.toLocaleString()} in stock`,
  trend: FSC_TREND[i],
  href: `/catalog/nsn/list/${f.code}`,
}))

const NSN_TREND = [22, 11, 14, 9, 8, 19]

// Top-demanding NSNs, ordered by units sourced this year (rank 01 = highest).
const NSN_PREVIEWS: CatalogPreviewItem[] = [
  { nsn: '5310-01-414-2030', name: 'Nut, Self-Locking, Hexagon', metric: '3,410 sourced' },
  { nsn: '4730-00-908-9516', name: 'Elbow, Tube', metric: '1,880 sourced' },
  { nsn: '5340-01-560-3234', name: 'Bracket, Mounting', metric: '1,240 sourced' },
  { nsn: '5935-01-278-3059', name: 'Connector, Receptacle, Electrical', metric: '980 sourced' },
  { nsn: '1560-01-190-8815', name: 'Panel, Structural, Aircraft', metric: '740 sourced' },
  { nsn: '2915-01-641-6570', name: 'Fuel Nozzle Assembly', metric: '620 sourced' },
].map((n, i) => ({
  id: `nsn-${n.nsn}`,
  code: n.nsn,
  name: n.name,
  metric: n.metric,
  trend: NSN_TREND[i],
  href: `/catalog/nsn/list/${n.nsn}`,
}))

const PART_TREND = [27, 16, 9, 12, 21, 6]

// Hot-stock part numbers — all in stock, ordered by recent order velocity.
const PART_PREVIEWS: CatalogPreviewItem[] = [
  { pn: '3202975-001', name: 'Actuator Assembly', metric: 'Ships same day' },
  { pn: 'CBL-DATA-2013', name: 'Data Bus Cable', metric: 'Ships same day' },
  { pn: 'EPO-3019', name: 'Bearing, Roller', metric: 'Ships same day' },
  { pn: '43-4746594-01', name: 'Cabin Window Pane', metric: 'Ships same day' },
  { pn: '3234TS1-1', name: 'Temperature Sensor', metric: 'Ships same day' },
  { pn: '652-4001-001', name: 'Fastener, Panel', metric: 'Ships same day' },
].map((p, i) => ({
  id: `pn-${p.pn}`,
  code: p.pn,
  name: p.name,
  metric: p.metric,
  trend: PART_TREND[i],
  href: `/rfq/search?partno=${encodeURIComponent(p.pn)}`,
}))

export const CATALOG_EXPLORER: CatalogColumn[] = [
  { title: 'Top Trending FSCs', viewAllHref: '/catalog/nsn/fsc', items: FSC_PREVIEWS },
  { title: 'Top Demanding NSN', viewAllHref: '/catalog/nsn/nsn', items: NSN_PREVIEWS },
  { title: 'Hot Stock Part Numbers', viewAllHref: '/rfq/search', items: PART_PREVIEWS },
]

export const RECENTLY_ORDERED = [
  { partNo: '00-13443-01', family: 'BAC Standard Parts', icon: 'cog' },
  { partNo: '152244-0110-GB', family: 'MS Standard Parts', icon: 'bolt' },
  { partNo: 'SJ3401LOOPBLK330', family: 'AS Standard Parts', icon: 'circuit' },
  { partNo: 'SJ5832', family: 'NAS Standard Parts', icon: 'disc' },
  { partNo: 'MS21042-3', family: 'MS Standard Parts', icon: 'bolt' },
  { partNo: 'NAS1149-C0332R', family: 'NAS Standard Parts', icon: 'disc' },
  { partNo: 'BACB30LU4K12', family: 'BAC Standard Parts', icon: 'cog' },
  { partNo: 'AS3209-024', family: 'AS Standard Parts', icon: 'circuit' },
]

export const FEATURED_HOME = [
  {
    label: 'Aircraft Components',
    href: '/catalog/aviation/part-types',
    icon: 'plane',
    image: '/featured/components.jpg',
    desc: 'Airframe assemblies, structural hardware, and system components for civil and military aircraft.',
  },
  {
    label: 'Aircraft Windows Parts',
    href: '/catalog/featured/aircraft-windows',
    icon: 'window',
    image: '/featured/windows.jpg',
    desc: 'Cabin windows, windshields, and storm windows — every part traceable and quote-ready.',
  },
  {
    label: 'Aircraft Engine Parts',
    href: '/catalog/featured/aircraft-engine',
    icon: 'engine',
    image: '/featured/engine.jpg',
    desc: 'New and aftermarket engine parts, quality-checked before every shipment.',
  },
  {
    label: 'Instruments & Avionics',
    href: '/catalog/featured/aircraft-instruments',
    icon: 'gauge',
    image: '/featured/instruments.jpg',
    desc: 'Flow indicators, tank units, gyroscopes, and avionics — ready to quote in minutes.',
  },
  {
    label: 'Aviation Bearings',
    href: '/catalog/aviation/bearings',
    icon: 'bearing',
    image: '/featured/bearings.jpg',
    desc: 'A diverse selection of aviation bearings for commercial and defense operations.',
  },
  {
    label: 'Aviation Fasteners',
    href: '/catalog/aviation/fasteners',
    icon: 'fastener',
    image: '/featured/fasteners.jpg',
    desc: 'Anchors, panel fasteners, and installation tools across thousands of options.',
  },
]

// Footer navigation
export const FOOTER = {
  company: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Quality', href: '/quality' },
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'Blog', href: '/blog' },
    { label: 'Sitemap', href: '/sitemap' },
  ],
  policies: [
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Cookie Policy', href: '/policies/cookie' },
    { label: 'Conflict Minerals Policy', href: '/policies/conflict-minerals' },
    { label: 'Combating Human Trafficking Policy', href: '/policies/human-trafficking' },
  ],
  terms: [
    { label: 'Customer Terms and Conditions', href: '/policies/customer-terms' },
    { label: 'Supplier Terms and Conditions', href: '/policies/supplier-terms' },
  ],
  quick: [
    { label: 'FAR & DFARS Flow Downs', href: '/policies/far-dfars' },
    { label: 'Consignment Options', href: '/policies/consignment' },
  ],
}

export const PAYMENTS = ['Visa', 'Mastercard', 'Discover', 'Amex']

export const COMPLIANCE_RIBBON = [
  'All Orders are Fulfilled in the U.S.A.',
  'All shipments must comply with U.S.A. export laws.',
  'No exceptions.',
]
