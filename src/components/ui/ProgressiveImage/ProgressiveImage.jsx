import { useState } from 'react'
import styles from './ProgressiveImage.module.css'

/**
 * Blur-up image: shows a tiny blurred placeholder (lqip) instantly, then fades
 * in the full image once it loads. Falls back to a simple fade-in when no lqip
 * is supplied. Fills its parent (which should define the box size).
 */
export default function ProgressiveImage({ src, lqip, alt = '', loading = 'lazy' }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <span className={styles.wrap}>
      {lqip && (
        <img
          src={lqip}
          alt=""
          aria-hidden="true"
          className={`${styles.lqip} ${loaded ? styles.hidden : ''}`}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${styles.img} ${loaded ? styles.loaded : ''}`}
      />
    </span>
  )
}
