'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Creatable combobox — a text input paired with a filtered dropdown of known
 * options that ALSO accepts a custom typed value (unlike `Select`, which locks
 * the value to the option list). The value is simply whatever is in the input;
 * picking a row just fills it. Used for the cart line-item manufacturer field,
 * where a remembered part may come from a manufacturer that isn't on our list.
 *
 * Controlled only (`value` + `onChange`). Not backed by a hidden native
 * <select> — a free-text value has no <option> to map to — so callers validate
 * the value themselves rather than relying on form `required` semantics.
 */
export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Select or type…',
  id,
  ariaLabel,
  size = 'md',
  className,
  autoFocus,
  onKeyDownCapture,
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  id?: string
  ariaLabel?: string
  size?: 'sm' | 'md'
  className?: string
  autoFocus?: boolean
  /** Optional passthrough so a parent (e.g. the draft row) can observe keys. */
  onKeyDownCapture?: (e: React.KeyboardEvent) => void
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const autoId = useId()
  const listId = `${id ?? autoId}-list`

  // Filter by the typed value. When the value already equals an option exactly,
  // show the whole list so the user can still switch to a different one.
  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return options
    if (options.some((o) => o.toLowerCase() === q)) return options
    return options.filter((o) => o.toLowerCase().includes(q))
  }, [value, options])

  // Any change to the result set clears the highlight so a stale index can
  // never commit the wrong row.
  useEffect(() => setActive(-1), [filtered])

  // Close when a click lands outside the component.
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const listOpen = open && filtered.length > 0

  function choose(v: string) {
    onChange(v)
    setOpen(false)
    setActive(-1)
    inputRef.current?.focus()
  }

  function onKeyDown(e: React.KeyboardEvent) {
    onKeyDownCapture?.(e)
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) setOpen(true)
        else setActive((a) => Math.min(filtered.length - 1, a + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (open) setActive((a) => Math.max(0, a - 1))
        break
      case 'Enter':
        // Only intercept Enter to pick a highlighted row; otherwise let it
        // bubble (the row uses Enter to commit).
        if (listOpen && active >= 0) {
          e.preventDefault()
          choose(filtered[active])
        }
        break
      case 'Escape':
        if (open) {
          e.preventDefault()
          setOpen(false)
          setActive(-1)
        }
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={listOpen}
        aria-controls={listOpen ? listId : undefined}
        aria-autocomplete="list"
        aria-label={ariaLabel}
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={cn('field-input !pr-9', size === 'sm' && '!py-2 text-sm')}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={open ? 'Close options' : 'Open options'}
        onMouseDown={(e) => {
          // Toggle without stealing focus from the input.
          e.preventDefault()
          setOpen((o) => !o)
          inputRef.current?.focus()
        }}
        className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-ink/60"
      >
        <ChevronDown size={16} aria-hidden className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {listOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto border border-inputline bg-white py-1 shadow-hover animate-fade"
        >
          {filtered.map((o, i) => {
            const isSelected = o.toLowerCase() === value.trim().toLowerCase()
            return (
              <li
                key={o}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  // Commit before the input's blur fires and closes the list.
                  e.preventDefault()
                  choose(o)
                }}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 font-body text-sm transition-colors',
                  i === active ? 'bg-surface-2 text-accent' : 'text-ink',
                )}
              >
                <span className="truncate">{o}</span>
                {isSelected && <Check size={15} aria-hidden className="shrink-0 text-accent" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
