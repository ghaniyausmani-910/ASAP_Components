import Link from 'next/link'
import { cn } from '@/lib/utils'

// The mark is a single geometric "A" with a rocket carved out of the negative
// space — the rocket's exhaust channel is the same void as the A's leg-gap, so
// the two forms are one shape. Even-odd fill; scales cleanly to a 16px favicon.
const MARK_PATH =
  'M40 12 L60 12 L94 92 L6 92 Z M50 20 L57 36 L57 60 L66 78 L57 79 L57 92 L43 92 L43 79 L34 78 L43 60 L43 36 Z'

export function LogoMark({
  className,
  notch = true,
}: {
  className?: string
  notch?: boolean
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="ASAP Components">
      <path d={MARK_PATH} fill="currentColor" fillRule="evenodd" />
      {/* Thrust notch — inherits the mark's color: navy on light, white on dark. */}
      {notch && <rect x="46.5" y="86" width="7" height="6" fill="currentColor" />}
    </svg>
  )
}

export function Logo({
  onDark = false,
  subtitle = true,
  className,
}: {
  onDark?: boolean
  subtitle?: boolean
  className?: string
}) {
  return (
    <Link
      href="/"
      className={cn('flex shrink-0 items-center gap-3', className)}
      aria-label="ASAP Components home"
    >
      <LogoMark className={cn('h-9 w-9 shrink-0', onDark ? 'text-white' : 'text-ink')} />
      <span className="leading-none">
        <span
          className={cn(
            'block font-brand text-[18px] tracking-tight sm:text-[20px]',
            onDark ? 'text-white' : 'text-ink',
          )}
        >
          <span className="font-bold">ASAP</span> <span className="font-normal">Components</span>
        </span>
        {subtitle && (
          // Tracked to the exact width of the "ASAP Components" wordmark above,
          // so the two lines lock into one block (parent-logo relationship).
          <span
            className={cn(
              'mt-1.5 hidden text-[8.5px] font-medium uppercase tracking-[0.053em] sm:block',
              onDark ? 'text-white/70' : 'text-secondary',
            )}
          >
            An ASAP Semiconductor Website
          </span>
        )}
      </span>
    </Link>
  )
}
