import styles from './QuantitySelector.module.css'

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className={styles.wrapper}>
      <button
        className={styles.btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
        type="button"
        disabled={value <= min}
      >
        −
      </button>
      <span className={styles.count} aria-label={`Quantity: ${value}`}>{value}</span>
      <button
        className={styles.btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
        type="button"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  )
}
