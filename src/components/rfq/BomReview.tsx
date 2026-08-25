'use client'

import { useState } from 'react'
import { Trash2, ArrowRight } from 'lucide-react'
import { type BomRow, bomRowProblem } from '@/lib/rfq/parseBom'
import { cn } from '@/lib/utils'

/**
 * Editable BOM review table. Presentation + local editing only — parsing lives
 * in parseBom.ts and the cart merge lives in the parent (BomUpload). Rows
 * re-validate live on edit via bomRowProblem (the same rule as the parser).
 */
export function BomReview({
  rows: initialRows,
  fileName,
  onSend,
  onReset,
}: {
  rows: BomRow[]
  fileName?: string
  onSend: (rows: BomRow[]) => void
  onReset: () => void
}) {
  const [rows, setRows] = useState<BomRow[]>(initialRows)

  function update(i: number, field: 'partNumber' | 'quantity' | 'manufacturer', value: string) {
    setRows((prev) =>
      prev.map((r, idx) => {
        if (idx !== i) return r
        const next = { ...r, [field]: value }
        return { ...next, problem: bomRowProblem(next) }
      }),
    )
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i))
  }

  const sendable = rows.filter((r) => r.partNumber.trim())
  const needAttention = rows.filter((r) => r.problem === 'No part number in this row').length

  return (
    <div className="border border-hairline bg-white">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-hairline px-5 py-4">
        <p className="font-display text-sm font-medium text-ink">
          Review {rows.length} line{rows.length === 1 ? '' : 's'}
          {fileName && <span className="text-tertiary"> · {fileName}</span>}
        </p>
        {needAttention > 0 && (
          <span className="text-xs text-tertiary">{needAttention} row{needAttention === 1 ? '' : 's'} without a part number will be skipped</span>
        )}
        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              if (rows.length === 0 || confirm(`Clear all ${rows.length} line${rows.length === 1 ? '' : 's'} from this BOM?`)) {
                onReset()
              }
            }}
            className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-error"
          >
            <Trash2 size={14} /> Clear all
          </button>
          <button type="button" onClick={onReset} className="text-sm text-accent hover:underline">
            Upload a different file
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-xs uppercase tracking-[0.06em] text-tertiary">
              <th className="w-10 px-4 py-2 font-medium">#</th>
              <th className="px-4 py-2 font-medium">Part number</th>
              <th className="w-24 px-4 py-2 font-medium">Qty</th>
              <th className="px-4 py-2 font-medium">Manufacturer</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="w-10 px-4 py-2 font-medium"><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isError = r.problem === 'No part number in this row'
              return (
                <tr
                  key={i}
                  className={cn('border-b border-hairline last:border-0', isError && 'bg-[color-mix(in_srgb,var(--color-error)_6%,#fff)]')}
                >
                  <td className="px-4 py-2 tabular-nums text-tertiary">{i + 1}</td>
                  <td className="px-4 py-2">
                    <CellInput value={r.partNumber} onChange={(v) => update(i, 'partNumber', v)} mono aria-label={`Part number, row ${i + 1}`} />
                  </td>
                  <td className="px-4 py-2">
                    <CellInput value={r.quantity} onChange={(v) => update(i, 'quantity', v)} inputMode="numeric" aria-label={`Quantity, row ${i + 1}`} />
                  </td>
                  <td className="px-4 py-2">
                    <CellInput value={r.manufacturer} onChange={(v) => update(i, 'manufacturer', v)} aria-label={`Manufacturer, row ${i + 1}`} />
                  </td>
                  <td className="px-4 py-2"><StatusPill problem={r.problem} /></td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      aria-label={`Remove row ${i + 1}`}
                      className="text-tertiary transition-colors hover:text-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-hairline px-5 py-4">
        <p className="text-sm text-secondary">
          <span className="font-semibold text-ink">{sendable.length}</span> line{sendable.length === 1 ? '' : 's'} ready
        </p>
        <button
          type="button"
          onClick={() => onSend(rows)}
          disabled={sendable.length === 0}
          className="btn btn-primary ml-auto !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send {sendable.length} line{sendable.length === 1 ? '' : 's'} to quote
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

function CellInput({
  value,
  onChange,
  mono = false,
  inputMode,
  'aria-label': ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  mono?: boolean
  inputMode?: 'numeric' | 'text'
  'aria-label': string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputMode={inputMode}
      aria-label={ariaLabel}
      className={cn(
        'w-full border border-inputline bg-white px-2 py-1.5 text-sm text-ink outline-none focus:border-accent',
        mono && 'font-mono',
      )}
    />
  )
}

function StatusPill({ problem }: { problem: string | null }) {
  const base = 'inline-flex items-center whitespace-nowrap px-2 py-0.5 text-xs font-semibold'
  if (!problem) return <span className={cn(base, 'bg-success/10 text-success')}>Ready</span>
  if (problem === 'No quantity, defaults to 1') return <span className={cn(base, 'bg-warning/10 text-warning')}>Qty → 1</span>
  return <span className={cn(base, 'bg-error/10 text-error')}>Missing part no.</span>
}
