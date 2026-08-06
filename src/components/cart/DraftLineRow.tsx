'use client'

import { Trash2 } from 'lucide-react'
import { QtyStepper } from '@/components/cart/QtyStepper'
import { Combobox } from '@/components/ui/Combobox'
import { SuggestionsDropdown } from '@/components/ui/SuggestionsDropdown'
import { useAutocomplete, type Suggestion } from '@/components/ui/useAutocomplete'
import { MANUFACTURERS } from '@/lib/data/parts'
import { lookupPartByNumber } from '@/lib/data/catalog-parts'
import { cn } from '@/lib/utils'

export interface DraftLine {
  partNo: string
  manufacturer: string
  /** Resolved catalog description; '' when the part number isn't a known part. */
  description: string
  quantity: number
}

export function emptyDraft(): DraftLine {
  return { partNo: '', manufacturer: '', description: '', quantity: 1 }
}

/** A draft is committable once it has both a part number and a manufacturer. */
export function isDraftValid(d: DraftLine): boolean {
  return d.partNo.trim() !== '' && d.manufacturer.trim() !== ''
}

/**
 * The editable "Add Line Item" row. Renders inline in the cart table with the
 * same columns as a committed line, but Part No. and Manufacturer are inputs.
 * The item name is read-only — it auto-fills only when the typed/selected part
 * number resolves to a real catalog part (never fabricated). The row commits
 * itself when focus leaves it while valid (see `onBlur`), so the flow needs no
 * extra confirm button; Quantity and Remove behave as on every other row.
 */
export function DraftLineRow({
  draft,
  onChange,
  onCommit,
  onDiscard,
}: {
  draft: DraftLine
  onChange: (next: DraftLine) => void
  onCommit: () => void
  onDiscard: () => void
}) {
  const set = (patch: Partial<DraftLine>) => onChange({ ...draft, ...patch })

  function selectSuggestion(s: Suggestion) {
    set({
      partNo: s.value,
      description: s.hint ?? lookupPartByNumber(s.value)?.description ?? '',
      // Auto-fill the manufacturer the part is sourced from; the user can still
      // override it in the combobox before committing.
      manufacturer: s.mfr ?? draft.manufacturer,
    })
    setOpen(false)
  }

  const { items, listOpen, setOpen, active, setActive, onKeyDown } = useAutocomplete({
    query: draft.partNo,
    type: 'Part Number',
    onSelect: selectSuggestion,
  })

  function onPartNoChange(v: string) {
    // Keep the item name in sync with whatever resolves for the typed value.
    set({ partNo: v, description: lookupPartByNumber(v)?.description ?? '' })
    setOpen(true)
  }

  // Commit when focus genuinely leaves the row (not when it moves between the
  // row's own inputs / stepper). An incomplete draft is left open, not errored.
  function onBlur(e: React.FocusEvent<HTMLTableRowElement>) {
    const next = e.relatedTarget as Node | null
    if (next && e.currentTarget.contains(next)) return
    if (isDraftValid(draft)) onCommit()
  }

  return (
    <tr className="border-t border-hairline bg-surface/40" onBlur={onBlur}>
      {/* Part No. — autocomplete against the canonical catalog */}
      <td className="px-4 py-3 align-top">
        <div className="relative">
          <input
            type="text"
            inputMode="text"
            autoFocus
            aria-label="New part number"
            placeholder="Enter part number"
            value={draft.partNo}
            autoComplete="off"
            onChange={(e) => onPartNoChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="field-input !py-2 font-mono text-sm"
          />
          {listOpen && (
            <SuggestionsDropdown
              id="draft-partno-list"
              items={items}
              active={active}
              query={draft.partNo}
              onPick={selectSuggestion}
              onHover={setActive}
            />
          )}
        </div>
      </td>

      {/* Manufacturer — known list + custom typed values */}
      <td className="px-4 py-3 align-top">
        <Combobox
          value={draft.manufacturer}
          onChange={(v) => set({ manufacturer: v })}
          options={MANUFACTURERS}
          placeholder="Select or type…"
          ariaLabel="Manufacturer"
          size="sm"
        />
      </td>

      {/* Item Name — read-only; auto-filled only on a real catalog match */}
      <td className="px-4 py-3 align-top">
        <span className={cn('block py-2 text-sm', draft.description ? 'text-secondary' : 'text-tertiary')}>
          {draft.description || '—'}
        </span>
      </td>

      {/* Quantity */}
      <td className="px-4 py-3 align-top">
        <div className="flex justify-center">
          <QtyStepper
            size="md"
            quantity={draft.quantity}
            onChange={(n) => set({ quantity: n })}
            onDecrementBelowOne={onDiscard}
          />
        </div>
      </td>

      {/* Remove — discards the draft */}
      <td className="px-4 py-3 text-center align-top">
        <button
          type="button"
          onClick={onDiscard}
          aria-label="Discard new line item"
          className="inline-flex h-8 w-8 items-center justify-center text-tertiary transition-colors hover:text-accent"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  )
}
