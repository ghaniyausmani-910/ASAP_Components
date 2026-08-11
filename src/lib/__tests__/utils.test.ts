import { describe, it, expect } from 'vitest'
import { cn, slugify, seededRand, pick, formatDate } from '@/lib/utils'

describe('cn', () => {
  it('joins truthy parts and drops falsy ones', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
    expect(cn()).toBe('')
  })
})

describe('slugify', () => {
  it('lowercases, converts & to "and", and collapses symbol runs to single dashes', () => {
    expect(slugify('Parker & Sons')).toBe('parker-and-sons')
    expect(slugify('The Boeing Company')).toBe('the-boeing-company')
  })

  it('trims leading/trailing dashes and surrounding whitespace', () => {
    expect(slugify('  Hello World!  ')).toBe('hello-world')
    expect(slugify('***edge***')).toBe('edge')
  })
})

describe('seededRand', () => {
  it('is deterministic for a given seed', () => {
    const a = seededRand('seed-x')
    const b = seededRand('seed-x')
    const seqA = Array.from({ length: 5 }, () => a())
    const seqB = Array.from({ length: 5 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it('produces a different sequence for a different seed', () => {
    const a = seededRand('seed-x')()
    const b = seededRand('seed-y')()
    expect(a).not.toBe(b)
  })

  it('stays within [0, 1)', () => {
    const r = seededRand('range')
    for (let i = 0; i < 50; i++) {
      const n = r()
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(1)
    }
  })
})

describe('pick', () => {
  it('indexes into the array by the random value', () => {
    const arr = ['a', 'b', 'c']
    expect(pick(() => 0, arr)).toBe('a')
    expect(pick(() => 0.99, arr)).toBe('c')
  })
})

describe('formatDate', () => {
  it('formats an ISO date to a long en-US string', () => {
    const out = formatDate('2026-08-10')
    expect(out).toContain('August')
    expect(out).toContain('2026')
  })
})
