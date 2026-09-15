/**
 * HOME BAR & RESTAURANT DATA
 * ─────────────────────────────────────────────────────────────
 * highlights are real (confirmed in chat) — only the descriptions are
 * placeholder copy, worth a polish pass before launch. Images/captions
 * are placeholders pending real photography (same pattern as every
 * other section).
 * ─────────────────────────────────────────────────────────────
 */

export const homeBarRestaurant = {
  eyebrow: 'Dining',
  headline: 'Breakfast, then the dish you have in mind',
  body: 'Guests enjoy breakfast as part of a bed-and-breakfast stay. Our chefs can prepare any dish you choose, and a buffet for nearby offices is coming soon.',
  cta: { label: 'See breakfast & dining', path: '/bar-restaurant' },
  highlights: [
    {
      id: 'sundowners',
      title: 'Lakeside Sundowners',
      description: 'Cocktails and cold drinks, timed for the view as the sun goes down over the water.',
    },
    {
      id: 'lake-fish',
      title: 'Fresh Lake Fish',
      description: 'Caught nearby and grilled simply, so the fish speaks for itself.',
    },
    {
      id: 'local-dishes',
      title: 'Local Rwandan Dishes',
      description: 'Honest regional cooking alongside familiar favorites, for guests who want to taste the place they\u2019re visiting.',
    },
    {
      id: 'all-day-dining',
      title: 'All-Day Dining',
      description: 'Open from breakfast through dinner — not restricted to hotel-guest hours only.',
    },
  ],
  images: {
    // TODO: replace both with real food/terrace photography
    primary: '/images/bar-restaurant/fresh-fish.jpg',
    secondary: '/images/bar-restaurant/sundowner.jpg',
  },
  captions: {
    // TODO: replace with captions matching the real photos above
    primary: 'Fresh catch, grilled lakeside',
    secondary: 'Sundowner hour on the terrace',
  },
};