import { cn } from '@/lib/utils'

// The shared AOG urgency cue: a round status dot in the site's error token,
// ringed by an expanding "ping". Pure CSS (see .aog-ping in globals.css), so it
// renders in both server and client trees. The ring is decorative and is
// removed under prefers-reduced-motion; the solid dot always shows.
export function AogPulseDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('relative inline-flex h-2 w-2', className)}>
      <span className="aog-ping absolute inline-flex h-full w-full rounded-full" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-error)]" />
    </span>
  )
}
