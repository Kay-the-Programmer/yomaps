import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { getProducts } from '../../../lib/api'
import CategoryTile from '../../ui/CategoryTile/CategoryTile'
import SectionHeading from '../../ui/SectionHeading/SectionHeading'
import styles from './CategoryGrid.module.css'

const CATEGORIES = [
  { slug: 'apparel',     name: 'Apparel' },
  { slug: 'headwear',    name: 'Headwear' },
  { slug: 'accessories', name: 'Accessories' },
  { slug: 'lifestyle',   name: 'Lifestyle' }
]

export default function CategoryGrid() {
  const [counts, setCounts] = useState({})
  const gridRef = useRef(null)

  useEffect(() => {
    Promise.all(
      CATEGORIES.map(({ slug }) =>
        getProducts({ category: slug, limit: 1 })
          .then((res) => ({ slug, count: res.data.total || (res.data.products || res.data).length }))
          .catch(() => ({ slug, count: 0 }))
      )
    ).then((results) => {
      const map = {}
      results.forEach(({ slug, count }) => { map[slug] = count })
      setCounts(map)
    })
  }, [])

  useEffect(() => {
    if (!gridRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from(gridRef.current.querySelectorAll(':scope > *'), {
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power3.out'
      })
    }, gridRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.section}>
      <SectionHeading
        index="02"
        eyebrow="Find Your Fit"
        title="Browse by Category"
        actionLabel="Shop All"
        actionTo="/shop"
      />
      <div ref={gridRef} className={styles.grid}>
        {CATEGORIES.map(({ slug, name }, i) => (
          <CategoryTile
            key={slug}
            index={String(i + 1).padStart(2, '0')}
            slug={slug}
            name={name}
            count={counts[slug] ?? '—'}
          />
        ))}
      </div>
    </section>
  )
}
