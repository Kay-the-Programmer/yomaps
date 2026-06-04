import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Helmet } from 'react-helmet-async'
import { useCartStore } from '../../store/cartStore'
import CartItem from '../../components/ui/CartItem/CartItem'
import CurrencyToggle from '../../components/ui/CurrencyToggle/CurrencyToggle'
import Button from '../../components/ui/Button/Button'
import { formatPrice } from '../../lib/utils'
import styles from './Cart.module.css'

const SHIPPING = [
  { id: 'zm_standard',  label: 'Zambia Standard',      cost: 50,  days: '3–7 days' },
  { id: 'zm_express',   label: 'Zambia Express',        cost: 120, days: '1–2 days' },
  { id: 'intl_standard',label: 'International Standard', cost: 350, days: '7–21 days' }
]

export default function Cart() {
  const [shipping, setShipping] = useState(SHIPPING[0])
  const listRef = useRef(null)
  const navigate = useNavigate()
  const { items, getTotal, currency } = useCartStore()
  const subtotal = getTotal()
  const total = subtotal + shipping.cost

  useEffect(() => {
    if (!listRef.current) return
    const rows = listRef.current.querySelectorAll(':scope > *')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !rows.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(rows, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [items.length])

  const display = (amount) =>
    currency === 'USD' ? formatPrice(amount, 'USD') : formatPrice(amount)

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <Helmet><title>Cart — Yo Maps Official Store</title></Helmet>
        <h1 className={styles.emptyTitle}>Your cart is empty</h1>
        <p className={styles.emptySub}>Nothing here yet. The store awaits.</p>
        <Link to="/shop"><Button variant="primary" size="lg">Browse the Store</Button></Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Helmet><title>Cart — Yo Maps Official Store</title></Helmet>

      <div className={styles.header}>
        <h1 className={styles.title}>Your Cart</h1>
        <CurrencyToggle />
      </div>

      <div className={styles.layout}>
        <div ref={listRef} className={styles.items}>
          {items.map((item, i) => (
            <CartItem key={`${item.product._id}-${item.size}-${i}`} item={item} />
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{display(subtotal)}</span>
          </div>

          <div className={styles.shippingSelect}>
            <label className={styles.label}>Shipping</label>
            {SHIPPING.map((opt) => (
              <label key={opt.id} className={styles.shippingOption}>
                <input
                  type="radio"
                  name="shipping"
                  checked={shipping.id === opt.id}
                  onChange={() => setShipping(opt)}
                />
                <span className={styles.shippingLabel}>{opt.label}</span>
                <span className={styles.shippingMeta}>{opt.days}</span>
                <span className={styles.shippingCost}>{display(opt.cost)}</span>
              </label>
            ))}
          </div>

          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>{display(total)}</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            style={{ width: '100%', marginTop: '8px' }}
            onClick={() => navigate('/checkout', { state: { shipping } })}
          >
            Proceed to Checkout
          </Button>

          <Link to="/shop" className={styles.continueLink}>Continue shopping →</Link>
        </div>
      </div>
    </div>
  )
}
