import { images } from '../../data/images'

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Tours', href: '/tours' },
  { label: 'About', href: '/about' },
]

export const heroBadges = [
  'Air ticketing',
  'Airport transfers',
  'Tailor-made tours',
  'Wildlife and culture',
]

export const serviceGroups = [
  {
    title: 'Services',
    description: 'Travel essentials arranged with care, from your flights and documents to support along the way.',
    services: ['Air ticketing', 'Passport & visa services', 'Travel insurance', 'Airport transfers'],
  },
  {
    title: 'Safari Trips',
    description: 'Guided wildlife journeys, gorilla trekking safaris, adventure trips, city tours, and day trips across Uganda and Africa.',
    services: ['Safari trips', 'Gorilla trekking', 'Adventure tours', 'Guided tours'],
  },
  {
    title: 'Beach Vacation',
    description: 'Relaxed coastal escapes, honeymoon packages, mumcation holidays, boat cruises, and private custom holidays.',
    services: ['Beach vacations', 'Honeymoon packages', 'Boat cruise', 'Private tours'],
  },
  {
    title: 'Reservations',
    description: 'Hotel bookings, corporate travel support, educational tours, and tailored reservations for groups, families, and teams.',
    services: ['Hotel reservations', 'Corporate travels', 'Educational tours', 'Admin support'],
  },
]

export const destinationCards = [
  { title: 'Murchison Falls', image: unsplash('photo-1547471080-7cc2caa01a7e') },
  { title: 'Queen Elizabeth National Park', image: images.treeLions },
  { title: 'Bwindi Impenetrable Forest', image: images.gorillaHero },
  { title: 'Kibale National Park', image: unsplash('photo-1516426122078-c23e76319801') },
  { title: 'Lake Bunyonyi', image: unsplash('photo-1500530855697-b586d89ba3ee') },
  { title: 'Kidepo Valley', image: images.elephant },
]

export const experienceCards = [
  { title: 'Gorilla Trekking', image: images.gorillaHero },
  { title: 'Big Five Safaris', image: images.treeLions },
  { title: 'Cultural Encounters', image: images.elephants },
  { title: 'Honeymoon Safaris', image: '/brand/elephants-sunset.jpeg' },
  { title: 'Family Safaris', image: images.elephant },
  { title: 'Photography Trips', image: '/brand/gorilla-forest.jpg' },
]

export const processSteps = [
  {
    title: 'Connect',
    description: 'Tell Top Cloud Rwenzori Adventures when you want to travel, who is coming, and what kind of journey feels right.',
    image: unsplash('photo-1528909514045-2fa4ac7a08ba'),
  },
  {
    title: 'Customise',
    description: 'We shape lodges, routes, guides, pace, and signature wildlife moments around you.',
    image: images.elephants,
  },
  {
    title: 'Confirm',
    description: 'Review your refined itinerary, secure your dates, and receive clear pre-trip support.',
    image: unsplash('photo-1517840901100-8179e982acb7'),
  },
  {
    title: 'Travel',
    description: 'Arrive with confidence while our local team supports every step of the journey.',
    image: images.elephant,
  },
]

export const tourPackages = [
  {
    slug: 'kenya-tanzania-great-migration-safari',
    duration: '9 Days',
    rating: '4.8',
    nights: '9 Nights',
    location: 'Kenya / Tanzania',
    title: 'Kenya and Tanzania Migration Safari',
    price: '$5,600',
    image: images.elephant,
    description: 'Follow East Africa safari landscapes from Kenya to Tanzania with guided game drives, big skies, and classic migration country.',
  },
  {
    slug: 'gorilla-trekking-and-queen-elizabeth-safari',
    duration: '7 Days',
    rating: '4.8',
    nights: '7 Nights',
    location: 'Uganda',
    title: 'Gorilla Trekking Safari Experience',
    price: '$3,980',
    image: images.gorillaHero,
    description: 'Track mountain gorillas through lush forest trails with expert local guides. This journey blends rare wildlife encounters, scenic landscapes, and peaceful lodge stays.',
  },
  {
    slug: 'murchison-falls-wildlife-escape',
    duration: '5 Days',
    rating: '4.7',
    nights: '5 Nights',
    location: 'Uganda',
    title: 'Murchison Falls Wildlife Safari',
    price: '$2,450',
    image: images.elephant,
    description: 'Discover Nile scenery, classic game drives, and relaxed wildlife viewing in Murchison Falls. Experience elephants, river cruises, and dramatic waterfall landscapes.',
  },
  {
    slug: 'queen-elizabeth-national-park-safari',
    duration: '4 Days',
    rating: '4.8',
    nights: '4 Nights',
    location: 'Uganda',
    title: 'Queen Elizabeth National Park Safari',
    price: '$1,980',
    image: images.treeLions,
    description: 'Explore savannah plains, crater lakes, and tree-climbing lion country. This safari combines wildlife drives, boat cruises, and beautiful western Uganda views.',
  },
  {
    slug: 'uganda-family-adventure-safari',
    duration: '8 Days',
    rating: '4.9',
    nights: '8 Nights',
    location: 'Uganda',
    title: 'Uganda Family Adventure Safari',
    price: '$4,600',
    image: images.elephants,
    description: 'A family-friendly journey designed with balanced pacing, wildlife moments, and cultural discovery. Perfect for travelers who want comfort, safety, and adventure.',
  },
  {
    slug: 'luxury-honeymoon-safari',
    duration: '6 Days',
    rating: '5.0',
    nights: '6 Nights',
    location: 'Uganda',
    title: 'Luxury Honeymoon Safari',
    price: '$5,200',
    image: images.treeLions,
    description: 'A romantic safari escape with intimate lodges, golden sunsets, and private wildlife experiences. Designed for couples seeking comfort, beauty, and unforgettable memories.',
  },
]

export const guideCards = [
  { title: 'First Time Safari Guide', image: images.elephant },
  { title: 'Best Beach Holidays in 2025', image: unsplash('photo-1500375592092-40eb2168fd21') },
  { title: 'Best Safari Destinations in 2025', image: images.treeLions },
]

export const footerColumns = [
  {
    heading: 'Destinations',
    links: ['Experiences', 'Inspiration', 'Who is Top Cloud Rwenzori Adventures?', 'Itineraries', 'Trip Planner'],
  },
  {
    heading: 'Company',
    links: ['Contact Us', 'My Account', 'Request Brochure', 'Careers'],
  },
]
