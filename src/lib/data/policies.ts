export interface Policy {
  slug: string
  title: string
  intro: string
  body: { heading?: string; text: string }[]
}

const generic = (title: string): Policy['body'] => [
  { text: `This ${title} explains how ASAP Components, a division of ASAP Semiconductor LLC, conducts business in this area. It applies to all users of this website and all transactions conducted through it.` },
  { heading: 'Scope', text: 'This policy applies to all products, services, and interactions across the ASAP brand of websites. By using this site you acknowledge and accept the terms described here.' },
  { heading: 'Compliance', text: 'We are committed to exceeding export-compliance and quality-control standards at every level of operation, and to sourcing only from trusted, verified manufacturers with full supply-chain traceability.' },
  { heading: 'Contact', text: 'For questions about this policy, contact our team at sales@asap-components.com or +1-714-705-4780. We are available 24/7 x 365.' },
]

export const POLICIES: Policy[] = [
  { slug: 'privacy', title: 'Privacy Policy', intro: 'How we collect, use, and protect your information.', body: generic('Privacy Policy') },
  { slug: 'cookie', title: 'Cookie Policy', intro: 'How and why we use cookies on this website.', body: generic('Cookie Policy') },
  { slug: 'conflict-minerals', title: 'Conflict Minerals Policy', intro: 'Our commitment to responsible mineral sourcing.', body: generic('Conflict Minerals Policy') },
  { slug: 'human-trafficking', title: 'Combating Human Trafficking Policy', intro: 'Our commitment to ethical supply chains.', body: generic('Combating Human Trafficking Policy') },
  { slug: 'customer-terms', title: 'Customer Terms and Conditions', intro: 'The terms governing customer purchases.', body: generic('Customer Terms and Conditions') },
  { slug: 'supplier-terms', title: 'Supplier Terms and Conditions', intro: 'The terms governing our supplier relationships.', body: generic('Supplier Terms and Conditions') },
  { slug: 'far-dfars', title: 'FAR & DFARS Flow Downs', intro: 'Applicable federal acquisition regulation clauses.', body: generic('FAR & DFARS Flow Downs') },
  { slug: 'consignment', title: 'Consignment Options', intro: 'Turn surplus inventory into revenue with ASAP.', body: generic('Consignment Options') },
]

export function getPolicy(slug: string) {
  return POLICIES.find((p) => p.slug === slug)
}
