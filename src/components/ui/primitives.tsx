import { cn } from '@/lib/utils'

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('container-x', className)}>{children}</div>
}

export function Section({
  className,
  tone = 'light',
  children,
  id,
}: {
  className?: string
  tone?: 'light' | 'surface' | 'dark' | 'navy'
  children: React.ReactNode
  id?: string
}) {
  const toneClass = {
    light: 'bg-white text-ink',
    surface: 'bg-surface text-ink',
    dark: 'bg-ink-900 text-[var(--on-dark)]',
    navy: 'bg-navy text-[var(--on-dark)]',
  }[tone]
  return (
    <section id={id} className={cn('section-y', toneClass, className)}>
      {children}
    </section>
  )
}

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string
  title: string
  intro?: string
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_-20%,#0d2b44_0%,#0b1f33_65%)]" />
      <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="container-x relative py-16 lg:py-24">
        {eyebrow && <p className="eyebrow !text-white/70">{eyebrow}</p>}
        <h1 className="mt-3 max-w-4xl font-display text-h1 font-extralight tracking-tight-2">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-body-lg text-white/70">{intro}</p>}
      </div>
    </section>
  )
}

export function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p className={cn('eyebrow', onDark && '!text-white/70')}>{children}</p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  onDark = false,
  center = false,
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  intro?: string
  onDark?: boolean
  center?: boolean
  className?: string
}) {
  return (
    <div className={cn(center && 'text-center mx-auto', center && 'max-w-3xl', className)}>
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          'mt-3 font-display text-h2 font-light tracking-tight-2',
          onDark ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn('mt-4 text-body-lg', onDark ? 'text-white/70' : 'text-secondary')}>{intro}</p>
      )}
    </div>
  )
}
