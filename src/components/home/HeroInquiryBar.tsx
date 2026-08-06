'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useId, useState, type ReactNode } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useAutocomplete } from '@/components/ui/useAutocomplete'
import { SuggestionsDropdown } from '@/components/ui/SuggestionsDropdown'

/**
 * Real catalog examples the part-number placeholder types through, deliberately
 * spanning formats — an MS spec, a NAS, a short AN, and a raw NSN — so the
 * animation teaches that the field accepts all of them. Real strings so a
 * curious user who types one verbatim actually resolves in the catalog.
 */
const PART_PLACEHOLDERS = ['MS27039-1-08', 'NAS1352-3-8', 'AN960-10', '5306-01-234-7788'] as const

/**
 * Hero inquiry card — a frosted-glass RFQ panel that sits directly beneath the
 * hero copy. A translucent deep-navy surface (ink at 42%) over a heavy backdrop
 * blur, with a white hairline border, sharp square edges, small muted labels
 * stacked over bold white values, thin vertical dividers between fields, and a
 * solid white submit on the right.
 *
 * The ink tint is a deliberate contrast floor: because the panel floats over
 * cinematic photography whose brightness varies, too light a tint would let bright
 * regions bleed through and drop the on-dark text below WCAG AA. The heavy backdrop
 * blur lets the tint sit lower (42%) while keeping a dark enough backing for white
 * text everywhere the card can land.
 *
 * Three fields (Part # / NSN, Quantity, Email) hand off to the full Instant
 * RFQ flow with values prefilled, matching InstantRfqQuickForm's behaviour.
 */
export function HeroInquiryBar() {
  const router = useRouter()
  const [f, setF] = useState({ partNo: '', qty: '', email: '' })
  const [partFocused, setPartFocused] = useState(false)
  const partListId = useId()

  // Typewriter runs only while the part field is untouched — it retreats the
  // moment the user focuses or has typed something, so it never fights a cursor.
  const partPh = useTypewriterPlaceholder(PART_PLACEHOLDERS, {
    enabled: !partFocused && f.partNo === '',
    fallback: PART_PLACEHOLDERS[0],
  })

  const partAc = useAutocomplete({
    query: f.partNo,
    type: 'Part Number',
    onSelect: (s) => setF((prev) => ({ ...prev, partNo: s.value })),
  })

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
      className="border border-white/15 bg-ink/[0.55] p-4 shadow-[0_24px_60px_-18px_rgba(11,31,51,0.45)] backdrop-blur-[64px] sm:p-5"
    >
      <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2 md:grid-cols-[1.6fr_0.9fr_1.5fr_auto] md:gap-0 md:divide-x md:divide-white/10">
        <HeroField
          id="hero-part"
          label="Part Number / NSN"
          required
          value={f.partNo}
          onChange={(v) => {
            setF({ ...f, partNo: v })
            partAc.setOpen(true)
          }}
          onFocus={() => {
            setPartFocused(true)
            partAc.setOpen(true)
          }}
          onBlur={() => {
            setPartFocused(false)
            partAc.setOpen(false)
          }}
          onKeyDown={partAc.onKeyDown}
          placeholder={partPh.placeholder}
          autoComplete="off"
          mono
          combobox={{
            listId: partListId,
            expanded: partAc.listOpen,
            activeId: partAc.active >= 0 ? `${partListId}-opt-${partAc.active}` : undefined,
          }}
          overlay={
            partAc.listOpen ? (
              <SuggestionsDropdown
                id={partListId}
                items={partAc.items}
                active={partAc.active}
                query={f.partNo}
                variant="dark"
                onPick={(s) => setF((prev) => ({ ...prev, partNo: s.value }))}
                onHover={partAc.setActive}
              />
            ) : null
          }
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
  onKeyDown,
  onFocus,
  onBlur,
  combobox,
  overlay,
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
  onKeyDown?: (e: React.KeyboardEvent) => void
  onFocus?: () => void
  onBlur?: () => void
  combobox?: { listId: string; expanded: boolean; activeId?: string }
  overlay?: ReactNode
}) {
  return (
    <div className="relative px-5 py-3 transition-colors focus-within:bg-white/[0.06] focus-within:ring-2 focus-within:ring-inset focus-within:ring-white/70">
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
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          role={combobox ? 'combobox' : undefined}
          aria-expanded={combobox ? combobox.expanded : undefined}
          aria-controls={combobox?.listId}
          aria-activedescendant={combobox?.activeId}
          aria-autocomplete={combobox ? 'list' : undefined}
          placeholder={placeholder}
          className={`mt-1.5 block h-9 w-full border-0 bg-transparent p-0 font-body text-body-lg font-medium text-white outline-none placeholder:font-normal placeholder:text-white/65 focus-visible:outline-none ${
            mono ? 'font-mono text-base placeholder:font-mono' : ''
          }`}
        />
      )}
      {overlay}
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

const TYPE_MS = 62 // per-character typing cadence
const HOLD_MS = 1600 // dwell on the completed string
const ERASE_MS = 34 // per-character backspace cadence (quicker than typing)
const GAP_MS = 220 // blank beat after erasing, before the next example types in

/** Tracks the user's `prefers-reduced-motion` setting, reacting to live changes. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return reduced
}

/**
 * Drives a field's placeholder as a looping typewriter: types each example one
 * character at a time, holds, then backspaces it away character by character
 * before typing the next — cycling forever so the field keeps drawing the eye
 * until the user engages.
 *
 * It stands down completely in two cases. Under `prefers-reduced-motion` the
 * placeholder is a single static example with no motion at all. While `enabled`
 * is false (the field is focused, or already holds a value) the placeholder is
 * blank, so the animation never competes with a live cursor; it resumes cycling
 * if the user leaves an empty field.
 */
function useTypewriterPlaceholder(
  examples: readonly string[],
  { enabled, fallback }: { enabled: boolean; fallback: string },
) {
  const reduced = usePrefersReducedMotion()
  const [placeholder, setPlaceholder] = useState(fallback)

  useEffect(() => {
    if (reduced) {
      setPlaceholder(fallback)
      return
    }
    if (!enabled) {
      setPlaceholder('')
      return
    }

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    let word = 0
    let char = 0

    const schedule = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
    }

    const type = () => {
      const current = examples[word]
      char += 1
      setPlaceholder(current.slice(0, char))
      schedule(char < current.length ? type : erase, char < current.length ? TYPE_MS : HOLD_MS)
    }
    const erase = () => {
      char -= 1
      setPlaceholder(examples[word].slice(0, Math.max(0, char)))
      if (char > 0) {
        schedule(erase, ERASE_MS)
      } else {
        word = (word + 1) % examples.length
        schedule(type, GAP_MS)
      }
    }

    setPlaceholder('')
    schedule(type, GAP_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [enabled, reduced, fallback, examples])

  return { placeholder }
}
