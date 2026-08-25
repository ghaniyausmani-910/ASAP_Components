'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Suggestion, SuggestionType } from '@/lib/data/suggestions'
import { searchSuggestions } from '@/lib/data/suggestions'

/**
 * Persistent list of the searches the user has actually run — powers the
 * empty-query state of the search dropdown alongside the popular list. Stored
 * per-browser in localStorage, keyed by suggestion type so a Manufacturer
 * search never leaks into the Part Number recent list.
 */
export interface RecentEntry {
  value: string
  type: SuggestionType
}

const KEY = 'asap.recentSearches.v1'
const MAX_TOTAL = 20

function read(): RecentEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (e): e is RecentEntry => !!e && typeof (e as RecentEntry).value === 'string' && typeof (e as RecentEntry).type === 'string',
    )
  } catch {
    return []
  }
}

function write(entries: RecentEntry[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_TOTAL)))
  } catch {
    // Storage full / disabled — ignore silently, the feature just becomes ephemeral.
  }
}

/**
 * Recent-search state hook. Returns the list scoped to the current `type`,
 * plus a `record()` callback to log a new query.
 */
export function useRecentSearches(type: string, limit = 4): {
  recent: Suggestion[]
  record: (value: string) => void
} {
  const [entries, setEntries] = useState<RecentEntry[]>([])

  useEffect(() => {
    setEntries(read())
  }, [])

  const record = useCallback(
    (value: string) => {
      const v = value.trim()
      if (!v) return
      const kind = (['Part Number', 'NSN', 'CAGE Code', 'Manufacturer'].includes(type)
        ? type
        : 'Part Number') as SuggestionType
      setEntries((prev) => {
        const next: RecentEntry[] = [{ value: v, type: kind }]
        for (const e of prev) {
          if (e.value === v && e.type === kind) continue
          next.push(e)
        }
        const trimmed = next.slice(0, MAX_TOTAL)
        write(trimmed)
        return trimmed
      })
    },
    [type],
  )

  const recent: Suggestion[] = entries
    .filter((e) => e.type === type)
    .slice(0, limit)
    // Try to reattach the current catalog metadata (hint / mfr / href) — the
    // stored entry only carries the raw query, so a live lookup gives us a
    // deep-link when the value still matches something in the pool.
    .map((e) => {
      const match = searchSuggestions(e.value, e.type, 1)[0]
      return match
        ? { ...match, section: 'recent' as const }
        : {
            value: e.value,
            type: e.type,
            href: `/search?q=${encodeURIComponent(e.value)}&type=${encodeURIComponent(e.type)}`,
            section: 'recent' as const,
          }
    })

  return { recent, record }
}
