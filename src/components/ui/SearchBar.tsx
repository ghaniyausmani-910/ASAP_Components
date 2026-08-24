'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAutocomplete } from '@/components/ui/useAutocomplete'
import { SuggestionsDropdown } from '@/components/ui/SuggestionsDropdown'
import { Select } from '@/components/ui/Select'
import { searchTargetHref } from '@/lib/data/suggestions'
import { describePartNo } from '@/lib/data/parts'
import {
  shouldTriggerBulkPaste,
  parseBulkPaste,
  type BulkParseResult,
  type BulkToken,
} from '@/lib/search/bulkPaste'
import { BulkPasteReview } from '@/components/search/BulkPasteReview'
import { useCart } from '@/lib/cart/CartContext'
import { useToast } from '@/lib/toast/ToastContext'

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
  const { getLine, setQuantity, addItem, removeItem } = useCart()
  const { showToast } = useToast()
  const [q, setQ] = useState('')
  const [type, setType] = useState(TYPES[0])
  const [bulk, setBulk] = useState<BulkParseResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
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

  // Layer 2 — intercept a multi-item paste; single-line pastes fall through to
  // the browser so normal search is untouched.
  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text')
    if (!shouldTriggerBulkPaste(text)) return
    e.preventDefault()
    ac.setOpen(false)
    setBulk(parseBulkPaste(text))
  }

  function closeBulk() {
    setBulk(null)
    inputRef.current?.focus()
  }

  // Layer 4 — one-shot commit. Matched tokens carry their catalog record;
  // unknowns go through as raw part numbers (the desk can still quote them).
  // Dedupes by part+manufacturer, merging quantity, into the shared cart store.
  function commitToRfq(committable: BulkToken[]) {
    const undos: Array<() => void> = []
    committable.forEach((t) => {
      const partNo = t.record?.partNo ?? t.normalized
      const manufacturer = t.record?.manufacturer ?? ''
      const description = t.record?.description ?? describePartNo(partNo) ?? undefined
      const existing = getLine(partNo, manufacturer)
      if (existing) {
        const prevQty = existing.quantity
        setQuantity(partNo, manufacturer, prevQty + 1)
        undos.push(() => setQuantity(partNo, manufacturer, prevQty))
      } else {
        addItem({ partNo, manufacturer, description, quantity: 1 })
        undos.push(() => removeItem(partNo, manufacturer))
      }
    })
    const n = committable.length
    showToast({
      message: `${n} item${n === 1 ? '' : 's'} added to your RFQ`,
      action: { label: 'Undo', onClick: () => undos.forEach((u) => u()) },
    })
    setBulk(null)
    router.push('/cart')
  }

  function searchAll(tokens: string[]) {
    setBulk(null)
    if (tokens.length) router.push(`/search?qs=${encodeURIComponent(tokens.join(','))}`)
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
          ref={inputRef}
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            ac.setOpen(true)
          }}
          onPaste={onPaste}
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
        {shortcut && (
          // Key-cap sitting INSIDE the field, right-aligned against the end of
          // the input (before the type selector). The same ⌘K / Ctrl+K shortcut
          // opens the global command palette.
          <kbd
            aria-hidden="true"
            className={cn(
              'mr-2 hidden shrink-0 select-none items-center gap-0.5 self-center font-mono text-xs lg:flex',
              onDark ? 'text-white/70' : 'text-tertiary',
            )}
          >
            {isMac ? '⌘' : 'Ctrl'} K
          </kbd>
        )}
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

      {ac.listOpen && !bulk && (
        <SuggestionsDropdown
          id={listId}
          items={ac.items}
          active={ac.active}
          query={q}
          onPick={handleSelect}
          onHover={ac.setActive}
        />
      )}

      {bulk && (
        <BulkPasteReview
          result={bulk}
          onClose={closeBulk}
          onSearchAll={searchAll}
          onCommitToRfq={commitToRfq}
        />
      )}
      </div>

    </div>
  )
}
