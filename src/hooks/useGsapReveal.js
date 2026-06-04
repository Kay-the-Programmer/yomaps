import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useGsapReveal = (options = {}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const fromVars = { opacity: 0, y: options.y ?? 32 }
      const toVars = {
        opacity: 1,
        y: 0,
        duration: options.duration || 0.7,
        ease: options.ease || 'power3.out',
        delay: options.delay || 0
      }

      // If the element is already on-screen at mount, play right away.
      // ScrollTrigger can fail to auto-fire for above-the-fold content when
      // triggers are created mid page-transition (stale positions), leaving
      // content stuck invisible — this guarantees it reveals.
      // fromTo (explicit end values) is used so React StrictMode's double-mount
      // can't capture an already-0 opacity as the destination.
      const inView = el.getBoundingClientRect().top < window.innerHeight * 0.95

      if (inView) {
        gsap.fromTo(el, fromVars, toVars)
      } else {
        gsap.fromTo(el, fromVars, {
          ...toVars,
          scrollTrigger: {
            trigger: el,
            start: options.start || 'top 85%',
            toggleActions: 'play none none none'
          }
        })
      }
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}
