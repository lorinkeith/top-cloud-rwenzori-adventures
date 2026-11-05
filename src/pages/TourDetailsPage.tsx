import { useTour } from '../hooks/useTours'
import { trackTourPageViewQuietly, trackTourAnalyticsEventQuietly } from '../services/tourAnalyticsService'
import { TourRouteMap } from '../components/TourRouteMap'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { FiArrowRight, FiCheck, FiChevronDown, FiClock, FiGlobe, FiMapPin, FiShield, FiUsers } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import { BookingModal } from '../components/BookingModal'
import { Header } from '../components/home/Header'
import { Reveal } from '../components/Reveal'
import { SiteFooter } from '../components/SiteFooter'
import { type ItineraryDay, type Tour } from '../data/tours'
import { formatUsd } from '../utils/currency'

export function TourDetailsPage() {
  const { slug } = useParams()
  const { data: tour, loading, error } = useTour(slug)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => { if (tour?.id) trackTourPageViewQuietly(tour.id, slug || '') }, [tour?.id, slug])

  if (!tour) {
    return (
      <div className="min-h-screen bg-white text-neutral-950">
        <Header />
        <main className="mx-auto max-w-3xl px-5 py-24 text-center">
          <p className="section-eyebrow">Tour not found</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.02em]">{loading ? 'Loading your safari?' : error || 'We could not find that safari.'}</h1>
          <p className="mt-4 text-base leading-7 text-neutral-600">The itinerary may have moved, or our team may still be refining it.</p>
          <Link className="luxury-button mt-8" to="/tours">View All Tours</Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-neutral-950">
      <Header />
      <main>
        <TourTitle tour={tour} onBook={() => { trackTourAnalyticsEventQuietly(tour.id, 'book_now'); setIsBookingOpen(true) }} />
        <TourGallery tour={tour} />
        <TourInfoRow tour={tour} />
        <section className="border-t border-neutral-200 px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <AboutTour tour={tour} />
            <TourHighlights highlights={tour.highlights} />
            <ItineraryTimeline days={tour.itineraryDays} />
            <LocationSection tour={tour} />
          </div>
        </section>
      </main>
      <SiteFooter />
      <BookingModal isOpen={isBookingOpen} tour={tour} onClose={() => setIsBookingOpen(false)} />
    </div>
  )
}

function TourTitle({ tour, onBook }: { tour: Tour; onBook: () => void }) {
  return (
    <section className="px-5 pb-8 pt-12 sm:px-8 lg:pt-16">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="max-w-4xl text-[clamp(1.65rem,3.25vw,2.65rem)] font-semibold leading-tight tracking-[-0.03em] text-neutral-950">{tour.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-600">
            <span className="inline-flex items-center gap-1.5"><FiMapPin className="text-luxury-green" />{tour.location}</span>
          </div>
        </div>
        <button className="tour-booking-card-button shrink-0 rounded-full" type="button" onClick={onBook}>
          Book Now <FiArrowRight />
        </button>
      </Reveal>
    </section>
  )
}

function TourGallery({ tour }: { tour: Tour }) {
  const gallery = [tour.heroImage || tour.mainImage, ...tour.galleryImages].filter(Boolean).slice(0, 4)

  return (
    <section className="px-5 pb-8 sm:px-8">
      <Reveal className="tour-gallery mx-auto max-w-7xl">
        <img className="tour-gallery-main" src={gallery[0]} alt={tour.title} />
        <div className="tour-gallery-side">
          <img className="h-full min-h-0 rounded-2xl object-cover" src={gallery[1] ?? gallery[0]} alt={`${tour.title} gallery view`} />
          <img className="h-full min-h-0 rounded-2xl object-cover" src={gallery[2] ?? gallery[0]} alt={`${tour.title} gallery`} />
          <img className="h-full min-h-0 rounded-2xl object-cover" src={gallery[3] ?? gallery[0]} alt={`${tour.title} safari view`} />
        </div>
      </Reveal>
    </section>
  )
}

function TourInfoRow({ tour }: { tour: Tour }) {
  const items = [
    { label: 'Duration', value: `${tour.durationDays} Days`, icon: FiClock },
    { label: 'Type', value: tour.type ?? tour.category, icon: FiGlobe },
    { label: 'Group Size', value: tour.groupSize ?? 'Private Group', icon: FiUsers },
    { label: 'Language', value: tour.language ?? 'English', icon: FiShield },
  ]

  return (
    <section className="px-5 pb-10 sm:px-8">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_20px_70px_rgb(15_23_42_/_0.06)] lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-luxury-green/10 text-xl text-luxury-green"><Icon /></span>
              <span><span className="block text-xs font-medium text-neutral-500">{label}</span><strong className="text-base font-semibold text-neutral-950">{value}</strong></span>
            </div>
          ))}
        </div>
        <div className="border-t border-neutral-200 pt-4 text-left lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 lg:text-right">
          <span className="text-sm text-neutral-500">From</span>
          <p className="text-2xl font-semibold tracking-[-0.03em] text-luxury-green">{formatUsd(tour.priceFromUsd)} <span className="text-sm font-normal text-neutral-500">/ Person</span></p>
        </div>
      </Reveal>
    </section>
  )
}

function AboutTour({ tour }: { tour: Tour }) {
  return (
    <Reveal as="section" className="tour-detail-section">
      <h2>About This Tour</h2>
      <p>{tour.overview}</p>
    </Reveal>
  )
}

function TourHighlights({ highlights }: { highlights: string[] }) {
  return (
    <Reveal as="section" className="tour-detail-section">
      <h2>Trip Highlights</h2>
      <ul className="mt-5 grid gap-3">
        {highlights.map((highlight) => (
          <li key={highlight} className="flex gap-3 text-base leading-7 text-neutral-800">
            <span className="tour-highlight-icon"><FiCheck /></span>
            {highlight}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  const [activeDay, setActiveDay] = useState<number | null>(days[0]?.dayNumber ?? null)

  useEffect(() => {
    setActiveDay(days[0]?.dayNumber ?? null)
  }, [days])

  return (
    <Reveal as="section" className="tour-detail-section">
      <h2>Tour Plan</h2>
      <p className="mt-3">A natural day-by-day flow with space for scenic stops, family pacing, and guide-led wildlife moments.</p>
      <div className="mt-8 grid gap-7">
        {days.map((day, index) => (
          <TimelineDay
            key={`${day.dayNumber}-${day.title}`}
            day={day}
            isExpanded={activeDay === day.dayNumber}
            isLast={index === days.length - 1}
            delay={index * 80}
            onToggle={() => setActiveDay((current) => (current === day.dayNumber ? null : day.dayNumber))}
          />
        ))}
      </div>
    </Reveal>
  )
}

function TimelineDay({ day, isExpanded, isLast, delay, onToggle }: { day: ItineraryDay; isExpanded: boolean; isLast: boolean; delay: number; onToggle: () => void }) {
  const paddedDay = String(day.dayNumber).padStart(2, '0')
  const panelId = `itinerary-day-${day.dayNumber}`

  return (
    <Reveal className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6" delay={delay}>
      {!isLast && <span className="absolute left-[1.08rem] top-8 h-[calc(100%+1.75rem)] w-px bg-luxury-green/20 sm:left-[1.45rem]" />}
      <span className="relative z-10 mt-2 grid h-9 w-9 place-items-center rounded-full border-4 border-white bg-luxury-green text-xs font-black text-white shadow-[0_0_0_1px_rgb(0_107_31_/_0.18)] sm:h-11 sm:w-11">
        {paddedDay}
      </span>
      <article className="min-w-0 py-2 sm:py-3">
        <button
          className="flex w-full items-center justify-between gap-4 rounded-2xl px-0 py-1 text-left transition hover:text-luxury-green"
          type="button"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-neutral-950">{day.title}</h3>
          <FiChevronDown className={`shrink-0 text-2xl text-luxury-green transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        <div id={panelId} className={`itinerary-panel ${isExpanded ? 'itinerary-panel-open' : ''}`}>
          <div className="itinerary-panel-inner">
            <p className="text-base leading-7 text-neutral-600">{day.description ?? day.overview}</p>
            {day.accommodationName && <p className="mt-3 text-sm font-semibold text-neutral-700">Stay: <span className="font-normal text-neutral-600">{day.accommodationName}</span></p>}
            {day.activities.map((activity, index) => <p key={index} className="mt-3 text-sm leading-7 text-neutral-600"><strong>{activity.title}</strong>{activity.description && `: ${activity.description}`}</p>)}
            <DayImageCarousel images={day.images} title={day.title} />
          </div>
        </div>
      </article>
    </Reveal>
  )
}

function DayImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const dragStart = useRef<number | null>(null)

  useEffect(() => {
    if (isPaused || images.length <= 1) return
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 4000)
    return () => window.clearInterval(interval)
  }, [images.length, isPaused])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientX
    setIsPaused(true)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return
    const movement = event.clientX - dragStart.current
    if (Math.abs(movement) > 40) {
      setActiveIndex((current) => (movement < 0 ? (current + 1) % images.length : (current - 1 + images.length) % images.length))
    }
    dragStart.current = null
    setIsPaused(false)
  }

  return (
    <div className="mt-5 overflow-hidden" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => setIsPaused(false)}>
      <div className="day-carousel-track" style={{ transform: `translateX(calc(-${activeIndex} * (var(--day-slide-width) + 0.85rem)))` }}>
        {[...images, ...images].map((image, index) => <img key={`${image}-${index}`} className="day-carousel-image" src={image} alt={`${title} view ${index + 1}`} draggable={false} />)}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {images.map((image, index) => <button key={image} className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-7 bg-luxury-green' : 'w-2 bg-neutral-300'}`} type="button" aria-label={`Show ${title} image ${index + 1}`} onClick={() => setActiveIndex(index)} />)}
      </div>
    </div>
  )
}

function LocationSection({ tour }: { tour: Tour }) {
  return (
    <Reveal as="section" className="tour-detail-section border-b-0 pb-0">
      <h2>Location</h2>
      <p className="mt-3">{tour.locations?.length ? tour.locations.map(stop => stop.location_name).join(' → ') : 'Our planning base is Kampala, Uganda. Exact safari routing is confirmed during trip planning.'}</p>
      <div className="tour-map-frame">
        {tour.locations?.length ? <TourRouteMap locations={tour.locations} mapStyle={tour.mapStyle} title={tour.title} /> : <iframe
          title="Kampala Uganda map"
          src="https://www.google.com/maps?q=Kampala%2C%20Uganda&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />}
      </div>
    </Reveal>
  )
}
