'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Custom dropdown that replaces native <select> so the open menu is styled by
// our design system (not the OS popup). Works controlled (pass value+onChange,
// as SearchBar does) or uncontrolled (forms just read the hidden control on
// submit). A visually-hidden native <select> mirrors the value so `required`
// validation and form semantics keep working with zero extra wiring.
//
//   variant="field" — matches .field-input (RFQ / cart form fields)
//   variant="bare"  — transparent inline trigger (search-bar type selector)
export function Select({
  value,
  defaultValue = '',
  onChange,
  options,
  placeholder = 'Select…',
  required,
  id,
  ariaLabel,
  variant = 'field',
  size = 'md',
  className,
}: {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  options: string[]
  placeholder?: string
  required?: boolean
  id?: string
  ariaLabel?: string
  variant?: 'field' | 'bare'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const controlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue)
  const selected = controlled ? value! : internal

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const autoId = useId()
  const listId = `${id ?? autoId}-list`
  const bare = variant === 'bare'

  function choose(v: string) {
    if (!controlled) setInternal(v)
    onChange?.(v)
    setOpen(false)
  }

  // Close when focus/click leaves the component.
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Opening lands the highlight on the current choice (or the first row).
  useEffect(() => {
    if (open) setActive(Math.max(0, options.indexOf(selected)))
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
        else if (active >= 0) choose(options[active])
        break
      case 'Escape':
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        // Type-ahead: jump to the first option starting with the typed letter.
        if (e.key.length === 1) {
          const i = options.findIndex((o) => o.toLowerCase().startsWith(e.key.toLowerCase()))
          if (i >= 0) {
            setActive(i)
            if (!open) setOpen(true)
          }
        }
    }
  }

  const triggerText = bare ? (size === 'lg' ? 'text-body' : 'text-sm') : 'text-body'

  return (
    <div ref={rootRef} className={cn('relative', bare && 'h-full', className)}>
      {/* Hidden real control — carries the value for form submit + `required`
          validation. Overlays the trigger (opacity 0, no pointer events) so the
          browser's validation bubble still anchors to the visible field. */}
      <select
        aria-hidden
        tabIndex={-1}
        required={required}
        value={selected}
        onChange={(e) => choose(e.target.value)}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      >
        <option value="" />
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={cn(
          'flex w-full items-center justify-between gap-2 text-left',
          bare
            ? cn('h-full cursor-pointer bg-transparent pl-4 pr-9 font-body text-secondary outline-none', triggerText)
            : cn('field-input !pr-3', triggerText, !selected && 'text-tertiary'),
        )}
      >
        <span className="truncate">{selected || placeholder}</span>
        <ChevronDown
          size={16}
          aria-hidden
          className={cn('shrink-0 transition-transform', bare ? 'text-tertiary' : 'text-ink/60', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            'absolute top-full z-30 mt-1 max-h-72 overflow-auto border border-inputline bg-white py-1 shadow-hover animate-fade',
            bare ? 'right-0 min-w-[12rem]' : 'left-0 right-0',
          )}
        >
          {options.map((o, i) => {
            const isSelected = o === selected
            return (
              <li
                key={o}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
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
