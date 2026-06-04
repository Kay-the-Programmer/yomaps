import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { gsap } from 'gsap'
import { Smartphone, Landmark, Truck } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { createOrder } from '../../lib/api'
import Button from '../../components/ui/Button/Button'
import styles from './Checkout.module.css'

const COUNTRIES = ['Zambia', 'South Africa', 'Kenya', 'Nigeria', 'United Kingdom', 'United States', 'Canada', 'Australia', 'Other']
const STEPS = ['Contact', 'Shipping', 'Payment']

const PAY_METHODS = [
  { id: 'airtel_money',     label: 'Airtel Money',     hint: 'Pay from your Airtel Money wallet',  Icon: Smartphone, mobile: true },
  { id: 'mtn_money',        label: 'MTN MoMo',         hint: 'Pay from your MTN Mobile Money',      Icon: Smartphone, mobile: true },
  { id: 'bank_transfer',    label: 'Bank Transfer',    hint: 'Transfer to our bank account',        Icon: Landmark },
  { id: 'cash_on_delivery', label: 'Cash on Delivery', hint: 'Pay with cash when it arrives',       Icon: Truck }
]

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { items, getTotal, clearCart } = useCartStore()
  const shipping = location.state?.shipping || { id: 'zm_standard', label: 'Zambia Standard', cost: 50, days: '3–7 days' }

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', country: 'Zambia', postal: ''
  })
  const [method, setMethod] = useState('airtel_money')
  const [payPhone, setPayPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(0)
  const [submitError, setSubmitError] = useState('')
  const [placing, setPlacing] = useState(false)
  const stepRef = useRef(null)

  const subtotal = getTotal()
  const total = subtotal + shipping.cost
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const isMobile = method === 'airtel_money' || method === 'mtn_money'

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !stepRef.current) return
    gsap.fromTo(stepRef.current, { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' })
  }, [step])

  const validateStep = (s) => {
    const e = {}
    if (s === 0) {
      if (!form.name.trim()) e.name = 'Full name required'
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    }
    if (s === 1) {
      if (!form.address.trim()) e.address = 'Address required'
      if (!form.city.trim()) e.city = 'City required'
    }
    return e
  }

  const next = () => {
    const e = validateStep(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    if (step === 0 && !payPhone && form.phone) setPayPhone(form.phone)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const back = () => { setErrors({}); setSubmitError(''); setStep((s) => Math.max(s - 1, 0)) }

  const placeOrder = async () => {
    if (isMobile && !payPhone.trim()) {
      setSubmitError('Enter the mobile money number to pay from.')
      return
    }
    setSubmitError('')
    setPlacing(true)
    try {
      const { data } = await createOrder({
        customer: {
          name: form.name, email: form.email, phone: form.phone,
          address: { line1: form.address, city: form.city, country: form.country, postal_code: form.postal }
        },
        items: items.map((i) => ({
          product: i.product._id, name: i.product.name, size: i.size,
          quantity: i.quantity, price: i.product.price_zmw
        })),
        subtotal, shipping_cost: shipping.cost,
        shipping_option: shipping.id, total,
        currency: 'ZMW',
        payment_method: method,
        payment_phone: isMobile ? payPhone.trim() : undefined
      })
      clearCart()
      navigate(`/order-confirmed/${data._id || data.order_number}`)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Something went wrong. Please try again.')
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Your cart is empty. <Link to="/shop">Back to shop</Link></p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Helmet><title>Checkout — Yo Maps Official Store</title></Helmet>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.layout}>
        <div>
          <div className={styles.progress}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ display: 'contents' }}>
                <div className={`${styles.progressStep} ${i === step ? styles.progressActive : ''} ${i < step ? styles.progressDone : ''}`}>
                  <span className={styles.progressDot}>{i < step ? '✓' : i + 1}</span>
                  <span className={styles.progressLabel}>{label}</span>
                </div>
                {i < STEPS.length - 1 && <span className={`${styles.progressBar} ${i < step ? styles.progressBarDone : ''}`} />}
              </div>
            ))}
          </div>

          <div ref={stepRef} className={styles.form}>
            {step === 0 && (
              <section className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Contact</h2>
                <div className={styles.fieldRow}>
                  <Field label="Full Name" error={errors.name}>
                    <input className={styles.input} value={form.name} onChange={set('name')} placeholder="Elton Mulenga" autoFocus />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input type="email" className={styles.input} value={form.email} onChange={set('email')} placeholder="you@example.com" />
                  </Field>
                </div>
                <Field label="Phone (optional)">
                  <input type="tel" className={styles.input} value={form.phone} onChange={set('phone')} placeholder="+260 97 000 0000" />
                </Field>
                <div className={styles.stepActions}>
                  <Button variant="primary" size="lg" onClick={next} type="button">Continue to Shipping</Button>
                </div>
              </section>
            )}

            {step === 1 && (
              <section className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Shipping Address</h2>
                <Field label="Street Address" error={errors.address}>
                  <input className={styles.input} value={form.address} onChange={set('address')} placeholder="123 Cairo Road" autoFocus />
                </Field>
                <div className={styles.fieldRow}>
                  <Field label="City" error={errors.city}>
                    <input className={styles.input} value={form.city} onChange={set('city')} placeholder="Lusaka" />
                  </Field>
                  <Field label="Postal Code">
                    <input className={styles.input} value={form.postal} onChange={set('postal')} placeholder="10101" />
                  </Field>
                </div>
                <Field label="Country">
                  <select className={styles.input} value={form.country} onChange={set('country')}>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <div className={styles.stepActions}>
                  <button className={styles.backBtn} onClick={back} type="button">Back</button>
                  <Button variant="primary" size="lg" onClick={next} type="button">Continue to Payment</Button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Payment Method</h2>

                <div className={styles.payMethods}>
                  {PAY_METHODS.map(({ id, label, hint, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      className={`${styles.payMethod} ${method === id ? styles.payMethodActive : ''}`}
                      onClick={() => setMethod(id)}
                      aria-pressed={method === id}
                    >
                      <Icon className={styles.payIcon} size={22} strokeWidth={1.6} />
                      <span className={styles.payLabel}>{label}</span>
                      <span className={styles.payHint}>{hint}</span>
                    </button>
                  ))}
                </div>

                {isMobile && (
                  <div style={{ marginTop: 18 }}>
                    <Field label="Mobile money number">
                      <input
                        className={styles.input}
                        type="tel"
                        value={payPhone}
                        onChange={(e) => setPayPhone(e.target.value)}
                        placeholder="097X XXX XXX"
                      />
                    </Field>
                    <p className={styles.testNote}>
                      You'll get a prompt on this number to approve the payment. If it doesn't arrive,
                      we'll show you how to pay manually on the next screen.
                    </p>
                  </div>
                )}

                {method === 'bank_transfer' && (
                  <p className={styles.testNote}>
                    We'll show our bank details and your payment reference on the next screen.
                    Your order ships once payment reflects.
                  </p>
                )}

                {method === 'cash_on_delivery' && (
                  <p className={styles.testNote}>
                    Pay with cash when your order is delivered. Please have the exact amount ready.
                  </p>
                )}

                {submitError && <p className={styles.submitError}>{submitError}</p>}

                <div className={styles.stepActions}>
                  <button className={styles.backBtn} onClick={back} type="button" disabled={placing}>Back</button>
                  <Button variant="primary" size="lg" type="button" disabled={placing} onClick={placeOrder}>
                    {placing ? 'Placing order…' : `Place Order — K${total.toLocaleString()}`}
                  </Button>
                </div>
              </section>
            )}
          </div>
        </div>

        <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </div>
  )
}

function OrderSummary({ items, subtotal, shipping, total }) {
  return (
    <div className={styles.orderSummary}>
      <h2 className={styles.sectionTitle}>Order Summary</h2>
      <div className={styles.orderItems}>
        {items.map((item, i) => (
          <div key={i} className={styles.orderItem}>
            <div className={styles.orderItemInfo}>
              <span className={styles.orderItemName}>{item.product.name}</span>
              {item.size && <span className={styles.orderItemMeta}>Size: {item.size}</span>}
              <span className={styles.orderItemMeta}>Qty: {item.quantity}</span>
            </div>
            <span className={styles.orderItemPrice}>K{(item.product.price_zmw * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className={styles.summaryLine}><span>Subtotal</span><span>K{subtotal.toLocaleString()}</span></div>
      <div className={styles.summaryLine}><span>Shipping</span><span>{shipping.label} — K{shipping.cost}</span></div>
      <div className={`${styles.summaryLine} ${styles.totalLine}`}><span>Total</span><span>K{total.toLocaleString()}</span></div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
        {label}
      </label>
      {children}
      {error && <span style={{ fontSize: '12px', color: '#f87171' }}>{error}</span>}
    </div>
  )
}
