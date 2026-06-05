import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import ProductCard from '../ProductCard/ProductCard'
import styles from './Slider.module.css'

gsap.registerPlugin(Flip)

const AUTOPLAY_DELAY = 4500
const DRAG_THRESHOLD = 50

function getSlidesVisible() {
  const w = window.innerWidth
  if (w < 560)  return 1
  if (w < 900)  return 2
  if (w < 1200) return 3
  return 4
}

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const keyOf = (p) => p._id || p.slug

export default function Slider({ products = [], onAddToCart }) {
  const viewportRef = useRef(null)
  const trackRef    = useRef(null)
  const progressRef = useRef(null)
  const autoTimer   = useRef(null)
  const progressTl  = useRef(null)
  const dragStart   = useRef(null)
  const prevBtnRef  = useRef(null)
  const nextBtnRef  = useRef(null)

  // Flip plumbing
  const isAnimating = useRef(false)
  const flipState   = useRef(null)
  const direction   = useRef(true)
  const isFirst     = useRef(true)

  const [windowStart,   setWindowStart]   = useState(0)
  const [slidesVisible, setSlidesVisible] = useState(getSlidesVisible)
  const [dragging,      setDragging]      = useState(false)
  const [paused,        setPaused]        = useState(false)
  // While a card rotates out it stays mounted (hidden) so Flip can animate it.
  const [transition,    setTransition]    = useState(null) // { leaving, forward } | null

  const total        = products.length
  const visibleCount = Math.min(slidesVisible, total)
  const canRotate    = total > slidesVisible

  // The window of cards on screen, plus the outgoing card (hidden) during a turn.
  const baseWindow = Array.from(
    { length: visibleCount },
    (_, i) => products[(windowStart + i) % total]
  )
  const renderList = transition
    ? (transition.forward
        ? [transition.leaving, ...baseWindow]
        : [...baseWindow, transition.leaving])
    : baseWindow
  const leavingKey = transition ? keyOf(transition.leaving) : null

  // ── caterpillar rotation ─────────────────────────────────────
  const rotate = useCallback((forward) => {
    if (!canRotate) return
    if (prefersReducedMotion()) {
      setWindowStart((s) => (s + (forward ? 1 : -1) + total) % total)
      return
    }
    if (isAnimating.current || !trackRef.current) return
    isAnimating.current = true
    direction.current = forward
    const leaving = forward
      ? products[windowStart % total]
      : products[(windowStart + visibleCount - 1) % total]
    flipState.current = Flip.getState(trackRef.current.children, { props: 'opacity' })
    setTransition({ leaving, forward })
    setWindowStart((s) => (s + (forward ? 1 : -1) + total) % total)
  }, [canRotate, total, visibleCount, products, windowStart])

  // Run the Flip once the new window (with the hidden outgoing card) has rendered.
  useLayoutEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    const state = flipState.current
    if (!state || !trackRef.current) return
    flipState.current = null

    const forward = direction.current
    Flip.from(state, {
      targets: gsap.utils.toArray(trackRef.current.children),
      absoluteOnLeave: true,
      fade: true,
      duration: 0.6,
      ease: 'power2.inOut',
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            transformOrigin: forward ? 'bottom right' : 'bottom left',
            duration: 0.5,
            ease: 'power2.out'
          }
        ),
      onLeave: (els) =>
        gsap.to(els, {
          opacity: 0,
          scale: 0,
          transformOrigin: forward ? 'bottom left' : 'bottom right',
          duration: 0.5,
          ease: 'power2.in'
        }),
      onComplete: () => {
        isAnimating.current = false
        setTransition(null)
      }
    })
  }, [windowStart])

  // ── autoplay ─────────────────────────────────────────────────
  const startAutoplay = useCallback(() => {
    clearTimeout(autoTimer.current)
    if (progressTl.current) progressTl.current.kill()

    if (progressRef.current) {
      gsap.set(progressRef.current, { scaleX: 0, opacity: 1 })
      progressTl.current = gsap.to(progressRef.current, {
        scaleX:   1,
        duration: AUTOPLAY_DELAY / 1000,
        ease:     'none'
      })
    }

    autoTimer.current = setTimeout(() => rotate(true), AUTOPLAY_DELAY)
  }, [rotate])

  const stopAutoplay = useCallback(() => {
    clearTimeout(autoTimer.current)
    if (progressTl.current) progressTl.current.pause()
    if (progressRef.current) gsap.to(progressRef.current, { opacity: 0, duration: 0.2 })
  }, [])

  const resumeAutoplay = useCallback(() => {
    if (paused) return
    if (progressRef.current) gsap.to(progressRef.current, { opacity: 1, duration: 0.2 })
    startAutoplay()
  }, [startAutoplay, paused])

  // ── resize ───────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setSlidesVisible(getSlidesVisible())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── autoplay lifecycle ───────────────────────────────────────
  useEffect(() => {
    if (!canRotate) return
    if (paused) {
      clearTimeout(autoTimer.current)
      if (progressTl.current) progressTl.current.kill()
      if (progressRef.current) gsap.to(progressRef.current, { opacity: 0, duration: 0.2 })
      return
    }
    startAutoplay()
    return () => clearTimeout(autoTimer.current)
  }, [windowStart, startAutoplay, canRotate, paused])

  // ── keyboard ─────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  rotate(false)
      if (e.key === 'ArrowRight') rotate(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [rotate])

  // ── arrow hover animations ────────────────────────────────────
  const arrowHover = (el, enter) => {
    if (prefersReducedMotion() || !el) return
    gsap.to(el, {
      scale:    enter ? 1.1 : 1,
      x:        enter ? (el === prevBtnRef.current ? -3 : 3) : 0,
      duration: 0.2,
      ease:     'power2.out'
    })
  }

  // ── swipe ────────────────────────────────────────────────────
  const onPointerDown = (e) => {
    dragStart.current = { x: e.clientX, moved: false }
    setDragging(true)
    stopAutoplay()
  }

  const onPointerMove = (e) => {
    if (!dragStart.current) return
    if (Math.abs(e.clientX - dragStart.current.x) > 5) dragStart.current.moved = true
  }

  const onPointerUp = (e) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    if (Math.abs(dx) >= DRAG_THRESHOLD) rotate(dx < 0)
    setDragging(false)
    dragStart.current = null
    resumeAutoplay()
  }

  const onPointerLeaveTrack = (e) => {
    if (dragging) onPointerUp(e)
  }

  if (!products.length) return null

  const showArrows = canRotate

  return (
    <div
      className={styles.slider}
      onMouseEnter={stopAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Viewport + caterpillar track */}
      <div
        ref={viewportRef}
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeaveTrack}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <div ref={trackRef} className={styles.track} style={{ userSelect: 'none' }}>
          {renderList.map((p) => {
            const k = keyOf(p)
            const isLeaving = k === leavingKey
            return (
              <div
                key={k}
                data-flip-id={k}
                className={`${styles.slide} ${isLeaving ? styles.slideLeaving : ''}`}
                style={{ width: `calc(100% / ${visibleCount})` }}
                onClick={(e) => { if (dragStart.current?.moved) e.preventDefault() }}
              >
                <ProductCard product={p} onAddToCart={onAddToCart} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls (back / pause / next) + autoplay progress */}
      <div className={styles.footer}>
        {showArrows && (
          <div className={styles.controls}>
            <button
              ref={prevBtnRef}
              className={styles.ctrlBtn}
              onClick={() => rotate(false)}
              onMouseEnter={() => arrowHover(prevBtnRef.current, true)}
              onMouseLeave={() => arrowHover(prevBtnRef.current, false)}
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              className={`${styles.ctrlBtn} ${styles.pauseBtn}`}
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play autoplay' : 'Pause autoplay'}
              aria-pressed={paused}
            >
              {paused ? (
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="8 5 19 12 8 19" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="9" y1="5" x2="9" y2="19" />
                  <line x1="15" y1="5" x2="15" y2="19" />
                </svg>
              )}
            </button>

            <button
              ref={nextBtnRef}
              className={styles.ctrlBtn}
              onClick={() => rotate(true)}
              onMouseEnter={() => arrowHover(nextBtnRef.current, true)}
              onMouseLeave={() => arrowHover(nextBtnRef.current, false)}
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
        <div className={styles.progressBar}>
          <div ref={progressRef} className={styles.progressFill} />
        </div>
      </div>
    </div>
  )
}
