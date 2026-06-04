import { gsap } from 'gsap'

/**
 * Cinematic hero entrance for the image-background layout: a slow photo zoom,
 * scrim fade, and a masked, bottom-up reveal of the overlay copy. Returns the
 * timeline.
 */
export const heroEntrance = () => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from('.hero-img',   { scale: 1.18, duration: 1.8, ease: 'power2.out' }, 0)
    .from('.hero-scrim', { opacity: 0, duration: 1.2, ease: 'power1.out' }, 0)
    .from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.7 }, 0.35)
    .from('.hero-line-inner', { yPercent: 120, duration: 0.95, stagger: 0.09 }, 0.5)
    .from('.hero-subline', { opacity: 0, y: 20, duration: 0.7 }, '-=0.5')
    .from('.hero-ctas > *', { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, '-=0.45')
    .from('.hero-cue', { opacity: 0, y: -10, duration: 0.6 }, '-=0.3')

  return tl
}

/**
 * Scroll-triggered parallax + dissolve. As the hero scrolls out of view the
 * photo drifts at its own pace (depth) while the overlay copy lifts and fades,
 * scrubbed 1:1 to scroll position. Triggers are auto-cleaned by useGSAP's
 * context. Skipped under reduced-motion.
 */
export const heroScrollFX = (scope) => {
  if (!scope) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const media   = scope.querySelector('.hero-media')
  const content = scope.querySelector('.hero-content')
  const cue     = scope.querySelector('.hero-cue')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scope,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  if (media)   tl.to(media,   { yPercent: 16, ease: 'none' }, 0)
  if (content) tl.to(content, { yPercent: -28, opacity: 0, ease: 'none' }, 0)
  if (cue)     tl.to(cue,     { opacity: 0, ease: 'none' }, 0)

  return tl
}
