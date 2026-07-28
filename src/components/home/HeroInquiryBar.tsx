'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

/**
 * Hero inquiry bar — a frosted deep-navy RFQ control bar docked flush across the
 * bottom edge of the cinematic hero. Rather than a bright white card floating on
 * a shadow, it dissolves into the scene: a translucent navy panel with a
 * backdrop blur, a single hairline white top keyline, square edges, and no drop
 * shadow (honouring the design system's "hairline over shadow" principle). All
 * chrome is monochrome on-dark — white labels, transparent inputs, a solid white
 * submit — so colour stays in the photography behind it.
 *
 * Three fields (Part # / NSN, Quantity, Email) hand off to the full Instant
 * RFQ flow with values prefilled, matching InstantRfqQuickForm's behaviour.
 */
export function HeroInquiryBar() {
  const router = useRouter()
  const [f, setF] = useState({ partNo: '', qty: '', email: '' })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (f.partNo) p.set('partno', f.partNo)
    if (f.qty) p.set('qty', f.qty)
    if (f.email) p.set('email', f.email)
    router.push(`/instant-rfq?${p.toString()}`)
  }

  return (
    <form
      onSubmit={submit}
      className="border-t border-white/15 bg-[rgb(var(--ink-rgb)/0.62)] py-6 backdrop-blur-lg sm:py-7"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-[1.6fr_0.85fr_1.4fr_auto] md:items-end">
          <HeroField
            id="hero-part"
            label="Part Number / NSN"
            required
            value={f.partNo}
            onChange={(v) => setF({ ...f, partNo: v })}
            placeholder="MS27039-1-08"
            mono
          />
          <HeroField
            id="hero-qty"
            label="Quantity"
            counter
            required
            value={f.qty}
            onChange={(v) => setF({ ...f, qty: v })}
            placeholder="0"
          />
          <HeroField
            id="hero-email"
            label="Work Email"
            type="email"
            required
            value={f.email}
            onChange={(v) => setF({ ...f, email: v })}
            placeholder="you@procurement.gov"
          />

          <button
            type="submit"
            className="mt-1 h-[52px] whitespace-nowrap bg-white px-8 font-body text-sm font-semibold tracking-[0.02em] text-ink transition-colors hover:bg-white/90 sm:col-span-2 md:col-span-1 md:mt-0"
          >
            Get Instant Quote
          </button>
        </div>
      </div>
    </form>
  )
}

function HeroField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  min,
  mono,
  counter,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  min?: number
  mono?: boolean
  counter?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70"
      >
        {label}
        {required && <span className="ml-0.5 text-white/70">*</span>}
      </label>
      {counter ? (
        <QtyCounter id={id} value={value} onChange={onChange} required={required} placeholder={placeholder} />
      ) : (
        <div className="mt-2 border border-white/20 bg-white/[0.04] px-4 transition-[border-color,box-shadow] duration-200 focus-within:border-white/60 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.12)]">
          <input
            id={id}
            type={type}
            min={min}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`block h-[52px] w-full border-0 bg-transparent p-0 font-body text-body text-white outline-none placeholder:text-white/60 focus-visible:outline-none ${
              mono ? 'font-mono text-sm placeholder:font-mono' : ''
            }`}
          />
        </div>
      )}
    </div>
  )
}

/**
 * `– n +` quantity counter styled for the frosted navy bar. Replaces the native
 * number-input spinner. Typing is allowed and clamped to whole numbers ≥ 0;
 * an empty value stays empty so the placeholder shows.
 */
function QtyCounter({
  id,
  value,
  onChange,
  required,
  placeholder,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
}) {
  const current = parseInt(value, 10)
  const step = (delta: number) => {
    const base = Number.isFinite(current) ? current : 0
    onChange(String(Math.max(0, base + delta)))
  }

  const btn =
    'flex h-[52px] w-12 shrink-0 items-center justify-center text-white/60 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-white/60'

  return (
    <div className="mt-2 flex items-stretch border border-white/20 bg-white/[0.04] transition-[border-color,box-shadow] duration-200 focus-within:border-white/60 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.12)]">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => step(-1)}
        disabled={!Number.isFinite(current) || current <= 0}
        className={btn}
      >
        <Minus size={16} />
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        placeholder={placeholder}
        className="block h-[52px] w-full min-w-0 border-x border-white/15 bg-transparent p-0 text-center font-body text-body text-white outline-none placeholder:text-white/60 focus-visible:outline-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => step(1)}
        className={btn}
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
