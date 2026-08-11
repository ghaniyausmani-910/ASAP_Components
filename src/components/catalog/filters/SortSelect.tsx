'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SortOption {
  value: string
  label: string
}

/**
 * Single-select sort control rendered as a design-system dropdown (a styled
 * popover — NOT the native OS <select> menu), so it matches the facet dropdowns
 * in the filter bar. Keyboard accessible; closes on outside-click / Escape / Tab.
 * The trigger shows the active sort label with balanced left/right padding.
 */
export function SortSelect({
  value,
  onChange,
  options,
  ariaLabel = 'Sort',
  className,
}: {
  value: string
  onChange: (value: string) => void
  options: SortOption[]
  ariaLabel?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const ref = useRef<HTMLDivElement>(null)

  const currentIndex = Math.max(0, options.findIndex((o) => o.value === value))
  const current = options[currentIndex]

  useEffect(() => {
    if (!open) return
    setActive(currentIndex)
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) setOpen(true)
        else setActive((a) => Math.min(options.length - 1, a + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) setOpen(true)
        else setActive((a) => Math.max(0, a - 1))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!open) setOpen(true)
        else if (active >= 0) {
          onChange(options[active].value)
          setOpen(false)
        }
        break
      case 'Escape':
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={cn(
          'flex items-center gap-2 border px-3 py-2 text-sm transition-colors',
          open
            ? 'border-accent text-accent'
            : 'border-hairline text-secondary hover:border-accent hover:text-accent',
        )}
      >
        <ArrowUpDown size={14} aria-hidden className="text-tertiary" />
        <span className="whitespace-nowrap">{current.label}</span>
        <ChevronDown
          size={14}
          aria-hidden
          className={cn('text-tertiary transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 top-full z-20 mt-1 min-w-full whitespace-nowrap border border-hairline bg-white py-1 shadow-lg"
        >
          {options.map((o, i) => {
            const isOn = o.value === value
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isOn}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange(o.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-4 px-3 py-1.5 text-sm transition-colors',
                  i === active ? 'bg-surface text-accent' : 'text-secondary',
                  isOn && 'font-medium',
                )}
              >
                <span>{o.label}</span>
                {isOn && <Check size={14} aria-hidden className="shrink-0 text-accent" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
