import styles from './Badge.module.css'

const LABELS = {
  'new': 'New',
  'best-seller': 'Best Seller',
  'limited': 'Limited',
  'exclusive': 'Exclusive'
}

export default function Badge({ type }) {
  return (
    <span className={`${styles.badge} ${styles[type]}`}>
      {LABELS[type] || type}
    </span>
  )
}
