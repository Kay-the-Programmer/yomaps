import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const productGridReveal = (cards) => {
  if (!cards || cards.length === 0) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  gsap.from(cards, {
    scrollTrigger: {
      trigger: cards[0].parentElement,
      start: 'top 82%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power3.out'
  })
}

export const sectionReveal = (el) => {
  if (!el) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%' },
    opacity: 0,
    y: 32,
    duration: 0.7,
    ease: 'power3.out'
  })
}

export const counterAnimation = (el, targetVal, suffix = '') => {
  if (!el) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    el.textContent = targetVal + suffix
    return
  }

  const obj = { val: 0 }
  gsap.to(obj, {
    scrollTrigger: { trigger: el, start: 'top 80%' },
    val: targetVal,
    duration: 2,
    ease: 'power1.inOut',
    onUpdate() {
      el.textContent = Math.round(obj.val) + suffix
    }
  })
}

export const timelineLineReveal = (line) => {
  if (!line) return
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  gsap.from(line, {
    scrollTrigger: { trigger: line, start: 'top 85%' },
    scaleY: 0,
    transformOrigin: 'top center',
    duration: 0.6,
    ease: 'power3.out'
  })
}

export const navbarScrollBehaviour = () => {
  ScrollTrigger.create({
    start: 'top -80px',
    onEnter:     () => gsap.to('.navbar', { backgroundColor: '#0a0a0a', duration: 0.4 }),
    onLeaveBack: () => gsap.to('.navbar', { backgroundColor: 'transparent', duration: 0.4 })
  })
}
