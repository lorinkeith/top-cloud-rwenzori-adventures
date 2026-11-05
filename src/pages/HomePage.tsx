import { defaultHomeCustomization } from '../services/homeCustomizationDefaults'
import { hasSupabaseConfig } from '../lib/supabaseClient'
import { useWebsiteContent } from '../context/WebsiteContent'
import { useTours } from '../hooks/useTours'
import { formatUsd } from '../utils/currency'
import { heroPositionStyle } from '../utils/heroSlider'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { FaHandHoldingHeart, FaLeaf, FaSeedling, FaUsers as FaCommunity } from 'react-icons/fa'
import { FiArrowDown, FiArrowRight, FiArrowUp, FiBriefcase, FiCamera, FiCheck, FiChevronLeft, FiChevronRight, FiGlobe, FiMapPin, FiPhone, FiSun, FiTruck } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Header } from '../components/home/Header'
import { serviceGroups, tourPackages as staticTourPackages } from '../components/home/homeData'
import { Reveal } from '../components/Reveal'
import { SiteFooter } from '../components/SiteFooter'
import { TourCard } from '../components/TourCard'
import { images } from '../data/images'
import { useContact } from '../hooks/useContact'

const bespokeExperiences = [
  { title: 'SAFARI TRIPS', image: images.treeLions, href: '/tours' },
  { title: 'AIR TICKETING', image: images.elephants, href: '/contact' },
  { title: 'GORILLA TREKKING', image: images.gorillaHero, href: '/tours' },
  { title: 'AIRPORT TRANSFERS', image: images.elephants, href: '/contact' },
  { title: 'BEACH VACATIONS', image: images.elephant, href: '/tours' },
  { title: 'HONEYMOON PACKAGES', image: images.gorillaHero, href: '/tours' },
  { title: 'HOTEL RESERVATIONS', image: images.treeLions, href: '/contact' },
]

const galleryImage = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

const recentGalleryImages = [
  { src: images.elephants, alt: 'Elephant family in Uganda', className: 'recent-gallery-item-left' },
  { src: images.gorillaHero, alt: 'Mountain gorilla trekking moment in a lush forest', className: 'recent-gallery-item-stack-top' },
  { src: galleryImage('photo-1547471080-7cc2caa01a7e'), alt: 'Waterfall landscape during a scenic safari route', className: 'recent-gallery-item-stack-bottom' },
  { src: images.elephant, alt: 'Elephant wildlife encounter on safari', className: 'recent-gallery-item-tall' },
  { src: images.treeLions, alt: 'Tree climbing lions in Queen Elizabeth National Park', className: 'recent-gallery-item-stack-top' },
  { src: galleryImage('photo-1500530855697-b586d89ba3ee'), alt: 'Peaceful lake and mountain travel scenery', className: 'recent-gallery-item-stack-bottom' },
  { src: galleryImage('photo-1523805009345-7448845a9e53'), alt: 'Relaxed luxury lodge moment on a romantic safari escape', className: 'recent-gallery-item-right' },
]

const heroSlides = [
  {
    kicker: 'Your safari story begins here',
    title: 'Explore Sites & Beauties of Africa',
    description: 'Plan safaris, gorilla trekking, air ticketing, airport transfers, hotel reservations, car hire, and custom holidays with Top Cloud Rwenzori Adventures.',
    image: images.treeLions,
  },
  {
    kicker: 'Wild places, carefully planned',
    title: 'Gorilla Forest Encounters',
    description: 'Travel into Uganda\'s misty forests with local experts, refined pacing, and unforgettable primate moments shaped around your style.',
    image: images.gorillaHero,
  },
  {
    kicker: 'Private journeys with purpose',
    title: 'Flights, Stays, Safaris',
    description: 'Move from flight planning to ground transfers, lodging, tours, and travel consultancy with one attentive team.',
    image: images.elephant,
  },
]

const initiativeCards = [
  {
    title: 'Responsible Tourism',
    description: 'Ethical travel that protects nature and uplifts local culture.',
    icon: FaLeaf,
  },
  {
    title: 'Community Empowerment',
    description: 'Local partnerships that support skills and opportunity.',
    icon: FaCommunity,
  },
  {
    title: 'Conservation Support',
    description: 'Protecting wildlife habitats through responsible safari planning.',
    icon: FaHandHoldingHeart,
  },
  {
    title: 'Eco-Friendly Travel',
    description: 'Lower-impact journeys shaped with thoughtful operations.',
    icon: FaSeedling,
  },
]

export function HomePage() {
  const { content } = useWebsiteContent()
  const sections: Record<string, React.ReactNode> = {
    hero: <HeroSection />, story: <BespokeExperiencesShowcase />, services: <ServicesSection />,
    featuredTours: <FeaturedToursSection />, gallery: <RecentGallerySection />, signature: <ExperiencesSection />,
    why: <InitiativesSection />, journey: <FinalCTA />, reviews: <ReviewsSection />,
  }
  const order = [...new Set([...content.sectionOrder, ...Object.keys(sections)])]
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-950">
      <Header />
      {order.filter(key => !content.hiddenSections.includes(key)).map(key => <div key={key}>{sections[key]}</div>)}
      {!content.hiddenSections.includes('footer') && <SiteFooter />}
      <BackToTopButton />
    </div>
  )
}

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [timerResetKey, setTimerResetKey] = useState(0)
  const { hero, content } = useWebsiteContent()
  const slides = hero ? hero.slides.filter(item => item.is_active).map(item => ({
    kicker: item.pre_title, title: item.title, description: item.subtitle, image: item.image_url,
    button: item.button_text, href: item.button_url, position: item.text_position,
  })) : heroSlides.map(item => ({ ...item, button: content.hero.cta.text, href: content.hero.cta.href || '/tours', position: 'center-left' as const }))
  const count = slides.length
  const slide = slides[activeSlide % Math.max(count, 1)]
  const autoplay = hero?.autoplay ?? true
  const duration = hero?.duration_seconds ?? 5

  useEffect(() => {
    if (!autoplay || count < 2) return
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % Math.max(count, 1))
    }, duration * 1000)

    return () => window.clearInterval(interval)
  }, [timerResetKey, count, autoplay, duration])

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % Math.max(count, 1))
    setTimerResetKey((current) => current + 1)
  }

  const previousSlide = () => {
    setActiveSlide((current) => (current - 1 + Math.max(count, 1)) % Math.max(count, 1))
    setTimerResetKey((current) => current + 1)
  }

  if (!slide) return null

  return (
    <section id="home" className="home-hero relative isolate bg-black px-5 text-white sm:px-8">
      {slides.map((item, index) => (
        <img
          key={item.title}
          className={`home-hero-slide absolute inset-0 -z-20 h-full w-full object-cover ${index === activeSlide % count ? 'home-hero-slide-active' : ''}`}
          src={item.image}
          alt={item.title}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(0_0_0_/_0.7),rgb(0_40_20_/_0.46)_48%,rgb(0_0_0_/_0.58)),linear-gradient(180deg,rgb(0_0_0_/_0.18),rgb(0_0_0_/_0.5))]" />
      <div style={hero ? { alignItems: slide.position.endsWith('right') ? 'flex-end' : slide.position.endsWith('left') ? 'flex-start' : 'center', justifyContent: slide.position.startsWith('top') ? 'flex-start' : slide.position.startsWith('bottom') ? 'flex-end' : 'center', flexDirection: 'column' } : undefined} className="mx-auto flex min-h-[640px] max-w-7xl items-center pb-28 pt-20 sm:min-h-[680px] lg:min-h-[720px] lg:pb-32">
        <div key={slide.title} style={hero ? { textAlign: heroPositionStyle(slide.position).textAlign, marginLeft: slide.position.endsWith('right') ? 'auto' : undefined, marginRight: slide.position.endsWith('left') ? 'auto' : undefined } : undefined} className="hero-copy max-w-3xl text-left">
          <p className="font-['Allura',cursive] text-[clamp(1.75rem,3.5vw,2.55rem)] leading-none text-white">{slide.kicker}</p>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.55rem,5.8vw,4.9rem)] font-black leading-[1.05] tracking-[-0.04em] text-white">{slide.title}</h1>
          <p className="mt-6 max-w-2xl text-[0.96rem] leading-8 text-white/75">{slide.description}</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            {slide.button && slide.href && <a className="hero-button hero-button-primary" href={slide.href}>{slide.button} <FiArrowRight /></a>}
          </div>
        </div>
      </div>
      <HeroSliderControls activeIndex={activeSlide % count} count={count} onNext={nextSlide} onPrevious={previousSlide} />
    </section>
  )
}

function BackToTopButton() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const updateBackToTop = () => {
      const hero = document.getElementById('home')
      const threshold = hero ? hero.offsetTop + hero.offsetHeight - 80 : 520
      setShowBackToTop(window.scrollY > threshold)
    }

    updateBackToTop()
    window.addEventListener('scroll', updateBackToTop, { passive: true })
    window.addEventListener('resize', updateBackToTop)
    return () => {
      window.removeEventListener('scroll', updateBackToTop)
      window.removeEventListener('resize', updateBackToTop)
    }
  }, [])

  return (
    <button className={`hero-scroll-top ${showBackToTop ? 'hero-scroll-top-visible' : ''}`} type="button" aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <FiArrowUp />
    </button>
  )
}

function HeroSliderControls({ activeIndex, count, onNext, onPrevious }: { activeIndex: number; count: number; onNext: () => void; onPrevious: () => void }) {
  return (
    <div className="hero-slider-controls" aria-label="Hero slides">
      <button type="button" aria-label="Previous hero slide" onClick={onPrevious}><FiArrowUp /></button>
      <span className="hero-slider-lines" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <i key={index} className={index === activeIndex ? 'hero-slider-indicator-active' : ''} />
        ))}
      </span>
      <button type="button" aria-label="Next hero slide" onClick={onNext}><FiArrowDown /></button>
    </div>
  )
}

function BespokeExperiencesShowcase() {
  const { content } = useWebsiteContent()
  const [visibleCount, setVisibleCount] = useState(3)
  const bufferCount = Math.min(bespokeExperiences.length, visibleCount + 1)
  const slideCount = bespokeExperiences.length
  const [activeIndex, setActiveIndex] = useState(() => Math.min(bespokeExperiences.length, 4))
  const [isPaused, setIsPaused] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const dragStart = useRef<number | null>(null)
  const carouselItems = useMemo(() => {
    const cloneCount = Math.min(bespokeExperiences.length, visibleCount + 1)
    return [
      ...bespokeExperiences.slice(-cloneCount),
      ...bespokeExperiences,
      ...bespokeExperiences.slice(0, cloneCount),
    ]
  }, [visibleCount])

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) setVisibleCount(1)
      else if (window.innerWidth < 1024) setVisibleCount(2)
      else setVisibleCount(3)
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  useEffect(() => {
    setIsResetting(true)
    setActiveIndex(bufferCount)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsResetting(false))
    })
  }, [bufferCount])

  useEffect(() => {
    if (isPaused) return
    const interval = window.setInterval(() => {
      setActiveIndex((current) => current + 1)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [isPaused])

  useEffect(() => {
    const firstTrailingClone = bufferCount + slideCount
    if (activeIndex < firstTrailingClone) return

    const timeout = window.setTimeout(() => {
      setIsResetting(true)
      setActiveIndex(bufferCount)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsResetting(false))
      })
    }, 780)

    return () => window.clearTimeout(timeout)
  }, [activeIndex, bufferCount, slideCount])

  useEffect(() => {
    if (activeIndex >= bufferCount) return

    const timeout = window.setTimeout(() => {
      setIsResetting(true)
      setActiveIndex(slideCount + bufferCount - 1)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsResetting(false))
      })
    }, 780)

    return () => window.clearTimeout(timeout)
  }, [activeIndex, bufferCount, slideCount])

  const nextExperience = () => {
    setIsPaused(true)
    setActiveIndex((current) => current + 1)
    window.setTimeout(() => setIsPaused(false), 1200)
  }

  const previousExperience = () => {
    setIsPaused(true)
    setActiveIndex((current) => current - 1)
    window.setTimeout(() => setIsPaused(false), 1200)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientX
    setIsPaused(true)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return
    const movement = event.clientX - dragStart.current
    if (Math.abs(movement) > 42) {
      if (movement < 0) {
        setActiveIndex((current) => current + 1)
      } else {
        setActiveIndex((current) => current - 1)
      }
    }
    dragStart.current = null
    setIsPaused(false)
  }

  return (
    <section className="bespoke-showcase-section px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.31fr_0.69fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="text-lg font-medium text-luxury-green">{content.story.label}</p>
          <h2 className="mt-5 text-[clamp(2.1rem,4vw,2.85rem)] font-bold uppercase leading-[1.15] tracking-[0.14em] text-[#20302b]">{content.story.title}</h2>
          <p className="mt-6 text-[0.95rem] leading-8 text-neutral-600">{content.story.paragraphs.join('\n\n')}</p>
          {JSON.stringify(content.story.badges) !== JSON.stringify(defaultHomeCustomization.story.badges) && content.story.badges.length > 0 && <div className="mt-4 flex gap-3">{content.story.badges.map((badge,index) => <a key={index} href={badge.href}><img src={badge.src} alt={badge.alt} className="h-14 object-contain" /></a>)}</div>}
          <Link className="bespoke-outline-button mt-8" to="/tours">All Experiences</Link>
        </Reveal>

        <Reveal className="min-w-0" delay={120}>
          <div className="bespoke-carousel-shell">
            <div
              className="bespoke-carousel-viewport"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => setIsPaused(false)}
            >
              <div
                className={`bespoke-carousel-track ${isResetting ? 'bespoke-carousel-track-reset' : ''}`}
                style={{
                  '--bespoke-visible': visibleCount,
                  transform: `translateX(calc(-${activeIndex} * var(--bespoke-slide-size)))`,
                } as CSSProperties}
              >
                {carouselItems.map((experience, index) => (
                  <Link key={`${experience.title}-${index}`} className="bespoke-experience-card" to={experience.href}>
                    <img src={experience.image} alt={experience.title} draggable={false} />
                    <span className="bespoke-experience-overlay" />
                    <span className="bespoke-experience-title">{experience.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bespoke-carousel-arrows">
              <button type="button" aria-label="Previous experience" onClick={previousExperience}><FiChevronLeft /></button>
              <button type="button" aria-label="Next experience" onClick={nextExperience}><FiChevronRight /></button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const serviceIcons = [FiTruck, FiGlobe, FiSun, FiBriefcase]
const servicePresentation = [
  { title: 'Travel essentials', label: 'Every detail, taken care of', action: 'Plan your journey', href: '/contact' },
  { title: 'Wildlife & safaris', label: 'A little closer to the wild', action: 'Explore our safaris', href: '/tours' },
  { title: 'Coastal escapes', label: 'Slow down. Discover more.', action: 'Find your escape', href: '/contact' },
  { title: 'Stays & reservations', label: 'Arrive with peace of mind', action: 'Talk to our team', href: '/contact' },
]

function ServicesSection() {
  return (
    <section id="services" className="services-section px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Our Services"
          title="Simple Travel Support"
          body="Top Cloud Rwenzori Adventures keeps planning clear and complete, with practical services and memorable trips arranged through one attentive team."
        />
        <div className="services-grid mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {serviceGroups.map((group, index) => {
            const Icon = serviceIcons[index] ?? FiCamera
            const presentation = servicePresentation[index]
            return (
              <Reveal key={group.title} delay={index * 70}>
                <article className={`service-card service-card--${index}`}>
                  <div className="service-card-art" aria-hidden="true">
                    <span className="service-card-number">0{index + 1}</span>
                    <span className="service-card-orbit" />
                    <span className="service-card-icon"><Icon /></span>
                    <span className="service-card-art-label">{presentation.label}</span>
                  </div>
                  <div className="service-card-content">
                    <h3>{presentation.title}</h3>
                    <p>{group.description}</p>
                    <ul className="service-chip-list" aria-label={`${group.title} services`}>
                      {group.services.map((service) => <li key={service}><FiCheck aria-hidden="true" />{service}</li>)}
                    </ul>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FeaturedToursSection() {
  const { content } = useWebsiteContent()
  const { data, loading, error } = useTours()
  const tourPackages = !hasSupabaseConfig ? staticTourPackages : data.map(tour => ({ slug: tour.slug, title: tour.title, category: tour.category, duration: `${tour.durationDays} Days`, price: formatUsd(tour.priceFromUsd), image: tour.mainImage, rating: String(tour.rating || 4.8), description: tour.shortDescription }))
  return (
    <section id="featured-safaris" className="bg-luxury-cream px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow={content.featuredTours.label}
          title={content.featuredTours.title}
          body={content.featuredTours.description}
        />
        {(loading || error) && <p role="status" className="mt-8 text-center text-neutral-600">{loading ? 'Loading tours?' : error}</p>}
        <div className="mt-12 grid items-stretch gap-8 md:grid-cols-2 xl:grid-cols-3">
          {tourPackages.slice(0, 6).map((tour, index) => (
            <Reveal key={tour.slug} delay={index * 70}>
              <TourCard tour={tour} />
            </Reveal>
          ))}
        </div>
        <Reveal className="featured-tours-cta" delay={120}>
          <Link className="featured-tours-button" to="/tours">
            Explore More Tours <FiArrowRight />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function RecentGallerySection() {
  const { content, published } = useWebsiteContent()
  const galleryImages = published ? content.gallery.images.map((item,index) => ({ ...item, className: recentGalleryImages[index % recentGalleryImages.length].className })) : recentGalleryImages
  return (
    <section id="destinations" className="recent-gallery-section px-5 sm:px-8">
      <span className="recent-gallery-line recent-gallery-line-top" aria-hidden="true" />
      <span className="recent-gallery-line recent-gallery-line-bottom" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[1280px]">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="recent-gallery-subtitle">{content.gallery.label}</p>
          <h2 className="recent-gallery-title">{content.gallery.title}</h2>
          {content.gallery.description && <p className="mt-4 text-neutral-600">{content.gallery.description}</p>}
        </Reveal>

        <div className="recent-gallery-grid">
          {galleryImages.map((image, index) => (
            <Reveal key={`${image.alt}-${index}`} className={`recent-gallery-frame ${image.className}`} delay={index * 70}>
              <img src={image.src} alt={image.alt} loading="lazy" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperiencesSection() {
  const { content } = useWebsiteContent()
  const photoChoices = ['/brand/gorilla-hero.jpg', '/brand/tree-lions.jpg', '/brand/ele.jpg', '/brand/elephants-sunset.jpeg', '/brand/elephant.jpg', '/brand/gorilla-forest.jpg']
  const usedPhotos = new Set<string>()
  const experienceCards = content.signature.items.map((item, index) => {
    let image = item.icon?.src || photoChoices[index % photoChoices.length]
    if (usedPhotos.has(image)) {
      image = [photoChoices[index % photoChoices.length], ...photoChoices].find(photo => !usedPhotos.has(photo)) || image
    }
    usedPhotos.add(image)
    return { title: item.title, description: item.text, image }
  })
  return (
    <section id="experiences" className="bg-luxury-black px-5 py-20 text-white sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Beyond ordinary tours" title={content.signature.title} body={content.signature.description} dark />
        {content.signature.image.src !== defaultHomeCustomization.signature.image.src && <img src={content.signature.image.src} alt={content.signature.image.alt} className="mx-auto mt-6 h-40 rounded-2xl object-cover" />}
        {content.signature.founderName && <p className="mt-6 text-center">{content.signature.founderName} {content.signature.founderRole}</p>}
        <div className="experiences-card-grid mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experienceCards.map((card, index) => <Reveal key={card.title} delay={index * 70}><ImageOverlayCard {...card} className="h-[310px]" /></Reveal>)}
        </div>
      </div>
    </section>
  )
}

function InitiativesSection() {
  const { content } = useWebsiteContent()
  return (
    <section className="initiatives-section">
      <div className="initiatives-container">
        <Reveal className="initiatives-heading">
          <p className="initiatives-script">{content.why.label}</p>
          <h2>{content.why.title}</h2>
          <span className="initiatives-accent" aria-hidden="true" />
          <p>{content.why.description}</p>
        </Reveal>

        <div className="initiatives-grid">
          {content.why.cards.map((initiative, index) => (
            <Reveal key={initiative.title} as="article" className="initiative-card" delay={140 + index * 90}>
              <span className="initiative-rule" aria-hidden="true" />
              <span className="initiative-icon" aria-hidden="true">
                {initiative.icon?.src ? <img src={initiative.icon.src} alt={initiative.icon.alt} /> : (() => { const Icon = initiativeCards[index % initiativeCards.length].icon; return <Icon /> })()}
              </span>
              <h3>{initiative.title}</h3>
              <p>{initiative.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  const { content } = useWebsiteContent()
  const { phoneDisplay, phoneHref } = useContact()
  return (
    <section className="relative overflow-hidden bg-luxury-green px-5 py-20 text-white sm:px-8">
      <img className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply" src={content.journey.image.src} alt={content.journey.image.alt} />
      <div className="absolute inset-0 bg-luxury-green/75" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/72">{content.journey.label}</p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.35rem)] font-black uppercase leading-tight tracking-[0.1em]">{content.journey.title}</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/76">{content.journey.description}</p>
          {content.journey.thumbnail.src !== defaultHomeCustomization.journey.thumbnail.src && <img src={content.journey.thumbnail.src} alt={content.journey.thumbnail.alt} className="mt-4 h-24 rounded-xl object-cover" />}
        </Reveal>
        <Reveal className="grid gap-0 overflow-hidden border border-white/22 sm:grid-cols-2" delay={120}>
          <a className="flex min-h-28 items-center gap-4 p-6 transition hover:bg-white/10" href={phoneHref}><FiPhone className="text-2xl" /><span><span className="block text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/62">Talk to our experts</span><strong>{phoneDisplay}</strong></span></a>
          <Link className="flex min-h-28 items-center gap-4 border-t border-white/22 p-6 transition hover:bg-white/10 sm:border-l sm:border-t-0" to={content.journey.cta.href || '/contact'}><FiMapPin className="text-2xl" /><span><span className="block text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/62">Enquire now</span><strong>{content.journey.cta.text}</strong></span></Link>
        </Reveal>
      </div>
    </section>
  )
}

function SectionIntro({ eyebrow, title, body, dark = false }: { eyebrow: string; title: string; body: string; dark?: boolean }) {
  return (
    <Reveal className="mx-auto max-w-4xl text-center">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className={`section-title mt-3 ${dark ? 'text-white' : 'text-neutral-950'}`}>{title}</h2>
      <p className={`mx-auto mt-5 max-w-3xl text-sm leading-7 ${dark ? 'text-white/62' : 'text-neutral-600'}`}>{body}</p>
    </Reveal>
  )
}

function ImageOverlayCard({ title, image, description, className }: { title: string; image: string; description?: string; className?: string }) {
  return (
    <article className={`group relative overflow-hidden rounded-sm bg-black ${className ?? ''}`}>
      <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={image} alt={title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5">
        <FiMapPin className="mb-2 text-xl text-luxury-bright" />
        <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">{title}</h3>
        {description && <p className="mt-3 text-sm text-white/80">{description}</p>}
      </div>
    </article>
  )
}

function ReviewsSection() {
 const { content, reviews } = useWebsiteContent()
 if (!reviews.length) return null
 return <section className="bg-luxury-cream px-5 py-20 sm:px-8"><div className="mx-auto max-w-7xl"><SectionIntro eyebrow="Traveler Reviews" title={content.reviews.title} body={content.reviews.description} /><div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">{reviews.map(review => <article key={review.id} className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-luxury-green">{'?'.repeat(Math.max(0,Math.min(5,review.rating || 0)))}</p><p className="mt-4 text-sm leading-7 text-neutral-600">{review.review_text}</p><strong className="mt-4 block">{review.author_name}</strong></article>)}</div></div></section>
}
