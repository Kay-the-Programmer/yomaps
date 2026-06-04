import { useCartStore } from '../../../store/cartStore'
import styles from './CurrencyToggle.module.css'

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCartStore()

  return (
    <div className={styles.toggle} role="group" aria-label="Currency">
      {['ZMW', 'USD'].map((c) => (
        <button
          key={c}
          className={`${styles.btn} ${currency === c ? styles.active : ''}`}
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          type="button"
        >
          {c}
        </button>
      ))}
    </div>
  )
}
