import { useRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './PageTransition.module.css'

gsap.registerPlugin(ScrollTrigger)

// Recompute ScrollTrigger start/end positions once layout has settled.
// Without this, reveal triggers created during the transition keep stale
// positions and above-the-fold content never auto-reveals until a scroll.
const refreshTriggers = () => ScrollTrigger.refresh()

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
  const pendingReveal = useRef(false) // true only when a cover curtain was played
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setDisplayLocation(location)
      window.scrollTo(0, 0)
      return
    }

    pendingReveal.current = true
    if (overlayRef.current) overlayRef.current.style.pointerEvents = 'auto'
    animate(true, () => {
      setDisplayLocation(location)
      window.scrollTo(0, 0)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  // After the content swaps, reveal the new page.
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      requestAnimationFrame(refreshTriggers)
      return
    }

    requestAnimationFrame(refreshTriggers)

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
