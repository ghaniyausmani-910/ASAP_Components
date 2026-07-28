import type { Certification, Benefit } from '@/lib/types'

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

// Manufacturer logos rendered on the home "Trusted brands" wall.
// `src` files live in /public/logos/ — save each logo there with the exact
// filename below (transparent PNG or SVG, wide/landscape crop works best).
export const MANUFACTURER_LOGOS: { name: string; src: string }[] = [
  { name: 'Boeing', src: '/logos/boeing.webp' },
  { name: 'Lockheed Martin', src: '/logos/lockheed-martin.webp' },
  { name: 'Honeywell', src: '/logos/honeywell.webp' },
  { name: 'GE Aviation', src: '/logos/ge-aviation.webp' },
  { name: 'Goodrich', src: '/logos/goodrich.webp' },
  { name: 'Eaton', src: '/logos/eaton.webp' },
  { name: 'Parker', src: '/logos/parker.webp' },
  { name: 'De Havilland Aircraft of Canada', src: '/logos/de-havilland-aircraft-of-canada.webp' },
  { name: 'Freescale Semiconductor', src: '/logos/freescale.webp' },
]

export const TOP_FSCS: string[] = [
  'Aircraft Wheel and Brake Systems', 'Aircraft Propellers and Components',
  'Hand Tools, Power Driven', 'Aircraft Landing Gear Components',
  'Miscellaneous Vehicular Components', 'Diesel Engines and Components',
  'Fuses, Arresters, Absorbers and Protectors', 'Bars and Rods, Nonferrous Base Metal',
  'Electrical Contact Brushes and Electrodes',
]

export const HOT_PART_NUMBERS: string[] = [
  '3202975-001', 'CBL-DATA-2013', 'EPO-3019', '43-4746594-01', '3234TS1-1',
  '652-4001-001', '012-S2200-00', 'CBL-DATA-3061', '60901076-060',
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
