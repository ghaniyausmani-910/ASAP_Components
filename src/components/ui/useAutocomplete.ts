'use client'

import { useEffect, useMemo, useState } from 'react'
import { searchSuggestions, type Suggestion } from '@/lib/data/suggestions'

/**
 * Headless combobox state for a type-scoped search input. Owns the filtered
 * suggestion list, open/closed state, and keyboard-driven active index; the
 * caller renders the dropdown (light on white, dark on the frosted hero card).
 *
 * `onSelect` fires when the user commits a suggestion via Enter or click.
 */
export function useAutocomplete({
  query,
  type,
  onSelect,
  enabled = true,
  limit = 6,
}: {
  query: string
  type: string
  onSelect: (s: Suggestion) => void
  enabled?: boolean
  limit?: number
}) {
  const items = useMemo(
    () => (enabled ? searchSuggestions(query, type, limit) : []),
    [query, type, enabled, limit],
  )
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
