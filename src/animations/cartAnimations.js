import { gsap } from 'gsap'

export const cartPulse = (iconEl) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion || !iconEl) return

  gsap.timeline()
    .to(iconEl, { scale: 1.35, duration: 0.15, ease: 'power2.out' })
    .to(iconEl, { scale: 1,    duration: 0.25, ease: 'elastic.out(1, 0.5)' })
}
