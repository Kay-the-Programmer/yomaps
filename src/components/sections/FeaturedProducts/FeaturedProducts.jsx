import { useEffect, useState } from 'react'
import { getProducts } from '../../../lib/api'
import { useCartStore, useToastStore } from '../../../store/cartStore'
import Slider from '../../ui/Slider/Slider'
import SkeletonCard from '../../ui/SkeletonCard/SkeletonCard'
import SectionHeading from '../../ui/SectionHeading/SectionHeading'
import styles from './FeaturedProducts.module.css'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()
  const { addToast } = useToastStore()

  useEffect(() => {
    getProducts({ sort: 'newest', limit: 12 })
      .then((res) => setProducts(res.data.products || res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const handleAddToCart = (product) => {
    const size = product.sizes?.[0] || null
    addItem(product, size)
    addToast(`${product.name} added to cart`)
  }

  return (
    <section className={styles.section}>
      <SectionHeading
        index="01"
        eyebrow="Fresh Off the Press"
        title="Latest Drops"
        actionLabel="View All"
        actionTo="/shop"
      />

      {loading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className={styles.sliderWrapper}>
          <Slider products={products} onAddToCart={handleAddToCart} />
        </div>
      )}
    </section>
  )
}
