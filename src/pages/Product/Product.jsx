import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Helmet } from 'react-helmet-async'
import { getProduct } from '../../lib/api'
import { useCartStore, useToastStore } from '../../store/cartStore'
import ProductSVG from '../../components/ui/ProductSVG/ProductSVG'
import SizeSelector from '../../components/ui/SizeSelector/SizeSelector'
import QuantitySelector from '../../components/ui/QuantitySelector/QuantitySelector'
import Badge from '../../components/ui/Badge/Badge'
import Button from '../../components/ui/Button/Button'
import ProductCard from '../../components/ui/ProductCard/ProductCard'
import { getCategoryLabel, imageUrl } from '../../lib/utils'
import styles from './Product.module.css'

export default function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const imageRef = useRef(null)
  const contentRef = useRef(null)
  const relatedRef = useRef(null)
  const { addItem } = useCartStore()
  const { addToast } = useToastStore()

  useEffect(() => {
    setLoading(true)
    setSelectedSize(null)
    setQuantity(1)
    setSizeError(false)
    setActiveImage(0)
    getProduct(slug)
      .then((res) => {
        setProduct(res.data.product || res.data)
        setRelated(res.data.related || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!product) return
    if (product.sizes?.length) setSelectedSize(product.sizes[0])

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' })
      }
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.querySelectorAll('h1, p, [data-anim]'),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
        )
      }
    })
    return () => ctx.revert()
  }, [product])

  useEffect(() => {
    if (!related.length || !relatedRef.current) return
    const cards = relatedRef.current.querySelectorAll(':scope > *')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !cards.length) return

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        scrollTrigger: { trigger: relatedRef.current, start: 'top 82%' },
        opacity: 0, y: 40, duration: 0.6, stagger: 0.08, ease: 'power3.out'
      })
    })
    return () => ctx.revert()
  }, [related])

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    addItem(product, selectedSize, quantity)
    addToast(`${product.name} added to cart`)
  }

  const handleRelatedAdd = (p) => {
    addItem(p, p.sizes?.[0] || null)
    addToast(`${p.name} added to cart`)
  }

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.loading}>Loading product…</div>
    </div>
  )

  if (!product) return (
    <div className={styles.page}>
      <p className={styles.loading}>Product not found. <Link to="/shop">Back to shop →</Link></p>
    </div>
  )

  const displayTags = (product.tags || []).filter((t) =>
    ['new', 'best-seller', 'limited', 'exclusive'].includes(t)
  )

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{product.name} — Yo Maps Official Store</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link>
        <span aria-hidden="true"> / </span>
        <Link to={`/shop/${product.category}`}>{getCategoryLabel(product.category)}</Link>
        <span aria-hidden="true"> / </span>
        <span>{product.name}</span>
      </nav>

      <div className={styles.layout}>
        <div ref={imageRef} className={styles.imageCol}>
          <div className={styles.imageWrap}>
            {product.images?.length ? (
              <img
                className={styles.photo}
                src={imageUrl(product.images[activeImage] || product.images[0])}
                alt={product.name}
              />
            ) : (
              <ProductSVG category={product.category} name={product.name} />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className={styles.thumbs}>
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={imageUrl(img)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          {displayTags.length > 0 && (
            <div className={styles.tags}>
              {displayTags.map((t) => <Badge key={t} type={t} />)}
            </div>
          )}
        </div>

        <div ref={contentRef} className={styles.infoCol}>
          <p className={styles.category} data-anim>{getCategoryLabel(product.category)}</p>
          <h1 className={styles.name}>{product.name}</h1>
          {product.album && (
            <p className={styles.album} data-anim>From: {product.album}</p>
          )}

          <div className={styles.prices} data-anim>
            <span className={styles.priceZmw}>K{product.price_zmw.toLocaleString()}</span>
            <span className={styles.priceUsd}>${product.price_usd}</span>
          </div>

          <p className={styles.description} data-anim>{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className={styles.sizeSection} data-anim>
              <div className={styles.sizeHeader}>
                <span className={styles.label}>Size</span>
                {selectedSize && <span className={styles.selectedSize}>{selectedSize}</span>}
              </div>
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onChange={(s) => { setSelectedSize(s); setSizeError(false) }}
              />
              {sizeError && <p className={styles.sizeError}>Please select a size</p>}
            </div>
          )}

          <div className={styles.quantitySection} data-anim>
            <span className={styles.label}>Quantity</span>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={product.stock_count || 99}
            />
          </div>

          <div className={styles.actions} data-anim>
            <Button variant="primary" size="lg" onClick={handleAddToCart} style={{ flex: 1 }}>
              Add to Cart
            </Button>
            <Button
              variant="secondary"
              size="lg"
              style={{ flex: 1 }}
              onClick={() => {
                if (product.sizes?.length && !selectedSize) { setSizeError(true); return }
                setSizeError(false)
                addItem(product, selectedSize, quantity)
                navigate('/checkout')
              }}
            >
              Buy Now
            </Button>
          </div>

          {!product.in_stock && (
            <p className={styles.outOfStock}>Currently out of stock</p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className={styles.related}>
          <h2 className={styles.relatedTitle}>You May Also Like</h2>
          <div ref={relatedRef} className={styles.relatedGrid}>
            {related.map((p) => (
              <ProductCard key={p._id || p.slug} product={p} onAddToCart={handleRelatedAdd} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
