import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// A bold, flat-top geometric "A" with a rocket carved from the negative space:
// a single evenodd cut forms the nose cone at the apex, the fuselage down the
// vertical axis, the angular fins, and the exhaust gap that splits the two legs
// — so the letter and the rocket read as one monolithic shape. Monochrome
// (inherits currentColor); stays legible down to 16px favicon size.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="ASAP Components">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M18,178 L78,24 L122,24 L182,178 Z M100,42 L111,70 L111,116 L132,142 L114,152 L128,178 L72,178 L86,152 L68,142 L89,116 L89,70 Z"
      />
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
      <LogoMark
        className={cn(
          // Fixed square sized to the wordmark+subtitle block height.
          'h-9 w-9 shrink-0',
          onDark ? 'text-white' : 'text-ink',
        )}
      />
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
          // Parent-brand lockup: the "ASAP" wordmark image sits inline in the
          // subtext to lock this site to the ASAP Semiconductor family.
          <span
            className={cn(
              'mt-0.5 hidden items-center gap-1 text-[8.5px] font-medium uppercase tracking-[0.053em] sm:inline-flex',
              onDark ? 'text-white/70' : 'text-secondary',
            )}
          >
            <Image
              src={onDark ? '/logos/asap.png' : '/logos/asap-navy.png'}
              alt="ASAP"
              width={240}
              height={71}
              priority
              className={cn(
                'h-[1.1em] w-auto shrink-0',
                onDark ? 'opacity-70' : 'opacity-80',
              )}
            />
            <span>Semiconductor Website</span>
          </span>
        )}
      </span>
    </Link>
  )
}
