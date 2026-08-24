'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, FileCheck2, AlertTriangle, Download, RotateCcw } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { useToast } from '@/lib/toast/ToastContext'
import { trackEvent } from '@/lib/analytics'
import { describePartNo } from '@/lib/data/parts'
import { slugify } from '@/lib/utils'
import {
  parseBomFile,
  bomRowsForCart,
  type BomParseResult,
  type BomRow,
  BOM_ACCEPT,
} from '@/lib/rfq/parseBom'
import { BomReview } from '@/components/rfq/BomReview'

// Same fold rule as the cart / bulk paste — normalize a part number for merging.
const foldKey = (partNumber: string, manufacturer: string) =>
  `${partNumber.trim().toUpperCase().replace(/\s+/g, '')}::${slugify(manufacturer)}`

export function BomUpload({ onBomChange }: { onBomChange?: (hasBom: boolean) => void } = {}) {
  const { getLine, setQuantity, addItem, removeItem } = useCart()
  const { showToast } = useToast()
  const [result, setResult] = useState<BomParseResult | null>(null)
  const [rows, setRows] = useState<BomRow[] | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Let the parent (Instant RFQ panel) hide Part Details once a BOM is in hand —
  // the BOM itself is the parts list, so those fields would just duplicate work.
  useEffect(() => {
    const hasBom = result?.kind === 'parsed' || result?.kind === 'attached'
    onBomChange?.(hasBom)
  }, [result, onBomChange])

  async function handleFile(file: File | undefined) {
    if (!file) return
    const res = await parseBomFile(file)
    setResult(res)
    setRows(res.kind === 'parsed' ? res.rows : null)
  }

  function reset() {
    setResult(null)
    setRows(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function sendToCart(rowsToSend: BomRow[]) {
    // Pre-fold the batch by normalized part number + manufacturer so quantities
    // sum instead of stacking duplicate lines; then merge into the shared cart.
    const folded = new Map<string, { partNo: string; manufacturer: string; quantity: number }>()
    for (const r of bomRowsForCart(rowsToSend)) {
      const manufacturer = r.manufacturer ?? ''
      const key = foldKey(r.partNumber, manufacturer)
      const cur = folded.get(key)
      if (cur) cur.quantity += r.quantity
      else folded.set(key, { partNo: r.partNumber, manufacturer, quantity: r.quantity })
    }

    const undos: Array<() => void> = []
    folded.forEach((e) => {
      const existing = getLine(e.partNo, e.manufacturer)
      if (existing) {
        const prevQty = existing.quantity
        setQuantity(e.partNo, e.manufacturer, prevQty + e.quantity)
        undos.push(() => setQuantity(e.partNo, e.manufacturer, prevQty))
      } else {
        addItem({
          partNo: e.partNo,
          manufacturer: e.manufacturer,
          description: describePartNo(e.partNo) || undefined,
          quantity: e.quantity,
        })
        undos.push(() => removeItem(e.partNo, e.manufacturer))
      }
    })

    const n = folded.size
    trackEvent('add_to_cart', { method: 'bom', lines: n })
    showToast({
      message: `Added ${n} line${n === 1 ? '' : 's'} to your cart`,
      action: { label: 'Undo', onClick: () => undos.forEach((u) => u()) },
      duration: 9000,
    })
    reset()
  }

  // ── Parsed → editable review ──────────────────────────────────────────────
  if (result?.kind === 'parsed' && rows) {
    return <BomReview rows={rows} fileName={result.fileName} onSend={sendToCart} onReset={reset} />
  }

  // ── xls/xlsx accepted but not parsed in the browser ───────────────────────
  if (result?.kind === 'attached') {
    return (
      <div className="border border-hairline bg-surface p-6">
        <div className="flex items-start gap-3">
          <FileCheck2 size={20} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className="font-display text-sm font-medium text-ink">{result.fileName} attached</p>
            <p className="mt-1 text-sm text-secondary">{result.note}</p>
            <button type="button" onClick={reset} className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
              <RotateCcw size={14} /> Upload a different file
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (result?.kind === 'error') {
    return (
      <div className="border border-hairline bg-[color-mix(in_srgb,var(--color-error)_6%,#fff)] p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-error" />
          <div>
            <p className="font-display text-sm font-medium text-ink">That file couldn’t be used</p>
            <p className="mt-1 text-sm text-secondary">{result.message}</p>
            <button type="button" onClick={reset} className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
              <RotateCcw size={14} /> Try another file
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Idle → the drop-zone band ─────────────────────────────────────────────
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={(e) => { e.preventDefault(); setDragging(false) }}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]) }}
      className={cnBand(dragging)}
    >
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(135deg,#fff_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <Upload size={40} className="shrink-0 text-white" />
        <div className="flex-1">
          <p className="font-display text-lg font-medium">Have multiple parts?</p>
          <p className="mt-1 text-sm text-white/70">
            Drop or upload your parts list or Bill of Materials (BOM) and we&apos;ll quote the whole list.{' '}
            <a href="/sample-bom.csv" download className="inline-flex items-center gap-1 text-white underline underline-offset-2 hover:text-white/80">
              <Download size={13} /> Download sample CSV
            </a>
          </p>
          <p className="mt-1 text-xs text-white/50">Accepted: {BOM_ACCEPT}</p>
        </div>
        <label className="btn btn-inverse cursor-pointer whitespace-nowrap">
          <Upload size={16} /> Upload BOM
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={BOM_ACCEPT}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      </div>
    </div>
  )
}

function cnBand(dragging: boolean): string {
  return [
    'relative overflow-hidden bg-navy p-6 text-white sm:p-8',
    dragging ? 'ring-2 ring-inset ring-white/70' : '',
  ].join(' ')
}
