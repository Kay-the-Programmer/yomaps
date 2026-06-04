import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { CheckCircle2 } from 'lucide-react'
import { sendContactForm } from '../../lib/api'
import { useToastStore } from '../../store/cartStore'
import { useGsapReveal } from '../../hooks/useGsapReveal'
import Button from '../../components/ui/Button/Button'
import styles from './Contact.module.css'

const SUBJECTS = [
  'Order Enquiry',
  'Shipping & Delivery',
  'Product Question',
  'Press & Media',
  'Wholesale',
  'Other'
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { addToast } = useToastStore()
  const titleRef = useGsapReveal()
  const formRef = useGsapReveal({ delay: 0.1 })

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Message required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      await sendContactForm(form)
      setSent(true)
      addToast("Message sent. We'll be in touch within 48 hours.")
    } catch {
      addToast('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Contact — Yo Maps Official Store</title>
        <meta name="description" content="Get in touch with the Yo Maps official store team." />
      </Helmet>

      <div className={styles.header}>
        <h1 ref={titleRef} className={styles.title}>Get in Touch</h1>
        <p className={styles.sub}>
          We typically respond within 24–48 hours.
          For urgent orders, include your order number.
        </p>
      </div>

      <div className={styles.layout}>
        {sent ? (
          <div className={styles.successState}>
            <span className={styles.successIcon} aria-hidden="true"><CheckCircle2 size={48} strokeWidth={1.4} /></span>
            <h2 className={styles.successTitle}>Message Received</h2>
            <p className={styles.successSub}>
              We'll get back to you within 48 hours.
            </p>
            <button className={styles.resetBtn} onClick={() => setSent(false)}>
              Send another message
            </button>
          </div>
        ) : (
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldRow}>
              <Field label="Name" error={errors.name}>
                <input className={styles.input} value={form.name} onChange={set('name')} placeholder="Your name" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" className={styles.input} value={form.email} onChange={set('email')} placeholder="you@example.com" />
              </Field>
            </div>
            <Field label="Subject">
              <select className={styles.input} value={form.subject} onChange={set('subject')} aria-label="Subject">
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                value={form.message}
                onChange={set('message')}
                placeholder="Tell us what's on your mind."
                rows={6}
              />
            </Field>
            <Button type="submit" variant="primary" size="lg" disabled={loading}>
              {loading ? 'Sending…' : 'Send Message'}
            </Button>
          </form>
        )}

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Based in</span>
            <span className={styles.infoVal}>Lusaka, Zambia</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Label</span>
            <span className={styles.infoVal}>Olios Records</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Ships</span>
            <span className={styles.infoVal}>Worldwide</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Response time</span>
            <span className={styles.infoVal}>24–48 hours</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
      {error && <span style={{ display: 'block', fontSize: '12px', color: '#f87171', marginTop: '4px' }}>{error}</span>}
    </div>
  )
}
