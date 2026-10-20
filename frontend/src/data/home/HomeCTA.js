/**
 * HOME CTA DATA
 * ─────────────────────────────────────────────────────────────
 * mapUrl uses a Google Maps search query (property name + "Kagugu,
 * Kigali") rather than real coordinates, since we don't have the
 * property's exact pin yet. TODO: replace with the real Google Maps
 * place link once available, so "Get Directions" points precisely at
 * the property rather than a general area search.
 * ─────────────────────────────────────────────────────────────
 */

/*export const homeCTA = {
  eyebrow: 'Ready When You Are',
  headline: 'Your stay in Kigali starts here',
  body: "Comfortable rooms and honest food in Kagugu — book direct and we'll take care of the rest.",
  cta: { label: 'Book Now', path: '/contact' },
  // TODO: replace with a real exterior/lake photo
  backgroundImage: '/images/home/cta-bg.jpg',
  location: {
    address: 'Kagugu, Kigali, Rwanda',
    distanceFromKigali: 'In Kigali — Kagugu',
    // TODO: swap for the real Google Maps place link once the property has a confirmed pin
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kagugu%2C+Kigali%2C+Rwanda',
  },
};
*/

/**
 * HOME CTA DATA
 * ─────────────────────────────────────────────────────────────
 * mapUrl uses a Google Maps search query (property name + "Kagugu,
 * Kigali") rather than real coordinates, since we don't have the
 * property's exact pin yet. TODO: replace with the real Google Maps
 * place link once available, so "Get Directions" points precisely at
 * the property rather than a general area search.
 * ─────────────────────────────────────────────────────────────
 */

export const homeCTA = {
  eyebrow: 'Ready When You Are',
  headline: 'Your stay in Kigali starts here',
  body: "Comfortable rooms and honest food in Kagugu — book direct and we'll take care of the rest.",
  cta: { label: 'Book Now', path: '/contact' },
  // TODO: replace with a real exterior/lake photo — using warm amber/gold
  // tones here (rather than another dark teal) so this placeholder is
  // clearly visible against the dark Bar & Restaurant and Video sections
  // directly above/below it, instead of blending into one dark mass
  backgroundImage: '/images/home/cta-bg.jpg',
  // Location details now live in @data/company.js (shared with Footer)
};