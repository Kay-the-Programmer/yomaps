import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './PageTransition.module.css'

gsap.registerPlugin(ScrollTrigger)

// Recompute ScrollTrigger start/end positions once layout has settled.
// Without this, reveal triggers created during the transition keep stale
// positions and above-the-fold content never auto-reveals until a scroll.
const refreshTriggers = () => ScrollTrigger.refresh()

// Kill ScrollTriggers whose trigger element has left the DOM (orphaned) — i.e. they belong
// to the page we just navigated away from. React reverts them eventually, but
// not before our jump-to-top runs, and a lingering *pinned* trigger (e.g. the
// home page's stacking slides) holds the scroll position and undoes the jump.
// Filtering by DOM-detachment leaves persistent triggers (navbar) untouched.
const killOrphanTriggers = () => {
  ScrollTrigger.getAll().forEach((t) => {
    if (t.trigger && !document.documentElement.contains(t.trigger)) t.kill()
  })
}

// The new page's content can load asynchronously (e.g. the shop grid), and each
// ScrollTrigger.refresh() that fires as it grows restores the *previous* page's
// cached scroll, instantly undoing a one-shot jump-to-top. So we re-assert the
// top every frame for a short window (covered by the reveal curtain) until the
// scroll has held at 0 for a few consecutive frames.
const keepTopUntilStable = () => {
  ScrollTrigger.clearScrollMemory()
  let stable = 0
  const start = performance.now()
  const tick = () => {
    if (window.scrollY !== 0 || document.documentElement.scrollTop !== 0) {
      jumpToTop()
      stable = 0
    } else {
      stable++
    }
    if (stable < 4 && performance.now() - start < 800) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// Jump to the top instantly, bypassing the page's `scroll-behavior: smooth`.
// The previous approach (toggling scrollBehavior around window.scrollTo) still
// left the scroll queued as a smooth animation that the content swap aborted,
// stranding the new page part-way down. `behavior: 'instant'` guarantees a
// non-animated jump; the direct scrollTop writes are a fallback for engines
// that ignore the option.
const jumpToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

// ── Wavy-curtain tuning (forked from Blake Bowen's "shape overlays" pen) ──
const NUM_POINTS = 10
const NUM_PATHS = 2
const DELAY_POINTS_MAX = 0.18 // jitter across the 10 control points
const DELAY_PER_PATH = 0.15 // stagger between the two layered curtains
const DURATION = 0.55

export default function PageTransition({ children }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)

  const overlayRef = useRef(null)
  const pathRefs = useRef([])
  const tlRef = useRef(null)
  const isFirstLoad = useRef(true)
  const pendingReveal = useRef(false)   // true only when a cover curtain was played
  const pendingScrollTop = useRef(false) // true for real (pathname) navigations
  // ScrollTrigger.refresh() restores the scroll position it had cached (e.g. the
  // home page's pinned slides), which would undo our jump-to-top. This stays
  // armed across a navigation so we can re-assert the top *after* that refresh.
  const resetScrollAfterRefresh = useRef(false)
  // points[pathIndex][pointIndex] — the y-position of each control point (0–100)
  const allPoints = useRef(
    Array.from({ length: NUM_PATHS }, () => new Array(NUM_POINTS).fill(0))
  )

  // Rebuild each path's `d` from its current control points. `opened` picks the
  // template: covering (fill grows from the top) vs revealing (fill shrinks to
  // the bottom). Both states are full-screen rectangles at the hand-off frame,
  // so cover→reveal is seamless.
  const render = (opened) => {
    for (let i = 0; i < NUM_PATHS; i++) {
      const points = allPoints.current[i]
      const path = pathRefs.current[i]
      if (!path) continue

      let d = opened ? `M 0 0 V ${points[0]} C` : `M 0 ${points[0]} C`
      for (let j = 0; j < NUM_POINTS - 1; j++) {
        const p = ((j + 1) / (NUM_POINTS - 1)) * 100
        const cp = p - (1 / (NUM_POINTS - 1)) * 100 / 2
        d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`
      }
      d += opened ? ` V 100 H 0` : ` V 0 H 0`
      path.setAttribute('d', d)
    }
  }

  // Animate every control point from 100 → 0. With `opened` true the screen
  // becomes covered; with `opened` false it becomes revealed.
  const animate = (opened, onComplete) => {
    tlRef.current?.kill()

    for (let i = 0; i < NUM_PATHS; i++) {
      allPoints.current[i].fill(100)
    }

    const pointsDelay = Array.from(
      { length: NUM_POINTS },
      () => Math.random() * DELAY_POINTS_MAX
    )

    const tl = gsap.timeline({
      onUpdate: () => render(opened),
      defaults: { ease: 'power2.inOut', duration: DURATION },
      onComplete
    })
    tlRef.current = tl

    for (let i = 0; i < NUM_PATHS; i++) {
      const points = allPoints.current[i]
      const pathDelay = DELAY_PER_PATH * (opened ? i : NUM_PATHS - i - 1)
      for (let j = 0; j < NUM_POINTS; j++) {
        tl.to(points, { [j]: 0 }, pointsDelay[j] + pathDelay)
      }
    }

    render(opened)
    return tl
  }

  // Cover the screen, then swap the routed content underneath.
  useEffect(() => {
    // Same path, only search/hash changed (e.g. Shop filters/sort): sync the
    // displayed location immediately so the page sees it — no curtain.
    if (location.pathname === displayLocation.pathname) {
      if (location.search !== displayLocation.search || location.hash !== displayLocation.hash) {
        setDisplayLocation(location)
      }
      return
    }

    // A real page change — the new page should start at the top.
    pendingScrollTop.current = true
    resetScrollAfterRefresh.current = true

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setDisplayLocation(location)
      return
    }

    pendingReveal.current = true
    if (overlayRef.current) overlayRef.current.style.pointerEvents = 'auto'
    animate(true, () => {
      setDisplayLocation(location)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  // Reset scroll to the top after the new page content has rendered (before
  // paint), for real navigations only — not Shop filter/sort search changes.
  useLayoutEffect(() => {
    if (pendingScrollTop.current) {
      pendingScrollTop.current = false
      killOrphanTriggers()
      jumpToTop()
    }
  }, [displayLocation])

  // ScrollTrigger.refresh() can restore a stale scroll position; clear any
  // remaining orphan triggers and re-assert the top right after it.
  const refreshAndKeepTop = () => {
    killOrphanTriggers()
    refreshTriggers()
    if (resetScrollAfterRefresh.current) {
      resetScrollAfterRefresh.current = false
      keepTopUntilStable()
    }
  }

  // After the content swaps, reveal the new page.
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      requestAnimationFrame(refreshTriggers)
      return
    }

    requestAnimationFrame(refreshAndKeepTop)

    // No curtain was lowered (search/hash-only sync) — nothing to reveal.
    if (!pendingReveal.current) return
    pendingReveal.current = false

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none'
      return
    }

    animate(false, () => {
      if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none'
      refreshTriggers()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayLocation])

  useEffect(() => () => tlRef.current?.kill(), [])

  return (
    <>
      <svg
        ref={overlayRef}
        className={styles.overlay}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Palette golds — back curtain (cream → gold) */}
          <linearGradient id="ptGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0ece4" />
            <stop offset="100%" stopColor="#c9a84c" />
          </linearGradient>
          {/* front curtain (gold → muted gold) */}
          <linearGradient id="ptGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#a8893e" />
          </linearGradient>
        </defs>
        <path ref={(el) => (pathRefs.current[0] = el)} fill="url(#ptGradBack)" />
        <path ref={(el) => (pathRefs.current[1] = el)} fill="url(#ptGradFront)" />
      </svg>

      {typeof children === 'function' ? children(displayLocation) : children}
    </>
  )
}
