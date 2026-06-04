import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { Helmet } from 'react-helmet-async'
import { getProducts } from '../../lib/api'
import { useCartStore, useToastStore } from '../../store/cartStore'
import { getCategoryLabel } from '../../lib/utils'
import ProductCard from '../../components/ui/ProductCard/ProductCard'
import SkeletonCard from '../../components/ui/SkeletonCard/SkeletonCard'
import styles from './Category.module.css'

export default function Category() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const gridRef = useRef(null)
  const heroRef = useRef(null)
  const { addItem } = useCartStore()
  const { addToast } = useToastStore()

  useEffect(() => {
    setLoading(true)
    getProducts({ category })
      .then((res) => setProducts(res.data.products || res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category])

  useEffect(() => {
    if (!heroRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current.querySelectorAll('h1, p'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }
      )
    })
    return () => ctx.revert()
  }, [category])

  useEffect(() => {
    if (loading || !gridRef.current) return
    const cards = gridRef.current.querySelectorAll(':scope > *')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !cards.length) return
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
        opacity: 0, y: 40, duration: 0.6, stagger: 0.08, ease: 'power3.out'
      })
    })
    return () => ctx.revert()
  }, [loading, products])

  const handleAddToCart = (product) => {
    addItem(product, product.sizes?.[0] || null)
    addToast(`${product.name} added to cart`)
  }

  const label = getCategoryLabel(category)

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{label} — Yo Maps Official Store</title>
      </Helmet>

      <div className={styles.hero} ref={heroRef}>
        <h1 className={styles.title}>{label}</h1>
        <p className={styles.count}>{!loading && `${products.length} items`}</p>
      </div>

      <div ref={gridRef} className={styles.grid}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p) => (
              <ProductCard key={p._id || p.slug} product={p} onAddToCart={handleAddToCart} />
            ))
        }
      </div>
    </div>
  )
}
