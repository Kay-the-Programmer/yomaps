import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useToastStore } from '../../../store/cartStore'
import styles from './Toast.module.css'

function ToastItem({ toast }) {
  const ref = useRef(null)
  const { removeToast } = useToastStore()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' })
    }

    const timer = setTimeout(() => {
      if (!prefersReducedMotion) {
        gsap.to(el, {
          opacity: 0,
          y: 10,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => removeToast(toast.id)
        })
      } else {
        removeToast(toast.id)
      }
    }, 2600)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={ref} className={styles.toast} role="status">
      <span className={styles.dot} />
      {toast.message}
    </div>
  )
}

export default function ToastRegion() {
  const { toasts } = useToastStore()

  return (
    <div aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
