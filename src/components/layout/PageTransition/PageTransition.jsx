import { useRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Recompute ScrollTrigger start/end positions once layout has settled.
// Without this, reveal triggers created during the page transition keep
// stale positions and above-the-fold content never auto-reveals until a scroll.
const refreshTriggers = () => ScrollTrigger.refresh()

export default function PageTransition({ children }) {
  const contentRef  = useRef(null)
  const overlayRef  = useRef(null)
  const location    = useLocation()
  const prevPath    = useRef(null)
  const isFirstLoad = useRef(true)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isFirstLoad.current) {
      isFirstLoad.current = false
      if (!prefersReducedMotion && contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform', onComplete: refreshTriggers }
        )
      }
      // Refresh once layout is painted, covering reduced-motion too.
      requestAnimationFrame(refreshTriggers)
      prevPath.current = location.pathname
      return
    }

    if (prevPath.current === location.pathname) return
    prevPath.current = location.pathname

    // New route mounted — recompute trigger positions for the incoming page,
    // and again after the entrance settles.
    requestAnimationFrame(refreshTriggers)

    if (prefersReducedMotion || !contentRef.current) return

    // Gold sweep line + fade
    const tl = gsap.timeline()

    if (overlayRef.current) {
      tl.fromTo(
        overlayRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.25, ease: 'power3.inOut' }
      )
      .to(overlayRef.current, {
        scaleX: 0, transformOrigin: 'right center',
        duration: 0.25, ease: 'power3.inOut'
      })
    }

    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', clearProps: 'transform', onComplete: refreshTriggers },
      overlayRef.current ? '-=0.3' : 0
    )
  }, [location.pathname])

  return (
    <>
      {/* Thin gold sweep bar across the top */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          height: '2px',
          background: 'var(--color-gold)',
          zIndex: 200,
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />
      <div ref={contentRef}>
        {children}
      </div>
    </>
  )
}
