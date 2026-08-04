'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Mail, Phone, Menu, X, ChevronDown, ArrowUpRight, Plane } from 'lucide-react'
import { CATEGORIES } from '@/lib/data/catalog'
import { COMPANY } from '@/lib/data/site'
import { SearchBar } from '@/components/ui/SearchBar'
import { CartButton } from '@/components/cart/CartButton'
import { cn } from '@/lib/utils'

const SIMPLE_LINKS = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact-us' },
]

export function Header({ variant = 'solid' }: { variant?: 'solid' | 'overlay' }) {
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = variant === 'solid' || scrolled
  const onDark = !solid

  return (
    <header
      className={cn(
        'inset-x-0 top-0 z-50 transition-colors duration-300',
        // Overlay (home) floats above the hero, so it must be `fixed`.
        // Solid (inner pages) is `sticky` — it occupies normal flow, so the
        // content below can never slide under it, at any breakpoint.
        variant === 'overlay' ? 'fixed' : 'sticky',
        solid
          ? 'bg-white border-b border-hairline'
          : 'border-b border-white/10 bg-ink/25 backdrop-blur-md',
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      {/* Top row */}
      <div className="container-x flex h-16 items-center gap-6 lg:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="ASAP Components home">
          <span className={cn('flex h-9 w-9 items-center justify-center', solid ? 'bg-accent text-white' : 'bg-white text-accent')}>
            <Plane size={20} strokeWidth={2.5} className="-rotate-45" />
          </span>
          <span className="leading-none">
            <span className={cn('block font-display text-[17px] font-semibold tracking-tight-2 sm:text-[19px]', onDark ? 'text-white' : 'text-ink')}>
              ASAP <span className={onDark ? 'text-white' : 'text-accent'}>Components</span>
            </span>
            <span className={cn('mt-1.5 hidden text-[10px] uppercase tracking-[0.14em] sm:block', onDark ? 'text-white/60' : 'text-tertiary')}>
              An ASAP Semiconductor Website
            </span>
          </span>
        </Link>

        {/* Divider between logo and contact */}
        <span aria-hidden className={cn('hidden h-9 w-px xl:block', onDark ? 'bg-white/20' : 'bg-hairline')} />

        {/* Contact (desktop, left) */}
        <div className="hidden items-center gap-5 xl:flex">
          <a href={`mailto:${COMPANY.email}`} className={cn('flex items-center gap-2 text-sm', onDark ? 'text-white/90' : 'text-secondary hover:text-ink')}>
            <Mail size={16} className={onDark ? 'text-white/80' : 'text-accent'} /> {COMPANY.email}
          </a>
          <a href={`tel:${COMPANY.phone}`} className={cn('flex items-center gap-2 text-sm font-semibold', onDark ? 'text-white' : 'text-ink')}>
            <Phone size={16} className={onDark ? 'text-white/80' : 'text-accent'} /> {COMPANY.phone}
          </a>
        </div>

        {/* Search (desktop, top-right) — flexes to fill available space, capped */}
        <div className="ml-auto hidden min-w-0 flex-1 lg:block xl:max-w-[34rem]">
          <SearchBar size="sm" />
        </div>

        {/* Mobile controls */}
        <div className="ml-auto flex items-center gap-3 lg:hidden">
          <CartButton onDark={onDark} />
          <Link href="/instant-rfq" className="btn btn-primary !px-3 !py-2 text-xs">RFQ</Link>
          <button aria-label="Open menu" onClick={() => setMobileOpen(true)} className={cn('p-2', onDark ? 'text-white' : 'text-ink')}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Nav row (desktop) */}
      <div className={cn('hidden lg:block border-t', solid ? 'border-hairline' : 'border-white/15')}>
        <div className="container-x flex items-center">
          {/* -ml-4 cancels the first link's px-4 so "Home" sits flush with the
              container edge — aligned with the logo and breadcrumb above/below. */}
          <nav className="-ml-4 flex items-center">
            <TopLink href="/" onDark={onDark}>Home</TopLink>
            {CATEGORIES.map((cat) => (
              <div key={cat.slug} className="relative" onMouseEnter={() => setOpenMenu(cat.slug)}>
                <button
                  className={cn(
                    'flex items-center gap-1 px-4 py-3.5 text-sm font-medium transition-colors',
                    onDark ? 'text-white/90 hover:text-white' : 'text-ink hover:text-accent',
                    openMenu === cat.slug && (onDark ? 'text-white' : 'text-accent'),
                  )}
                  aria-expanded={openMenu === cat.slug}
                >
                  {cat.label}
                  <ChevronDown size={14} className={cn('transition-transform', openMenu === cat.slug && 'rotate-180')} />
                </button>
                {openMenu === cat.slug && (
                  <div className="absolute left-0 top-full z-50 w-64 border border-hairline bg-white shadow-hover animate-fade">
                    <div className="border-b border-hairline bg-surface px-4 py-2 text-xs uppercase tracking-[0.08em] text-tertiary">
                      {cat.label}
                    </div>
                    {cat.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/catalog/${cat.slug}/${item.slug}`}
                        className="block px-4 py-2.5 text-sm text-ink transition-colors hover:bg-accent hover:text-white"
                        onClick={() => setOpenMenu(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {SIMPLE_LINKS.map((l) => (
              <TopLink key={l.href} href={l.href} onDark={onDark}>{l.label}</TopLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <CartButton onDark={onDark} />
            <Link href="/instant-rfq" className="my-2 btn btn-primary group">
              Instant RFQ <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white p-5 animate-fade">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-semibold">Menu</span>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="p-2"><X size={22} /></button>
            </div>
            <SearchBar size="sm" className="mb-5" />
            <MobileLink href="/" onClick={() => setMobileOpen(false)}>Home</MobileLink>
            {CATEGORIES.map((cat) => (
              <details key={cat.slug} className="border-b border-hairline">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-medium">
                  {cat.label} <ChevronDown size={16} />
                </summary>
                <div className="pb-2">
                  {cat.items.map((item) => (
                    <Link key={item.slug} href={`/catalog/${cat.slug}/${item.slug}`} onClick={() => setMobileOpen(false)} className="block py-2 pl-4 text-sm text-secondary hover:text-accent">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
            {SIMPLE_LINKS.map((l) => (
              <MobileLink key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</MobileLink>
            ))}
            <Link href="/instant-rfq" onClick={() => setMobileOpen(false)} className="btn btn-primary mt-5 w-full">Instant RFQ</Link>
          </div>
        </div>
      )}
    </header>
  )
}

function TopLink({ href, children, onDark }: { href: string; children: React.ReactNode; onDark: boolean }) {
  return (
    <Link href={href} className={cn('px-4 py-3.5 text-sm font-medium transition-colors', onDark ? 'text-white/90 hover:text-white' : 'text-ink hover:text-accent')}>
      {children}
    </Link>
  )
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block border-b border-hairline py-3 text-sm font-medium">
      {children}
    </Link>
  )
}
