import { supabase } from '../lib/supabaseClient'

export async function submitContactForm(payload: Record<string, unknown>) {
  // The public insert policy accepts inquiries but never exposes saved submissions.
  // This works on static hosting and does not depend on the optional email server.
  if (payload.formType === 'inquiry') {
    if (!supabase) throw new Error('The inquiry service is not configured. Please contact us by phone or email.')
    const clean = (value: unknown) => String(value ?? '').trim()
    const fullName = clean(payload.fullName)
    const email = clean(payload.email).toLowerCase()
    const phone = clean(payload.phone)
    const message = clean(payload.message)
    if (!fullName || fullName.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || phone.length > 80 || !message || message.length > 500) {
      throw new Error('Please enter your name, a valid email, phone number, and a message of up to 500 characters.')
    }
    const { error } = await supabase.from('form_submissions').insert({
      type: 'inquiry',
      full_name: fullName,
      email,
      phone,
      message,
      raw_payload: {},
    })
    if (error) throw new Error('Your inquiry could not be saved. Please check your connection and try again, or contact us by phone or email.')
    return { saved: true }
  }

  const endpoint = import.meta.env.VITE_CONTACT_API_URL || '/api/contact'

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, formType: payload.formType || 'booking' }),
  })

  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(result?.message || 'The request could not be sent right now. Please try again.')
  }

  return result
}
