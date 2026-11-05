import { allTours, getTourBySlug, type Tour } from '../data/tours'
import { hasSupabaseConfig } from '../lib/supabaseClient'
import { getPublishedTourPackages, getTourPackageDetailsBySlug } from '../services/publicTourService'
import { detailsToTour, packageToTour } from '../services/tourMapper'
import { useRemoteData } from './useRemoteData'

async function loadTours() { return (await getPublishedTourPackages()).map(packageToTour) }
export function useTours() { return useRemoteData<Tour[]>(loadTours, hasSupabaseConfig ? [] : allTours) }
export function useTour(slug?: string) {
  return useRemoteData<Tour | undefined>(async () => {
    const details = slug ? await getTourPackageDetailsBySlug(slug) : null
    return details ? detailsToTour(details) : undefined
  }, hasSupabaseConfig ? undefined : getTourBySlug(slug), slug)
}
