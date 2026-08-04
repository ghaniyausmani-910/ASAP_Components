'use client'

import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAutocomplete } from '@/components/ui/useAutocomplete'
import { SuggestionsDropdown } from '@/components/ui/SuggestionsDropdown'

const TYPES = ['Part Number', 'NSN', 'CAGE Code', 'Manufacturer']

export function SearchBar({
  size = 'md',
  onDark = false,
  showType = true,
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
  showType?: boolean
  className?: string
}) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [type, setType] = useState(TYPES[0])
  const listId = useId()

  function go(value: string, searchType: string) {
    const v = value.trim()
    if (!v) return
    router.push(`/search?q=${encodeURIComponent(v)}&type=${encodeURIComponent(searchType)}`)
  }

  function handleSelect(s: { value: string; type: string }) {
    setQ(s.value)
    go(s.value, s.type)
  }

  const ac = useAutocomplete({ query: q, type, onSelect: handleSelect })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    go(q, type)
  }

  const h = size === 'lg' ? 'h-16' : size === 'sm' ? 'h-11' : 'h-12'
  const text = size === 'lg' ? 'text-body-lg' : 'text-body'

  return (
    <div className={cn('relative', className)}>
      <form
        onSubmit={submit}
        role="search"
        aria-label="Search parts"
        className={cn(
          'flex items-stretch bg-white border',
          onDark ? 'border-transparent shadow-hover' : 'border-inputline',
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
          <div className="relative hidden sm:flex items-center border-l border-inputline">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Search type"
              className={cn('h-full appearance-none bg-transparent pl-4 pr-9 font-body text-secondary outline-none cursor-pointer', size === 'lg' ? 'text-body' : 'text-sm')}
            >
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 text-tertiary">▾</span>
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
  )
}
