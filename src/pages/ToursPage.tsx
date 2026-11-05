import { Header } from '../components/home/Header'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { SiteFooter } from '../components/SiteFooter'
import { TourCard } from '../components/TourCard'
import { images } from '../data/images'
import { useTours } from '../hooks/useTours'
import { formatUsd } from '../utils/currency'

export function ToursPage() {
  const { data, loading, error } = useTours()
  const tourCards = data.map((tour) => ({
  slug: tour.slug,
  category: tour.category,
  duration: `${tour.durationDays} Days`,
  rating: String(tour.rating ?? 4.8),
  title: tour.title,
  price: formatUsd(tour.priceFromUsd),
  image: tour.mainImage,
  description: tour.shortDescription,
}))


  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <PageHero title="Our Tours" subtitle="Explore unforgettable safaris, custom holidays, guided tours, transfers, and travel support across Uganda and beyond." image={images.treeLions} />
      <main className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          {(loading || error || !tourCards.length) && <p role="status" className="mb-8 text-neutral-600">{loading ? 'Loading tours?' : error || 'New journeys are being prepared. Please contact us to plan your safari.'}</p>}
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {tourCards.map((tour, index) => (
              <Reveal key={tour.slug} delay={index * 70}>
                <TourCard tour={tour} />
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
