import { trackTourAnalyticsEventQuietly } from '../services/tourAnalyticsService'
import { useMemo, useState } from 'react'
import { useLoadingTask } from '../context/LoadingContext'
import type { ReactNode } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { FiArrowRight, FiBriefcase, FiCalendar, FiMinus, FiPlus, FiUser } from 'react-icons/fi'
import type { Tour } from '../data/tours'
import { countryOptions } from '../data/countries'
import type { CountryOption } from '../data/countries'
import { formatUsd } from '../utils/currency'
import { submitContactForm } from '../utils/formSubmission'

type BookingModalProps = {
  isOpen: boolean
  tour?: Tour
  onClose: () => void
}

type Accommodation = 'Budget' | 'Mid-range' | 'Luxury'
type FormState = {
  fullName: string
  email: string
  phone: string
  country: string
  travelDate: string
  flexible: 'Yes' | 'No'
  adults: number
  children: number
  childrenAges: string
  accommodation: Accommodation
  notes: string
}

const initialForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  travelDate: '',
  flexible: 'Yes',
  adults: 1,
  children: 0,
  childrenAges: '',
  accommodation: 'Mid-range',
  notes: '',
}

const accommodationMultipliers: Record<Accommodation, number> = { Budget: 0.85, 'Mid-range': 1, Luxury: 1.35 }

export function BookingModal({ isOpen, tour, onClose }: BookingModalProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  useLoadingTask(isSubmitting)

  const selectedTour = tour?.title ?? 'Tailor-made Top Cloud Rwenzori Adventures Journey'
  const basePrice = Number.isFinite(tour?.priceFromUsd) ? tour?.priceFromUsd ?? 0 : 0
  const travelers = Math.max(1, Number(form.adults) + Number(form.children))
  const adjustedPerPerson = useMemo(() => tour?.accommodationPrices ? tour.accommodationPrices[form.accommodation] : Math.round(basePrice * accommodationMultipliers[form.accommodation]), [basePrice, form.accommodation, tour?.accommodationPrices])
  const estimatedGroupBudget = adjustedPerPerson === null ? null : adjustedPerPerson * travelers

  if (!isOpen) return null

  const update = (field: keyof FormState, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus(null)
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {}

    if (!form.travelDate.trim()) nextErrors.travelDate = 'Required'
    if (!form.country.trim()) nextErrors.country = 'Required'
    if (!Number.isFinite(form.adults) || form.adults < 1) nextErrors.adults = 'At least 1 adult is required'
    if (!Number.isFinite(form.children) || form.children < 0) nextErrors.children = 'Children cannot be negative'
    if (!form.fullName.trim()) nextErrors.fullName = 'Required'
    if (!form.email.trim()) nextErrors.email = 'Required'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email'
    if (!form.phone.trim()) nextErrors.phone = 'Required'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) {
      setStatus({ type: 'error', message: 'Please complete every required field before sending.' })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: 'info', message: 'Sending your booking request...' })

    try {
      await submitContactForm({
        selectedTour,
        packageId: tour?.id && /^[0-9a-f-]{36}$/i.test(tour.id) ? tour.id : undefined,
        formType: 'booking',
        ...form,
        budgetPerPerson: adjustedPerPerson !== null && basePrice > 0 ? formatUsd(adjustedPerPerson) : 'Custom quote',
        baseBudgetPerPerson: basePrice > 0 ? formatUsd(basePrice) : 'Custom quote',
        estimatedGroupBudget: estimatedGroupBudget !== null && basePrice > 0 ? formatUsd(estimatedGroupBudget) : 'Custom quote',
        travelers,
        accommodationPreference: form.accommodation,
        accommodationMultiplier: accommodationMultipliers[form.accommodation],
        currency: 'USD',
      })
      trackTourAnalyticsEventQuietly(tour?.id, 'booking_submitted')
      setForm(initialForm)
      setStatus({ type: 'success', message: 'Booking request sent successfully. Our team will contact you shortly.' })
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Something went wrong. Please try again or contact us on WhatsApp.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] h-dvh w-full overflow-hidden bg-white text-[#07111f]" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <form className="booking-form-scroll flex h-dvh flex-col overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-5 lg:px-8" onSubmit={submit} noValidate>
        <header className="mx-auto flex w-full max-w-[1680px] shrink-0 items-start justify-between gap-5 border-b border-[#cfe2d6] pb-4">
          <div>
            <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#007a24]">Booking Request</p>
            <h2 id="booking-title" className="mt-1 text-[clamp(1.45rem,2.4vw,2.45rem)] font-black leading-tight tracking-[-0.035em] text-[#07111f]">{selectedTour}</h2>
            <p className="mt-2 text-sm leading-6 text-[#5e6761]">Share your details and our team will help plan the next step.</p>
          </div>

          <div className="flex items-start gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5e6761]">Estimated Total</p>
              <p className="text-[clamp(1.8rem,3vw,2.6rem)] font-black leading-none text-[#007a24]">{estimatedGroupBudget !== null && basePrice > 0 ? formatUsd(estimatedGroupBudget) : 'Custom'}</p>
              <p className="mt-1 text-xs font-semibold text-[#5e6761]">{travelers} traveler{travelers === 1 ? '' : 's'} | {form.accommodation}</p>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-full text-2xl text-[#07111f] transition hover:bg-[#eef7f1]" type="button" aria-label="Close booking form" onClick={onClose}>
              <FaXmark />
            </button>
          </div>
        </header>

        <div className="mx-auto mt-4 grid w-full max-w-[1680px] flex-1 content-start gap-4">
          <SectionCard icon={<FiCalendar />} title="Travel Details">
            <div className="grid gap-4 lg:grid-cols-[1.05fr_1.05fr_0.72fr]">
              <Field label="Preferred Travel Date" required error={errors.travelDate}>
                <input className="booking-light-input" type="date" value={form.travelDate} onChange={(event) => update('travelDate', event.target.value)} />
              </Field>
              <Field label="Country of Residence" required error={errors.country}>
                <CountryCombobox value={form.country} onChange={(value) => update('country', value)} />
              </Field>
              <Field label="Date Flexibility" required>
                <div className="grid min-h-11 grid-cols-2 overflow-hidden rounded-[0.35rem] border border-[#bfd8c8]">
                  {(['Yes', 'No'] as const).map((value) => (
                    <button key={value} className={`text-sm font-black transition ${form.flexible === value ? 'bg-[#007a24] text-white' : 'bg-white text-[#07111f] hover:bg-[#eef7f1]'}`} type="button" onClick={() => update('flexible', value)}>
                      {value}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="mt-3 grid gap-4 lg:grid-cols-[0.7fr_0.7fr_1.55fr]">
              <Counter label="Adults" value={form.adults} error={errors.adults} onChange={(value) => update('adults', Math.max(1, value))} />
              <Counter label="Children" value={form.children} error={errors.children} onChange={(value) => update('children', Math.max(0, value))} />
              <Field label="Children's Ages" optional>
                <input className="booking-light-input" value={form.childrenAges} onChange={(event) => update('childrenAges', event.target.value)} placeholder="e.g. 5, 8, 12" />
              </Field>
            </div>
          </SectionCard>

          <SectionCard icon={<FiUser />} title="Contact">
            <div className="grid gap-4 lg:grid-cols-3">
              <Field label="Full Name" required error={errors.fullName}>
                <input className="booking-light-input" value={form.fullName} onChange={(event) => update('fullName', event.target.value)} placeholder="Enter your full name" />
              </Field>
              <Field label="Email Address" required error={errors.email}>
                <input className="booking-light-input" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="Enter your email" />
              </Field>
              <Field label="Phone / WhatsApp" required error={errors.phone}>
                <input className="booking-light-input" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Enter your phone number" />
              </Field>
            </div>
          </SectionCard>

          <SectionCard icon={<FiBriefcase />} title="Preferences">
            <Field label="Special Requests / Notes" optional>
              <textarea className="booking-light-input min-h-20 resize-none" value={form.notes} maxLength={500} onChange={(event) => update('notes', event.target.value)} placeholder="Share interests, accessibility needs, celebrations, or any special requests..." />
              <p className="mt-1 text-right text-xs text-[#5e6761]">{form.notes.length}/500</p>
            </Field>
          </SectionCard>

          <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto]">
            {status ? (
              <p className={`rounded-xl p-3 text-sm font-semibold ${status.type === 'success' ? 'bg-[#edf8f1] text-[#007a24]' : status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-[#edf8f1] text-[#007a24]'}`}>
                {status.message}
              </p>
            ) : (
              <span />
            )}

            <button className="inline-flex min-h-12 w-full items-center justify-center gap-4 rounded-[0.35rem] bg-[#00872c] px-8 text-sm font-black text-white shadow-[0_24px_60px_rgb(0_122_36_/_0.18)] transition hover:bg-[#006b1f] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-72" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Booking Request'} <FiArrowRight />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function CountryCombobox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const query = value.trim().toLowerCase()
  const selectedCountry = countryOptions.find((country) => country.name === value)
  const filteredCountries = useMemo(() => {
    if (!query) return countryOptions
    return countryOptions.filter((country) =>
      country.name.toLowerCase().includes(query) || country.code.toLowerCase().includes(query),
    )
  }, [query])

  const selectCountry = (country: CountryOption) => {
    onChange(country.name)
    setIsOpen(false)
  }

  return (
    <div className="booking-country-combobox" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
    }}>
      <div className="booking-country-control">
        {selectedCountry && <CountryFlag country={selectedCountry} className="booking-country-selected-flag" />}
        <input
          autoComplete="off"
          className="booking-country-search"
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsOpen(false)
          }}
          placeholder="Select country"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="booking-country-listbox"
        />
        <span className={`booking-country-arrow ${isOpen ? 'booking-country-arrow-open' : ''}`} aria-hidden="true" />
      </div>

      {isOpen && (
        <div className="booking-country-menu" id="booking-country-listbox" role="listbox">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <div
                key={country.code}
                className={`booking-country-option ${country.name === value ? 'booking-country-option-active' : ''}`}
                onMouseDown={(event) => {
                  event.preventDefault()
                  selectCountry(country)
                }}
                role="option"
                aria-selected={country.name === value}
              >
                <CountryFlag country={country} className="booking-country-flag" />
                <span>{country.name} - {country.code}</span>
              </div>
            ))
          ) : (
            <div className="booking-country-empty">No countries found</div>
          )}
        </div>
      )}
    </div>
  )
}

function CountryFlag({ country, className }: { country: CountryOption; className: string }) {
  return (
    <img
      className={className}
      src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 1x, https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`}
      alt=""
      aria-hidden="true"
      loading="lazy"
    />
  )
}

function SectionCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="rounded-[0.85rem] border border-[#d7e7dc] bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-3 border-b border-[#d7e7dc] pb-3">
        <span className="text-lg text-[#007a24]">{icon}</span>
        <h3 className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#007a24]">{title}</h3>
      </div>
      {children}
    </section>
  )
}

function Field({ label, required, optional, error, children }: { label: string; required?: boolean; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <label className={`block text-left text-[0.82rem] font-black text-[#07111f] ${error ? 'field-error' : ''}`}>
      {label} {required && <span className="text-[#007a24]">*</span>} {optional && <span className="ml-2 font-medium text-[#5e6761]">Optional</span>}
      <span className="mt-1.5 block">{children}</span>
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  )
}

function Counter({ label, value, error, onChange }: { label: string; value: number; error?: string; onChange: (value: number) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-[0.82rem] font-black text-[#07111f]">{label} <span className="text-[#007a24]">*</span></p>
      <div className="flex h-11 items-center justify-between rounded-[0.35rem] border border-[#bfd8c8] bg-white px-4 text-[#07111f]">
        <button className="grid h-7 w-7 place-items-center rounded-full text-lg transition hover:bg-[#edf8f1]" type="button" onClick={() => onChange(value - 1)} aria-label={`Decrease ${label}`}><FiMinus /></button>
        <span className="font-black">{value}</span>
        <button className="grid h-7 w-7 place-items-center rounded-full text-lg transition hover:bg-[#edf8f1]" type="button" onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`}><FiPlus /></button>
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </div>
  )
}
