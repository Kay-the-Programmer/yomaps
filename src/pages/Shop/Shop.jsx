import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Helmet } from 'react-helmet-async'
import { getProducts } from '../../lib/api'
import { useCartStore, useToastStore } from '../../store/cartStore'
import { getCategoryLabel } from '../../lib/utils'
import ProductCard from '../../components/ui/ProductCard/ProductCard'
import SkeletonCard from '../../components/ui/SkeletonCard/SkeletonCard'
import styles from './Shop.module.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const CATEGORIES = ['apparel', 'headwear', 'accessories', 'lifestyle']
const SORTS = [
  { value: 'newest',      label: 'Newest' },
  { value: 'best_seller', label: 'Best Sellers' },
  { value: 'price_asc',   label: 'Price: Low → High' },
  { value: 'price_desc',  label: 'Price: High → Low' }
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const gridRef = useRef(null)
  const { addItem } = useCartStore()
  const { addToast } = useToastStore()

  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'newest'

  // Fetch the full catalogue for the current sort; category filtering is
  // client-side (cheap, and lets the grid re-render instantly).
  useEffect(() => {
    setLoading(true)
    getProducts({ sort, limit: 100 })
      .then((res) => setProducts(res.data.products || res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [sort])

  // Only the matching products are rendered. Toggling `display` on hidden cells
  // underneath a Flip animation used to race with React and scatter the grid;
  // rendering just the visible set keeps the layout deterministic.
  const visibleProducts = category === 'all'
    ? products
    : products.filter((p) => p.category === category)

  // Cards reveal via a pure-CSS keyframe (see .cell in Shop.module.css), staggered
  // by the --i index set in the render. CSS can't be interrupted by the Flip/skew
  // GSAP calls the way a JS tween could, so cards always settle fully visible.

  // Velocity-based skew on scroll, applied to the dedicated .skewElem inner
  // wrappers (never the cards themselves, so it can't fight the entrance tween).
  // Re-runs when the rendered set changes so it always targets live elements.
  useGSAP(() => {
    if (loading || visibleProducts.length === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = gridRef.current?.querySelectorAll('.skewElem')
    if (!targets || !targets.length) return

    const proxy = { skew: 0 }
    const skewSetter = gsap.quickSetter(targets, 'skewY', 'deg')
    const clamp = gsap.utils.clamp(-12, 12)

    gsap.set(targets, { transformOrigin: 'right center', force3D: true })

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = clamp(self.getVelocity() / -300)
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: 'power3',
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew)
          })
        }
      }
    })

    return () => {
      trigger.kill()
      gsap.set(targets, { clearProps: 'transform' })
    }
  }, [loading, products, category])

  const setFilter = (cat) => {
    if (cat === category) return
    const p = new URLSearchParams(searchParams)
    if (cat === 'all') p.delete('category')
    else p.set('category', cat)
    setSearchParams(p)
  }

  const setSort = (s) => {
    const p = new URLSearchParams(searchParams)
    p.set('sort', s)
    setSearchParams(p)
  }

  const handleAddToCart = (product) => {
    addItem(product, product.sizes?.[0] || null)
    addToast(`${product.name} added to cart`)
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Shop — Yo Maps Official Store</title>
        <meta name="description" content="Browse all official Yo Maps merchandise." />
      </Helmet>

      <div className={styles.header}>
        <h1 className={styles.title}>The Store</h1>
        <div className={styles.controls}>
          <div className={styles.filters} role="group" aria-label="Filter by category">
            <button
              className={`${styles.filterBtn} ${category === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${category === cat ? styles.active : ''}`}
                onClick={() => setFilter(cat)}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            {SORTS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div ref={gridRef} className={styles.grid}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleProducts.map((p, i) => (
              <div
                key={p._id || p.slug}
                data-card
                className={styles.cell}
                style={{ '--i': i }}
              >
                <div className={`${styles.skew} skewElem`}>
                  <ProductCard product={p} onAddToCart={handleAddToCart} />
                </div>
              </div>
            ))
        }
        {!loading && visibleProducts.length === 0 && (
          <p className={styles.empty}>No products found.</p>
        )}
      </div>
    </div>
  )
}
