import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ArrowRight } from 'lucide-react'
import styles from './SectionHeading.module.css'

/**
 * Editorial section heading: a numbered eyebrow plus a word-by-word masked
 * title reveal, animated on scroll. Shared across the home page so every
 * section speaks the same motion language as the hero.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  align = 'left',
  actionLabel,
  actionTo
}) {
  const ref = useRef(null)
  const words = title.split(' ')

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 85%' }
    })

    tl.from('[data-sh-eyebrow] > *', {
      opacity: 0, y: 12, duration: 0.5, stagger: 0.06, ease: 'power3.out'
    })
      .from('[data-sh-word]', {
        yPercent: 115, duration: 0.85, stagger: 0.08, ease: 'power4.out'
      }, '-=0.2')

    const action = ref.current.querySelector('[data-sh-action]')
    if (action) {
      tl.from(action, { opacity: 0, x: -10, duration: 0.5, ease: 'power3.out' }, '-=0.5')
    }
  }, { scope: ref })

  return (
    <header ref={ref} className={`${styles.heading} ${styles[align]}`}>
      <div className={styles.titleWrap}>
        {(index || eyebrow) && (
          <p data-sh-eyebrow className={styles.eyebrow}>
            {index && <span className={styles.index}>{index}</span>}
            {index && eyebrow && <span className={styles.dash} aria-hidden="true" />}
            {eyebrow && <span>{eyebrow}</span>}
          </p>
        )}
        <h2 className={styles.title} aria-label={title}>
          {words.map((word, i) => (
            <span className={styles.wordMask} key={`${word}-${i}`} aria-hidden="true">
              <span data-sh-word className={styles.word}>{word}</span>
            </span>
          ))}
        </h2>
      </div>

      {actionLabel && actionTo && (
        <Link to={actionTo} data-sh-action className={styles.action}>
          {actionLabel}
          <span aria-hidden="true" className={styles.actionArrow}><ArrowRight size={15} strokeWidth={1.75} /></span>
        </Link>
      )}
    </header>
  )
}
