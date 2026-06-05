import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { heroEntrance } from '../../../animations/heroAnimations'
import Button from '../../ui/Button/Button'
import heroImage from '../../../../assets/images/yomaps.jpg'
import headlinePaths from '../../../animations/heroHeadlinePaths.json'
import styles from './Hero.module.css'

export default function Hero() {
  const scopeRef = useRef(null)
  const shopZoneRef = useRef(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    // Only the on-load cinematic entrance lives here now. The scroll-out
    // behaviour is owned by the home page's stacking-slides effect (the hero is
    // its first pinned panel), so heroScrollFX is intentionally not called —
    // pinning + its parallax dissolve would fight over the same scroll range.
    const { split } = heroEntrance()
    return () => split?.revert()
  }, { scope: scopeRef })

  // Magnetic "Shop Now" button: the button (and its label, at a softer rate)
  // tracks the cursor within the zone, then springs back on leave. overwrite:true
  // ensures each new pull cancels the previous tween so the motion stays crisp.
  useEffect(() => {
    const zone = shopZoneRef.current
    if (!zone) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const btn = zone.querySelector('button')
    const label = zone.querySelector('[data-mag-label]')
    if (!btn) return

    const strength = 0.4
    const labelStrength = 0.24

    const onMove = (e) => {
      const rect = zone.getBoundingClientRect()
      const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX)
      const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY)
      gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power2.out', overwrite: true })
      if (label) gsap.to(label, { x: x * labelStrength, y: y * labelStrength, duration: 0.4, ease: 'power2.out', overwrite: true })
    }

    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: true })
      if (label) gsap.to(label, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: true })
    }

    zone.addEventListener('mousemove', onMove)
    zone.addEventListener('mouseleave', onLeave)
    return () => {
      zone.removeEventListener('mousemove', onMove)
      zone.removeEventListener('mouseleave', onLeave)
      gsap.set([btn, label].filter(Boolean), { x: 0, y: 0 })
    }
  }, [])

  return (
    <section className={styles.hero} ref={scopeRef}>
      <div className={`hero-media ${styles.media}`}>
        <img
          className={`hero-img ${styles.img}`}
          src={heroImage}
          alt="Yo Maps — Elton Mulenga"
          fetchpriority="high"
        />
      </div>
      <div className={`hero-scrim ${styles.scrim}`} aria-hidden="true" />

      <div className={`hero-content ${styles.content}`}>
        <h1 className={styles.headline}>
          <span className={styles.srOnly}>{headlinePaths.text}</span>
          <svg
            className={styles.headlineSvg}
            viewBox={headlinePaths.viewBox}
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient id="heroHeadlineGrad" x1="0" y1="-164" x2="0" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#f8dbb9" />
                <stop offset="0.5" stopColor="#fb8305" />
                <stop offset="1" stopColor="#e06f08" />
              </linearGradient>
            </defs>
            {headlinePaths.letters.map((letter, i) => (
              <path
                key={`${letter.ch}-${i}`}
                className="hero-letter"
                d={letter.d}
                data-from={letter.from}
                fill="url(#heroHeadlineGrad)"
              />
            ))}
          </svg>
        </h1>

        <p className={`hero-subline ${styles.subline}`}>
          Official merchandise from Zambia's most-streamed artist.
        </p>

        <div className={`hero-ctas ${styles.ctas}`}>
          <Link to="/shop" ref={shopZoneRef} className={styles.magneticZone}>
            <Button variant="primary" size="lg">
              <span data-mag-label className={styles.magLabel}>Shop Now</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className={`hero-cue ${styles.cue}`} aria-hidden="true">
        <span className={styles.cueLabel}>Scroll</span>
        <span className={styles.cueLine}><span className={styles.cueDot} /></span>
      </div>
    </section>
  )
}
