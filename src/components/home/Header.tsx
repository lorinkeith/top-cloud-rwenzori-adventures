import { useWebsiteContent } from '../../context/WebsiteContent'
import { useState } from 'react'
import { FiArrowRight, FiMenu, FiPhone, FiX } from 'react-icons/fi'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useContact } from '../../hooks/useContact'

export function Header() {
  const { content } = useWebsiteContent()
  const navLinks = content.nav.links.some(link => link.href === '/blog') ? content.nav.links.map(link => link.href === '/blog' ? { ...link, label: 'Discover' } : link) : [...content.nav.links, { label: 'Discover', href: '/blog' }]
  const caelumLogo = content.nav.logo.src
  const { phoneDisplay, phoneHref } = useContact()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const isServicesActive = location.pathname === '/' && location.hash === '#services'

  return (
    <header className="relative z-40">
      <div className="bg-luxury-green text-white">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-5 text-[0.68rem] font-bold uppercase tracking-[0.16em] sm:px-8">
          <span>EN (UK) / UGX</span>
          <a className="inline-flex items-center gap-2 transition hover:text-white/75" href={phoneHref}>
            <FiPhone /> <span>Talk to our experts: {phoneDisplay}</span>
          </a>
        </div>
      </div>

      <nav className="bg-white text-black shadow-[0_10px_30px_rgb(0_0_0_/_0.06)]">
        <div className="mx-auto flex h-[84px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
          <Link className="flex h-full items-center leading-none" to="/" aria-label="Top Cloud Rwenzori Adventures home">
            <img className="site-header-logo" src={caelumLogo} alt="Top Cloud Rwenzori Adventures" />
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              link.href.includes('#') ? (
                <Link
                  key={link.href}
                  className={`relative text-[0.74rem] font-black uppercase tracking-[0.13em] transition after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-luxury-green after:transition-all ${
                    isServicesActive ? 'text-luxury-green after:w-full' : 'text-neutral-800 after:w-0 hover:text-luxury-green hover:after:w-full'
                  }`}
                  to={link.href}
                >
                  {link.label}
                </Link>
              ) : (
                <NavLink
                  key={link.href}
                  className={({ isActive }) =>
                    `relative text-[0.74rem] font-black uppercase tracking-[0.13em] transition after:absolute after:-bottom-2 after:left-0 after:h-px after:bg-luxury-green after:transition-all ${
                      isActive && !isServicesActive ? 'text-luxury-green after:w-full' : 'text-neutral-800 after:w-0 hover:text-luxury-green hover:after:w-full'
                    }`
                  }
                  end={link.href === '/'}
                  to={link.href}
                >
                  {link.label}
                </NavLink>
              )
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <NavLink className="luxury-button" style={{ backgroundColor: content.nav.inquiryButton.color }} to={content.nav.inquiryButton.href || '/contact'}>{content.nav.inquiryButton.text}{content.nav.inquiryButton.icon === 'arrow' ? <FiArrowRight /> : content.nav.inquiryButton.icon === 'phone' ? <FiPhone /> : null}</NavLink>
          </div>

          <button className="grid h-11 w-11 place-items-center border border-neutral-200 text-2xl lg:hidden" type="button" aria-label="Open menu" onClick={() => setIsMenuOpen(true)}>
            <FiMenu />
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 z-50 bg-black/60 transition-opacity lg:hidden ${isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setIsMenuOpen(false)}>
        <div className={`ml-auto h-full w-[min(88vw,24rem)] bg-white p-6 shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between">
            <img className="site-mobile-logo" src={caelumLogo} alt="Top Cloud Rwenzori Adventures" />
            <button className="grid h-10 w-10 place-items-center text-2xl" type="button" aria-label="Close menu" onClick={() => setIsMenuOpen(false)}>
              <FiX />
            </button>
          </div>
          <div className="mt-8 grid gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.href} className="border-b border-neutral-100 py-4 text-sm font-black uppercase tracking-[0.14em] text-neutral-900" to={link.href} onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <NavLink className="luxury-button mt-8 w-full" style={{ backgroundColor: content.nav.inquiryButton.color }} to={content.nav.inquiryButton.href || '/contact'} onClick={() => setIsMenuOpen(false)}>{content.nav.inquiryButton.text}{content.nav.inquiryButton.icon === 'arrow' ? <FiArrowRight /> : content.nav.inquiryButton.icon === 'phone' ? <FiPhone /> : null}</NavLink>
        </div>
      </div>
    </header>
  )
}
