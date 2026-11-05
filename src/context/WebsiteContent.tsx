import { createContext, useContext, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import { defaultHomeCustomization, mergeHomeCustomization } from '../services/homeCustomizationDefaults'
import { normalizeHeroSlider } from '../utils/heroSlider'
import { useRemoteData } from '../hooks/useRemoteData'
import type { HeroSliderContent } from '../types/heroSlider'
import { phoneDisplay, emailDisplay, locationDisplay, whatsappHref } from '../utils/contact'

type Review = { id: string; author_name: string; review_text: string; rating: number; author_image: string | null }
type WebsiteState = { published: boolean; content: typeof defaultHomeCustomization; hero: HeroSliderContent | null; reviews: Review[] }
const initial: WebsiteState = { published: false, content: defaultHomeCustomization, hero: null, reviews: [] }
const Context = createContext(initial)
function currentContactDetails(content: typeof defaultHomeCustomization) {
  // Older published homepage snapshots may still reference the retired vehicle photo.
  content = JSON.parse(JSON.stringify(content).replaceAll('safari-vehicle.jpg', 'ele.jpg')) as typeof defaultHomeCustomization
  // Keep contact destinations current even when an older homepage was published.
  const isWhatsApp = (href?: string) => /^https?:\/\/(?:wa\.me|(?:api\.|www\.)?whatsapp\.com)(?:\/|$)/i.test(href || '')
  return {
    ...content,
    footer: { ...content.footer, phone: phoneDisplay, email: emailDisplay, location: locationDisplay, socials: content.footer.socials.map(link => ({ ...link, href: link.id === 'whatsapp' || isWhatsApp(link.href) ? whatsappHref : link.href })) },
    story: { ...content.story, badges: content.story.badges.map(badge => ({ ...badge, href: isWhatsApp(badge.href) ? whatsappHref : badge.href })) },
  }
}
async function loadContent(): Promise<WebsiteState> {
  if (!supabase) return initial
  const [home, hero, reviews] = await Promise.all([
    supabase.rpc('get_published_homepage'), supabase.rpc('get_published_hero_slider'),
    supabase.from('tripadvisor_reviews').select('id,author_name,review_text,rating,author_image').order('review_date', { ascending: false, nullsFirst: false }),
  ])
  if (home.error || hero.error || reviews.error) throw new Error('Unable to load published content')
  return { published: home.data !== null, content: currentContactDetails(mergeHomeCustomization(home.data)), hero: hero.data ? normalizeHeroSlider(hero.data) : null, reviews: reviews.data || [] }
}
export function WebsiteContentProvider({ children }: { children: ReactNode }) {
  const { data } = useRemoteData(loadContent, initial)
  return <Context.Provider value={data}>{children}</Context.Provider>
}
export function useWebsiteContent() { return useContext(Context) }
