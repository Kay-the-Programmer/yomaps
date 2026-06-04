import { gsap } from 'gsap'

export const pageExit = (container) =>
  gsap.to(container, {
    opacity: 0,
    y: -24,
    duration: 0.35,
    ease: 'power2.in'
  })

export const pageEnter = (container) =>
  gsap.fromTo(
    container,
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
  )
