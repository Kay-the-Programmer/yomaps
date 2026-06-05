import { useRef, useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '../../../store/cartStore'
import { cartPulse } from '../../../animations/cartAnimations'
import styles from './Navbar.module.css'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { to: '/shop',    label: 'Shop' },
  { to: '/about',   label: 'About' },
  { to: '/contact', label: 'Contact' }
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef       = useRef(null)
  const cartIconRef  = useRef(null)
  const menuRef      = useRef(null)
  const bar1Ref      = useRef(null)
  const bar2Ref      = useRef(null)
  const bar3Ref      = useRef(null)
  const count = useCartStore((s) => s.getCount())

  // Navbar scroll solid bg and show/hide on scroll
  useEffect(() => {
    if (!navRef.current) return

    const stSolid = ScrollTrigger.create({
      start:       'top -80px',
      onEnter:     () => setScrolled(true),
      onLeaveBack: () => setScrolled(false)
    })

    const showAnim = gsap.fromTo(navRef.current,
      { yPercent: -100 },
      { yPercent: 0, paused: true, duration: 0.2, ease: 'power2.out' }
    ).progress(1)

    const stHide = ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        if (self.scrollY > 80) {
          self.direction === -1 ? showAnim.play() : showAnim.reverse()
        } else {
          showAnim.play()
        }
      }
    })

    return () => {
      stSolid.kill()
      stHide.kill()
    }
  }, [])

  // Cart icon pulse
  useEffect(() => {
    if (count > 0 && cartIconRef.current) cartPulse(cartIconRef.current)
  }, [count])

  // GSAP mobile menu open/close
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!menuRef.current) return

    if (menuOpen) {
      const links = menuRef.current.querySelectorAll('[data-menu-link]')
      gsap.set(menuRef.current, { display: 'flex' })

      if (prefersReducedMotion) return

      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
      )
      gsap.fromTo(
        links,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power3.out', delay: 0.1 }
      )

      // Animate hamburger → X
      gsap.to(bar1Ref.current, { rotation: 45,  y: 6,  duration: 0.3, ease: 'power2.out' })
      gsap.to(bar2Ref.current, { opacity: 0,       duration: 0.15 })
      gsap.to(bar3Ref.current, { rotation: -45, y: -6, duration: 0.3, ease: 'power2.out' })
    } else {
      if (prefersReducedMotion) {
        gsap.set(menuRef.current, { display: 'none' })
        return
      }
      gsap.to(menuRef.current, {
        opacity: 0, y: -8, duration: 0.25, ease: 'power2.in',
        onComplete: () => gsap.set(menuRef.current, { display: 'none' })
      })

      // Animate X → hamburger
      gsap.to(bar1Ref.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' })
      gsap.to(bar2Ref.current, { opacity: 1,        duration: 0.2, delay: 0.1 })
      gsap.to(bar3Ref.current, { rotation: 0, y: 0, duration: 0.3, ease: 'power2.out' })
    }
  }, [menuOpen])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        const btn = document.querySelector('[data-hamburger]')
        if (btn && btn.contains(e.target)) return
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav ref={navRef} className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          YO <span>MAPS</span>
        </Link>

        {/* Desktop nav */}
        <div className={styles.desktopNav}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className={styles.actions}>
          <Link to="/cart" className={styles.cartBtn} aria-label={`Cart, ${count} items`}>
            <span ref={cartIconRef} className={styles.cartIcon} aria-hidden="true"><ShoppingBag size={18} strokeWidth={1.6} /></span>
            <span className={styles.cartLabel}>Cart</span>
            {count > 0 && (
              <span className={styles.cartCount} aria-hidden="true">{count}</span>
            )}
          </Link>

          <button
            data-hamburger
            className={styles.hamburger}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span ref={bar1Ref} />
            <span ref={bar2Ref} />
            <span ref={bar3Ref} />
          </button>
        </div>
      </nav>

      {/* Mobile menu — hidden by default, shown via GSAP */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={styles.mobileMenu}
        aria-hidden={!menuOpen}
        style={{ display: 'none' }}
      >
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            data-menu-link
            className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
            onClick={closeMenu}
          >
            {label}
          </NavLink>
        ))}
        <NavLink
          to="/cart"
          data-menu-link
          className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
          onClick={closeMenu}
        >
          Cart {count > 0 && `(${count})`}
        </NavLink>
      </div>
    </>
  )
}
