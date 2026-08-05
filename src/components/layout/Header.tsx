'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, ChevronDown, ArrowUpRight, ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/data/catalog'
import { Logo } from '@/components/layout/Logo'
import { SearchBar } from '@/components/ui/SearchBar'
import { CartButton } from '@/components/cart/CartButton'
import { cn } from '@/lib/utils'

// About ASAP sits right after Home; Blog and Contact Us close out the row.
const ABOUT_LINK = { label: 'About ASAP', href: '/about-us' }
const SIMPLE_LINKS = [
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
        {/* Logo — shared canonical component (see Logo.tsx). onDark maps the
            monochrome mark+wordmark to white over the hero and to ink on the
            solid white header, identical formation to the footer. */}
        <Logo onDark={onDark} />

        {/* Search + CTAs (desktop, top-right) — search flexes, CTAs stay pinned right */}
        <div className="ml-auto hidden min-w-0 flex-1 items-center gap-4 lg:flex xl:max-w-[46rem]">
          <div className="min-w-0 flex-1">
            <SearchBar size="sm" />
          </div>
          <CartButton onDark={onDark} />
          <Link href="/instant-rfq" className="btn btn-primary group shrink-0">
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

      {/* Nav row (desktop) */}
      <div className={cn('hidden lg:block border-t', solid ? 'border-hairline' : 'border-white/15')}>
        <div className="container-x flex items-center">
          {/* -ml-5 cancels the first link's px-5 so "Home" sits flush with the
              container edge — aligned with the logo and breadcrumb above/below. */}
          <nav className="-ml-5 flex items-center">
            <TopLink href="/" onDark={onDark}>Home</TopLink>
            <TopLink href={ABOUT_LINK.href} onDark={onDark}>{ABOUT_LINK.label}</TopLink>
            {CATEGORIES.map((cat) => (
              <div key={cat.slug} className="relative" onMouseEnter={() => setOpenMenu(cat.slug)}>
                <button
                  className={cn(
                    'flex items-center gap-1 px-5 py-3.5 text-sm font-medium transition-colors',
                    onDark ? 'text-white/90 hover:text-white' : 'text-ink hover:text-accent',
                    openMenu === cat.slug && (onDark ? 'text-white' : 'text-accent'),
                  )}
                  aria-expanded={openMenu === cat.slug}
                >
                  {cat.label}
                  <ChevronDown size={14} className={cn('transition-transform', openMenu === cat.slug && 'rotate-180')} />
                </button>
                {openMenu === cat.slug && (
                  <div className="absolute left-0 top-full z-50 w-64 border border-hairline bg-surface shadow-hover animate-fade">
                    <div className="border-b border-hairline px-4 py-2 text-xs uppercase tracking-[0.08em] text-tertiary">
                      {cat.label}
                    </div>
                    {cat.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/catalog/${cat.slug}/${item.slug}`}
                        className="group/item flex items-center gap-1 px-4 py-3 text-sm text-ink transition-colors hover:bg-surface-2 hover:text-accent"
                        onClick={() => setOpenMenu(null)}
                      >
                        {item.label}
                        <ArrowRight size={13} className="-translate-x-1 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
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
            <MobileLink href={ABOUT_LINK.href} onClick={() => setMobileOpen(false)}>{ABOUT_LINK.label}</MobileLink>
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
    <Link href={href} className={cn('px-5 py-3.5 text-sm font-medium transition-colors', onDark ? 'text-white/90 hover:text-white' : 'text-ink hover:text-accent')}>
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
