import { describe, it, expect } from 'vitest'
import {
  ROUTES,
  NAV_ROUTES,
  DEFAULT_ROUTE,
  isRoute,
  routeTitle,
  routeLabel,
} from '../src/routes'

describe('routes registry', () => {
  it('has a valid default route', () => {
    expect(isRoute(DEFAULT_ROUTE)).toBe(true)
  })

  it('has no duplicate ids', () => {
    const ids = ROUTES.map(r => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every route a non-empty id, label and title', () => {
    for (const r of ROUTES) {
      expect(typeof r.id).toBe('string')
      expect(r.id.trim().length).toBeGreaterThan(0)
      expect(r.label?.trim().length).toBeGreaterThan(0)
      expect(r.title?.trim().length).toBeGreaterThan(0)
    }
  })

  it('uses url-safe ids so ?page= round-trips without encoding', () => {
    for (const r of ROUTES) {
      expect(r.id).toMatch(/^[a-z0-9-]+$/)
      expect(encodeURIComponent(r.id)).toBe(r.id)
    }
  })

  it('exposes only nav:true entries in NAV_ROUTES', () => {
    expect(NAV_ROUTES.every(r => r.nav === true)).toBe(true)
    expect(NAV_ROUTES.length).toBe(ROUTES.filter(r => r.nav).length)
    expect(NAV_ROUTES.length).toBeGreaterThan(0)
  })

  it('has no duplicate nav labels (the menu would be ambiguous)', () => {
    const labels = NAV_ROUTES.map(r => r.label)
    expect(new Set(labels).size).toBe(labels.length)
  })

  describe('isRoute', () => {
    it('accepts every declared id', () => {
      for (const r of ROUTES) expect(isRoute(r.id)).toBe(true)
    })

    it('rejects unknown and non-string values', () => {
      const bad = [
        undefined, null, '', ' ', 'nope', 'Dashboard', 0, 1, {}, [],
        () => {}, NaN, true, false, '__proto__', 'constructor', 'toString',
        'hasOwnProperty', 'dashboard ', ' dashboard',
      ]
      for (const value of bad) expect(isRoute(value)).toBe(false)
    })
  })

  describe('routeTitle / routeLabel', () => {
    it('returns the declared text for a known id', () => {
      const r = ROUTES[0]
      expect(routeTitle(r.id)).toBe(r.title)
      expect(routeLabel(r.id)).toBe(r.label)
    })

    it('falls back to the default route for anything unknown', () => {
      const fallbackTitle = routeTitle(DEFAULT_ROUTE)
      const fallbackLabel = routeLabel(DEFAULT_ROUTE)
      for (const value of [undefined, null, '', 'nope', 0, {}, '__proto__']) {
        expect(routeTitle(value)).toBe(fallbackTitle)
        expect(routeLabel(value)).toBe(fallbackLabel)
      }
    })
  })
})
