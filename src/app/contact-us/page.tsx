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

      {/* B1 · at desktop the form sits on the right of the header row so its
          submit lands above the 1080 fold; below lg the original vertical
          order is preserved. The 4 contact-info cards stay below on all
          viewports — they aren't part of the conversion path. */}
      <section className="bg-white pb-[clamp(64px,10vw,160px)] pt-6 lg:pt-8">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:items-start lg:gap-12">
            <ScrollReveal>
              <div>
                <p className="eyebrow">Get in touch</p>
                <h1 className="mt-2 font-display text-h2 font-light tracking-tight-2 text-ink">
                  Contact <span className="text-tertiary">Our Team</span>
                </h1>
                <p className="mt-4 text-body-lg text-secondary">
                  <Link href="/instant-rfq" className="font-semibold text-accent">Submit an Instant RFQ →</Link>
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <ContactForm />
            </ScrollReveal>
          </div>

          {/* Contact info cards — supporting detail below the primary path. */}
          <ScrollReveal delay={80}>
            <ContactCards className="mt-12" />
          </ScrollReveal>
        </Container>
      </section>

      <Certifications />
    </>
  )
}
