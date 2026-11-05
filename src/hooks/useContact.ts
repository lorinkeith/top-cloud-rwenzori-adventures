import { useWebsiteContent } from '../context/WebsiteContent'
import { phoneDisplay, phoneHref, whatsappDisplay, whatsappHref } from '../utils/contact'
export function useContact() {
 const { content }=useWebsiteContent()
 return {phoneDisplay,phoneHref,whatsappDisplay,whatsappHref,emailDisplay:content.footer.email,emailHref:`mailto:${content.footer.email}`,locationDisplay:content.footer.location}
}
