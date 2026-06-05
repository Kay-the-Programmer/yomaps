import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { Helmet } from 'react-helmet-async'
import { getProducts } from '../../lib/api'
import { useCartStore, useToastStore } from '../../store/cartStore'
import { getCategoryLabel } from '../../lib/utils'
import ProductCard from '../../components/ui/ProductCard/ProductCard'
import SkeletonCard from '../../components/ui/SkeletonCard/SkeletonCard'
import styles from './Shop.module.css'

gsap.registerPlugin(Flip)

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
  const flipState = useRef(null)
  const { addItem } = useCartStore()
  const { addToast } = useToastStore()

  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'newest'

  // Fetch the full catalogue for the current sort. Category filtering happens
  // client-side so Flip can animate the grid reflow.
  useEffect(() => {
    setLoading(true)
    getProducts({ sort, limit: 100 })
      .then((res) => setProducts(res.data.products || res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [sort])

  const matches = (p) => category === 'all' || p.category === category
  const visibleCount = products.filter(matches).length

  // Entrance fade for freshly fetched products (initial load / sort change).
  useEffect(() => {
    if (!loading && products.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll(':scope > [data-flip-card]')
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion || !cards.length) return

      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
      )
    }
  }, [loading, products])

  // Flip the grid whenever the category filter changes.
  useLayoutEffect(() => {
    const state = flipState.current
    if (!state) return
    flipState.current = null

    Flip.from(state, {
      duration: 0.7,
      scale: true,
      ease: 'power1.inOut',
      stagger: 0.05,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0, duration: 0.6 })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const setFilter = (cat) => {
    if (cat === category) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion && gridRef.current) {
      flipState.current = Flip.getState(
        gridRef.current.querySelectorAll(':scope > [data-flip-card]'),
        { props: 'opacity' }
      )
    }
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
          : products.map((p) => (
              <div
                key={p._id || p.slug}
                data-flip-card
                data-flip-id={p._id || p.slug}
                className={styles.cell}
                style={{ display: matches(p) ? '' : 'none' }}
              >
                <ProductCard product={p} onAddToCart={handleAddToCart} />
              </div>
            ))
        }
        {!loading && visibleCount === 0 && (
          <p className={styles.empty}>No products found.</p>
        )}
      </div>
    </div>
  )
}
