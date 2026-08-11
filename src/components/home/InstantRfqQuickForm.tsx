'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { track } from '@/lib/analytics'

export function InstantRfqQuickForm() {
  const router = useRouter()
  const [f, setF] = useState({ partNo: '', qty: '', needBy: '', email: '' })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    track('rfq_start', { source: 'quick_form', part_no: f.partNo || undefined })
    const p = new URLSearchParams()
    if (f.partNo) p.set('partno', f.partNo)
    if (f.qty) p.set('qty', f.qty)
    if (f.needBy) p.set('needby', f.needBy)
    if (f.email) p.set('email', f.email)
    router.push(`/instant-rfq?${p.toString()}`)
  }

  return (
    <form onSubmit={submit}>
      <p className="eyebrow">Already know the part? Instant RFQ</p>
      <h2 className="mt-3 font-display text-[clamp(1.6rem,2.6vw,2rem)] font-light tracking-tight-2 text-ink">
        Three fields. One quote.
      </h2>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor="rfq-part" className="field-label">
            Part number or NSN <span className="text-accent">*</span>
          </label>
          <input
            id="rfq-part"
            required
            value={f.partNo}
            onChange={(e) => setF({ ...f, partNo: e.target.value })}
            placeholder="e.g. MS27039-1-08 or 5310-00-167-0801"
            className="field-input font-mono text-sm placeholder:font-mono"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rfq-qty" className="field-label">
              Quantity <span className="text-accent">*</span>
            </label>
            <input
              id="rfq-qty"
              type="number"
              min={0}
              required
              value={f.qty}
              onChange={(e) => setF({ ...f, qty: e.target.value })}
              placeholder="0"
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="rfq-needby" className="field-label">
              Need by
            </label>
            <input
              id="rfq-needby"
              type="date"
              value={f.needBy}
              onChange={(e) => setF({ ...f, needBy: e.target.value })}
              className="field-input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="rfq-email" className="field-label">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="rfq-email"
            type="email"
            required
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            placeholder="you@procurement.gov"
            className="field-input"
          />
          <p className="mt-2 text-sm text-tertiary">A quote lands here in 15 minutes.</p>
        </div>
      </div>

      <button type="submit" className="btn btn-primary group mt-7 w-full justify-center">
        Continue to RFQ details
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
      </button>

      <p className="mt-4 text-sm text-tertiary">
        Need to quote many parts at once?{' '}
        <Link href="/instant-rfq" className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover">
          Use the RFQ cart
        </Link>{' '}
        and submit them as one collection.
      </p>
    </form>
  )
}
