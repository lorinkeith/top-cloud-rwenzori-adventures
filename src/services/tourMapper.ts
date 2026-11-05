import type { Tour } from '../data/tours'
import { images } from '../data/images'
import type { TourPackage, TourPackageDetails } from '../types/tourPackage'

export function packageToTour(row: TourPackage): Tour {
  return {
    id: row.id, slug: row.slug, title: row.title, category: row.category,
    location: row.category, durationDays: row.duration_days,
    priceFromUsd: row.price_from_usd, accommodationPrices: { Budget: row.price_budget_usd, 'Mid-range': row.price_mid_range_usd, Luxury: row.price_luxury_usd },
    shortDescription: row.short_description, overview: row.overview,
    mainImage: row.main_image_url || images.treeLions,
    heroImage: row.hero_image_url || row.main_image_url || images.treeLions,
    galleryImages: [], highlights: [], itineraryDays: [], mapStyle: row.map_style,
  }
}

export function detailsToTour(details: TourPackageDetails): Tour {
  return {
    ...packageToTour(details.package),
    galleryImages: details.galleryImages.map(image => image.image_url),
    highlights: details.highlights.map(item => [item.title, item.description].filter(Boolean).join(' — ')),
    locations: details.locations,
    itineraryDays: details.itineraryDays.map(day => ({
      dayNumber: day.day_number, title: day.title, overview: day.overview,
      accommodationName: day.accommodation_name || '',
      activities: day.activities.map(activity => ({ title: activity.title, description: activity.description || '' })),
      images: day.images.map(image => image.image_url),
    })),
  }
}
