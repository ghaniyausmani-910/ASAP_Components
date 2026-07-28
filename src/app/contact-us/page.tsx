import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ContactCards } from '@/components/contact/ContactCards'
import { ContactForm } from '@/components/forms/ContactForm'
import { Certifications } from '@/components/modules/Certifications'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact ASAP Components with any questions about aircraft parts or services. We respond within 15 minutes, 24/7.',
}

export default function ContactPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />

      <section className="section-y bg-white">
        <Container>
          {/* Header: heading left, CTA right */}
          <ScrollReveal>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
              <div>
                <p className="eyebrow">Get in touch</p>
                <h1 className="mt-3 font-display text-h2 font-light tracking-tight-2 text-ink">
                  Contact <span className="text-tertiary">Our Team</span>
                </h1>
              </div>
              <p className="text-body-lg lg:text-right">
                <Link href="/instant-rfq" className="font-semibold text-accent">Submit an Instant RFQ →</Link>
              </p>
            </div>
          </ScrollReveal>

          {/* Contact info cards */}
          <ScrollReveal delay={80}>
            <ContactCards className="mt-12" />
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={120}>
            <div className="mt-12">
              <ContactForm />
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <Certifications />
    </>
  )
}
