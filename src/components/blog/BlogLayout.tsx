import { Link } from 'react-router-dom'
import { SiteFooter } from '../SiteFooter'
import { useLoadingTask } from '../../context/LoadingContext'
export function Footer() { return <SiteFooter /> }
export function PageLoader() { useLoadingTask(true); return null }
export function FinalCTA({ heading, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: { heading: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string }) {
  return <section className="bg-luxury-cream px-5 py-16 text-center"><h2 className="section-title">{heading}</h2><div className="mt-8 flex flex-wrap justify-center gap-4"><Link className="luxury-button" to={primaryHref}>{primaryLabel}</Link><Link className="luxury-button" to={secondaryHref}>{secondaryLabel}</Link></div></section>
}
