import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(MorphSVGPlugin, SplitText)

/**
 * Cinematic hero entrance for the image-background layout: a slow photo zoom,
 * scrim fade, and a MorphSVG headline where each letter of "WEAR THE VIBE"
 * coalesces from a geometric shape (triangle / square / circle) into its final
 * glyph. Each `.hero-letter` path carries its starting shape in `data-from`.
 * The subline is split into words that tumble in with a random rotation.
 *
 * Returns `{ tl, split }`; call `split.revert()` on cleanup to restore the
 * subline's original markup.
 */
export const heroEntrance = () => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // Split the subline into individual words for the tumble-in effect.
  const sublineEl = document.querySelector('.hero-subline')
  const split = sublineEl
    ? SplitText.create(sublineEl, { type: 'words', wordsClass: 'hero-subword' })
    : null

  tl.from('.hero-img',   { scale: 1.18, duration: 1.8, ease: 'power2.out' }, 0)
    .from('.hero-scrim', { opacity: 0, duration: 1.2, ease: 'power1.out' }, 0)
    .from('.hero-letter', {
      morphSVG: (i, el) => el.getAttribute('data-from'),
      opacity: 0,
      scale: 0.6,
      transformOrigin: '50% 50%',
      duration: 1.0,
      stagger: 0.08,
      ease: 'power2.inOut'
    }, 0.45)

  if (split) {
    tl.from(split.words, {
      y: -100,
      opacity: 0,
      rotation: 'random(-80, 80)',
      stagger: 0.1,
      duration: 1,
      ease: 'back'
    }, '-=0.5')
  }

  tl.from('.hero-ctas > *', { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, '-=0.45')
    .from('.hero-cue', { opacity: 0, y: -10, duration: 0.6 }, '-=0.3')

  return { tl, split }
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
