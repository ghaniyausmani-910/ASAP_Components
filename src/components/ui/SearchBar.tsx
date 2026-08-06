'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAutocomplete } from '@/components/ui/useAutocomplete'
import { SuggestionsDropdown } from '@/components/ui/SuggestionsDropdown'
import { Select } from '@/components/ui/Select'
import { searchTargetHref } from '@/lib/data/suggestions'

const TYPES = ['Part Number', 'NSN', 'CAGE Code', 'Manufacturer']

export function SearchBar({
  size = 'md',
  onDark = false,
  showType = true,
  shortcut = false,
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
  showType?: boolean
  /** Show a ⌘K / Ctrl+K hint — the same shortcut opens the global command palette. */
  shortcut?: boolean
  className?: string
}) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [type, setType] = useState(TYPES[0])
  const listId = useId()
  // Platform-aware modifier label; defaults to ⌘ (matches server render) and
  // corrects on non-mac after mount, so there's no hydration mismatch.
  const [isMac, setIsMac] = useState(true)
  useEffect(() => {
    setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent))
  }, [])

  function go(value: string, searchType: string) {
    // A query with no genuine catalog match dead-ends on the results page (which
    // fabricates a row for anything), so `searchTargetHref` routes it straight to
    // a pre-filled RFQ instead — keeping /search out of history so Back doesn't
    // loop. Shared with the command palette so both agree on the destination.
    const href = searchTargetHref(value, searchType)
    if (href) router.push(href)
  }

  function handleSelect(s: { value: string; type: string; href?: string }) {
    setQ(s.value)
    // A suggestion points at one specific thing — deep-link to its page.
    // Falls back to the listing if a row ever lacks an href.
    if (s.href) {
      router.push(s.href)
    } else {
      go(s.value, s.type)
    }
  }

  const ac = useAutocomplete({ query: q, type, onSelect: handleSelect })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    go(q, type)
  }

  const h = size === 'lg' ? 'h-16' : size === 'sm' ? 'h-11' : 'h-12'
  const text = size === 'lg' ? 'text-body-lg' : 'text-body'

  return (
    <div className={cn('flex items-stretch gap-2', className)}>
      <div className="relative min-w-0 flex-1">
      <form
        onSubmit={submit}
        role="search"
        aria-label="Search parts"
        className={cn(
          'flex items-stretch bg-white',
          onDark ? 'field-shell-dark' : 'field-shell',
          h,
        )}
      >
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            ac.setOpen(true)
          }}
          onFocus={() => ac.setOpen(true)}
          onBlur={() => ac.setOpen(false)}
          onKeyDown={ac.onKeyDown}
          placeholder="Enter Part Number, NSN…"
          aria-label="Search query"
          role="combobox"
          aria-expanded={ac.listOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={ac.active >= 0 ? `${listId}-opt-${ac.active}` : undefined}
          autoComplete="off"
          className={cn('min-w-0 flex-1 bg-transparent px-4 font-body text-ink outline-none placeholder:text-tertiary', text)}
        />
        {showType && (
          <div className="hidden sm:flex items-center border-l border-inputline">
            <Select
              variant="bare"
              size={size}
              value={type}
              onChange={setType}
              options={TYPES}
              ariaLabel="Search type"
              className="h-full"
            />
          </div>
        )}
        <button
          type="submit"
          className={cn(
            'flex items-center gap-2 whitespace-nowrap bg-accent px-5 font-body font-semibold text-white transition-colors hover:bg-accent-hover',
            size === 'lg' ? 'text-body px-7' : 'text-sm',
          )}
        >
          <Search size={size === 'lg' ? 20 : 16} strokeWidth={2.5} />
          <span className="hidden sm:inline tracking-[0.02em]">Search</span>
        </button>
      </form>

      {ac.listOpen && (
        <SuggestionsDropdown
          id={listId}
          items={ac.items}
          active={ac.active}
          query={q}
          onPick={handleSelect}
          onHover={ac.setActive}
        />
      )}
      </div>

      {shortcut && (
        // Standalone key-cap sitting beside the field (outside it). The same
        // ⌘K / Ctrl+K shortcut opens the global command palette.
        <kbd
          aria-hidden="true"
          className={cn(
            'hidden shrink-0 items-center gap-0.5 self-center border px-2 font-mono text-xs lg:flex',
            h,
            onDark ? 'border-white/30 text-white/70' : 'border-inputline text-tertiary',
          )}
        >
          {isMac ? '⌘' : 'Ctrl'} K
        </kbd>
      )}
    </div>
  )
}
