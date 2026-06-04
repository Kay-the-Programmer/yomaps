import { useRef } from 'react'
import { gsap } from 'gsap'
import { useCartStore } from '../../../store/cartStore'
import QuantitySelector from '../QuantitySelector/QuantitySelector'
import ProductSVG from '../ProductSVG/ProductSVG'
import { formatPrice } from '../../../lib/utils'
import styles from './CartItem.module.css'

export default function CartItem({ item }) {
  const { removeItem, updateQuantity, currency } = useCartStore()
  const ref = useRef(null)

  const handleRemove = () => {
    const el = ref.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (el && !prefersReducedMotion) {
      gsap.to(el, {
        scale: 0.95,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => removeItem(item.product._id, item.size)
      })
    } else {
      removeItem(item.product._id, item.size)
    }
  }

  const lineTotal = item.product.price_zmw * item.quantity
  const displayPrice = currency === 'USD'
    ? formatPrice(lineTotal, 'USD')
    : formatPrice(lineTotal)

  return (
    <div ref={ref} className={styles.item}>
      <div className={styles.image}>
        <ProductSVG category={item.product.category} name={item.product.name} />
      </div>
      <div className={styles.details}>
        <span className={styles.name}>{item.product.name}</span>
        <div className={styles.meta}>
          {item.size && <span>Size: {item.size}</span>}
          <span>K{item.product.price_zmw} each</span>
        </div>
        <div className={styles.controls}>
          <QuantitySelector
            value={item.quantity}
            onChange={(q) => updateQuantity(item.product._id, item.size, q)}
          />
          <button className={styles.removeBtn} onClick={handleRemove} type="button">
            Remove
          </button>
        </div>
      </div>
      <span className={styles.price}>{displayPrice}</span>
    </div>
  )
}
