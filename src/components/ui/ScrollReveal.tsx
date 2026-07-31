'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function ScrollReveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'section'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    // Reveal immediately if the element is already within the viewport on
    // mount. The observer's first async callback can miss an element that is
    // in view before it fires (e.g. after a client navigation or restored
    // scroll), which would otherwise leave the content stranded at opacity 0.
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh && rect.bottom > 0) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)

    // Safety net: never let content stay hidden. If the observer hasn't fired
    // by the time this resolves (stalled/backgrounded render), reveal anyway.
    const fallback = window.setTimeout(() => setShown(true), 1200)

    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <Tag
      // @ts-expect-error polymorphic ref
      ref={ref}
      className={cn('transition-all duration-700 ease-out will-change-transform', shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
