import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { Helmet } from 'react-helmet-async'
import { getProducts } from '../../lib/api'
import { useCartStore, useToastStore } from '../../store/cartStore'
import { getCategoryLabel } from '../../lib/utils'
import ProductCard from '../../components/ui/ProductCard/ProductCard'
import SkeletonCard from '../../components/ui/SkeletonCard/SkeletonCard'
import styles from './Shop.module.css'

const CATEGORIES = ['apparel', 'headwear', 'accessories', 'music', 'lifestyle', 'exclusive']
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

  useEffect(() => {
    setLoading(true)
    const params = { sort }
    if (category !== 'all') params.category = category

    getProducts(params)
      .then((res) => setProducts(res.data.products || res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category, sort])

  useEffect(() => {
    if (!loading && products.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll(':scope > *')
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion || !cards.length) return

      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
      )
    }
  }, [loading, products])

  const setFilter = (cat) => {
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
          : products.length === 0
            ? <p className={styles.empty}>No products found.</p>
            : products.map((p) => (
                <ProductCard key={p._id || p.slug} product={p} onAddToCart={handleAddToCart} />
              ))
        }
      </div>
    </div>
  )
}
