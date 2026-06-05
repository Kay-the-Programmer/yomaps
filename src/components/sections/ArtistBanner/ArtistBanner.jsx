import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { counterAnimation } from '../../../animations/scrollAnimations'
import { useGsapReveal } from '../../../hooks/useGsapReveal'
import Button from '../../ui/Button/Button'
import styles from './ArtistBanner.module.css'

export default function ArtistBanner() {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const statsRef = useRef(null)
  const streamRef = useRef(null)
  const concertRef = useRef(null)
  const awardsRef = useRef(null)
  const eyebrowRef = useGsapReveal({ delay: 0 })
  const bioRef = useGsapReveal({ delay: 0.1 })

  useEffect(() => {
    counterAnimation(streamRef.current, 100, 'M+')
    counterAnimation(concertRef.current, 50, 'K+')
    counterAnimation(awardsRef.current, 1, '')
  }, [])

  // Scroll parallax on the giant wordmark + staggered stat reveal.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { xPercent: 12, yPercent: -50 },
          {
            xPercent: -12,
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        )
      }

      if (statsRef.current) {
        gsap.from(statsRef.current.querySelectorAll('[data-stat]'), {
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
          opacity: 0,
          y: 28,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out'
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.banner}>
      <span ref={bgRef} className={styles.bgText} aria-hidden="true">ZAMBIA</span>
      <div className={styles.inner}>
        <p ref={eyebrowRef} className={styles.eyebrow}>
          Yo Maps 
        </p>

        <div ref={statsRef} className={styles.stats}>
          <div className={styles.stat} data-stat>
            <span
              ref={streamRef}
              className={`stat-counter ${styles.statNumber}`}
              aria-label="100M+ streams"
            >
              0M+
            </span>
            <span className={styles.statLabel}>Boomplay Streams</span>
          </div>
          <div className={styles.stat} data-stat>
            <span
              ref={concertRef}
              className={`stat-counter ${styles.statNumber}`}
              aria-label="50K+ fans"
            >
              0K+
            </span>
            <span className={styles.statLabel}>Heroes Stadium</span>
          </div>
          <div className={styles.stat} data-stat>
            <span
              ref={awardsRef}
              className={`stat-counter ${styles.statNumber}`}
              aria-label="AFRIMA 2025"
            >
              0
            </span>
            <span className={styles.statLabel}>AFRIMA Award 2025</span>
          </div>
        </div>

        <p ref={bioRef} className={styles.bio}>
          Zambia's most-streamed artist. First Zambian in Boomplay's Golden Club.
          The 2025 AFRIMA Best Male Artist in Southern Africa.
          From Kasama to the continent — every item in this store is a piece of that journey.
        </p>

        <Link to="/shop">
          <Button variant="secondary" size="md">Shop All</Button>
        </Link>
      </div>
    </section>
  )
}
