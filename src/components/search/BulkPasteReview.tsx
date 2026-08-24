'use client'

import { useEffect, useId, useRef } from 'react'
import { X, ListChecks, AlertTriangle } from 'lucide-react'
import {
  type BulkParseResult,
  type BulkToken,
  BULK_PASTE_CAP,
  committableTokens,
  uniqueNormalizedTokens,
} from '@/lib/search/bulkPaste'
import { cn } from '@/lib/utils'

/**
 * Layer 3 — presentation only. Given a parse result it renders a non-blocking
 * review panel and exposes two commit actions via callbacks. It does NO parsing,
 * lookup, or routing — the search bar (Layer 2) owns those.
 */
export function BulkPasteReview({
  result,
  onSearchAll,
  onCommitToRfq,
  onClose,
}: {
  result: BulkParseResult
  onSearchAll: (tokens: string[]) => void
  onCommitToRfq: (committable: BulkToken[]) => void
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const headingId = useId()
  const committable = committableTokens(result.tokens)
  const canCommit = committable.length > 0

  // Move focus into the panel on open; Esc / outside-click close it (the caller
  // returns focus to the input).
  useEffect(() => {
    panelRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    function onDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [onClose])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
      tabIndex={-1}
      className="absolute left-0 top-full z-50 mt-2 w-full min-w-[18rem] border border-hairline bg-white shadow-hover outline-none"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
        <ListChecks size={18} className="shrink-0 text-accent" />
        <p id={headingId} className="font-display text-sm font-medium text-ink">
          Detected {result.tokens.length} item{result.tokens.length === 1 ? '' : 's'}
        </p>
        {result.truncated && (
          <span className="inline-flex items-center gap-1 bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning">
            <AlertTriangle size={12} /> Capped at {BULK_PASTE_CAP} of {result.rawCount}
          </span>
        )}
        <button
          type="button"
          aria-label="Close bulk paste review"
          onClick={onClose}
          className="ml-auto shrink-0 text-tertiary transition-colors hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>

      {/* Rows */}
      <div className="max-h-[min(60vh,26rem)] overflow-y-auto">
        {/* Desktop table */}
        <table className="hidden w-full border-collapse text-sm sm:table">
          <thead>
            <tr className="border-b border-hairline text-left text-xs uppercase tracking-[0.06em] text-tertiary">
              <th className="w-10 px-4 py-2 font-medium">#</th>
              <th className="px-4 py-2 font-medium">Token</th>
              <th className="px-4 py-2 font-medium">Type</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {result.tokens.map((t) => (
              <tr
                key={t.index}
                className={cn('border-b border-hairline last:border-0', t.status === 'duplicate' && 'opacity-60')}
              >
                <td className="px-4 py-2.5 tabular-nums text-tertiary">{t.index}</td>
                <td className="px-4 py-2.5 font-mono text-navy">{t.raw}</td>
                <td className="px-4 py-2.5 text-secondary">{t.detectedType}</td>
                <td className="px-4 py-2.5"><StatusPill token={t} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile stacked list */}
        <ul className="divide-y divide-hairline sm:hidden">
          {result.tokens.map((t) => (
            <li key={t.index} className={cn('flex items-center gap-3 px-4 py-3', t.status === 'duplicate' && 'opacity-60')}>
              <span className="tabular-nums text-xs text-tertiary">{t.index}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-sm text-navy">{t.raw}</p>
                <p className="text-xs text-tertiary">{t.detectedType}</p>
              </div>
              <StatusPill token={t} />
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-3 border-t border-hairline px-4 py-3">
        <p className="text-sm text-secondary">
          <span className="font-semibold text-ink">{committable.length}</span> / {result.tokens.length} committable
        </p>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSearchAll(uniqueNormalizedTokens(result.tokens))}
            className="btn btn-outline !px-4 !py-2 text-sm"
          >
            Search all
          </button>
          <button
            type="button"
            onClick={() => onCommitToRfq(committable)}
            disabled={!canCommit}
            title={canCommit ? undefined : 'No items to add — every row is a duplicate or ambiguous.'}
            className="btn btn-primary !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to RFQ
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusPill({ token }: { token: BulkToken }) {
  const base = 'inline-flex items-center whitespace-nowrap px-2 py-0.5 text-xs font-semibold'
  switch (token.status) {
    case 'match':
      return <span className={cn(base, 'bg-success/10 text-success')}>Match</span>
    case 'ambiguous':
      return <span className={cn(base, 'bg-warning/10 text-warning')}>{token.matchCount} matches</span>
    case 'duplicate':
      return <span className={cn(base, 'bg-surface-2 text-tertiary')}>Duplicate of #{token.duplicateOf}</span>
    case 'unknown':
    default:
      return <span className={cn(base, 'bg-surface-2 text-secondary')}>Not stocked · RFQ</span>
  }
}
