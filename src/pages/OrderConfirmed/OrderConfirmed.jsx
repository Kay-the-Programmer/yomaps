import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Download } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import api, { invoiceUrl, getPaymentConfig, IS_DEMO } from '../../lib/api'
import styles from './OrderConfirmed.module.css'

const METHOD_LABELS = {
  airtel_money: 'Airtel Money',
  mtn_money: 'MTN MoMo',
  bank_transfer: 'Bank Transfer',
  cash_on_delivery: 'Cash on Delivery'
}

export default function OrderConfirmed() {
  const { id } = useParams()
  const checkRef = useRef(null)
  const detailsRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [order, setOrder] = useState(null)
  const [payCfg, setPayCfg] = useState(null)

  // Animate checkmark first, then reveal details
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!checkRef.current) return

    const circle = checkRef.current.querySelector('.check-circle')
    const tick   = checkRef.current.querySelector('.check-tick')

    if (prefersReducedMotion) {
      setVisible(true)
      return
    }

    gsap.set([circle, tick], { opacity: 0 })
    gsap.timeline({ onComplete: () => setVisible(true) })
      .to(circle, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', transformOrigin: 'center' })
      .fromTo(tick,
        { strokeDashoffset: 60 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
        '-=0.1'
      )
  }, [])

  // Fetch order from backend once details become visible
  useEffect(() => {
    if (!visible || !id) return
    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => {})
    getPaymentConfig()
      .then((res) => setPayCfg(res.data))
      .catch(() => {})
  }, [visible, id])

  // Animate details in
  useEffect(() => {
    if (!visible || !detailsRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(detailsRef.current.querySelectorAll('h1, p, [data-anim]'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
      )
    })
    return () => ctx.revert()
  }, [visible])

  const displayId = order?.order_number || id

  return (
    <div className={styles.page}>
      <Helmet><title>Order Confirmed — Yo Maps Official Store</title></Helmet>

      <div ref={checkRef} className={styles.checkmark}>
        <svg viewBox="0 0 80 80" className={styles.svg} aria-hidden="true">
          <circle
            className="check-circle"
            cx="40" cy="40" r="36"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.5"
          />
          <polyline
            className="check-tick"
            points="24,42 35,53 56,30"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="60"
            strokeDashoffset="60"
          />
        </svg>
      </div>

      {visible && (
        <div ref={detailsRef} className={styles.details}>
          <h1 className={styles.title} data-anim>Order Confirmed</h1>
          <p className={styles.sub} data-anim>
            Your order has been placed.{order?.customer?.email && ` A confirmation is on its way to ${order.customer.email}.`}
          </p>

          {displayId && (
            <div className={styles.orderNum} data-anim>
              <span className={styles.orderLabel}>Order Reference</span>
              <span className={styles.orderId}>{displayId}</span>
            </div>
          )}

          {order && (
            <PaymentInstructions order={order} cfg={payCfg} />
          )}

          {order?.items?.length > 0 && (
            <div className={styles.itemList} data-anim>
              {order.items.map((item, i) => (
                <div key={i} className={styles.itemRow}>
                  <span className={styles.itemName}>
                    {item.name}{item.size ? ` — ${item.size}` : ''} × {item.quantity}
                  </span>
                  <span className={styles.itemPrice}>K{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className={styles.itemTotal}>
                <span>Total</span>
                <span>K{order.total?.toLocaleString()}</span>
              </div>
            </div>
          )}

          {order?.customer?.address && (
            <p className={styles.note} data-anim>
              Shipping to {order.customer.address.city}, {order.customer.address.country} via {order.shipping_option?.replace('_', ' ')}.
            </p>
          )}

          <p className={styles.note} data-anim>
            Processing begins within 24 hours. You'll receive a shipping notification when your order is on its way.
          </p>

          <div className={styles.actions} data-anim>
            {id && !IS_DEMO && (
              <a
                className={styles.ctaSecondary}
                href={invoiceUrl(id)}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={15} strokeWidth={1.8} />
                Download Invoice
              </a>
            )}
            <Link to="/shop">
              <button className={styles.cta}>Continue Shopping</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function PaymentInstructions({ order, cfg }) {
  const paid = order.status === 'paid'
  const ref = order.payment_reference || order.order_number
  const amount = `K${(order.total || 0).toLocaleString()}`
  const m = cfg?.merchant
  const label = METHOD_LABELS[order.payment_method] || 'Payment'

  let body
  if (paid) {
    body = <p className={styles.payText}>Payment received — thank you! Your order is being prepared.</p>
  } else if (order.payment_method === 'cash_on_delivery') {
    body = <p className={styles.payText}>Pay <strong>{amount}</strong> in cash when your order is delivered. Please have the exact amount ready.</p>
  } else if (order.payment_method === 'bank_transfer') {
    body = (
      <p className={styles.payText}>
        Transfer <strong>{amount}</strong> to:<br />
        {m?.bank?.name || '—'} — {m?.bank?.accountName || '—'}<br />
        Acct: <strong>{m?.bank?.accountNumber || '—'}</strong>{m?.bank?.branch ? ` · ${m.bank.branch}` : ''}<br />
        Reference: <strong>{ref}</strong>
      </p>
    )
  } else {
    // mobile money
    const number = order.payment_method === 'airtel_money' ? m?.airtelNumber : m?.mtnNumber
    body = order.payment_provider === 'lenco'
      ? <p className={styles.payText}>Approve the <strong>{label}</strong> prompt sent to your phone to pay <strong>{amount}</strong>. This page will update once confirmed.</p>
      : <p className={styles.payText}>Send <strong>{amount}</strong> via {label} to <strong>{number || '—'}</strong>, using reference <strong>{ref}</strong>. We'll confirm once received.</p>
  }

  return (
    <div className={`${styles.payBox} ${paid ? styles.payBoxPaid : ''}`} data-anim>
      <span className={styles.payBoxLabel}>{label}{paid ? ' · Paid' : ' · Awaiting payment'}</span>
      {body}
    </div>
  )
}
