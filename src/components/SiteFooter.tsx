import { defaultHomeCustomization } from '../services/homeCustomizationDefaults'
import { useWebsiteContent } from '../context/WebsiteContent'
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useContact } from '../hooks/useContact'
import { travelServices } from '../data/services'

export function SiteFooter() {
  const { content, published } = useWebsiteContent()
  const footerLinks = content.footer.quickLinks
  const caelumLogo = content.nav.logo.src
  const { emailDisplay, emailHref, phoneDisplay, phoneHref, locationDisplay } = useContact()
  return (
    <footer style={!content.hiddenSections.includes('footerBand') && content.footerBand.src !== defaultHomeCustomization.footerBand.src ? { backgroundImage: `linear-gradient(rgb(255 255 255 / .94),rgb(255 255 255 / .94)),url(${content.footerBand.src})`, backgroundSize: 'cover' } : undefined} className="border-t border-neutral-200 bg-white px-5 py-12 text-neutral-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 md:items-start xl:grid-cols-[1.1fr_0.6fr_0.9fr_1.2fr]">
          <div>
            <Link className="inline-flex" to="/" aria-label="Top Cloud Rwenzori Adventures home">
              <img className="w-[170px] object-contain" src={caelumLogo} alt="Top Cloud Rwenzori Adventures" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-600">{content.footer.about}</p>
          </div>

          <div>
            <h3 className="footer-heading">Pages</h3>
            <nav className="mt-5 grid gap-3 text-sm text-neutral-600" aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <Link key={link.href} className="transition hover:text-luxury-green" to={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="footer-heading">Our Services</h3>
            <nav className="mt-5 grid gap-3 text-sm text-neutral-600" aria-label="Footer services">
              {travelServices.map(service => <Link key={service.title} className="transition hover:text-luxury-green" to="/about#services">{service.title}</Link>)}
            </nav>
          </div>

          <div className="min-w-0">
            <h3 className="footer-heading">Contact</h3>
            <div className="mt-5 grid gap-3 text-sm text-neutral-600">
              <a className="inline-flex items-center gap-2 transition hover:text-luxury-green" href={phoneHref}><FiPhone className="text-luxury-green" /> {phoneDisplay}</a>
              <a className="inline-flex min-w-0 items-start gap-2 break-all transition hover:text-luxury-green" href={emailHref}><FiMail className="mt-1 shrink-0 text-luxury-green" /> {emailDisplay}</a>
              {published && content.footer.socials.map(link => <a key={link.id} href={link.href} className="transition hover:text-luxury-green">{link.label}</a>)}
              <a className="inline-flex items-start gap-2 leading-6 transition hover:text-luxury-green" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationDisplay)}`} target="_blank" rel="noreferrer"><FiMapPin className="mt-1 shrink-0 text-luxury-green" /> {locationDisplay}</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-neutral-200 pt-6 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500 sm:flex-row">
          <span>(c) 2026 Top Cloud Rwenzori Adventures. All rights reserved.</span>
          <Link className="transition hover:text-luxury-green" to="/contact">Plan your safari</Link>
        </div>
      </div>
    </footer>
  )
}
