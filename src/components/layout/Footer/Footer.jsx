import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

// lucide 1.x dropped brand logos — inline brand marks (currentColor).
const Instagram = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const Facebook = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)
const Youtube = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.42 8.59.42 8.59.42s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
)
const TikTok = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M16.5 5.6a4.9 4.9 0 0 1-1.16-2.6h-2.9v11.2a2.45 2.45 0 1 1-2.1-2.43V8.78a5.3 5.3 0 1 0 5 5.29V8.9a7.7 7.7 0 0 0 4.16 1.22V7.2a4.9 4.9 0 0 1-3-1.6z" />
  </svg>
)

/**
 * Official social profiles.
 * TODO: These are PLACEHOLDER URLs — replace each `url` with the verified
 * official Yo Maps account before launch. Unverified handles risk linking
 * fans to impersonator accounts.
 */
const SOCIAL_LINKS = [
  { label: 'Instagram', url: 'https://www.instagram.com/yomaps_official', Icon: Instagram },
  { label: 'Facebook',  url: 'https://www.facebook.com/YoMapsOfficial',   Icon: Facebook },
  { label: 'TikTok',    url: 'https://www.tiktok.com/@yomaps_official',    Icon: TikTok },
  { label: 'YouTube',   url: 'https://www.youtube.com/@YoMapsOfficial',    Icon: Youtube }
]

const STORE_LINKS = [
  { to: '/shop',            label: 'All Products' },
  { to: '/shop/apparel',    label: 'Apparel' },
  { to: '/shop/headwear',   label: 'Headwear' },
  { to: '/shop/lifestyle',  label: 'Lifestyle' }
]

const INFO_LINKS = [
  { to: '/about',          label: 'About Yo Maps' },
  { to: '/contact',        label: 'Contact' },
  { to: '/faq#shipping',   label: 'Shipping Policy' },
  { to: '/faq#returns',    label: 'Returns' },
  { to: '/faq',            label: 'FAQ' }
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Link to="/" className={styles.brand}>YO <span>MAPS</span></Link>
          <div className={styles.rule} />
          <p className={styles.tagline}>
            Official merchandise from Zambia's most-streamed artist.
            Every item is a piece of the journey.
          </p>
        </div>

        <div>
          <p className={styles.colTitle}>Store</p>
          <nav className={styles.links}>
            {STORE_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={styles.link}>{label}</Link>
            ))}
          </nav>
        </div>

        <div>
          <p className={styles.colTitle}>Info</p>
          <nav className={styles.links}>
            {INFO_LINKS.map(({ to, label }) => (
              <Link key={label} to={to} className={styles.link}>{label}</Link>
            ))}
          </nav>
        </div>

        <div>
          <p className={styles.colTitle}>Follow</p>
          <nav className={styles.links}>
            {SOCIAL_LINKS.map(({ label, url, Icon }) => (
              <a
                key={label}
                href={url}
                className={`${styles.link} ${styles.social}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Yo Maps — Olios Records. All rights reserved.</span>
        <span>Lusaka, Zambia · Ships Worldwide</span>
      </div>
    </footer>
  )
}
