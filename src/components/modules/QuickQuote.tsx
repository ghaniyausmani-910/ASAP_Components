'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function QuickQuote({ variant = 'bar' }: { variant?: 'bar' | 'card' }) {
  const router = useRouter()
  const [f, setF] = useState({ partNo: '', qty: '', email: '' })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (f.partNo) params.set('partno', f.partNo)
    if (f.qty) params.set('qty', f.qty)
    if (f.email) params.set('email', f.email)
    router.push(`/instant-rfq?${params.toString()}`)
  }

  if (variant === 'card') {
    return (
      <form onSubmit={submit}>
        <div className="space-y-3">
          <input className="field-input" placeholder="Enter Part Number" value={f.partNo} onChange={(e) => setF({ ...f, partNo: e.target.value })} aria-label="Part number" />
          <input className="field-input" placeholder="Quantity" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} aria-label="Quantity" />
          <input className="field-input" type="email" placeholder="Email Address" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-label="Email" />
          <button className="btn btn-primary w-full">Get a Quote</button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={submit} className={cn('grid gap-3 border border-hairline bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto]')}>
      <input className="field-input" placeholder="Part Number" value={f.partNo} onChange={(e) => setF({ ...f, partNo: e.target.value })} aria-label="Part number" />
      <input className="field-input" placeholder="Quantity" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} aria-label="Quantity" />
      <input className="field-input" type="email" placeholder="Email Address" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-label="Email" />
      <button className="btn btn-primary whitespace-nowrap">Get a Quote</button>
    </form>
  )
}
