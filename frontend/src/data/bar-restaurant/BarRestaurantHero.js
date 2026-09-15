/**
 * BAR & RESTAURANT — HERO
 * ─────────────────────────────────────────────────────────────
 * videoUrl is intentionally empty — no footage exists yet. The hero
 * falls back to a moody gradient background if empty (see
 * BarRestaurantHero.jsx); once you have real slow-motion footage of
 * people toasting/cheersing, drop the URL in here.
 * ─────────────────────────────────────────────────────────────
 */

export const barRestaurantHero = {
  eyebrow: 'Bed & breakfast',
  headline: 'Breakfast for guests. Dishes cooked to order.',
  intro:
    'We do not run a restaurant menu yet. Stay with us and enjoy breakfast, or ask our professional chefs to prepare any dish you like. A buffet for nearby offices is on the way.',
  cta: { label: 'Ask about dining', path: '/contact' },
  // TODO: replace with real slow-motion video (people toasting/cheersing)
  videoUrl: '/images/bar-restaurant/hero-video.mp4',
  // TODO: replace with a real photo — used as poster + fallback if no video
  backgroundImage: '/images/bar-restaurant/hero-bg.jpg',
}