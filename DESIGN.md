# ASAP Components — Design System & Direction

**Design language:** modeled on **Hanwha Aerospace** (premium, editorial, cinematic
corporate-aerospace) — adapted to **ASAP's red/navy brand accent** with a **geometric display +
neutral body** type system. This is the baseline design language for the redesign; sections will be
enhanced later.

> Companion to `REDESIGN-PLAN.md` (structure + sitemap). This file governs the *look & feel*.

---

## 1. Design principles

1. **Whitespace is the layout.** Generous vertical rhythm; let content breathe.
2. **Big, light, tight headlines.** Large display type, light weight, negative letter-spacing — confident and editorial.
3. **Square & sharp.** No rounded corners; hairline borders over shadows. Precision signals engineering trust.
4. **Restrained accent.** Near-monochrome **deep navy**; hierarchy comes from weight, fill, and underline, not hue. Color lives in the photography, not the chrome.
5. **Cinematic imagery.** Full-bleed aerospace photography with navy scrims for legible overlaid text.
6. **Search + RFQ are the visual priority.** The two core features are the loudest, clearest elements on every page.
7. **Motion with intent.** Subtle scroll-reveal (fade + rise) and carousels; nothing decorative-only. Respect `prefers-reduced-motion`.

### Reference facts pulled from Hanwha's live CSS
White-dominant canvas · near-black navy `#00040E` cinematic sections · grayscale text (`#666`, `#999`) ·
single restrained accent (their orange `#F37321`) · light display headlines (Gibson, wt 200) with tight
negative tracking · neutral gothic body (HanwhaGothic, wt 400) · big type (H2 ~62px, display ~45–71px) ·
~1280px container · column grid · very generous vertical rhythm (160/80px) · **square edges (radius 0)** ·
full-bleed hero video · Swiper carousels · scroll-reveal motion.

---

## 2. Color — Caladan navy monochrome (two-tier tokens)

The palette is a **near-monochrome deep-navy** system ported from the Caladan template. Architecture is two-tier and the **single source of truth is `:root` in `globals.css`** — `tailwind.config.ts` only references these variables. Change a primitive to re-theme the whole site.

### Tier 1 — Primitives
| Token | Value | Role |
|-------|-------|------|
| `--ink` (`--ink-rgb: 11 31 51`) | `#0b1f33` | Deep-navy anchor — all ink + the whole neutral ladder |
| `--paper` | `#ffffff` | Light anchor / canvas |
| `--dark-ocean` | `#0d2b44` | Dark button fills + dark bands (footer, headers) |
| `--deep-navy` | `#071522` | Darkest band / hover floor |
| `--ocean` (`--ocean-rgb: 15 76 129`) | `#0f4c81` | **Focus ring only** + rare decorative pop |
| `--aqua` | `#2ec4b6` | Decorative accents only — **never text** (fails contrast) |

### Tier 1b — Opacity ladder (every neutral is navy at N%)
`--ink-4 / -8 / -14 / -28 / -48 / -64 / -88` = `rgb(var(--ink-rgb) / .NN)`. There are **no true grays** — hairlines, input lines, and secondary/tertiary text are all transparencies of the navy anchor, giving one cohesive temperature (Caladan's core trick).

### Tier 2 — Semantic tokens
| Token | Resolves to | Use |
|-------|-------------|-----|
| `--color-ink` / `--color-ink-900` | `#0b1f33` | Primary text / deepest anchor |
| `--color-surface` | `color-mix(ink 5%, #fff)` ≈ `#f3f4f5` | Light section background |
| `--color-surface-2` | `color-mix(ink 9%, #fff)` ≈ `#e9ebee` | Alt surface, hover fills |
| `--color-text-secondary` | `--ink-64` | Body secondary |
| `--color-text-tertiary` | `--ink-48` | Meta / captions (de-emphasized/large only) |
| `--color-border` | `--ink-14` | Hairline borders / dividers |
| `--color-inputline` | `--ink-28` | Form control borders |
| `--color-accent` | `--dark-ocean` `#0d2b44` | Primary action / CTA / eyebrows / key highlight |
| `--color-accent-hover` | `--deep-navy` `#071522` | Hover/active |
| `--color-accent-100` | `color-mix(ocean 14%, #fff)` | Focus-glow tint |
| `--color-navy` | `--dark-ocean` `#0d2b44` | Solid dark surfaces: footer, headers, dark panels |
| `--color-navy-700` | `#16436e` | Dark elevation / gradient top |
| `--color-navy-tint` | `color-mix(ink 12%, #fff)` | Light cool-tinted panels |
| on-dark text/muted/border | `rgba(255,255,255,.92/.60/.15)` | Text & dividers on dark bands |

**Usage rule:** near-monochrome — hierarchy comes from **weight, fill, and underline, not hue**. The accent role is deep navy (`#0d2b44`), so it reads on light surfaces; on dark bands, accent text/icons/links go **white** (reuse the `onDark` gate + `.btn-on-dark`). The ocean hue appears in exactly one functional place: the **focus ring**. Aqua is decorative-only.

### Semantic status
`--color-success #2ad87f` (fills/icons only — too light for text) · `--color-warning #c56a21` · `--color-error #c94040` (validation/error UI only) · info = `--color-navy`

**Contrast:** accent `#0d2b44` on white ≈ 12:1 ✓ · secondary (ink-64) ≈ 4.6:1 ✓ body-safe · tertiary (ink-48) ≈ 3.1:1 (large/muted only) · focus ring ocean `#0f4c81` on white ≈ 7:1 ✓ · white on navy ≈ 12:1 ✓.

---

## 3. Typography

| Role | Family | Weights | Notes |
|------|--------|---------|-------|
| Display / headings | **Sora** | 200, 300, 400 | Geometric — Gibson equivalent. Fallback: Poppins, sans-serif |
| Body / UI | **Inter** | 400, 500, 600 | Neutral grotesque — HanwhaGothic equivalent |
| Mono | **IBM Plex Mono** | 500 | Part numbers / NSN / NIIN / CAGE codes |

- **Weights:** display 200–400 (never heavy); body 400/500; emphasis 600.
- **Tracking:** display `-0.02em` → `-0.03em` (tight); body `0`; eyebrow labels `+0.08em` UPPERCASE.
- **Line-height:** display `1.05–1.1`; headings `1.2`; body `1.6`.

### Fluid type scale (`clamp()`)
| Token | Value | ≈ px (min→max) |
|-------|-------|----------------|
| `--fs-display` | `clamp(2.5rem, 5vw, 4.5rem)` | 40 → 72 |
| `--fs-h1` | `clamp(2rem, 4vw, 3.25rem)` | 32 → 52 |
| `--fs-h2` | `clamp(1.75rem, 3.2vw, 2.75rem)` | 28 → 44 |
| `--fs-h3` | `1.5rem` | 24 |
| `--fs-h4` | `1.25rem` | 20 |
| `--fs-body-lg` | `1.125rem` | 18 |
| `--fs-body` | `1rem` | 16 |
| `--fs-sm` | `0.875rem` | 14 |
| `--fs-xs` | `0.8125rem` | 13 (eyebrows/labels) |

---

## 4. Spacing & layout

- **8px base scale:** `4, 8, 12, 16, 24, 32, 48, 64, 80, 120, 160` → `--space-1 … --space-160`.
- **Section rhythm:** desktop `padding-block: 120–160px`; mobile `64–80px`.
- **Container:** `--container-max 1280px`; content column `1170px`; gutter `24px` (mobile `16px`).
- **Grid:** 12-column, `24px` gap.

## 5. Shape, border, elevation

- **Radius:** `--radius 0` (square) default. Inputs/controls optional `2px`. Pills only where truly needed.
- **Borders:** 1px hairline `--color-border`; emphasis 1px `--color-ink`.
- **Shadows (minimal — prefer borders):** `--shadow-card 0 1px 2px rgba(5,7,13,.06)`; `--shadow-hover 0 8px 24px rgba(5,7,13,.10)`.

## 6. Motion

- **Durations:** `--dur-fast 200ms` · `--dur 400ms` · `--dur-slow 700ms`.
- **Easing:** `--ease-out cubic-bezier(0.22,1,0.36,1)` (expo-out) for reveals · `--ease cubic-bezier(0.4,0,0.2,1)` (standard).
- **Scroll-reveal:** opacity `0→1` + translateY `24px→0`, staggered children. Gate behind `prefers-reduced-motion: no-preference`.
- Carousels (Swiper-style) for products / featured / partners; hero supports full-bleed video/image.

## 7. Imagery

- Full-bleed cinematic aerospace photography (assets: `AeroImages/`, `HardenerFastners/`, `Electrochemicals/`).
- Text-over-image scrim: `linear-gradient(180deg, rgba(5,7,13,0) 0%, rgba(5,7,13,.65) 100%)`.
- Manufacturer logos grayscale by default → color on hover. Certification badges kept crisp.

---

## 8. Component tokens (map to REDESIGN-PLAN templates)

- **Header:** slim; transparent over hero → solid white with hairline bottom border on scroll; square; **red INSTANT RFQ** button; prominent Search.
- **Search bar (core):** square, 1px ink border, large hit area, solid **red** submit; ONE consistent label sitewide (fixes "SEARCH" vs "FIND PARTS").
- **Buttons:** primary = solid red, square, `--fs-sm`, `+0.04em` tracking, padding `14px 24px`; secondary = 1px ink outline; on-dark = white outline. No radius.
- **Cards** (part / blog / product): square, hairline border, image-top, hover = lift (`--shadow-hover`) + red keyline/underline.
- **Data table** (listings): hairline row dividers, sticky header, **mono** part numbers, per-row **red RFQ** button; no zebra (use hairlines).
- **Forms** (RFQ / contact): persistent visible labels (never placeholder-only), square inputs, ink border, focus = red ring (`--color-red-100` bg + `--color-red` border); solid red submit; explicit success state.
- **Sidebar RFQ:** navy or light card; consistent across pages.
- **Footer:** navy/ink surface, multi-column, generous padding.

---

## 9. Drop-in: `tokens.css`

```css
:root {
  /* Tier 1 — primitives (channels enable /alpha) */
  --ink-rgb:11 31 51; --ocean-rgb:15 76 129;
  --ink:rgb(var(--ink-rgb)); --paper:#ffffff;
  --dark-ocean:#0d2b44; --deep-navy:#071522; --ocean:rgb(var(--ocean-rgb)); --aqua:#2ec4b6;
  /* Tier 1b — opacity ladder */
  --ink-4:rgb(var(--ink-rgb)/.04); --ink-8:rgb(var(--ink-rgb)/.08); --ink-14:rgb(var(--ink-rgb)/.14);
  --ink-28:rgb(var(--ink-rgb)/.28); --ink-48:rgb(var(--ink-rgb)/.48); --ink-64:rgb(var(--ink-rgb)/.64); --ink-88:rgb(var(--ink-rgb)/.88);
  /* Tier 2 — semantic neutrals */
  --color-white:#ffffff;
  --color-surface:color-mix(in srgb,var(--ink) 5%,#fff); --color-surface-2:color-mix(in srgb,var(--ink) 9%,#fff);
  --color-ink:rgb(var(--ink-rgb)); --color-ink-900:rgb(var(--ink-rgb));
  --color-text-secondary:var(--ink-64); --color-text-tertiary:var(--ink-48);
  --color-border:var(--ink-14); --color-inputline:var(--ink-28);
  --on-dark:rgba(255,255,255,.92); --on-dark-muted:rgba(255,255,255,.6); --on-dark-border:rgba(255,255,255,.15);
  /* Tier 2 — accent (near-monochrome navy) */
  --color-accent:var(--dark-ocean); --color-accent-hover:var(--deep-navy); --color-accent-100:color-mix(in srgb,var(--ocean) 14%,#fff);
  --color-navy:var(--dark-ocean); --color-navy-700:#16436e; --color-navy-tint:color-mix(in srgb,var(--ink) 12%,#fff);
  /* semantic status */
  --color-success:#2ad87f; --color-warning:#c56a21; --color-error:#c94040; --color-info:var(--color-navy);
  /* type */
  --font-display:'Sora',Poppins,sans-serif; --font-body:'Inter',system-ui,sans-serif; --font-mono:'IBM Plex Mono',monospace;
  --fs-display:clamp(2.5rem,5vw,4.5rem); --fs-h1:clamp(2rem,4vw,3.25rem); --fs-h2:clamp(1.75rem,3.2vw,2.75rem);
  --fs-h3:1.5rem; --fs-h4:1.25rem; --fs-body-lg:1.125rem; --fs-body:1rem; --fs-sm:.875rem; --fs-xs:.8125rem;
  --tracking-tight:-.02em; --tracking-tighter:-.03em; --tracking-label:.08em;
  --lh-display:1.08; --lh-heading:1.2; --lh-body:1.6;
  /* space */
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-6:24px; --space-8:32px;
  --space-12:48px; --space-16:64px; --space-20:80px; --space-30:120px; --space-40:160px;
  /* layout */
  --container-max:1280px; --content-max:1170px; --gutter:24px;
  /* shape */
  --radius:0px; --radius-input:2px;
  --shadow-card:0 1px 2px rgba(11,31,51,.06); --shadow-hover:0 8px 24px rgba(11,31,51,.10);
  /* motion */
  --dur-fast:200ms; --dur:400ms; --dur-slow:700ms;
  --ease-out:cubic-bezier(.22,1,.36,1); --ease:cubic-bezier(.4,0,.2,1);
}
```

## 10. Drop-in: `tailwind.config.ts` (theme.extend)

```ts
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        // References the :root vars in globals.css — that is the source of truth.
        ink: { DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)', 900: 'rgb(var(--ink-rgb) / <alpha-value>)' },
        surface: { DEFAULT: 'var(--color-surface)', 2: 'var(--color-surface-2)' },
        hairline: 'var(--color-border)', inputline: 'var(--color-inputline)',
        accent: { DEFAULT: 'var(--color-accent)', hover: 'var(--color-accent-hover)', 100: 'var(--color-accent-100)' },
        navy: { DEFAULT: 'var(--color-navy)', 700: 'var(--color-navy-700)', tint: 'var(--color-navy-tint)' },
        secondary: 'var(--color-text-secondary)', tertiary: 'var(--color-text-tertiary)',
        error: 'var(--color-error)', success: 'var(--color-success)', warning: 'var(--color-warning)',
      },
      fontFamily: {
        display: ['Sora', 'Poppins', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        display: ['clamp(2.5rem,5vw,4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        h1: ['clamp(2rem,4vw,3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.75rem,3.2vw,2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h3: ['1.5rem', { lineHeight: '1.2' }],
        h4: ['1.25rem', { lineHeight: '1.3' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.6' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        xs: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      spacing: { 30: '120px', 40: '160px' },
      maxWidth: { container: '1280px', content: '1170px' },
      borderRadius: { DEFAULT: '0px', input: '2px' },
      boxShadow: { card: '0 1px 2px rgba(11,31,51,.06)', hover: '0 8px 24px rgba(11,31,51,.10)' },
      transitionTimingFunction: { out: 'cubic-bezier(.22,1,.36,1)', std: 'cubic-bezier(.4,0,.2,1)' },
    },
  },
} satisfies Config
```

## 11. Implementation notes

- **`:root` in `globals.css` is the single source of truth.** `tailwind.config.ts` references those vars (it holds no literal color hexes), so re-theming means editing one `:root` block. `ink` uses the channel form `rgb(var(--ink-rgb) / <alpha-value>)` so `/alpha` utilities work; if a new token later needs `/alpha`, give it a `-rgb` channel too.
- **Self-host fonts** (Sora, Inter, IBM Plex Mono) via `next/font` — no external requests.
- Verify **WCAG AA** on all text/background pairings.
- **Confirm the exact ASAP red/navy hex** against the official logo (placeholders `#C8102E` / `#0A2240` used because the live site was behind bot-verification during token capture).
