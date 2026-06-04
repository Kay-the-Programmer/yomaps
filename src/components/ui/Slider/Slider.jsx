import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import ProductCard from '../ProductCard/ProductCard'
import styles from './Slider.module.css'

const AUTOPLAY_DELAY = 4500
const DRAG_THRESHOLD = 50

function getSlidesVisible() {
  const w = window.innerWidth
  if (w < 560)  return 1
  if (w < 900)  return 2
  if (w < 1200) return 3
  return 4
}

export default function Slider({ products = [], onAddToCart }) {
  const viewportRef  = useRef(null)
  const trackRef     = useRef(null)
  const progressRef  = useRef(null)
  const autoTimer    = useRef(null)
  const progressTl   = useRef(null)
  const dragStart    = useRef(null)
  const prevBtnRef   = useRef(null)
  const nextBtnRef   = useRef(null)

  const [current,       setCurrent]       = useState(0)
  const [slidesVisible, setSlidesVisible] = useState(getSlidesVisible)
  const [dragging,      setDragging]      = useState(false)

  const maxIndex = Math.max(0, products.length - slidesVisible)

  // ── helpers ──────────────────────────────────────────────────
  const getCardWidth = useCallback(() => {
    if (!viewportRef.current) return 0
    return viewportRef.current.offsetWidth / slidesVisible
  }, [slidesVisible])

  const goTo = useCallback((index, instant = false) => {
    const clamped = Math.max(0, Math.min(index, maxIndex))
    gsap.to(trackRef.current, {
      x:        -clamped * getCardWidth(),
      duration: instant ? 0 : 0.65,
      ease:     'power3.out'
    })
    setCurrent(clamped)
  }, [maxIndex, getCardWidth])

  // ── autoplay ─────────────────────────────────────────────────
  const startAutoplay = useCallback(() => {
    clearInterval(autoTimer.current)
    if (progressTl.current) progressTl.current.kill()

    if (progressRef.current) {
      gsap.set(progressRef.current, { scaleX: 0 })
      progressTl.current = gsap.to(progressRef.current, {
        scaleX:   1,
        duration: AUTOPLAY_DELAY / 1000,
        ease:     'none'
      })
    }

    autoTimer.current = setTimeout(() => {
      setCurrent(prev => {
        const next = prev >= maxIndex ? 0 : prev + 1
        goTo(next)
        return next
      })
    }, AUTOPLAY_DELAY)
  }, [maxIndex, goTo])

  const stopAutoplay = useCallback(() => {
    clearTimeout(autoTimer.current)
    if (progressTl.current) progressTl.current.pause()
    if (progressRef.current) gsap.to(progressRef.current, { opacity: 0, duration: 0.2 })
  }, [])

  const resumeAutoplay = useCallback(() => {
    if (progressRef.current) gsap.to(progressRef.current, { opacity: 1, duration: 0.2 })
    startAutoplay()
  }, [startAutoplay])

  // ── resize ───────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      const next = getSlidesVisible()
      setSlidesVisible(next)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── re-clamp on resize ───────────────────────────────────────
  useEffect(() => {
    goTo(Math.min(current, maxIndex), true)
  }, [slidesVisible]) // eslint-disable-line

  // ── autoplay lifecycle ───────────────────────────────────────
  useEffect(() => {
    if (products.length <= slidesVisible) return
    startAutoplay()
    return () => { clearTimeout(autoTimer.current) }
  }, [current, startAutoplay, products.length, slidesVisible])

  // ── keyboard ─────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  goTo(current - 1)
      if (e.key === 'ArrowRight') goTo(current + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, goTo])

  // ── arrow hover animations ────────────────────────────────────
  const arrowHover = (el, enter) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    gsap.to(el, {
      scale:    enter ? 1.1 : 1,
      x:        enter ? (el === prevBtnRef.current ? -3 : 3) : 0,
      duration: 0.2,
      ease:     'power2.out'
    })
  }

  // ── drag / swipe ─────────────────────────────────────────────
  const onPointerDown = (e) => {
    dragStart.current = { x: e.clientX, moved: false }
    setDragging(true)
    stopAutoplay()
  }

  const onPointerMove = (e) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    if (Math.abs(dx) > 5) dragStart.current.moved = true
    gsap.set(trackRef.current, { x: -current * getCardWidth() + dx })
  }

  const onPointerUp = (e) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    if (Math.abs(dx) >= DRAG_THRESHOLD) {
      goTo(dx < 0 ? current + 1 : current - 1)
    } else {
      goTo(current) // snap back
    }
    setDragging(false)
    dragStart.current = null
    resumeAutoplay()
  }

  const onPointerLeaveTrack = (e) => {
    if (dragging) onPointerUp(e)
  }

  if (!products.length) return null

  const showArrows = products.length > slidesVisible

  return (
    <div
      className={styles.slider}
      onMouseEnter={stopAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Prev arrow */}
      {showArrows && (
        <button
          ref={prevBtnRef}
          className={`${styles.arrow} ${styles.arrowPrev} ${current === 0 ? styles.arrowDisabled : ''}`}
          onClick={() => goTo(current - 1)}
          onMouseEnter={() => arrowHover(prevBtnRef.current, true)}
          onMouseLeave={() => arrowHover(prevBtnRef.current, false)}
          aria-label="Previous slide"
          disabled={current === 0}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Viewport + draggable track */}
      <div
        ref={viewportRef}
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeaveTrack}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <div
          ref={trackRef}
          className={styles.track}
          style={{ userSelect: 'none' }}
        >
          {products.map((p) => (
            <div
              key={p._id || p.slug}
              className={styles.slide}
              style={{ width: `calc(100% / ${slidesVisible})` }}
              onClick={(e) => { if (dragStart.current?.moved) e.preventDefault() }}
            >
              <ProductCard product={p} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>

      {/* Next arrow */}
      {showArrows && (
        <button
          ref={nextBtnRef}
          className={`${styles.arrow} ${styles.arrowNext} ${current >= maxIndex ? styles.arrowDisabled : ''}`}
          onClick={() => goTo(current + 1)}
          onMouseEnter={() => arrowHover(nextBtnRef.current, true)}
          onMouseLeave={() => arrowHover(nextBtnRef.current, false)}
          aria-label="Next slide"
          disabled={current >= maxIndex}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Dots + autoplay progress */}
      <div className={styles.footer}>
        {showArrows && (
          <div className={styles.dots} role="tablist" aria-label="Slider navigation">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={current === i}
                aria-label={`Go to slide ${i + 1}`}
                className={`${styles.dot} ${current === i ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
        <div className={styles.progressBar}>
          <div ref={progressRef} className={styles.progressFill} />
        </div>
      </div>
    </div>
  )
}
