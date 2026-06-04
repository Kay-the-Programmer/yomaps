import { useGsapReveal } from '../../hooks/useGsapReveal'
import NewsletterForm from '../../components/ui/NewsletterForm/NewsletterForm'
import styles from './NewsletterSection.module.css'

export default function NewsletterSection() {
  const ref = useGsapReveal()

  return (
    <section className={styles.section}>
      <span className={styles.bgWord} aria-hidden="true">JOIN</span>
      <div className={styles.inner} ref={ref}>
        <p className={styles.eyebrow}>
          <span className={styles.index}>04</span>
          <span className={styles.dash} aria-hidden="true" />
          <span>Join the Movement</span>
        </p>
        <h2 className={styles.title}>Stay Close</h2>
        <p className={styles.sub}>New drops. Concert merch. Exclusives. Direct to you.</p>
        <NewsletterForm />
      </div>
    </section>
  )
}
