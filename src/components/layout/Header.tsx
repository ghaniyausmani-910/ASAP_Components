'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, ChevronDown, ArrowUpRight, ArrowRight } from 'lucide-react'
import { SearchBar } from '@/components/ui/SearchBar'
import { Logo } from '@/components/layout/Logo'
import { CartButton } from '@/components/cart/CartButton'
import { cn } from '@/lib/utils'
import {
  CATEGORY_NAV,
  PRODUCT_NAV,
  MANUFACTURER_DIRECTORIES,
  MANUFACTURERS_BROWSE_ALL,
  TOP_BRANDS,
  type NavLink,
} from '@/lib/data/nav'

const SIMPLE_LINKS = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact-us' },
]

// The three mobile accordions mirror the desktop mega menus, flattened
// into a single link list each so the drawer stays compact.
const MOBILE_AXES: { label: string; links: NavLink[] }[] = [
  { label: 'Categories', links: CATEGORY_NAV },
  { label: 'Products', links: PRODUCT_NAV.flatMap((g) => g.links) },
  { label: 'Manufacturers', links: [...MANUFACTURER_DIRECTORIES, ...TOP_BRANDS] },
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
      {/* Top strip — logo, search, and primary actions */}
      <div className="container-x flex h-16 items-center gap-4 lg:h-[72px] lg:gap-6">
        {/* Logo */}
        <Logo onDark={onDark} />

        {/* Search (desktop) — flexes to fill available space, capped */}
        <div className="ml-auto hidden min-w-0 flex-1 lg:block xl:max-w-[34rem]">
          <SearchBar size="sm" />
        </div>

        {/* Primary actions (desktop) */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <CartButton onDark={onDark} />
          <Link href="/instant-rfq" className="btn btn-primary group">
            Instant RFQ <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
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

      {/* Nav row (desktop) — a single row of triggers + one shared, full-width
          mega panel that sits below the whole row (Cloudflare-style). */}
      <div className={cn('relative hidden lg:block border-t', solid ? 'border-hairline' : 'border-white/15')}>
        <div className="container-x">
          {/* -ml-4 cancels the first link's px-4 so "Home" sits flush with the
              container edge — aligned with the logo and breadcrumb above/below. */}
          <nav className="-ml-4 flex items-center">
            <TopLink href="/" onDark={onDark} onHover={() => setOpenMenu(null)}>Home</TopLink>
            <NavTrigger id="categories" label="Categories" openMenu={openMenu} setOpenMenu={setOpenMenu} onDark={onDark} />
            <NavTrigger id="products" label="Products" openMenu={openMenu} setOpenMenu={setOpenMenu} onDark={onDark} />
            <NavTrigger id="manufacturers" label="Manufacturers" openMenu={openMenu} setOpenMenu={setOpenMenu} onDark={onDark} />
            {SIMPLE_LINKS.map((l) => (
              <TopLink key={l.href} href={l.href} onDark={onDark} onHover={() => setOpenMenu(null)}>{l.label}</TopLink>
            ))}
          </nav>
        </div>

        {openMenu && (
          <div className="absolute inset-x-0 top-full z-50 border-t border-hairline bg-surface shadow-hover animate-mega">
            <MegaPanel menu={openMenu} onNavigate={() => setOpenMenu(null)} />
          </div>
        )}
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
            {MOBILE_AXES.map((axis) => (
              <details key={axis.label} className="group border-b border-hairline">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-medium">
                  {axis.label} <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="pb-2">
                  {axis.links.map((l) => (
                    <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block py-2 pl-4 text-sm text-secondary hover:text-accent">
                      {l.label}
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

// ── Desktop mega menu ────────────────────────────────────────

function MegaPanel({ menu, onNavigate }: { menu: string; onNavigate: () => void }) {
  if (menu === 'categories') {
    return (
      <MegaShell
        heading="Browse by market"
        footer={<MegaFooter cta="Browse the full catalog" href="/sitemap" meta="6 markets · thousands of line items" onNavigate={onNavigate} />}
      >
        <div className="grid grid-cols-3 gap-x-10 gap-y-1">
          {CATEGORY_NAV.map((l) => (
            <MegaItem key={l.href} link={l} onNavigate={onNavigate} />
          ))}
        </div>
      </MegaShell>
    )
  }

  if (menu === 'products') {
    return (
      <MegaShell
        heading="Browse by part type"
        footer={<MegaFooter cta="View all part types" href="/catalog/electronic/part-types" meta="Bearings · Fasteners · Standards · Featured" onNavigate={onNavigate} />}
      >
        <div className="grid grid-cols-4">
          {PRODUCT_NAV.map((g, i) => (
            <div key={g.heading} className={cn('flex flex-col gap-0.5 px-8', i === 0 ? 'pl-0' : 'border-l border-hairline')}>
              <MegaColHeading>{g.heading}</MegaColHeading>
              {g.links.map((l) => (
                <MegaItem key={l.href} link={l} onNavigate={onNavigate} />
              ))}
            </div>
          ))}
        </div>
      </MegaShell>
    )
  }

  // manufacturers
  return (
    <MegaShell
      heading="Browse by brand"
      footer={<MegaFooter cta="Browse all manufacturers A–Z" href={MANUFACTURERS_BROWSE_ALL} meta={`${TOP_BRANDS.length}+ top brands in stock`} onNavigate={onNavigate} />}
    >
      <div className="grid grid-cols-4 gap-x-10">
        <div className="flex flex-col gap-0.5">
          <MegaColHeading>Directories</MegaColHeading>
          {MANUFACTURER_DIRECTORIES.map((l) => (
            <MegaItem key={l.href} link={l} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="col-span-3 border-l border-hairline pl-10">
          <MegaColHeading>Top brands</MegaColHeading>
          <div className="grid grid-cols-3 gap-x-8 gap-y-0.5">
            {TOP_BRANDS.map((l) => (
              <MegaItem key={l.href} link={l} onNavigate={onNavigate} compact />
            ))}
          </div>
        </div>
      </div>
    </MegaShell>
  )
}

// Shared shell keeps every panel the same width (container) and the same
// height (min-h + footer pinned to the bottom) for visual consistency.
function MegaShell({ heading, children, footer }: { heading: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="container-x flex min-h-[424px] flex-col py-8">
      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-tertiary">{heading}</p>
      <div className="flex-1">{children}</div>
      {footer}
    </div>
  )
}

function MegaColHeading({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-tertiary">{children}</p>
}

function MegaItem({ link, onNavigate, compact }: { link: NavLink; onNavigate: () => void; compact?: boolean }) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className="group/item -mx-3 flex flex-col rounded-md px-3 py-1.5 transition-colors duration-150 hover:bg-surface-2"
    >
      <span className="flex items-center gap-1 text-sm font-medium text-ink transition-colors duration-150 group-hover/item:text-accent">
        {link.label}
        <ArrowRight size={13} className="-translate-x-1 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
      </span>
      {!compact && link.desc && (
        <span className="mt-0.5 text-xs leading-relaxed text-tertiary">{link.desc}</span>
      )}
    </Link>
  )
}

function MegaFooter({ cta, href, meta, onNavigate }: { cta: string; href: string; meta: string; onNavigate: () => void }) {
  return (
    <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
      <Link href={href} onClick={onNavigate} className="group/cta inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        {cta}
        <ArrowRight size={14} className="transition-transform duration-200 group-hover/cta:translate-x-1" />
      </Link>
      <span className="text-xs text-tertiary">{meta}</span>
    </div>
  )
}

function NavTrigger({
  id,
  label,
  openMenu,
  setOpenMenu,
  onDark,
}: {
  id: string
  label: string
  openMenu: string | null
  setOpenMenu: (v: string | null) => void
  onDark: boolean
}) {
  const open = openMenu === id
  return (
    <button
      type="button"
      onMouseEnter={() => setOpenMenu(id)}
      onClick={() => setOpenMenu(open ? null : id)}
      aria-expanded={open}
      className={cn(
        'flex items-center gap-1 px-4 py-3.5 text-sm font-medium transition-colors',
        onDark ? 'text-white/90 hover:text-white' : 'text-ink hover:text-accent',
        open && (onDark ? 'text-white' : 'text-accent'),
      )}
    >
      {label}
      <ChevronDown size={14} className={cn('transition-transform duration-200', open && 'rotate-180')} />
    </button>
  )
}

function TopLink({ href, children, onDark, onHover }: { href: string; children: React.ReactNode; onDark: boolean; onHover?: () => void }) {
  return (
    <Link
      href={href}
      onMouseEnter={onHover}
      className={cn('px-4 py-3.5 text-sm font-medium transition-colors', onDark ? 'text-white/90 hover:text-white' : 'text-ink hover:text-accent')}
    >
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
