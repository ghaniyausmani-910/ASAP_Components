import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Single source of truth lives in globals.css :root.
        // `ink` uses the channel form so /alpha utilities (bg-ink/45…) work.
        ink: {
          DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)',
          900: 'rgb(var(--ink-rgb) / <alpha-value>)',
        },
        surface: { DEFAULT: 'var(--color-surface)', 2: 'var(--color-surface-2)' },
        hairline: 'var(--color-border)',
        inputline: 'var(--color-inputline)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          100: 'var(--color-accent-100)',
        },
        error: 'var(--color-error)',
        navy: {
          DEFAULT: 'var(--color-navy)',
          700: 'var(--color-navy-700)',
          tint: 'var(--color-navy-tint)',
        },
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        display: ['clamp(2.5rem,5vw,4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        h1: ['clamp(2rem,4vw,3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.75rem,3.2vw,2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h3: ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        h4: ['1.25rem', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.6' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        xs: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      spacing: { 30: '120px', 40: '160px' },
      maxWidth: { container: '1800px', content: '1170px' },
      borderRadius: { DEFAULT: '0px', input: '2px' },
      boxShadow: {
        card: '0 1px 2px rgba(11,31,51,.06)',
        hover: '0 8px 24px rgba(11,31,51,.10)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(.22,1,.36,1)',
        std: 'cubic-bezier(.4,0,.2,1)',
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fade: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        // Content is duplicated twice, so -50% lands exactly on the seam for a
        // seamless loop. The reverse row uses animation-direction: reverse.
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        reveal: 'reveal .7s cubic-bezier(.22,1,.36,1) both',
        fade: 'fade .4s ease both',
        marquee: 'marquee var(--marquee-duration,60s) linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
