import { Helmet } from 'react-helmet-async'
import Hero from '../../components/sections/Hero/Hero'
import FeaturedProducts from '../../components/sections/FeaturedProducts/FeaturedProducts'
import CategoryGrid from '../../components/sections/CategoryGrid/CategoryGrid'
import ArtistBanner from '../../components/sections/ArtistBanner/ArtistBanner'
import NewsletterSection from './NewsletterSection'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Yo Maps Official Store — Wear the Vibe</title>
        <meta name="description" content="Official merchandise from Zambia's most-streamed artist. T-shirts, hoodies, caps, collectibles and exclusive drops." />
      </Helmet>
      <Hero />
      <FeaturedProducts />
      <CategoryGrid />
      <ArtistBanner />
      <NewsletterSection />
    </>
  )
}
