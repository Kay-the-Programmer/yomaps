import styles from './SizeSelector.module.css'

export default function SizeSelector({ sizes, selected, onChange }) {
  if (!sizes || sizes.length === 0) return null

  return (
    <div className={styles.wrapper} role="group" aria-label="Select size">
      {sizes.map((size) => (
        <button
          key={size}
          className={`${styles.pill} ${selected === size ? styles.selected : ''}`}
          onClick={() => onChange(size)}
          aria-pressed={selected === size}
          type="button"
        >
          {size}
        </button>
      ))}
    </div>
  )
}
