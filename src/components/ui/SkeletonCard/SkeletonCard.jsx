import styles from './SkeletonCard.module.css'

export default function SkeletonCard() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.image} />
      <div className={styles.info}>
        <div className={`${styles.line} ${styles.lineShort}`} />
        <div className={`${styles.line} ${styles.lineMed}`} />
        <div className={`${styles.line} ${styles.lineFull}`} />
        <div className={`${styles.line} ${styles.lineShort}`} />
      </div>
    </div>
  )
}
