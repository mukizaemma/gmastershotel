import { UtensilsCrossed, Coffee, Truck, Users } from 'lucide-react'

export const RESTAURANT_FEATURE_ICONS = {
  food: UtensilsCrossed,
  drinks: UtensilsCrossed,
  coffee: Coffee,
  buffet: Truck,
  groups: Users,
  delivery: Truck,
}

export const DEFAULT_RESTAURANT_FEATURES = [
  {
    icon: 'food',
    title: 'Food and drinks on site',
    text: 'Stay with us and eat well. We prepare food and drinks here, so you do not have to hunt for a meal after a long day.',
  },
  {
    icon: 'groups',
    title: 'Cooking for groups',
    text: 'Travelling as a team, family, or office group? Tell us how many you are and what you like — we will cook for everyone staying with us.',
  },
  {
    icon: 'delivery',
    title: 'Cooked and delivered in Kigali',
    text: 'Need the meal where you are? We can cook and deliver anywhere in Kigali — to your office, home, or meeting.',
  },
]

export const DEFAULT_DINING_HOURS = [
  { id: 'breakfast', icon: 'breakfast', label: 'Breakfast', hours: 'Your choice of dishes' },
  { id: 'lunch', icon: 'lunch', label: 'Lunch', hours: 'Your choice of dishes' },
  { id: 'dinner', icon: 'dinner', label: 'Dinner', hours: 'Your choice of dishes' },
]

export const DEFAULT_DINING = {
  eyebrow: 'Meals, your way',
  headline: 'Breakfast, lunch, and dinner — cooked as you like them.',
  intro:
    'Travellers stay with us knowing they will eat well. There is no set restaurant menu and no table to reserve. Tell us the dishes you want, and our chefs prepare them for breakfast, lunch, or dinner.',
}

export const DEFAULT_DINING_HERO = {
  eyebrow: 'Dining',
  headline: 'Eat well while you stay. Ask for the dishes you want.',
  intro:
    'We cook breakfast, lunch, and dinner to order. No restaurant seating to book — just tell the front desk what you would like, for yourself or for a group.',
}

export const DEFAULT_DINING_CTA = {
  headline: 'Tell us what to cook',
  body: 'Ask for breakfast, lunch, or dinner, a meal for your group, or delivery anywhere in Kigali. The front desk will pass your request to the kitchen.',
  buttonLabel: 'Contact us',
}

export const DEFAULT_HOME_SPOTLIGHT = {
  eyebrow: 'Food & drinks',
  headline: 'Eat here, or we will cook and bring it to you',
  intro:
    'Guests find food and drinks at the hotel. We also cook for groups staying with us, and we can cook and deliver anywhere in Kigali.',
  ctaLabel: 'See how we cook for you',
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
  'Bed & breakfast',
  'Guests eat well. Tell us what you would like.',
  'We are not a full restaurant yet. Hotel guests enjoy breakfast, and our chefs can cook any dish you have in mind. A buffet for nearby offices and workers is on the way.',
  'Breakfast for guests. Dishes cooked to order.',
  'We do not run a restaurant menu yet. Stay with us and enjoy breakfast, or ask our professional chefs to prepare any dish you like. A buffet for nearby offices is on the way.',
  'Tell us what you would like to eat',
  'Breakfast, then the dish you have in mind',
  'Guests enjoy breakfast as part of a bed-and-breakfast stay. Our chefs can prepare any dish you choose, and a buffet for nearby offices is coming soon.',
  'See breakfast & dining',
  'Ask about dining',
  "Send us your date and party size — we'll confirm within the day.",
  'Send us your date and party size — we’ll confirm within the day.',
])

export function looksLikeReservation(value) {
  return /reserv(e|ing|ation).{0,40}table|table.{0,24}reserv|party size/i.test(String(value || ''))
}

export function pickCopy(value, fallback) {
  const text = String(value || '').trim()
  if (!text || STALE.has(text) || looksLikeReservation(text)) return fallback
  return text
}
