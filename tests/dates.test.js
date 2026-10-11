import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  dayKey,
  todayKey,
  dayKeyOffset,
  isSameLocalDay,
  daysBetween,
  recentDayKeys,
} from '../src/utils/dates'

// These helpers exist specifically to avoid the UTC-vs-local bug described in
// dates.js, so the tests pin down LOCAL-calendar behaviour rather than just
// "returns a string".

afterEach(() => {
  vi.useRealTimers()
})

describe('dayKey', () => {
  it('formats as zero-padded YYYY-MM-DD', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(dayKey(new Date(2026, 11, 31))).toBe('2026-12-31')
  })

  it('uses the LOCAL calendar day, not the UTC day', () => {
    // 00:30 local on the 5th. In any timezone east of UTC this is still the
    // 4th in UTC, which is exactly the bug dates.js was written to kill.
    const justAfterLocalMidnight = new Date(2026, 2, 5, 0, 30, 0)
    expect(dayKey(justAfterLocalMidnight)).toBe('2026-03-05')
    expect(dayKey(justAfterLocalMidnight)).toBe(
      `${justAfterLocalMidnight.getFullYear()}-` +
      `${String(justAfterLocalMidnight.getMonth() + 1).padStart(2, '0')}-` +
      `${String(justAfterLocalMidnight.getDate()).padStart(2, '0')}`
    )
  })

  it('accepts a timestamp or an ISO string, not only a Date', () => {
    const d = new Date(2026, 5, 9, 13, 45)
    expect(dayKey(d.getTime())).toBe('2026-06-09')
    expect(dayKey(d.toISOString())).toBe('2026-06-09')
  })

  it('falls back to today for unparseable input instead of returning NaN', () => {
    for (const bad of ['not a date', NaN, new Date('nope'), 'undefined']) {
      expect(dayKey(bad)).toBe(todayKey())
    }
  })

  it('sorts lexicographically in chronological order', () => {
    const keys = [
      dayKey(new Date(2026, 9, 2)),
      dayKey(new Date(2026, 0, 15)),
      dayKey(new Date(2025, 11, 31)),
      dayKey(new Date(2026, 9, 10)),
    ]
    expect([...keys].sort()).toEqual([
      '2025-12-31', '2026-01-15', '2026-10-02', '2026-10-10',
    ])
  })
})

describe('todayKey', () => {
  it('matches dayKey() of the current clock', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 3, 0, 0))
    expect(todayKey()).toBe('2026-08-30')
  })

  it('rolls over at LOCAL midnight, not at 07:00 local (UTC midnight in UTC+7)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 23, 59, 59))
    const before = todayKey()
    vi.setSystemTime(new Date(2026, 7, 31, 0, 0, 1))
    const after = todayKey()
    expect(before).toBe('2026-08-30')
    expect(after).toBe('2026-08-31')
  })
})

describe('dayKeyOffset', () => {
  it('walks backwards by whole days', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 12, 0, 0))
    expect(dayKeyOffset(0)).toBe('2026-08-30')
    expect(dayKeyOffset(1)).toBe('2026-08-29')
    expect(dayKeyOffset(7)).toBe('2026-08-23')
  })

  it('crosses a month boundary correctly', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 2, 2, 12, 0, 0)) // 2 Mar 2026
    expect(dayKeyOffset(1)).toBe('2026-03-01')
    expect(dayKeyOffset(2)).toBe('2026-02-28')
    expect(dayKeyOffset(3)).toBe('2026-02-27')
  })

  it('crosses a leap-day boundary correctly', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2028, 2, 1, 12, 0, 0)) // 1 Mar 2028 (leap year)
    expect(dayKeyOffset(1)).toBe('2028-02-29')
    expect(dayKeyOffset(2)).toBe('2028-02-28')
  })

  it('goes into the future for a negative offset', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 12, 0, 0))
    expect(dayKeyOffset(-1)).toBe('2026-08-31')
  })
})

describe('isSameLocalDay', () => {
  it('is true for two times on the same local day', () => {
    expect(isSameLocalDay(new Date(2026, 7, 30, 0, 1), new Date(2026, 7, 30, 23, 59))).toBe(true)
  })

  it('is false across a local midnight even when only minutes apart', () => {
    expect(isSameLocalDay(new Date(2026, 7, 30, 23, 59), new Date(2026, 7, 31, 0, 1))).toBe(false)
  })

  it('is false for missing or unparseable values rather than throwing', () => {
    expect(isSameLocalDay(null, new Date())).toBe(false)
    expect(isSameLocalDay(undefined, undefined)).toBe(false)
    expect(isSameLocalDay('', new Date())).toBe(false)
    expect(isSameLocalDay('garbage', new Date())).toBe(false)
    expect(isSameLocalDay(new Date(), 'garbage')).toBe(false)
  })

  it('accepts mixed input types', () => {
    const d = new Date(2026, 7, 30, 8, 0)
    expect(isSameLocalDay(d.getTime(), d.toISOString())).toBe(true)
  })
})

describe('daysBetween', () => {
  it('ignores the time of day', () => {
    // 23:59 on the 1st to 00:01 on the 2nd is 2 minutes but ONE calendar day.
    expect(daysBetween(new Date(2026, 7, 1, 23, 59), new Date(2026, 7, 2, 0, 1))).toBe(1)
  })

  it('is zero for the same day and negative going backwards', () => {
    expect(daysBetween(new Date(2026, 7, 10, 1), new Date(2026, 7, 10, 22))).toBe(0)
    expect(daysBetween(new Date(2026, 7, 12), new Date(2026, 7, 10))).toBe(-2)
  })

  it('counts across months and years', () => {
    expect(daysBetween(new Date(2026, 0, 31), new Date(2026, 1, 1))).toBe(1)
    expect(daysBetween(new Date(2025, 11, 31), new Date(2026, 0, 1))).toBe(1)
    expect(daysBetween(new Date(2026, 0, 1), new Date(2027, 0, 1))).toBe(365)
  })

  it('defaults the second argument to now', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 12, 0, 0))
    expect(daysBetween(new Date(2026, 7, 27))).toBe(3)
  })

  it('returns 0 for unparseable input instead of NaN', () => {
    expect(daysBetween('garbage')).toBe(0)
    expect(daysBetween(new Date(), 'garbage')).toBe(0)
    expect(Number.isNaN(daysBetween(null))).toBe(false)
  })
})

describe('recentDayKeys', () => {
  it('returns `count` keys, oldest first, ending today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 12, 0, 0))
    expect(recentDayKeys(7)).toEqual([
      '2026-08-24', '2026-08-25', '2026-08-26', '2026-08-27',
      '2026-08-28', '2026-08-29', '2026-08-30',
    ])
  })

  it('defaults to 7 days and is already sorted', () => {
    const keys = recentDayKeys()
    expect(keys).toHaveLength(7)
    expect(keys).toEqual([...keys].sort())
    expect(keys.at(-1)).toBe(todayKey())
  })

  it('handles a single day and an empty request', () => {
    expect(recentDayKeys(1)).toEqual([todayKey()])
    expect(recentDayKeys(0)).toEqual([])
  })
})
