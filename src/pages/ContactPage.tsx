import { FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { Header } from '../components/home/Header'
import { InquiryForm } from '../components/InquiryForm'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { SiteFooter } from '../components/SiteFooter'
import { images } from '../data/images'
import { useContact } from '../hooks/useContact'

export function ContactPage() {
  const { emailDisplay, emailHref, locationDisplay, phoneDisplay, phoneHref } = useContact()
  const contactItems = [
  { label: 'Phone', value: phoneDisplay, href: phoneHref, icon: FiPhone },
  { label: 'Email', value: emailDisplay, href: emailHref, icon: FiMail },
  { label: 'Location', value: locationDisplay, icon: FiMapPin },
  { label: 'Working Hours', value: 'Mon - Sat, 8:00 AM - 6:00 PM', icon: FiClock },
]


  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <PageHero title="Contact Us" subtitle="Talk to us about air ticketing, safaris, tours, passport and visa services, hotels, and travel insurance. Explore the world with us!" image={images.gorillaHero} />
      <main className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h2 className="section-title text-left">Let's Start With A Conversation</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600">Share your dates, preferred travel style, flight needs, transfers, accommodation, must-see wildlife, and comfort level. Our planning team will help shape the next practical steps.</p>
            <div className="mt-8 grid gap-4">
              {contactItems.map(({ label, value, href, icon: Icon }) => {
                const content = (
                  <div className="flex items-center gap-4 rounded-[1.35rem] border border-[#d7e5e8] bg-white p-5 shadow-[0_16px_42px_rgb(0_0_0_/_0.04)]">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-luxury-green text-xl text-white"><Icon /></span>
                    <span className="min-w-0">
                      <span className="block text-[0.68rem] font-medium uppercase tracking-[0.16em] text-neutral-500">{label}</span>
                      <span className="mt-1 block break-words text-base font-normal text-neutral-800 sm:text-lg">{value}</span>
                    </span>
                  </div>
                )

                return href ? <a key={label} href={href}>{content}</a> : <div key={label}>{content}</div>
              })}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <InquiryForm />
          </Reveal>
        </div>
      </main>
      <section aria-label={`Location map: ${locationDisplay}`} className="w-full border-y border-neutral-200">
        <iframe
          title={`Find Top Cloud Rwenzori Adventures in ${locationDisplay}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(locationDisplay)}&output=embed`}
          className="block h-[350px] w-full border-0 sm:h-[450px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-4 text-sm sm:px-8">
          <span className="inline-flex items-center gap-2 font-normal text-neutral-600"><FiMapPin aria-hidden="true" />{locationDisplay}</span>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationDisplay)}`} target="_blank" rel="noreferrer" className="font-semibold text-luxury-green underline-offset-4 hover:underline">Open in Google Maps ↗</a>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
