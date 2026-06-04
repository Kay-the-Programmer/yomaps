import { Link } from 'react-router-dom'
import { Shirt, Crown, Gem, Disc3, Coffee, Star, ArrowRight } from 'lucide-react'
import styles from './CategoryTile.module.css'

const ICONS = {
  apparel:     Shirt,
  headwear:    Crown,
  accessories: Gem,
  music:       Disc3,
  lifestyle:   Coffee,
  exclusive:   Star
}

export default function CategoryTile({ slug, name, count, index }) {
  const Icon = ICONS[slug] || Shirt
  return (
    <Link to={`/shop/${slug}`} className={styles.tile}>
      <span className={styles.line} aria-hidden="true" />
      {index && <span className={styles.index} aria-hidden="true">{index}</span>}
      <span className={styles.icon}><Icon size={26} strokeWidth={1.5} /></span>
      <span className={styles.name}>{name}</span>
      <span className={styles.count}>{count} items</span>
      <span className={styles.arrow} aria-hidden="true"><ArrowRight size={16} strokeWidth={1.75} /></span>
    </Link>
  )
}
