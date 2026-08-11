'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { track } from '@/lib/analytics'

export function InlineRfqForm({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const router = useRouter()
  const [partNo, setPartNo] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const q = partNo.trim()
    track('rfq_start', { source: 'inline', part_no: q || undefined })
    router.push(q ? `/instant-rfq?partno=${encodeURIComponent(q)}` : '/instant-rfq')
  }

  const light = theme === 'light'

  return (
    <form
      onSubmit={submit}
      className={cn(
        'flex items-stretch border transition-[border-color,box-shadow] duration-200',
        light
          ? 'border-hairline bg-white focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--color-accent-100)]'
          : 'border-white/15 bg-white/5 focus-within:border-white/90 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.22)]',
      )}
    >
      <input
        value={partNo}
        onChange={(e) => setPartNo(e.target.value)}
        placeholder="Enter Part Number"
        aria-label="Part number"
        className={cn(
          'min-w-0 flex-1 bg-transparent px-4 py-3.5 font-body text-body outline-none',
          light ? 'text-ink placeholder:text-tertiary' : 'text-white placeholder:text-white/40',
        )}
      />
      <button
        type="submit"
        className={cn(
          'whitespace-nowrap px-6 font-body text-sm font-semibold transition-colors',
          light ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-white text-ink hover:bg-accent hover:text-white',
        )}
      >
        Get a Quote
      </button>
    </form>
  )
}
