import { useState, useEffect, useCallback, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { DEFAULT_ROUTE, isRoute, routeTitle } from '../routes'

const APP_NAME = 'English Master IELTS'
const EXIT_HINT_MS = 2000

function readPageFromLocation() {
  try {
    const p = new URLSearchParams(window.location.search).get('page')
    if (isRoute(p)) return p
  } catch {}
  return DEFAULT_ROUTE
}

function urlForPage(page) {
  try {
    const url = new URL(window.location.href)
    if (page === DEFAULT_ROUTE) url.searchParams.delete('page')
    else url.searchParams.set('page', page)
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return page === DEFAULT_ROUTE ? '/' : `/?page=${page}`
  }
}

function scrollToTop() {
  try {
    // Explicit 'instant' beats the global `scroll-behavior: smooth` in index.css:
    // a page swap should start at the top immediately, not glide there.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  } catch {
    window.scrollTo(0, 0)
  }
}

/**
 * URL-backed page state.
 *
 * Every navigation pushes a real History entry, which gives us browser
 * Back/Forward, a shareable/reloadable URL, and — via the Capacitor
 * `backButton` listener — an Android hardware Back that walks the in-app
 * stack instead of killing the app on the first press.
 *
 * Returns `exitHint` (true while the "press Back again to exit" window is
 * open) so the shell can render a toast.
 */
export function useRouter() {
  const [page, setPage] = useState(readPageFromLocation)
  const [exitHint, setExitHint] = useState(false)

  // Mirrors `page` for use inside listeners that must not re-subscribe on
  // every navigation.
  const pageRef = useRef(page)
  const exitArmedAt = useRef(0)
  const exitTimer = useRef(null)

  const navigate = useCallback((next, { replace = false } = {}) => {
    const target = isRoute(next) ? next : DEFAULT_ROUTE
    if (pageRef.current === target) return
    pageRef.current = target
    try {
      const url = urlForPage(target)
      const entry = { page: target }
      if (replace) window.history.replaceState(entry, '', url)
      else window.history.pushState(entry, '', url)
    } catch {}
    setPage(target)
  }, [])

  // Normalize the entry the app booted on so Back from page 2 has somewhere
  // to land and `event.state.page` is always populated.
  useEffect(() => {
    try {
      window.history.replaceState({ page: pageRef.current }, '', urlForPage(pageRef.current))
    } catch {}
  }, [])

  useEffect(() => {
    const onPopState = (event) => {
      const fromState = event.state && event.state.page
      const next = isRoute(fromState) ? fromState : readPageFromLocation()
      pageRef.current = next
      setPage(next)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Android hardware Back. Without a JS listener Capacitor closes the app on
  // the first press; with one, we own the decision.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    let cancelled = false
    let removeListener = null

    ;(async () => {
      try {
        const { App: CapacitorApp } = await import('@capacitor/app')
        const handle = await CapacitorApp.addListener('backButton', () => {
          if (pageRef.current !== DEFAULT_ROUTE) {
            // Unwind the in-app history stack; popstate updates `page`.
            if (window.history.length > 1) window.history.back()
            else navigate(DEFAULT_ROUTE, { replace: true })
            return
          }

          // At the root: require a second press so Back never discards a
          // session by accident.
          const now = Date.now()
          if (now - exitArmedAt.current < EXIT_HINT_MS) {
            CapacitorApp.exitApp()
            return
          }
          exitArmedAt.current = now
          setExitHint(true)
          clearTimeout(exitTimer.current)
          exitTimer.current = setTimeout(() => setExitHint(false), EXIT_HINT_MS)
        })

        if (cancelled) handle.remove()
        else removeListener = () => handle.remove()
      } catch {
        // Plugin unavailable (older native shell): fall back to Capacitor's
        // default behaviour rather than breaking navigation.
      }
    })()

    return () => {
      cancelled = true
      clearTimeout(exitTimer.current)
      if (removeListener) removeListener()
    }
  }, [navigate])

  // Reflect the current page in the tab title and start each page at the top.
  useEffect(() => {
    document.title = page === DEFAULT_ROUTE
      ? `${APP_NAME} — Học Từ Mất Gốc Đến IELTS 6.0`
      : `${routeTitle(page)} · ${APP_NAME}`
    scrollToTop()
  }, [page])

  return { page, navigate, exitHint }
}
