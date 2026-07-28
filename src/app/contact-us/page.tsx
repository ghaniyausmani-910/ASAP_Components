import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/ui/primitives'
import { ContactForm } from '@/components/forms/ContactForm'
import { Certifications } from '@/components/modules/Certifications'
import { COMPANY } from '@/lib/data/site'

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
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Get in touch</p>
            <h1 className="mt-3 font-display text-h1 font-extralight tracking-tight-2">Contact ASAP Components</h1>
            <p className="mt-4 text-body-lg text-secondary">
              We&apos;d love to hear from you. Complete the form below and one of our representatives will contact you.
              Need a part quote instead?{' '}
              <Link href="/instant-rfq" className="font-semibold text-accent">Submit an Instant RFQ →</Link>
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[380px_1fr]">
            {/* Info panel */}
            <div className="flex flex-col">
              <div className="flex h-44 items-end overflow-hidden bg-navy p-6">
                <div className="absolute" />
                <span className="font-display text-lg font-light text-white/90">ASAP Semiconductor · Anaheim, CA</span>
              </div>
              <div className="flex-1 border border-t-0 border-hairline p-6">
                <ul className="space-y-5 text-sm">
                  <li className="flex gap-3"><MapPin size={20} className="shrink-0 text-accent" /><span className="text-secondary">{COMPANY.address}</span></li>
                  <li className="flex gap-3"><Phone size={20} className="shrink-0 text-accent" /><a href={`tel:${COMPANY.phone}`} className="font-semibold text-ink">{COMPANY.phone}</a></li>
                  <li className="flex gap-3"><Mail size={20} className="shrink-0 text-accent" /><a href={`mailto:${COMPANY.email}`} className="text-secondary hover:text-accent">{COMPANY.email}</a></li>
                  <li className="flex gap-3"><Clock size={20} className="shrink-0 text-accent" /><span className="text-secondary">Available 24/7 × 365</span></li>
                </ul>
                <a
                  href="https://maps.google.com/?q=1341+South+Sunkist+Street+Anaheim+CA+92806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent"
                >
                  Open in Google Maps <ArrowUpRight size={15} />
                </a>
              </div>
            </div>

            <ContactForm />
          </div>
        </Container>
      </section>

      {/* Map band */}
      <section className="border-y border-hairline">
        <div className="relative h-72 w-full bg-surface">
          <div className="absolute inset-0 opacity-[0.5] [background-image:linear-gradient(#d3dae2_1px,transparent_1px),linear-gradient(90deg,#d3dae2_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 border border-hairline bg-white px-5 py-3 shadow-card">
              <MapPin size={20} className="text-accent" />
              <span className="text-sm font-medium">1341 S Sunkist St, Anaheim, CA 92806</span>
            </div>
          </div>
        </div>
      </section>

      <Certifications />
    </>
  )
}
