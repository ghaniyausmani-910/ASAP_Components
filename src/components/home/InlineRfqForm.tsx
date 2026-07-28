'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function InlineRfqForm({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const router = useRouter()
  const [partNo, setPartNo] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const q = partNo.trim()
    router.push(q ? `/instant-rfq?partno=${encodeURIComponent(q)}` : '/instant-rfq')
  }

  const light = theme === 'light'

  return (
    <form
      onSubmit={submit}
      className={cn('flex items-stretch border', light ? 'border-hairline bg-white' : 'border-white/15 bg-white/5')}
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
