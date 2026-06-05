import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Stacking-slides scroll effect (adapted from GreenSock's "scroll to reveal,
 * pinned, with internal scroll" pen). Each panel pins when its bottom reaches
 * the bottom of the viewport, then scales down + fades out as the next panel
 * scrolls up over it. Panels whose content is taller than the viewport
 * "fake-scroll" their inner content into view before the scale/fade plays, so
 * nothing is clipped.
 *
 * Pass the `.slides-wrapper` element. Markup contract inside it:
 *   [data-slide]            — the pinned/scaled panel (fixed height, overflow hidden)
 *     [data-slide-inner]    — the content holder that is measured + fake-scrolled
 *
 * The final panel is intentionally left untouched (it's the resting slide).
 * Ratios, margins and tween durations are recomputed on every ScrollTrigger
 * refresh, so async content (e.g. fetched products) and resizes stay correct.
 *
 * Returns a cleanup function that kills the triggers it created.
 */
export const stackingSlides = (wrapper) => {
  if (!wrapper) return () => {}
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return () => {}

  const allPanels = gsap.utils.toArray('[data-slide]', wrapper)
  const panels = allPanels.slice(0, -1) // last panel is the resting slide

  const triggers = []
  const inners = []

  panels.forEach((panel) => {
    const inner = panel.querySelector('[data-slide-inner]')
    if (!inner) return
    inners.push(inner)

    // Portion of the animation spent fake-scrolling tall content (0 when the
    // panel fits the viewport). Recomputed lazily so refreshes stay accurate.
    const getRatio = () => {
      const difference = inner.offsetHeight - window.innerHeight
      return difference > 0 ? difference / (difference + window.innerHeight) : 0
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'bottom bottom',
        end: () => (getRatio() ? `+=${inner.offsetHeight}` : 'bottom top'),
        pin: true,
        pinSpacing: false,
        scrub: true,
        invalidateOnRefresh: true,
        // Tall panels need bottom margin so the next slide arrives on cue.
        onRefresh: () => {
          const ratio = getRatio()
          panel.style.marginBottom = ratio ? `${inner.offsetHeight * ratio}px` : ''
        }
      }
    })

    // Fake-scroll segment — function values re-evaluate via invalidateOnRefresh.
    // Duration of 0 (when the panel fits) makes this a no-op.
    tl.to(inner, {
      yPercent: () => (getRatio() ? -100 : 0),
      y: () => (getRatio() ? window.innerHeight : 0),
      duration: () => {
        const ratio = getRatio()
        return ratio ? 1 / (1 - ratio) - 1 : 0
      },
      ease: 'none'
    })
      .fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 })
      .to(panel, { opacity: 0, duration: 0.1 })

    if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
  })

  ScrollTrigger.refresh()

  // Panel heights settle in stages — async product fetches, the skeleton→slider
  // swap, then late image loads — each of which happens after the initial
  // measurement. A stale measurement (e.g. taken while skeletons were showing)
  // would leave a wrong fake-scroll margin and a gap. We re-refresh on every
  // signal that a height may have changed: any inner resize (debounced), each
  // image finishing, and the window load event. Debouncing coalesces bursts.
  let refreshTimer
  const scheduleRefresh = () => {
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
  }

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleRefresh) : null
  inners.forEach((inner) => ro?.observe(inner))

  const pendingImgs = [...wrapper.querySelectorAll('img')].filter((img) => !img.complete)
  pendingImgs.forEach((img) => {
    img.addEventListener('load', scheduleRefresh, { once: true })
    img.addEventListener('error', scheduleRefresh, { once: true })
  })

  const onWindowLoad = () => scheduleRefresh()
  if (document.readyState !== 'complete') window.addEventListener('load', onWindowLoad)

  return () => {
    clearTimeout(refreshTimer)
    ro?.disconnect()
    pendingImgs.forEach((img) => {
      img.removeEventListener('load', scheduleRefresh)
      img.removeEventListener('error', scheduleRefresh)
    })
    window.removeEventListener('load', onWindowLoad)
    triggers.forEach((t) => t && t.kill())
  }
}
