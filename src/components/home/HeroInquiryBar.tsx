'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

/**
 * Hero inquiry card — a frosted-glass RFQ panel that sits directly beneath the
 * hero copy. A translucent deep-navy surface (ink at 72%) over a heavy backdrop
 * blur, with a white hairline border, sharp square edges, small muted labels
 * stacked over bold white values, thin vertical dividers between fields, and a
 * solid white submit on the right.
 *
 * The 72% ink tint is a deliberate contrast floor: because the panel floats over
 * cinematic photography whose brightness varies, a lighter tint would let bright
 * regions bleed through and drop the on-dark text below WCAG AA. 72% guarantees a
 * dark enough backing for white text everywhere the card can land.
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
      aria-label="Instant RFQ quick quote"
      className="border border-white/15 bg-ink/[0.72] p-4 shadow-[0_24px_60px_-18px_rgba(11,31,51,0.45)] backdrop-blur-[64px] sm:p-5"
    >
      <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2 md:grid-cols-[1.6fr_0.9fr_1.5fr_auto] md:gap-0 md:divide-x md:divide-white/10">
        <HeroField
          id="hero-part"
          label="Part Number / NSN"
          required
          value={f.partNo}
          onChange={(v) => setF({ ...f, partNo: v })}
          placeholder="MS27039-1-08"
          autoComplete="off"
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
          autoComplete="email"
          inputMode="email"
        />

        <div className="flex items-center sm:col-span-2 md:col-span-1 md:pl-3">
          <button
            type="submit"
            className="h-[60px] w-full whitespace-nowrap bg-white px-9 font-body text-base font-semibold tracking-[0.02em] text-ink transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--ocean)] active:bg-white/80 md:w-auto"
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
  autoComplete,
  inputMode,
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
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'numeric' | 'search'
}) {
  return (
    <div className="px-5 py-3 transition-colors focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-inset focus-within:ring-white/70">
      <label
        htmlFor={id}
        className="block font-body text-xs font-semibold uppercase tracking-[0.14em] text-white"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-white" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {counter ? (
        <QtyCounter id={id} value={value} onChange={onChange} required={required} placeholder={placeholder} />
      ) : (
        <input
          id={id}
          type={type}
          min={min}
          required={required}
          aria-required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`mt-1.5 block h-9 w-full border-0 bg-transparent p-0 font-body text-body-lg font-medium text-white outline-none placeholder:font-normal placeholder:text-white/65 focus-visible:outline-none ${
            mono ? 'font-mono text-base placeholder:font-mono' : ''
          }`}
        />
      )}
    </div>
  )
}

/**
 * `– n +` quantity counter styled for the frosted-glass card. Replaces the
 * native number-input spinner. Typing is allowed and clamped to whole numbers
 * ≥ 0; an empty value stays empty so the placeholder shows. Keyboard focus on
 * either stepper is surfaced by the parent field's focus-within ring.
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
    'flex h-9 w-9 shrink-0 items-center justify-center text-white/60 transition-colors hover:text-white disabled:opacity-30 disabled:hover:text-white/60'

  return (
    <div className="mt-1.5 flex items-stretch">
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
        className="block h-9 w-full min-w-0 bg-transparent p-0 text-center font-body text-body-lg font-medium text-white outline-none placeholder:font-normal placeholder:text-white/65 focus-visible:outline-none"
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
