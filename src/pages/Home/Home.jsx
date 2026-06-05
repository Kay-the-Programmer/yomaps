import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useGSAP } from '@gsap/react'
import Hero from '../../components/sections/Hero/Hero'
import FeaturedProducts from '../../components/sections/FeaturedProducts/FeaturedProducts'
import CategoryGrid from '../../components/sections/CategoryGrid/CategoryGrid'
import ArtistBanner from '../../components/sections/ArtistBanner/ArtistBanner'
import NewsletterSection from './NewsletterSection'
import { stackingSlides } from '../../animations/stackingSlides'
import styles from './Home.module.css'

export default function Home() {
  const slidesRef = useRef(null)

  // Each slide below the hero pins, then scales down + fades as the next
  // slides up over it. The last slide (Newsletter) is the resting panel.
  useGSAP(() => stackingSlides(slidesRef.current), { scope: slidesRef })

  return (
    <>
      <Helmet>
        <title>Yo Maps Official Store — Wear the Vibe</title>
        <meta name="description" content="Official merchandise from Zambia's most-streamed artist. T-shirts, hoodies, caps, and lifestyle gear." />
      </Helmet>
      <div ref={slidesRef} className={styles.slidesWrapper}>
        <div data-slide className={`${styles.slide} ${styles.slideHero}`}>
          <div data-slide-inner className={styles.slideInner}>
            <Hero />
          </div>
        </div>
        <div data-slide className={styles.slide}>
          <div data-slide-inner className={styles.slideInner}>
            <FeaturedProducts />
          </div>
        </div>
        <div data-slide className={styles.slide}>
          <div data-slide-inner className={styles.slideInner}>
            <CategoryGrid />
          </div>
        </div>
        <div data-slide className={styles.slide}>
          <div data-slide-inner className={styles.slideInner}>
            <ArtistBanner />
          </div>
        </div>
        <div data-slide className={styles.slide}>
          <div data-slide-inner className={styles.slideInner}>
            <NewsletterSection />
          </div>
        </div>
      </div>
    </>
  )
}
