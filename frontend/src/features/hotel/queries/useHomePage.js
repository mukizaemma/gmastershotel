/**
 * HOME PAGE
 * One hook for the whole Home page. HomePage.jsx gates loading/error;
 * each section calls it again — same query key, so React Query serves
 * it from cache.
 */
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@lib/apiClient'
import { adaptRoom, headerUrl, mediaUrl } from '../adapters'
import { asPlain } from '@lib/richText'
import { DEFAULT_HOME_FEATURES } from '../homeFeatures'
import { fetchPages } from './usePages'

async function fetchHomePage() {
  const [pages, roomsRes] = await Promise.all([
    fetchPages(),
    apiClient.get('/api/rooms?limit=100&depth=2'),
  ])

  const page = pages.home || {}
  const fallback = pages.defaultHeaderImage
  const rooms = roomsRes.data.docs.map(adaptRoom)
  const features = (page.features || [])
    .map((item) => ({
      id: item.id,
      icon: item.icon,
      title: item.title,
      text: item.text,
    }))
    .filter((item) => item.title)

  return {
    hero: {
      slides: (page.hero?.slides || []).map((slide) => ({
        id: slide.id,
        eyebrow: slide.eyebrow,
        headline: slide.headline,
        subline: asPlain(slide.subline),
        image: headerUrl(slide.image, fallback),
      })),
      cta: {
        label: page.hero?.cta?.label || 'Book your stay',
        link: page.hero?.cta?.link || '/book',
      },
      secondaryCta: {
        label: page.hero?.secondaryCta?.label || 'Explore rooms',
        link: page.hero?.secondaryCta?.link || '/accommodation',
      },
    },

    features: features.length ? features : DEFAULT_HOME_FEATURES,

    welcome: {
      eyebrow: page.welcome?.eyebrow,
      headline: page.welcome?.headline,
      body: asPlain(page.welcome?.body),
      cta: page.welcome?.cta || {},
      images: {
        primary: mediaUrl(page.welcome?.primaryImage),
        secondary: mediaUrl(page.welcome?.secondaryImage),
      },
      reviewBadges: (page.welcome?.reviewBadges || []).map((badge) => ({
        id: badge.id,
        source: badge.source,
        score: badge.score,
        tier: badge.tier,
        reviewCount: badge.reviewCount,
      })),
    },

    roomsSection: {
      eyebrow: page.roomsSection?.eyebrow || 'Stay',
      headline: page.roomsSection?.headline || 'Rooms made for real rest',
      intro:
        page.roomsSection?.intro ||
        'Quiet nights, thoughtful details, and space to unwind by Lake Kivu.',
    },

    barRestaurant: {
      eyebrow: page.barRestaurantSpotlight?.eyebrow,
      headline: page.barRestaurantSpotlight?.headline,
      body: asPlain(page.barRestaurantSpotlight?.body),
      cta: page.barRestaurantSpotlight?.cta || {},
      highlights: (page.barRestaurantSpotlight?.highlights || []).map((item) => ({
        ...item,
        description: asPlain(item.description),
      })),
      images: {
        primary: mediaUrl(page.barRestaurantSpotlight?.images?.primary),
        secondary: mediaUrl(page.barRestaurantSpotlight?.images?.secondary),
      },
      captions: {
        primary: page.barRestaurantSpotlight?.captions?.primary,
        secondary: page.barRestaurantSpotlight?.captions?.secondary,
      },
    },

    cta: {
      eyebrow: page.cta?.eyebrow || '',
      headline: String(page.cta?.headline || '').trim(),
      body: asPlain(page.cta?.body),
      cta: {
        label: page.cta?.cta?.label || 'Book Now',
        path: page.cta?.cta?.path || '/book',
      },
      backgroundImage: mediaUrl(page.cta?.backgroundImage) || '/images/home/cta-bg.jpg',
    },

    rooms,
  }
}

export function useHomePage() {
  return useQuery({
    queryKey: ['home-page'],
    queryFn: fetchHomePage,
    staleTime: 5 * 60 * 1000,
  })
}
