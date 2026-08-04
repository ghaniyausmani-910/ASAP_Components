'use client'

import { cn } from '@/lib/utils'
import type { Suggestion } from '@/lib/data/suggestions'

/** Bold the substring of `text` that matches `query` (case-insensitive). */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent font-semibold text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

const MONO_TYPES = new Set(['Part Number', 'NSN', 'CAGE Code'])

export function SuggestionsDropdown({
  id,
  items,
  active,
  query,
  onPick,
  onHover,
  variant = 'light',
}: {
  id: string
  items: Suggestion[]
  active: number
  query: string
  onPick: (s: Suggestion) => void
  onHover: (i: number) => void
  variant?: 'light' | 'dark'
}) {
  const dark = variant === 'dark'
  return (
    <ul
      id={id}
      role="listbox"
      className={cn(
        'absolute left-0 right-0 top-full z-30 mt-1 max-h-80 overflow-auto border py-1 text-left shadow-hover',
        dark
          ? 'border-white/15 bg-ink/95 backdrop-blur-xl'
          : 'border-inputline bg-white',
      )}
    >
      {items.map((s, i) => {
        const mono = MONO_TYPES.has(s.type)
        return (
          <li
            key={`${s.type}-${s.value}`}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => {
              // Commit before the input's blur fires and closes the list.
              e.preventDefault()
              onPick(s)
            }}
            onMouseEnter={() => onHover(i)}
            className={cn(
              'flex cursor-pointer items-baseline justify-between gap-3 px-4 py-2.5 transition-colors',
              dark
                ? i === active
                  ? 'bg-white/10'
                  : 'hover:bg-white/[0.06]'
                : i === active
                  ? 'bg-surface'
                  : 'hover:bg-surface',
            )}
          >
            <span className="flex min-w-0 flex-col">
              <span
                className={cn(
                  'truncate text-body',
                  dark ? 'text-white' : 'text-ink',
                  mono && 'font-mono text-sm',
                )}
              >
                <Highlight text={s.value} query={query} />
              </span>
              {s.hint && (
                <span className={cn('truncate text-xs', dark ? 'text-white/60' : 'text-tertiary')}>
                  {s.hint}
                </span>
              )}
            </span>
            {s.mfr && (
              <span
                className={cn(
                  'max-w-[13rem] shrink-0 truncate text-right text-xs',
                  dark ? 'text-white/60' : 'text-secondary',
                )}
              >
                {s.mfr}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
