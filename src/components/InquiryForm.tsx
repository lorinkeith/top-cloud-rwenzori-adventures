import { useState } from 'react'
import { useLoadingTask } from '../context/LoadingContext'
import { FaEnvelope, FaPhone, FaRegUser } from 'react-icons/fa6'
import { FiArrowRight } from 'react-icons/fi'
import { submitContactForm } from '../utils/formSubmission'

type InquiryFormState = {
  fullName: string
  email: string
  phone: string
  message: string
}

const initialForm: InquiryFormState = { fullName: '', email: '', phone: '', message: '' }

export function InquiryForm() {
  const [form, setForm] = useState<InquiryFormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormState, string>>>({})
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  useLoadingTask(isSubmitting)

  const update = (field: keyof InquiryFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus(null)
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof InquiryFormState, string>> = {}
    ;(['fullName', 'email', 'phone', 'message'] as const).forEach((field) => {
      if (!form[field].trim()) nextErrors[field] = 'Required'
    })
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setStatus({ type: 'info', message: 'Sending your inquiry...' })
    try {
      await submitContactForm({ formType: 'inquiry', ...form })
      setForm(initialForm)
      setStatus({ type: 'success', message: 'Your inquiry has been sent. Our travel specialist will contact you shortly.' })
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'The inquiry could not be sent right now.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="inquiry-form-card">
      <div>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950">Send An Inquiry</h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600">Tell us about your dream safari and our team will get back to you.</p>
      </div>
      <form className="mt-8 grid gap-5" onSubmit={submit} noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full Name" required error={errors.fullName}>
            <div className="input-icon-field relative"><FaRegUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input className="inquiry-input" value={form.fullName} onChange={(event) => update('fullName', event.target.value)} placeholder="Enter your full name" /></div>
          </Field>
          <Field label="Email Address" required error={errors.email}>
            <div className="input-icon-field relative"><FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input className="inquiry-input" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="Enter your email address" /></div>
          </Field>
        </div>
        <Field label="Phone / WhatsApp" required error={errors.phone}>
          <div className="input-icon-field relative"><FaPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input className="inquiry-input" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Enter your phone number" /></div>
        </Field>
        <Field label="Message" required error={errors.message}>
          <textarea className="inquiry-input min-h-36 resize-none" value={form.message} maxLength={500} onChange={(event) => update('message', event.target.value)} placeholder="Tell us about dates, destinations, travelers, comfort level, or special requests..." />
          <p className="mt-1 text-right text-xs text-muted">{form.message.length}/500</p>
        </Field>
        {status && <p className={`rounded-xl p-3 text-sm font-semibold ${status.type === 'success' ? 'bg-primary/10 text-primary' : status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-primary/5 text-primary'}`}>{status.message}</p>}
        <button className="inquiry-submit disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Inquiry'} <FiArrowRight />
        </button>
      </form>
    </div>
  )
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className={`block text-left text-sm font-semibold text-ink ${error ? 'field-error' : ''}`}>
      {label} {required && <span className="text-primary">*</span>}
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  )
}
