import { FiArrowRight, FiArrowUpRight, FiClock } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export type TourCardData = {
  title: string
  image: string
  rating: string
  price: string
  duration: string
  slug: string
  description?: string
  category?: string
}

export function TourCard({ tour }: { tour: TourCardData }) {
  const tourHref = `/tours/${tour.slug}`
  const description = tour.description ?? 'Experience a tailor-made journey with expert local guiding, memorable encounters, and seamless Top Cloud Rwenzori Adventures planning.'

  return (
    <Link className="tour-card group block cursor-pointer" to={tourHref} aria-label={`View ${tour.title}`}>
      <div className="tour-card-image-wrap">
        <img src={tour.image} alt={tour.title} loading="lazy" decoding="async" />
        <span className="tour-card-image-arrow" aria-hidden="true"><FiArrowUpRight /></span>
      </div>
      <div className="tour-card-body">
        <div className="tour-card-price">
          <span>{tour.price}</span>
        </div>
        <h3 className="tour-card-title">{tour.title}</h3>
        <p className="tour-card-description">{description}</p>
        <div className="tour-card-footer">
          <span className="tour-card-duration"><FiClock aria-hidden="true" /> {tour.duration}</span>
          <span className="tour-card-button">Book Now <FiArrowRight aria-hidden="true" /></span>
        </div>
      </div>
    </Link>
  )
}
