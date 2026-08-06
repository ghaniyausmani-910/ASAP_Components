'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CommandPalette } from '@/components/search/CommandPalette'

interface SearchCommandValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const SearchCommandContext = createContext<SearchCommandValue | null>(null)

/**
 * Owns the global command-palette (⌘K) open state and installs the app-wide
 * keyboard shortcut. Mounted once in the root layout (mirrors CartProvider) and
 * renders the palette itself. The palette opens from anywhere via ⌘K / Ctrl+K;
 * any component can also open it programmatically through `useSearchCommand()`.
 */
export function SearchCommandProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // ⌘K (mac) / Ctrl+K (elsewhere) — toggle from anywhere. preventDefault so
      // the browser's own shortcut (focus address bar, etc.) never fires.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(() => ({ open, setOpen }), [open])

  return (
    <SearchCommandContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </SearchCommandContext.Provider>
  )
}

export function useSearchCommand(): SearchCommandValue {
  const ctx = useContext(SearchCommandContext)
  if (!ctx) throw new Error('useSearchCommand must be used within SearchCommandProvider')
  return ctx
}
