'use client'

import { Trash2 } from 'lucide-react'
import { QtyStepper } from '@/components/cart/QtyStepper'
import { Combobox } from '@/components/ui/Combobox'
import { MANUFACTURERS } from '@/lib/data/parts'
import { resolveDescription, type ParsedBomRow } from '@/lib/rfq/parseBom'
import { cn } from '@/lib/utils'

/**
 * The editable review of a parsed BOM. Lists every line item found in the
 * uploaded file with the same columns as the cart table, and lets the user fix
 * a part number / manufacturer / quantity (or drop a row) before submitting the
 * quote request. Rows are controlled by the parent (BomUpload) so the RFQ form's
 * collapsed header can show a live part count — the actual submit lives on the
 * page's contact form, so there's no commit button here.
 */
export function BomReview({
  rows,
  onRowsChange,
  fileName,
  skipped,
}: {
  rows: ParsedBomRow[]
  onRowsChange: (rows: ParsedBomRow[]) => void
  fileName: string
  skipped: number
}) {
  function update(index: number, patch: Partial<ParsedBomRow>) {
    onRowsChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  function removeRow(index: number) {
    onRowsChange(rows.filter((_, i) => i !== index))
  }

  return (
    <div className="mt-4 border border-hairline bg-white">
      <div className="flex flex-col gap-1 border-b border-hairline px-5 py-4">
        <p className="font-display text-sm font-medium text-navy">
          We found {rows.length} {rows.length === 1 ? 'part' : 'parts'} in{' '}
          <span className="font-mono">{fileName}</span>
        </p>
        <p className="text-sm text-secondary">
          Review and edit below — these parts will be included in your quote request.
          {skipped > 0 && (
            <> {skipped} {skipped === 1 ? 'row was' : 'rows were'} skipped (no part number).</>
          )}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-navy text-left text-white">
              <Th>Part No.</Th>
              <Th>Manufacturer</Th>
              <Th>Item Name</Th>
              <Th className="w-40 text-center">Quantity</Th>
              <Th className="w-16 text-center">Remove</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-secondary">
                  No parts left. Upload a different file, or remove the BOM to enter parts manually.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => {
                const invalid = row.partNo.trim() === '' || row.manufacturer.trim() === ''
                return (
                  <tr
                    key={i}
                    className="border-t border-hairline hover:bg-surface"
                    style={invalid ? { backgroundColor: 'color-mix(in srgb, var(--color-warning) 7%, transparent)' } : undefined}
                  >
                    {/* Part No. */}
                    <td className="px-4 py-3 align-top">
                      <input
                        type="text"
                        aria-label={`Part number, row ${i + 1}`}
                        value={row.partNo}
                        autoComplete="off"
                        onChange={(e) => update(i, { partNo: e.target.value })}
                        onBlur={(e) => {
                          const v = e.target.value.trim()
                          if (v && !row.description) update(i, { description: resolveDescription(v) })
                        }}
                        className="field-input !py-2 font-mono text-sm"
                      />
                    </td>

                    {/* Manufacturer */}
                    <td className="px-4 py-3 align-top">
                      <Combobox
                        value={row.manufacturer}
                        onChange={(v) => update(i, { manufacturer: v })}
                        options={MANUFACTURERS}
                        placeholder="Select or type…"
                        ariaLabel={`Manufacturer, row ${i + 1}`}
                        size="sm"
                      />
                    </td>

                    {/* Item Name — read-only, resolved from the part number */}
                    <td className="px-4 py-3 align-top">
                      <span className={cn('block py-2 text-sm', row.description ? 'text-secondary' : 'text-tertiary')}>
                        {row.description || '—'}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-center">
                        <QtyStepper
                          size="md"
                          quantity={row.quantity}
                          onChange={(n) => update(i, { quantity: n })}
                          onDecrementBelowOne={() => removeRow(i)}
                        />
                      </div>
                    </td>

                    {/* Remove */}
                    <td className="px-4 py-3 text-center align-top">
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        aria-label={`Remove row ${i + 1}`}
                        className="inline-flex h-8 w-8 items-center justify-center text-tertiary transition-colors hover:text-accent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn('px-4 py-3 font-medium', className)}>{children}</th>
}
