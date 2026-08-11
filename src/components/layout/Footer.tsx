import Link from 'next/link'
import { MapPin, Phone, Printer, Mail, ShieldCheck, Truck, AlertCircle } from 'lucide-react'
import { COMPANY, FOOTER, PAYMENTS, COMPLIANCE_RIBBON } from '@/lib/data/site'
import { Logo } from '@/components/layout/Logo'

const RIBBON_ICONS = [Truck, ShieldCheck, AlertCircle]

export function Footer() {
  return (
    <footer className="bg-navy text-[var(--on-dark)]">
      {/* CTA banner */}
      <div className="border-b border-white/15 bg-ink-900">
        <div className="container-x flex flex-col items-center gap-6 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-display text-xl font-light text-white sm:text-2xl">
              Need a part fast? Get a quote in 15 minutes.
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Submit an RFQ or browse our catalog of aviation, aerospace, and defense parts — 24/7.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/instant-rfq" className="btn bg-white text-ink hover:bg-white/90">Instant RFQ</Link>
            <Link href="/catalog/aviation/part-types" className="btn btn-on-dark">Browse Parts</Link>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-12">
        {/* Get in touch */}
        <div className="lg:col-span-4">
          <Logo onDark className="mb-6" />
          <h3 className="mb-5 font-display text-lg font-medium text-white">Get In Touch</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-white" /> {COMPANY.address}</li>
            <li className="flex gap-3"><Phone size={18} className="shrink-0 text-white" /> <a href={`tel:${COMPANY.phone}`}>{COMPANY.phone}</a></li>
            <li className="flex gap-3"><Printer size={18} className="shrink-0 text-white" /> {COMPANY.fax}</li>
            <li className="flex gap-3"><Mail size={18} className="shrink-0 text-white" /> <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
          </ul>
          <div className="mt-6 border border-white/15 p-4">
            <p className="font-display text-white">How are we doing?</p>
            <p className="mt-1 text-xs text-white/70">Customer satisfaction is our priority. Take a moment to tell us how we are doing.</p>
            <Link href="/contact-us" className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.08em] text-white">Take a survey now →</Link>
          </div>
        </div>

        <FooterCol title="Company Information" links={FOOTER.company} className="lg:col-span-2" />
        <FooterCol title="Policies" links={FOOTER.policies} className="lg:col-span-3" />
        <div className="lg:col-span-3">
          <FooterCol title="Quick Links" links={FOOTER.quick} />
          <div className="mt-6">
            <p className="mb-3 text-xs uppercase tracking-[0.08em] text-white/60">Terms &amp; Conditions</p>
            <ul className="space-y-2 text-sm text-white/80">
              {FOOTER.terms.map((t) => (
                <li key={t.href}><Link href={t.href} className="hover:text-white">{t.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.08em] text-white/60">Cards Accepted</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENTS.map((p) => (
                <span key={p} className="border border-white/20 px-2 py-1 text-[11px] text-white/80">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance ribbon */}
      <div className="border-t border-white/15">
        <div className="container-x grid gap-4 py-6 sm:grid-cols-3">
          {COMPLIANCE_RIBBON.map((text, i) => {
            const Icon = RIBBON_ICONS[i]
            return (
              <div key={text} className="flex items-center gap-3 text-sm text-white/85">
                <Icon size={20} className="shrink-0 text-white" /> {text}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-white/15 bg-ink-900">
        <div className="container-x py-6 text-center text-xs leading-relaxed text-white/50">
          <p>
            As an Independent Distributor, ASAP Semiconductor LLC is not affiliated with the manufacturers of the products it sells except as expressly noted. All trademark rights are owned by the respective manufacturers.
          </p>
          <p className="mt-2">Copyright © 2026, All rights reserved to ASAP Semiconductor LLC.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
  className,
}: {
  title: string
  links: { label: string; href: string }[]
  className?: string
}) {
  return (
    <div className={className}>
      <p className="mb-4 text-xs uppercase tracking-[0.08em] text-white/60">{title}</p>
      <ul className="space-y-2 text-sm text-white/80">
        {links.map((l) => (
          <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  )
}
