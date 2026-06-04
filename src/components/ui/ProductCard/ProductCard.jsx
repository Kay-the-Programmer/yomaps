import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import Badge from '../Badge/Badge'
import ProductSVG from '../ProductSVG/ProductSVG'
import { getCategoryLabel, imageUrl } from '../../../lib/utils'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, onAddToCart }) {
  const cardRef = useRef(null)
  const imageRef = useRef(null)
  const addBtnRef = useRef(null)
  const navigate = useNavigate()

  const handleMouseEnter = () => {
    if (window.innerWidth < 1024) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.to(imageRef.current, { scale: 1.04, duration: 0.4, ease: 'power2.out' })
    gsap.to(addBtnRef.current, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
    gsap.to(cardRef.current, { borderColor: 'rgba(201, 168, 76, 0.5)', duration: 0.25 })
  }

  const handleMouseLeave = () => {
    if (window.innerWidth < 1024) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.to(imageRef.current, { scale: 1, duration: 0.4, ease: 'power2.inOut' })
    gsap.to(addBtnRef.current, { y: 12, opacity: 0, duration: 0.25, ease: 'power2.in' })
    gsap.to(cardRef.current, { borderColor: 'rgba(240, 236, 228, 0.08)', duration: 0.25 })
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    onAddToCart(product)
  }

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`)
  }

  const displayTags = (product.tags || []).filter((t) =>
    ['new', 'best-seller', 'limited', 'exclusive'].includes(t)
  )

  const primaryImage = product.images?.[0]

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <div className={styles.imageWrapper}>
        <div ref={imageRef} style={{ width: '100%', height: '100%' }}>
          {primaryImage ? (
            <img
              className={styles.photo}
              src={imageUrl(primaryImage)}
              alt={product.name}
              loading="lazy"
            />
          ) : (
            <ProductSVG category={product.category} name={product.name} />
          )}
        </div>
        {displayTags.length > 0 && (
          <div className={styles.badges}>
            {displayTags.map((tag) => (
              <Badge key={tag} type={tag} />
            ))}
          </div>
        )}
        <button
          ref={addBtnRef}
          className={styles.addBtn}
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
      <div className={styles.info}>
        <span className={styles.category}>{getCategoryLabel(product.category)}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.prices}>
          <span className={styles.priceZmw}>K{product.price_zmw.toLocaleString()}</span>
          <span className={styles.priceUsd}>${product.price_usd}</span>
        </div>
      </div>
    </div>
  )
}
