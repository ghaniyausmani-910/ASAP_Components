'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const value = q.trim()
    if (!value) return
    router.push(`/search?q=${encodeURIComponent(value)}&type=${encodeURIComponent(type)}`)
  }

  const h = size === 'lg' ? 'h-16' : size === 'sm' ? 'h-11' : 'h-12'
  const text = size === 'lg' ? 'text-body-lg' : 'text-body'

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Search parts"
      className={cn(
        'flex items-stretch bg-white border',
        onDark ? 'border-transparent shadow-hover' : 'border-inputline',
        h,
        className,
      )}
    >
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Enter Part Number, NSN…"
        aria-label="Search query"
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
  )
}
