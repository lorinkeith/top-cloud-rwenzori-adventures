export async function submitContactForm(payload: Record<string, unknown>) {
  if (payload.formType === 'inquiry') {
    const clean = (value: unknown) => String(value ?? '').trim()
    const fullName = clean(payload.fullName)
    const email = clean(payload.email).toLowerCase()
    const phone = clean(payload.phone)
    const message = clean(payload.message)
    if (!fullName || fullName.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone || phone.length > 80 || !message || message.length > 500) {
      throw new Error('Please enter your name, a valid email, phone number, and a message of up to 500 characters.')
    }
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

  if (result?.saved !== true) {
    throw new Error('The submission service returned an invalid response. Please contact us by phone or email.')
  }

  return result as { saved: true; notificationSent: boolean; message: string }
}
