import { UtensilsCrossed, Coffee, Building2, ChefHat } from 'lucide-react'

export const RESTAURANT_FEATURE_ICONS = {
  food: UtensilsCrossed,
  drinks: ChefHat,
  coffee: Coffee,
  buffet: Building2,
}

export const DEFAULT_RESTAURANT_FEATURES = [
  {
    icon: 'coffee',
    title: 'Breakfast for guests',
    text: 'We are a bed and breakfast. Guests start the day with a proper breakfast, prepared on site.',
  },
  {
    icon: 'drinks',
    title: 'Cooked to order',
    text: 'Professional chefs can prepare any dish you like — tell us what you are craving, and we will make it.',
  },
  {
    icon: 'buffet',
    title: 'Neighbourhood buffet',
    text: 'A buffet for nearby offices and workers is on the way, so good food is close at hand during the day.',
  },
]

export const DEFAULT_DINING_HOURS = [
  { id: 'breakfast', icon: 'breakfast', label: 'Breakfast', hours: 'Served to hotel guests' },
  { id: 'custom', icon: 'custom', label: 'Dishes to order', hours: 'Ask the front desk' },
  { id: 'buffet', icon: 'buffet', label: 'Office buffet', hours: 'Coming soon' },
]

export const DEFAULT_DINING_PANELS = [
  {
    id: 'breakfast',
    title: 'Breakfast you can linger over',
    description:
      'Guests enjoy breakfast as part of a bed-and-breakfast stay — a calm start before work, travel, or a day in Kagugu.',
  },
  {
    id: 'chefs',
    title: 'Chefs who cook what you ask for',
    description:
      'We do not run a fixed restaurant menu yet. Our professional chefs will prepare any dish of your choice — local favourites or something from home.',
  },
  {
    id: 'buffet',
    title: 'A buffet for the neighbourhood',
    description:
      'We are planning a buffet so people working in the offices around us can find nice food nearby. Watch this space.',
  },
]

export const DEFAULT_DINING = {
  eyebrow: 'Bed & breakfast',
  headline: 'Guests eat well. Tell us what you would like.',
  intro:
    'We are not a full restaurant yet. Hotel guests enjoy breakfast, and our chefs can cook any dish you have in mind. A buffet for nearby offices and workers is on the way.',
}

export const DEFAULT_DINING_HERO = {
  eyebrow: 'Bed & breakfast',
  headline: 'Breakfast for guests. Dishes cooked to order.',
  intro:
    'We do not run a restaurant menu yet. Stay with us and enjoy breakfast, or ask our professional chefs to prepare any dish you like. A buffet for nearby offices is on the way.',
}

export const DEFAULT_DINING_CTA = {
  headline: 'Tell us what you would like to eat',
  body: 'Whether it is breakfast with your stay or a dish cooked just for you, the front desk will pass your request to the kitchen.',
  buttonLabel: 'Contact us',
}

export const DEFAULT_HOME_SPOTLIGHT = {
  eyebrow: 'Dining',
  headline: 'Breakfast, then the dish you have in mind',
  intro:
    'Guests enjoy breakfast as part of a bed-and-breakfast stay. Our chefs can prepare any dish you choose, and a buffet for nearby offices is coming soon.',
  ctaLabel: 'See breakfast & dining',
}

const STALE = new Set([
  'Restaurant',
  'Taste, sip & relax',
  'Savor delicious food, drinks, and coffee.',
  'View menu',
  'The menu',
  'Eat and drink with us',
  'Bar & Restaurant',
  'Restaurant & bar',
  'You came to the right place',
  'Leave everything behind. Good food, good drinks, and a view worth staying for.',
  'Ready to reserve your table?',
  'Reserve a Table',
  'Reserve a table',
  'Lakeside Sundowners',
  'Fresh Lake Fish',
  'Local Rwandan Dishes',
  'All-Day Dining',
])

export function pickCopy(value, fallback) {
  const text = String(value || '').trim()
  if (!text || STALE.has(text)) return fallback
  return text
}
