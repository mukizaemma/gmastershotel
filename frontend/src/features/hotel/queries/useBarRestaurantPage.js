/**
 * BAR & RESTAURANT PAGE
 * ─────────────────────────────────────────────────────────────
 * One hook for /bar-restaurant. Every section on that page
 * (BarRestaurantHero, BarRestaurantHours, BarRestaurantPanels,
 * BarRestaurantMenu headline, BarRestaurantVideo) calls this directly — same
 * query key, so only one request happens; the rest are cache hits.
 * BarRestaurantCTA is hardcoded copy with no CMS content, so it isn't
 * wired to anything here.
 * ─────────────────────────────────────────────────────────────
 */
import { useQuery } from '@tanstack/react-query'
import { headerUrl, mediaUrl } from '../adapters'
import { asPlain } from '@lib/richText'
import { DEFAULT_RESTAURANT_FEATURES } from '../restaurantSpotlight'
import { fetchPages } from './usePages'

async function fetchBarRestaurantPage() {
  const pages = await fetchPages()
  const page = pages.barRestaurant || {}

  return {
    hero: {
      eyebrow: page.hero?.eyebrow,
      headline: page.hero?.headline,
      intro: asPlain(page.hero?.intro),
      cta: page.hero?.cta || {},
      videoUrl: mediaUrl(page.hero?.videoUrl),
      backgroundImage: headerUrl(page.hero?.backgroundImage, pages.defaultHeaderImage),
    },

    homeSpotlight: {
      eyebrow: page.homeSpotlight?.eyebrow || 'Restaurant',
      headline: page.homeSpotlight?.headline || 'Taste, sip & relax',
      intro: page.homeSpotlight?.intro || 'Savor delicious food, drinks, and coffee.',
      features: (page.homeSpotlight?.features || []).filter((item) => item.title).length
        ? page.homeSpotlight.features.map((item) => ({
            id: item.id,
            icon: item.icon,
            title: item.title,
            text: item.text,
          }))
        : DEFAULT_RESTAURANT_FEATURES,
      images: (page.homeSpotlight?.images || []).map((item) => mediaUrl(item.image)).filter(Boolean),
      cta: {
        label: page.homeSpotlight?.cta?.label || 'View menu',
        path: page.homeSpotlight?.cta?.path || '/bar-restaurant',
      },
    },

    hours: (page.hours || []).map((item) => ({
      id: item.id,
      icon: item.icon,
      label: item.label,
      hours: item.hours,
    })),

    panels: (page.panels || []).map((panel) => ({
      id: panel.id,
      title: panel.title,
      description: asPlain(panel.description),
      backgroundImage: mediaUrl(panel.backgroundImage),
    })),

    menu: {
      eyebrow: page.menu?.eyebrow || 'The menu',
      headline: page.menu?.headline || 'Eat and drink with us',
    },

    video: {
      eyebrow: page.video?.eyebrow,
      headline: page.video?.headline,
      videoUrl: page.video?.videoUrl || '',
      backgroundImage: mediaUrl(page.video?.backgroundImage),
    },

    cta: {
      headline: page.cta?.headline || 'Ready to reserve your table?',
      body: asPlain(page.cta?.body, "Send us your date and party size — we'll confirm within the day."),
      buttonLabel: page.cta?.buttonLabel || 'Reserve a Table',
      buttonPath: page.cta?.buttonPath || '/contact',
    },
  }
}

export function useBarRestaurantPage() {
  return useQuery({
    queryKey: ['bar-restaurant-page'],
    queryFn: fetchBarRestaurantPage,
    staleTime: 5 * 60 * 1000,
  })
}
