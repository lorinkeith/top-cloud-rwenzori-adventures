import { images } from './images'

export type ItineraryDay = {
  dayNumber: number
  title: string
  overview: string
  description?: string
  accommodationName: string
  activities: { title: string; description: string }[]
  images: string[]
}

export type Tour = {
  id?: string
  title: string
  slug: string
  category: string
  location?: string
  rating?: number
  reviews?: number
  durationDays: number
  priceFromUsd: number | null
  accommodationPrices?: Record<'Budget' | 'Mid-range' | 'Luxury', number | null>
  locations?: import('../types/tourPackage').TourPackageLocation[]
  mapStyle?: import('../types/tourPackage').TourMapStyle
  shortDescription: string
  overview: string
  mainImage: string
  heroImage: string
  galleryImages: string[]
  videoThumbnail?: string
  type?: string
  groupSize?: string
  language?: string
  highlights: string[]
  included?: string[]
  excluded?: string[]
  itineraryDays: ItineraryDay[]
  mapLocation?: string
}

const dayImages = [
  images.gorillaHero,
  images.treeLions,
  images.elephants,
  images.elephant,
  images.elephants,
  images.gorillaHero,
  images.elephant,
  images.treeLions,
]

const included = [
  'Pick and drop service',
  'Professional safari guide',
  'Comfortable accommodation',
  'Park entry support',
  'Selected meals',
]

const excluded = [
  'International flights',
  'Visa fees',
  'Personal expenses',
  'Tips and gratuities',
  'Optional activities',
]

const itineraryTitlePool = [
  'Arrival and Safari Briefing',
  'Scenic Transfer and Lodge Check-In',
  'Guided Wildlife Drive',
  'Boat Safari and Local Landscapes',
  'Cultural Encounter and Slow Travel',
  'Forest Walk and Birding',
  'Sunrise Game Drive',
  'Relaxed Lodge Day',
  'Signature Safari Experience',
  'Departure Transfer',
]

function buildTailorMadeItinerary(durationDays: number, location: string, mainImage: string, offset: number): ItineraryDay[] {
  return Array.from({ length: durationDays }, (_, index) => {
    const dayNumber = index + 1
    const isLast = dayNumber === durationDays
    const title = isLast ? 'Departure Transfer' : itineraryTitlePool[index % (itineraryTitlePool.length - 1)]
    const imageOne = [mainImage, images.elephants, images.treeLions, images.elephant, ...dayImages][(index + offset) % (dayImages.length + 4)]

    return {
      dayNumber,
      title,
      overview: isLast
        ? `Enjoy a flexible final morning before your transfer and onward travel from ${location}.`
        : `Experience a carefully paced day around ${location}, with guided activities, scenic stops, and time to settle into the rhythm of your safari.`,
      accommodationName: isLast ? 'Departure day' : dayNumber === 1 ? 'Boutique lodge' : 'Safari lodge',
      activities: [
        {
          title: isLast ? 'Departure support' : 'Guided experience',
          description: isLast ? 'Your guide assists with timing, luggage, and onward connections.' : 'Your guide shapes the day around wildlife, scenery, comfort, and local insight.',
        },
      ],
      images: [imageOne, images.elephants, dayImages[(index + offset + 2) % dayImages.length]],
    }
  })
}

export const tours: Tour[] = [
  {
    id: 'gorilla-queen-elizabeth',
    slug: 'gorilla-trekking-and-queen-elizabeth-safari',
    title: 'Gorilla Trekking Safari Experience',
    category: 'Primate and wildlife safari',
    location: 'Bwindi and Queen Elizabeth, Uganda',
    rating: 4.9,
    reviews: 38,
    durationDays: 7,
    priceFromUsd: 3980,
    shortDescription: 'Track mountain gorillas, cruise the Kazinga Channel, and enjoy Uganda family safari comfort.',
    overview: 'This carefully paced Uganda safari combines the life-changing experience of mountain gorilla trekking with the open savannahs, crater lakes, and boat safaris of Queen Elizabeth National Park. It is ideal for families and first-time visitors who want a premium route with expert local guidance, comfortable lodges, and time to absorb each destination.',
    mainImage: images.gorillaHero,
    heroImage: images.gorillaHero,
    galleryImages: [images.gorillaHero, images.treeLions, images.elephants, images.elephant],
    videoThumbnail: images.treeLions,
    type: 'Adventure',
    groupSize: '2-12 People',
    language: 'English',
    highlights: [
      'Track mountain gorillas with expert local guides',
      'Explore Uganda\'s most iconic national parks',
      'Enjoy comfortable safari lodges and scenic drives',
      'Perfect for wildlife lovers and first-time visitors',
    ],
    included,
    excluded,
    itineraryDays: [
      {
        dayNumber: 1,
        title: 'Arrival in Entebbe',
        overview: 'Land in Entebbe and settle into a calm lakeside stay before your safari begins.',
        accommodationName: 'Boutique guesthouse',
        activities: [{ title: 'Arrival assistance', description: 'Meet your driver-guide and review the days ahead.' }],
        images: [images.elephants, images.gorillaHero, images.treeLions],
      },
      {
        dayNumber: 2,
        title: 'Scenic Drive to Bwindi',
        overview: 'Travel through rolling hills, tea country, and rural villages toward the misty forests of Bwindi.',
        accommodationName: 'Forest lodge',
        activities: [{ title: 'Road safari', description: 'Pause for viewpoints and relaxed family-friendly breaks.' }],
        images: [images.treeLions, images.elephants, dayImages[4]],
      },
      {
        dayNumber: 3,
        title: 'Gorilla Trekking Experience',
        overview: 'Join trained rangers for an unforgettable trek to observe a habituated gorilla family.',
        accommodationName: 'Forest lodge',
        activities: [{ title: 'Gorilla permit support', description: 'Briefing, trekking, and guided time in the forest.' }],
        images: [images.gorillaHero, dayImages[5], images.elephants],
      },
      {
        dayNumber: 4,
        title: 'Queen Elizabeth National Park',
        overview: 'Continue to Queen Elizabeth National Park for crater scenery and a gentle evening game drive.',
        accommodationName: 'Savannah lodge',
        activities: [{ title: 'Game drive', description: 'Search for elephants, buffalo, lions, and antelope.' }],
        images: [images.elephant, images.treeLions, dayImages[7]],
      },
      {
        dayNumber: 5,
        title: 'Kazinga Channel Boat Safari',
        overview: 'Enjoy a relaxed boat safari with excellent chances for hippos, elephants, and abundant birdlife.',
        accommodationName: 'Savannah lodge',
        activities: [{ title: 'Boat cruise', description: 'A family-friendly wildlife highlight on the water.' }],
        images: [dayImages[6], images.elephant, images.elephants],
      },
      {
        dayNumber: 6,
        title: 'Tree-Climbing Lion Sector',
        overview: 'Explore the southern sector and keep watch for the famous tree-climbing lions of Ishasha.',
        accommodationName: 'Safari lodge',
        activities: [{ title: 'Ishasha game drive', description: 'Slow wildlife viewing with time for photography.' }],
        images: [images.treeLions, images.elephant, images.gorillaHero],
      },
      {
        dayNumber: 7,
        title: 'Return to Entebbe',
        overview: 'Drive back to Entebbe with a flexible pace and onward flight assistance.',
        accommodationName: 'Departure day',
        activities: [{ title: 'Departure transfer', description: 'Final scenic drive and airport drop-off.' }],
        images: [images.elephants, dayImages[4], images.elephant],
      },
    ],
    mapLocation: 'Bwindi Impenetrable Forest and Queen Elizabeth National Park',
  },
  {
    id: 'murchison-falls',
    slug: 'murchison-falls-wildlife-escape',
    title: 'Murchison Falls Wildlife Safari',
    category: 'Wildlife safari',
    location: 'Murchison Falls, Uganda',
    rating: 4.8,
    reviews: 27,
    durationDays: 5,
    priceFromUsd: 2450,
    shortDescription: 'A focused safari through Uganda\'s largest national park with falls, wildlife, and river scenes.',
    overview: 'Designed for travelers who want a shorter but rewarding Uganda safari, this escape centers on Murchison Falls National Park. Expect big wildlife, powerful Nile scenery, comfortable lodges, and a route that works well for families and small private groups.',
    mainImage: images.elephant,
    heroImage: images.elephant,
    galleryImages: [images.elephant, images.elephants, images.treeLions, dayImages[6]],
    videoThumbnail: images.elephants,
    type: 'Wildlife',
    groupSize: '2-10 People',
    language: 'English',
    highlights: [
      'See the Nile squeeze through the dramatic falls',
      'Enjoy classic savannah game drives',
      'Take a boat safari toward the base of the falls',
      'Travel with a private local guide',
    ],
    included,
    excluded,
    itineraryDays: [
      { dayNumber: 1, title: 'Kampala to Murchison Falls', overview: 'Depart for Murchison Falls with scenic stops and lodge check-in.', accommodationName: 'Safari lodge', activities: [], images: [images.elephants, images.elephant, dayImages[4]] },
      { dayNumber: 2, title: 'Game Drive and Nile Cruise', overview: 'Spend the day viewing wildlife by vehicle and boat along the Nile.', accommodationName: 'Safari lodge', activities: [], images: [images.elephant, dayImages[6], images.treeLions] },
      { dayNumber: 3, title: 'Top of the Falls', overview: 'Visit the top of the falls and enjoy relaxed afternoon lodge time.', accommodationName: 'Safari lodge', activities: [], images: [dayImages[6], images.elephants, images.elephant] },
      { dayNumber: 4, title: 'Delta Wildlife Drive', overview: 'Explore the delta tracks for giraffe, elephant, buffalo, and predators.', accommodationName: 'Safari lodge', activities: [], images: [images.treeLions, images.elephant, dayImages[7]] },
      { dayNumber: 5, title: 'Return to Kampala', overview: 'Return at an easy pace with transfer support for onward plans.', accommodationName: 'Departure day', activities: [], images: [images.elephants, dayImages[4], images.elephant] },
    ],
    mapLocation: 'Murchison Falls National Park',
  },
]

const fallbackTourTitles = [
  [
    'kenya-tanzania-great-migration-safari',
    'Kenya and Tanzania Migration Safari',
    'Kenya / Tanzania',
    5600,
    9,
    'Follow East Africa safari landscapes from Kenya to Tanzania with guided game drives, big skies, and classic migration country.',
    images.elephant,
  ],
  [
    'queen-elizabeth-national-park-safari',
    'Queen Elizabeth National Park Safari',
    'Queen Elizabeth National Park, Uganda',
    1980,
    4,
    'Explore savannah plains, crater lakes, boat safaris, and tree-climbing lion country.',
    images.treeLions,
  ],
  [
    'uganda-family-adventure-safari',
    'Uganda Family Adventure Safari',
    'Uganda',
    4600,
    8,
    'A balanced private safari for families who want wildlife, culture, comfort, and easy pacing.',
    images.elephants,
  ],
  [
    'luxury-honeymoon-safari',
    'Luxury Honeymoon Safari',
    'Uganda',
    5200,
    6,
    'A romantic safari escape with intimate lodges, golden sunsets, and private wildlife moments.',
    images.treeLions,
  ],
  [
    'kidepo-valley-wilderness-safari',
    'Kidepo Valley Wilderness Safari',
    'Kidepo Valley, Uganda',
    5750,
    7,
    'Venture into Uganda\'s remote northeast for dramatic valleys, big skies, and uncrowded wildlife viewing.',
    images.elephant,
  ],
  [
    'rwenzori-and-kibale-primate-safari',
    'Rwenzori and Kibale Primate Safari',
    'Kibale and Rwenzori, Uganda',
    3420,
    6,
    'Combine chimpanzee tracking, crater lakes, forest walks, and views of the Mountains of the Moon.',
    images.gorillaHero,
  ],
  [
    'lake-bunyonyi-relaxation-safari',
    'Lake Bunyonyi Relaxation Safari',
    'Lake Bunyonyi, Uganda',
    2890,
    5,
    'Slow down beside island-dotted waters with scenic canoeing, community visits, and gentle safari pacing.',
    images.elephants,
  ],
] as const

export const fallbackTours: Tour[] = fallbackTourTitles.map(([slug, title, location, price, durationDays, shortDescription, mainImage], index) => ({
  id: slug,
  slug,
  title,
  category: 'Luxury safari',
  location,
  rating: 4.8,
  reviews: 20 + index * 7,
  durationDays,
  priceFromUsd: price,
  shortDescription,
  overview: 'This sample itinerary gives Top Cloud Rwenzori Adventures a strong starting point for a tailor-made journey. We can refine lodges, pace, transfers, flight plans, and family-friendly experiences once we understand how you want to travel.',
  mainImage,
  heroImage: mainImage,
  galleryImages: [mainImage, images.elephants, images.treeLions, images.elephant],
  videoThumbnail: images.elephants,
  type: 'Luxury',
  groupSize: '2-12 People',
  language: 'English',
  highlights: ['Tailor-made routing and lodge selection', 'Private guide support', 'Premium wildlife and landscape experiences', 'Flexible pacing for families and couples'],
  included,
  excluded,
  itineraryDays: buildTailorMadeItinerary(durationDays, location, mainImage, index),
  mapLocation: location,
}))

export const allTours = [...tours, ...fallbackTours]

export function getTourBySlug(slug?: string) {
  return allTours.find((tour) => tour.slug === slug)
}
