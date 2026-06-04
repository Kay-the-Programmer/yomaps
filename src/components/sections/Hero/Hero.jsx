import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { heroEntrance, heroScrollFX } from '../../../animations/heroAnimations'
import Button from '../../ui/Button/Button'
import heroImage from '../../../../assets/images/yomaps.jpg'
import styles from './Hero.module.css'

const HEADLINE = ['WEAR', 'THE', 'VIBE']

export default function Hero() {
  const scopeRef = useRef(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    heroEntrance()
    heroScrollFX(scopeRef.current)
  }, { scope: scopeRef })

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
        <p className={`hero-eyebrow ${styles.eyebrow}`}>
          Olios Records · Lusaka, Zambia
        </p>

        <h1 className={styles.headline}>
          {HEADLINE.map((word) => (
            <span className={styles.wordMask} key={word}>
              <span className={`hero-line-inner ${styles.word} ${word === 'VIBE' ? styles.accent : ''}`}>
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p className={`hero-subline ${styles.subline}`}>
          Official merchandise from Zambia's most-streamed artist —
          100M+ streams, a Heroes Stadium sellout, and the 2025 AFRIMA Award.
        </p>

        <div className={`hero-ctas ${styles.ctas}`}>
          <Link to="/shop">
            <Button variant="primary" size="lg">Shop Now</Button>
          </Link>
          <Link to="/shop/exclusive">
            <Button variant="secondary" size="lg">Exclusive Drops</Button>
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
