import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { heroEntrance, heroScrollFX } from '../../../animations/heroAnimations'
import Button from '../../ui/Button/Button'
import heroImage from '../../../../assets/images/yomaps.jpg'
import headlinePaths from '../../../animations/heroHeadlinePaths.json'
import styles from './Hero.module.css'

export default function Hero() {
  const scopeRef = useRef(null)

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    const { split } = heroEntrance()
    heroScrollFX(scopeRef.current)
    return () => split?.revert()
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
