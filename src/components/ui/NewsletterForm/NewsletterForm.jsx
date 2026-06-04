import { useState } from 'react'
import { subscribeNewsletter } from '../../../lib/api'
import styles from './NewsletterForm.module.css'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setStatus('loading')
    try {
      await subscribeNewsletter(email)
      setStatus('success')
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return <p className={styles.success}>You're in. New drops coming your way.</p>
  }

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          className={styles.input}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <button className={styles.btn} type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
