'use client'

import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Search,
  ArrowRight,
  Plane,
  Boxes,
  CircuitBoard,
  Cable,
  FileText,
  ShieldCheck,
  Newspaper,
  Mail,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Highlight } from '@/components/ui/SuggestionsDropdown'
import { searchCommand } from '@/lib/data/command-search'
import { searchTargetHref, searchSuggestions } from '@/lib/data/suggestions'
import { trackSearch } from '@/lib/analytics'

const MONO_TYPES = new Set(['Part Number', 'NSN', 'CAGE Code'])

/**
 * Curated shortcuts shown while the input is empty — the palette's "resting"
 * state, so it's useful before the user types (mirrors the grouped links in a
 * docs command palette). Kept flat-indexable so arrow-key nav works here too.
 */
interface QuickLink {
  label: string
  hint: string
  href: string
  Icon: LucideIcon
}
const DEFAULT_GROUPS: { title: string; items: QuickLink[] }[] = [
  {
    title: 'Browse catalog',
    items: [
      { label: 'Aviation Parts', hint: 'Aircraft & aviation', href: '/catalog/aviation/part-types', Icon: Plane },
      { label: 'NSN Parts', hint: 'By NSN, NIIN, FSC', href: '/catalog/nsn/nsn', Icon: Boxes },
      { label: 'Board Level Components', hint: 'ICs, resistors, capacitors', href: '/catalog/electronic/part-types', Icon: CircuitBoard },
      { label: 'Electrical Connectors', hint: 'Circular, RF, fiber optic', href: '/catalog/connectors/types', Icon: Cable },
    ],
  },
  {
    title: 'Quick links',
    items: [
      { label: 'Instant RFQ', hint: 'Quote in 15 minutes', href: '/instant-rfq', Icon: FileText },
      { label: 'Quality & Certifications', hint: 'AS9120B · ISO 9001', href: '/quality', Icon: ShieldCheck },
      { label: 'Blog', hint: 'News & guides', href: '/blog', Icon: Newspaper },
      { label: 'Contact Us', hint: 'Talk to our team', href: '/contact-us', Icon: Mail },
    ],
  },
]
const DEFAULT_ITEMS: QuickLink[] = DEFAULT_GROUPS.flatMap((g) => g.items)

/**
 * Global command palette (⌘K). A portal-mounted overlay with one search input
 * and grouped, keyboard-navigable results (parts + pages). Open state is owned
 * by SearchCommandProvider; this component handles focus, scroll lock, keyboard
 * navigation and routing.
 */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  // createPortal needs `document`; only render after the client mounts.
  useEffect(() => setMounted(true), [])

  const { parts, pages } = useMemo(() => searchCommand(query), [query])
  const hasQuery = query.trim().length > 0
  const hasResults = parts.length > 0 || pages.length > 0
  // One flattened list drives a single active index for keyboard nav. While the
  // input is empty it's the default quick-links; once typing, it's parts→pages.
  const flat = useMemo(
    () =>
      hasQuery
        ? [...parts.map((p) => p.href), ...pages.map((p) => p.href)]
        : DEFAULT_ITEMS.map((i) => i.href),
    [hasQuery, parts, pages],
  )

  // Any change to the result set clears the highlight so a stale index can
  // never commit the wrong row.
  useEffect(() => setActive(-1), [query])

  // Open/close side effects: capture + restore focus, lock body scroll, reset.
  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const raf = window.requestAnimationFrame(() => inputRef.current?.focus())
      return () => {
        document.body.style.overflow = prevOverflow
        window.cancelAnimationFrame(raf)
      }
    }
    // On close, reset query/highlight and hand focus back to the trigger.
    setQuery('')
    setActive(-1)
    restoreRef.current?.focus?.()
  }, [open])

  // Keep the highlighted row scrolled into view.
  useEffect(() => {
    if (active < 0) return
    document.getElementById(`cmd-opt-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function navigate(href: string) {
    onClose()
    router.push(href)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        if (!hasResults) return
        e.preventDefault()
        setActive((i) => (i + 1) % flat.length)
        break
      case 'ArrowUp':
        if (!hasResults) return
        e.preventDefault()
        setActive((i) => (i <= 0 ? flat.length - 1 : i - 1))
        break
      case 'Enter': {
        e.preventDefault()
        if (active >= 0 && flat[active]) {
          navigate(flat[active])
        } else {
          // No row highlighted — treat as a free-text submit, same routing as
          // the header search bar (results page, or a pre-filled RFQ on a miss).
          const v = query.trim()
          if (v) trackSearch(v, searchSuggestions(v, 'Part Number', 50).length, 'Part Number')
          const href = searchTargetHref(query, 'Part Number')
          if (href) navigate(href)
        }
        break
      }
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-0 flex justify-center px-4 pt-[12vh]">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site search"
              className="w-full max-w-[640px] overflow-hidden border border-inputline bg-white shadow-hover"
              initial={{ opacity: 0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.98 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-hairline px-4">
                <Search size={20} className="shrink-0 text-tertiary" strokeWidth={2.25} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search part number, NSN, CAGE, manufacturer…"
                  aria-label="Search query"
                  role="combobox"
                  aria-expanded={hasQuery ? hasResults : true}
                  aria-controls="cmd-listbox"
                  aria-autocomplete="list"
                  aria-activedescendant={active >= 0 ? `cmd-opt-${active}` : undefined}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-16 min-w-0 flex-1 bg-transparent font-body text-body-lg text-ink outline-none placeholder:text-tertiary"
                />
                <kbd className="hidden shrink-0 border border-hairline px-2 py-1 font-mono text-xs text-tertiary sm:block">
                  esc
                </kbd>
              </div>

              {/* Results */}
              {!hasQuery ? (
                <div id="cmd-listbox" className="max-h-[60vh] overflow-auto p-2">
                  <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                    {DEFAULT_GROUPS.map((group) => (
                      <div key={group.title} className="py-1">
                        <div className="px-4 pb-1 pt-2 text-xs uppercase tracking-[0.08em] text-tertiary">
                          {group.title}
                        </div>
                        <ul role="listbox" aria-label={group.title}>
                          {group.items.map((item) => {
                            const idx = DEFAULT_ITEMS.indexOf(item)
                            return (
                              <Row
                                key={item.href}
                                index={idx}
                                active={active === idx}
                                title={item.label}
                                hint={item.hint}
                                icon={<item.Icon size={16} className="text-tertiary" />}
                                onHover={() => setActive(idx)}
                                onPick={() => navigate(item.href)}
                              />
                            )
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : !hasResults ? (
                <div className="px-4 py-10 text-center text-sm text-tertiary">
                  No catalog match for “{query.trim()}”. Press{' '}
                  <kbd className="border border-hairline px-1.5 py-0.5 font-mono text-xs">Enter</kbd> to
                  request a quote.
                </div>
              ) : (
                <ul id="cmd-listbox" role="listbox" className="max-h-[60vh] overflow-auto py-2">
                  {parts.length > 0 && <SectionLabel>Parts</SectionLabel>}
                  {parts.map((s, i) => (
                    <Row
                      key={`part-${s.value}`}
                      index={i}
                      active={active === i}
                      mono={MONO_TYPES.has(s.type)}
                      title={<Highlight text={s.value} query={query} />}
                      hint={s.hint}
                      trailing={s.mfr}
                      onHover={() => setActive(i)}
                      onPick={() => navigate(s.href)}
                    />
                  ))}
                  {pages.length > 0 && <SectionLabel>Pages</SectionLabel>}
                  {pages.map((p, j) => {
                    const idx = parts.length + j
                    return (
                      <Row
                        key={`page-${p.href}`}
                        index={idx}
                        active={active === idx}
                        title={<Highlight text={p.label} query={query} />}
                        hint={p.hint}
                        icon={<ArrowRight size={15} className="text-tertiary" />}
                        onHover={() => setActive(idx)}
                        onPick={() => navigate(p.href)}
                      />
                    )
                  })}
                </ul>
              )}

              {/* Footer hints */}
              <div className="flex items-center gap-4 border-t border-hairline px-4 py-2.5 text-xs text-tertiary">
                <Hint keys="↑ ↓">Navigate</Hint>
                <Hint keys="↵">Select</Hint>
                <Hint keys="esc">Close</Hint>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <li
      role="presentation"
      className="px-4 pb-1 pt-2 text-xs uppercase tracking-[0.08em] text-tertiary"
    >
      {children}
    </li>
  )
}

function Row({
  index,
  active,
  mono,
  title,
  hint,
  trailing,
  icon,
  onHover,
  onPick,
}: {
  index: number
  active: boolean
  mono?: boolean
  title: React.ReactNode
  hint?: string
  trailing?: string
  icon?: React.ReactNode
  onHover: () => void
  onPick: () => void
}) {
  return (
    <li
      id={`cmd-opt-${index}`}
      role="option"
      aria-selected={active}
      onMouseMove={onHover}
      onMouseDown={(e) => {
        // Commit before the input's blur can steal the click.
        e.preventDefault()
        onPick()
      }}
      className={cn(
        'flex cursor-pointer items-baseline justify-between gap-3 px-4 py-2.5 transition-colors',
        active ? 'bg-surface' : 'hover:bg-surface',
      )}
    >
      <span className="flex min-w-0 items-baseline gap-3">
        {icon && <span className="self-center">{icon}</span>}
        <span className="flex min-w-0 flex-col">
          <span className={cn('truncate text-body text-ink', mono && 'font-mono text-sm')}>{title}</span>
          {hint && <span className="truncate text-xs text-tertiary">{hint}</span>}
        </span>
      </span>
      {trailing && (
        <span className="max-w-[13rem] shrink-0 truncate text-right text-xs text-secondary">
          {trailing}
        </span>
      )}
    </li>
  )
}

function Hint({ keys, children }: { keys: string; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="border border-hairline px-1.5 py-0.5 font-mono text-[0.65rem] leading-none">
        {keys}
      </kbd>
      {children}
    </span>
  )
}
