import type { BlogPost } from '@/lib/types'

const GRADIENTS = ['navy', 'accent', 'steel', 'sky', 'ink', 'slate']

const body = (topic: string): BlogPost['body'] => [
  { type: 'p', text: `Commercial and defense aircraft operate in some of the most demanding environments on earth. Understanding ${topic.toLowerCase()} is essential for anyone responsible for procurement, maintenance, or engineering in the aerospace industry.` },
  { type: 'h2', text: 'The engineering context' },
  { type: 'p', text: 'Every detail in this effort is deliberately engineered. Systems are designed with redundancy, traceability, and rigorous quality control so that each component performs reliably across its full service life.' },
  { type: 'ul', items: [
    { lead: 'Reliability', text: 'components are selected for consistent performance under stress, temperature, and vibration.' },
    { lead: 'Traceability', text: 'full documentation and certification accompany every part we supply.' },
    { lead: 'Availability', text: 'obsolete and hard-to-find parts are sourced through a vetted, fully traceable supply chain.' },
  ] },
  { type: 'h2', text: 'Sourcing with a trusted distributor' },
  { type: 'p', text: 'Whether you are in the market for filters, valves, sensors, or any such products, ASAP Components is a one-stop shop for quality options. Paired with competitive pricing, swift lead times, and personalized solutions, you never have to compromise when you initiate procurement here.' },
]

export const BLOG_POSTS: BlogPost[] = ([
  ['Why Safety Cable Tools Are Replacing Traditional Lockwire in Aerospace Maintenance', 'Aviation', '2026-04-06', '/featured/fasteners.jpg'],
  ['Heat Shrink Tubing for Electrical, Automotive, and Industrial Use', 'Electronics Components', '2026-03-06', '/featured/components.jpg'],
  ['Why Is Proper Air Distribution Critical in Aircraft Cabins', 'Aircraft Manufacturer', '2025-10-08', '/featured/windows.jpg'],
  ['How Pressure and Temperature Sensors Improve Aircraft Safety', 'Aviation', '2025-07-10', '/featured/instruments.jpg'],
  ['What Procurement Teams Should Know About NSNs', 'Military Aircrafts', '2025-07-10', '/about/warehouse-aisle.jpg'],
  ['Aircraft Hydraulic Systems Explained', 'Aviation', '2025-05-15', '/featured/engine.jpg'],
  ['What Are Air Turbine Starters?', 'Aviation', '2024-09-20', '/proof/mission-critical.jpg'],
  ['Everything You Need to Know About Auto Wire Harness Parts', 'Aviation', '2024-09-06', '/featured/components.jpg'],
  ['Understanding the Various Uses of PTFE Hoses', 'Aviation', '2024-08-05', '/featured/bearings.jpg'],
  ['Choosing the Best Avionics System for an Aircraft', 'Avionics', '2024-05-29', '/featured/instruments.jpg'],
  ['Understanding PTFE Hoses in Various Industries', 'Aviation', '2023-11-20', '/about/bin-picking.jpg'],
  ['How Has 5G Technology Impacted Aviation Altimeters', 'Aviation', '2023-10-18', '/featured/instruments.jpg'],
] as const).map(([title, category, date, photo], i) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return {
    slug,
    title,
    category,
    date,
    author: 'Tony Adams',
    readingTime: 4 + (i % 4),
    excerpt:
      'A closer look at the components, systems, and sourcing considerations that keep modern aircraft flying safely and efficiently.',
    image: GRADIENTS[i % GRADIENTS.length],
    photo,
    body: body(title),
  }
})

export const BLOG_CATEGORIES = [
  'Aerospace', 'Aerospace Parts', 'Aircraft Engines', 'Aircraft Manufacturer',
  'Aviation', 'Aviation News', 'Avionics', 'Bearings', 'Electronics',
  'Electronics Components', 'Jet Engines', 'Military Aircrafts',
]

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
