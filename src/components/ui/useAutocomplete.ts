'use client'

import { useEffect, useMemo, useState } from 'react'
import { searchSuggestions, popularSuggestions, type Suggestion } from '@/lib/data/suggestions'

/**
 * Headless combobox state for a type-scoped search input. Owns the filtered
 * suggestion list, open/closed state, and keyboard-driven active index; the
 * caller renders the dropdown (light on white, dark on the frosted hero card).
 *
 * `onSelect` fires when the user commits a suggestion via Enter or click.
 *
 * When the query is empty the hook falls back to the supplied `recent`
 * list and a small `popular` slice from the catalog pool, so focusing the
 * bar always surfaces something clickable instead of a blank list.
 */
export function useAutocomplete({
  query,
  type,
  onSelect,
  enabled = true,
  limit = 6,
  recent = [],
  popularLimit = 5,
}: {
  query: string
  type: string
  onSelect: (s: Suggestion) => void
  enabled?: boolean
  limit?: number
  /** Recent searches for the current `type`, most recent first. */
  recent?: Suggestion[]
  /** Cap on the popular slice shown alongside recents in the empty state. */
  popularLimit?: number
}) {
  const items = useMemo(() => {
    if (!enabled) return []
    if (query.trim()) return searchSuggestions(query, type, limit)
    // Empty query → recent + popular, deduped so a recent value never repeats
    // when it also shows up in the popular pool.
    const seen = new Set<string>()
    const merged: Suggestion[] = []
    for (const r of recent) {
      const key = `${r.type}::${r.value}`
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(r)
    }
    for (const p of popularSuggestions(type, popularLimit)) {
      const key = `${p.type}::${p.value}`
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(p)
    }
    return merged
  }, [enabled, query, type, limit, recent, popularLimit])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  // Any change to the result set clears the highlight so a stale index can
  // never commit the wrong row.
  useEffect(() => {
    setActive(-1)
  }, [items])

  const listOpen = open && items.length > 0

  function onKeyDown(e: React.KeyboardEvent) {
    if (!items.length) return
    if (!open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
        setActive(0)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive((i) => (i + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((i) => (i <= 0 ? items.length - 1 : i - 1))
        break
      case 'Enter':
        if (active >= 0) {
          e.preventDefault()
          onSelect(items[active])
          setOpen(false)
          setActive(-1)
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        setActive(-1)
        break
    }
  }

  return { items, listOpen, open, setOpen, active, setActive, onKeyDown }
}

export type { Suggestion }
