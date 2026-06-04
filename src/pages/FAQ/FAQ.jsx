import { useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { gsap } from 'gsap'
import { useGsapReveal } from '../../hooks/useGsapReveal'
import styles from './FAQ.module.css'

const SECTIONS = [
  {
    id: 'shipping',
    title: 'Shipping Policy',
    intro: 'We ship worldwide from Lusaka, Zambia. Orders are processed within 24 hours.',
    items: [
      {
        q: 'Where do you ship?',
        a: 'Everywhere. Domestic delivery across Zambia and international shipping to fans worldwide.'
      },
      {
        q: 'What are the delivery options and costs?',
        a: 'Zambia Standard (K50, 3–7 days), Zambia Express (K120, 1–2 days), and International Standard (K350, 7–21 days depending on destination).'
      },
      {
        q: 'When will my order ship?',
        a: 'Processing begins within 24 hours of payment. You receive a shipping notification by email the moment your order is on its way.'
      },
      {
        q: 'Do you cover customs and duties?',
        a: 'International orders may incur import duties set by your country. These are the responsibility of the recipient and are not included at checkout.'
      }
    ]
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    intro: 'We want you wearing the vibe with confidence. If something is not right, we will make it right.',
    items: [
      {
        q: 'What is your return window?',
        a: 'Unworn, unwashed items in original condition can be returned within 30 days of delivery.'
      },
      {
        q: 'How do I start a return or exchange?',
        a: 'Reach out through our Contact page with your order number and reason, and we will send return instructions within 48 hours.'
      },
      {
        q: 'Can I exchange for a different size?',
        a: 'Yes. Size exchanges are free within Zambia; international exchanges cover return shipping only.'
      },
      {
        q: 'When will I be refunded?',
        a: 'Refunds are issued to your original payment method within 5–7 business days of us receiving the returned item.'
      }
    ]
  },
  {
    id: 'orders',
    title: 'Orders & Payment',
    intro: null,
    items: [
      {
        q: 'How can I pay?',
        a: 'We accept Airtel Money, MTN MoMo, bank transfer, and cash on delivery. Prices display in Zambian Kwacha (ZMW) or USD using the currency toggle; you pay in Kwacha at checkout.'
      },
      {
        q: 'Are my products authentic?',
        a: 'Every item is official Yo Maps merchandise from Olios Records. This store is the only place to buy authentic gear.'
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'Contact us within 12 hours of ordering and we will do our best to amend it before it enters processing.'
      }
    ]
  }
]

export default function FAQ() {
  const location = useLocation()
  const titleRef = useGsapReveal()

  // Scroll to the targeted section when arriving via a hash link.
  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }
    // Wait for the page transition to mount the content.
    const t = setTimeout(() => {
      const el = document.getElementById(hash)
      if (el) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
      }
    }, 120)
    return () => clearTimeout(t)
  }, [location.hash])

  return (
    <div className={styles.page}>
      <Helmet>
        <title>FAQ, Shipping & Returns — Yo Maps Official Store</title>
        <meta name="description" content="Shipping policy, returns and exchanges, payment and order questions for the Yo Maps official store." />
      </Helmet>

      <header className={styles.header}>
        <p className={styles.eyebrow}>Help Centre</p>
        <h1 ref={titleRef} className={styles.title}>FAQ &amp; Policies</h1>
        <p className={styles.sub}>
          Everything you need to know about shipping, returns, and orders.
          Still stuck? <Link to="/contact" className={styles.inlineLink}>Get in touch</Link>.
        </p>

        <nav className={styles.jumpNav} aria-label="Jump to section">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={styles.jumpLink}>{s.title}</a>
          ))}
        </nav>
      </header>

      {SECTIONS.map((section) => (
        <FaqSection key={section.id} section={section} />
      ))}

      <div className={styles.footerCta}>
        <p className={styles.ctaText}>Can't find what you're looking for?</p>
        <Link to="/contact" className={styles.ctaLink}>Contact the team →</Link>
      </div>
    </div>
  )
}

function FaqSection({ section }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current.querySelectorAll('[data-faq-item]'), {
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        opacity: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out'
      })
    }, ref.current)
    return () => ctx.revert()
  }, [])

  return (
    <section id={section.id} ref={ref} className={styles.section}>
      <h2 className={styles.sectionTitle}>{section.title}</h2>
      {section.intro && <p className={styles.sectionIntro}>{section.intro}</p>}
      <dl className={styles.list}>
        {section.items.map(({ q, a }) => (
          <div key={q} className={styles.item} data-faq-item>
            <dt className={styles.question}>{q}</dt>
            <dd className={styles.answer}>{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
