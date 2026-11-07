import { FaWhatsapp } from 'react-icons/fa'
import { FiCheck, FiCompass, FiMapPin, FiPhoneCall, FiShield, FiSunrise } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { Header } from '../components/home/Header'
import { Reveal } from '../components/Reveal'
import { SiteFooter } from '../components/SiteFooter'
import { images } from '../data/images'
import { useContact } from '../hooks/useContact'
import { travelServices } from '../data/services'

const whyPoints = [
  'Tailor-made journeys shaped around your dates, pace, interests, comfort level, and budget.',
  'Thoughtful planning for air ticketing, transfers, gorilla trekking, wildlife drives, culture, hotels, lakes, and landscapes.',
  'Clear support before and during the journey so flights, routing, transport, stays, and activities feel well prepared.',
]

const planningSteps = [
  'We listen to your travel style.',
  'We recommend the right route.',
  'We refine lodges and pacing.',
  'We support the full journey.',
]

const expertisePoints = [
  'Uganda parks, seasons, and route knowledge.',
  'Flight routing, hotel, activity, and transport recommendations that fit your travel style.',
  'Practical support for smooth safari days, airport transfers, corporate travel, and private holidays.',
]

const experiences = [
  { alt: 'Gorilla trekking safari experience', image: images.gorillaHero },
  { alt: 'Tree climbing lions on safari', image: images.treeLions },
  { alt: 'Elephant wildlife safari encounter', image: images.elephant },
  { alt: 'Elephant family on safari', image: images.elephants },
  { alt: 'Forest gorilla travel moment', image: images.gorillaHero },
  { alt: 'East African savannah wildlife safari', image: images.elephant },
]

export function AboutPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-neutral-950">
      <Header />
      <AboutHero />
      <main>
        <StorySection />
        <ServicesSection />
        <WhyTravelSection />
        <PlanningSection />
        <LocalExpertiseSection />
        <ExperiencesSection />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  )
}

function AboutHero() {
  return (
    <section className="relative grid min-h-[420px] place-items-center overflow-hidden bg-black px-5 py-24 text-center text-white">
      <img className="absolute inset-0 h-full w-full object-cover opacity-62" src={images.elephants} alt="" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0_/_0.78),rgb(0_0_0_/_0.44))]" />
      <Reveal className="relative z-10 mx-auto max-w-4xl">
        <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-black uppercase leading-tight tracking-[0.1em] text-white">About Us</h1>
      </Reveal>
    </section>
  )
}

function StorySection() {
  return (
    <section className="bg-[#fbf7ef] px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <p className="text-left text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#007a24]">Our Story</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.6vw,2.85rem)] font-black uppercase leading-[1.12] tracking-[0.1em] text-[#102d23]">Built Around Complete Travel Planning</h2>
          <div className="mt-6 max-w-2xl space-y-5 text-sm leading-8 text-[#5e6761]">
            <p>Top Cloud Rwenzori Adventures creates complete travel experiences across Uganda and Africa. We design trips around each traveler&apos;s pace, interests, comfort level, flight needs, transfers, and dream moments.</p>
            <p>We offer air ticketing, safaris, tours, passport and visa services, hotels, travel insurance, and more. From the first flight to the final stay, we help bring the practical details together. Explore the world with us!</p>
            <p><a className="font-bold text-luxury-green underline underline-offset-4" href="https://www.safaribookings.com/" target="_blank" rel="noopener noreferrer">Safaribookings</a></p>
          </div>
          <Link className="luxury-button mt-8" to="/tours">Explore Tours</Link>
        </Reveal>

        <Reveal delay={120}>
          <img className="h-[300px] w-full rounded-[1.45rem] object-cover shadow-[0_24px_70px_rgb(16_45_35_/_0.14)] sm:h-[390px] lg:h-[480px]" src={images.gorillaHero} alt="Mountain gorilla trekking in Uganda" />
        </Reveal>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-8 bg-white px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="about-services-heading">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">Our Services</p>
          <h2 id="about-services-heading" className="section-title mt-4 text-[#102d23]">Your Journey, Thoughtfully Arranged</h2>
          <p className="mt-5 text-sm leading-7 text-[#5e6761]">From everyday travel essentials to unforgettable adventures, our team helps you plan each part of your journey with care.</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {travelServices.map(({ title, description, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 60} className="h-full">
              <article className="flex h-full flex-col rounded-[1.35rem] border border-neutral-200 bg-luxury-cream p-7 transition hover:border-luxury-green/40 hover:shadow-[0_18px_45px_rgb(16_45_35_/_0.08)]">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-luxury-green text-xl text-white"><Icon aria-hidden="true" /></span>
                <h3 className="mt-5 text-lg font-extrabold text-[#102d23]">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[#5e6761]">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-7 text-[#5e6761]">Need something more? We also help with airport transfers, car hire, and personalised travel planning. <Link className="font-bold text-luxury-green underline-offset-4 hover:underline" to="/contact">Tell us what you have in mind.</Link></p>
      </div>
    </section>
  )
}

function WhyTravelSection() {
  return (
    <section className="bg-[#050505] px-5 py-20 text-white sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
        <Reveal>
          <img className="h-[320px] w-full rounded-[1.45rem] object-cover shadow-[0_26px_70px_rgb(0_0_0_/_0.28)] sm:h-[420px] lg:h-full lg:min-h-[540px]" src={images.treeLions} alt="Tree climbing lions on safari" />
        </Reveal>

        <Reveal className="flex flex-col justify-center" delay={120}>
          <p className="text-left text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#ffe81f]">Why Travel With Us</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.6vw,2.85rem)] font-black uppercase leading-[1.12] tracking-[0.1em] text-white">Thoughtful Journeys, Practical Travel Care</h2>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-white/68">We combine local knowledge, careful coordination, and a passion for unforgettable travel experiences. Every route, ticket, transfer, stay, and activity is shaped to feel personal, comfortable, and memorable.</p>
          <div className="mt-10 grid gap-6">
            {whyPoints.map((point, index) => (
              <div key={point} className="flex gap-4">
                <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#007a24] text-sm text-white">{index === 0 ? <FiCompass /> : index === 1 ? <FiSunrise /> : <FiShield />}</span>
                <p className="text-sm leading-7 text-white/72">{point}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function PlanningSection() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <p className="text-left text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#007a24]">Tailor-Made Planning</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.6vw,2.85rem)] font-black uppercase leading-[1.12] tracking-[0.1em] text-[#102d23]">Designed Around You</h2>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-[#5e6761]">No two travelers are the same. We listen first, then recommend the right flights, route, lodge style, activities, transfers, and travel pace for your journey.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {planningSteps.map((step) => (
              <div key={step} className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#007a24] text-xs text-white"><FiCheck /></span>
                <p className="text-[0.82rem] font-semibold uppercase leading-6 tracking-[0.08em] text-[#102d23]">{step}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <img className="h-[300px] w-full rounded-[1.45rem] object-cover shadow-[0_24px_70px_rgb(16_45_35_/_0.12)] sm:h-[390px] lg:h-[480px]" src={images.elephants} alt="Elephants in their natural habitat" />
        </Reveal>
      </div>
    </section>
  )
}

function LocalExpertiseSection() {
  return (
    <section className="bg-[#07150f] px-5 py-20 text-white sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <img className="h-[300px] w-full rounded-[1.45rem] object-cover shadow-[0_26px_70px_rgb(0_0_0_/_0.28)] sm:h-[390px] lg:h-[500px]" src={images.elephant} alt="Elephant wildlife safari in East Africa" />
        </Reveal>

        <Reveal delay={120}>
          <p className="text-left text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#ffe81f]">Local Expertise</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.9rem,3.6vw,2.85rem)] font-black uppercase leading-[1.12] tracking-[0.1em] text-white">Grounded In African Travel Knowledge</h2>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-white/68">Our team understands the parks, seasons, routes, lodges, flights, transport options, and details that make travel smooth and memorable. That knowledge helps guests move with confidence from first inquiry to final transfer.</p>
          <div className="mt-8 grid gap-4">
            {expertisePoints.map((point) => (
              <div key={point} className="flex items-start gap-3 text-sm leading-7 text-white/72">
                <FiMapPin className="mt-1 shrink-0 text-[#ffe81f]" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ExperiencesSection() {
  return (
    <section className="bg-[#fbf7ef] px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="section-eyebrow">Safari Experiences</p>
          <h2 className="section-title mt-4 text-[#102d23]">Experiences We Create</h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-[#5e6761]">From once-in-a-lifetime wildlife encounters to calm scenic escapes, air ticketing, hotel reservations, and transport support, our trips are built to feel personal, memorable, and seamless.</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {experiences.map((experience, index) => (
            <Reveal key={`${experience.alt}-${index}`} delay={index * 60}>
              <div className="group relative h-40 overflow-hidden rounded-[1rem] bg-black shadow-[0_20px_55px_rgb(16_45_35_/_0.12)] sm:h-64">
                <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={experience.image} alt={experience.alt} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  const { phoneHref, whatsappHref } = useContact()
  return (
    <section className="relative isolate overflow-hidden bg-[#07150f] px-5 py-20 text-center text-white sm:px-8 lg:py-28">
      <img className="absolute inset-0 -z-20 h-full w-full object-cover opacity-42" src={images.elephants} alt="Elephant family in the African wilderness" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(7_21_15_/_0.82),rgb(7_21_15_/_0.92))]" />
      <Reveal className="mx-auto max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffe81f]">Start Planning</p>
        <h2 className="mt-4 text-[clamp(1.9rem,4vw,3.1rem)] font-black uppercase leading-tight tracking-[0.1em] text-white">Ready To Plan Your Safari Journey?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/72">Share your travel idea with Top Cloud Rwenzori Adventures and our team will help shape the next step.</p>
        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <a className="luxury-button gap-2" href={whatsappHref} target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp</a>
          <a className="luxury-button luxury-button-outline gap-2" href={phoneHref}><FiPhoneCall /> Call</a>
        </div>
      </Reveal>
    </section>
  )
}
