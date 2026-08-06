'use client'

import { useRef, useState } from 'react'
import { Upload, FileCheck2, Download, AlertCircle, X } from 'lucide-react'
import { BomReview } from '@/components/rfq/BomReview'
import { parseBomText, type ParsedBomRow } from '@/lib/rfq/parseBom'
import { cn } from '@/lib/utils'

/** File extensions we parse client-side for instant auto-fill. */
const PARSEABLE = ['.csv', '.txt']

function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot === -1 ? '' : name.slice(dot).toLowerCase()
}

type Attached = { name: string; parseable: boolean }

/**
 * The "Have multiple parts?" BOM uploader. Parses .csv/.txt into an editable
 * review of line items; other formats (.xls/.xlsx/.pdf) are attached for us to
 * process manually. Either way it reports up via `onActiveChange` so the sibling
 * RFQ form can collapse its part-detail fields — the parts come from the BOM.
 */
export function BomUpload({
  onActiveChange,
  className,
}: {
  /** Called whenever a BOM becomes attached/detached, with the current part count. */
  onActiveChange?: (active: boolean, partsCount: number, fileName: string | null) => void
  className?: string
}) {
  const [attached, setAttached] = useState<Attached | null>(null)
  const [rows, setRows] = useState<ParsedBomRow[]>([])
  const [skipped, setSkipped] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function reset() {
    setAttached(null)
    setRows([])
    setSkipped(0)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
    onActiveChange?.(false, 0, null)
  }

  function onRowsChange(next: ParsedBomRow[]) {
    setRows(next)
    if (attached) onActiveChange?.(true, next.length, attached.name)
  }

  function onFile(file: File | undefined) {
    if (!file) return
    setError(null)
    setRows([])
    setSkipped(0)
    const ext = extensionOf(file.name)
    const parseable = PARSEABLE.includes(ext)
    setAttached({ name: file.name, parseable })

    if (!parseable) {
      // .xls / .xlsx / .pdf → attach only, we'll process manually. The form still
      // collapses (the file carries the parts), just with no on-screen count.
      onActiveChange?.(true, 0, file.name)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = parseBomText(String(reader.result ?? ''))
      if (result.rows.length === 0) {
        setError("We couldn't find any parts in that file. Check that it has a part-number column, or email it to us.")
        setAttached(null)
        if (inputRef.current) inputRef.current.value = ''
        onActiveChange?.(false, 0, null)
        return
      }
      setRows(result.rows)
      setSkipped(result.skipped)
      onActiveChange?.(true, result.rows.length, file.name)
    }
    reader.onerror = () => {
      setError("We couldn't read that file. Please try again or email it to us.")
      setAttached(null)
      onActiveChange?.(false, 0, null)
    }
    reader.readAsText(file)
  }

  const showReview = attached?.parseable && rows.length >= 0 && !error

  return (
    <div className={className}>
      <div className="relative overflow-hidden bg-navy p-6 text-white sm:p-8">
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(135deg,#fff_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Upload size={40} className="shrink-0 text-white" />
          <div className="flex-1">
            <p className="font-display text-lg font-medium">Have multiple parts?</p>
            <p className="mt-1 text-sm text-white/70">
              Upload your parts list or Bill of Materials (BOM) and we&apos;ll quote the whole list.{' '}
              <a href="/sample_bom.csv" download className="inline-flex items-center gap-1 text-white underline underline-offset-2 hover:text-white/80">
                <Download size={13} /> Download sample CSV
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="btn cursor-pointer whitespace-nowrap bg-white text-navy transition-colors hover:bg-white/90">
              {attached ? <><FileCheck2 size={16} /> {attached.name}</> : <><Upload size={16} /> Upload BOM</>}
              <input
                ref={inputRef}
                type="file"
                className="sr-only"
                accept=".csv,.xls,.xlsx,.pdf,.txt"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
            {attached && (
              <button
                type="button"
                onClick={reset}
                aria-label="Remove uploaded BOM"
                className="inline-flex h-9 w-9 items-center justify-center rounded-input text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Parse error — offer the manual fallback. */}
      {error && (
        <div className="mt-4 flex items-start gap-3 border border-hairline bg-white px-5 py-4 text-sm">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-warning" />
          <p className="text-secondary">{error}</p>
        </div>
      )}

      {/* Non-parseable file (xls/xlsx/pdf) — attached, handled manually. */}
      {attached && !attached.parseable && !error && (
        <div className="mt-4 flex items-start gap-3 border border-hairline bg-white px-5 py-4 text-sm">
          <FileCheck2 size={18} className="mt-0.5 shrink-0 text-success" />
          <p className="text-secondary">
            <span className="font-medium text-ink">{attached.name}</span> attached — we&apos;ll review and quote it
            manually. For instant on-screen review, upload a <span className="font-mono">.csv</span> or{' '}
            <span className="font-mono">.txt</span> parts list instead.
          </p>
        </div>
      )}

      {/* Parsed CSV/TXT → inline editable review. */}
      {showReview && attached && (
        <BomReview rows={rows} onRowsChange={onRowsChange} skipped={skipped} fileName={attached.name} />
      )}
    </div>
  )
}
