/**
 * DINING PAGE
 * ─────────────────────────────────────────────────────────────
 * One hook for /bar-restaurant. Sections share this query key so only
 * one request happens; the rest are cache hits.
 * ─────────────────────────────────────────────────────────────
 */
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@lib/apiClient'
import { displayCaption, headerUrl, mediaUrl } from '../adapters'
import { asPlain } from '@lib/richText'
import {
  DEFAULT_DINING,
  DEFAULT_DINING_CTA,
  DEFAULT_DINING_HERO,
  DEFAULT_DINING_HOURS,
  DEFAULT_HOME_SPOTLIGHT,
  DEFAULT_RESTAURANT_FEATURES,
  pickCopy,
} from '../restaurantSpotlight'
import { fetchPages } from './usePages'

async function fetchDiningMedia() {
  try {
    const res = await apiClient.get('/api/media', {
      params: {
        limit: 24,
        sort: 'galleryOrder,-createdAt',
        depth: 0,
        'where[and][0][mimeType][contains]': 'image',
        'where[and][1][galleryCategory][equals]': 'bar-restaurant',
      },
    })
    return res.data?.docs || []
  } catch {
    return []
  }
}

function photoFromUpload(image, caption, id) {
  const url = mediaUrl(image)
  if (!url) return null
  return {
    id,
    image: url,
    caption: caption || displayCaption(image?.alt, image?.filename) || '',
  }
}

function diningPhotos(page, mediaDocs) {
  const fromDining = (page.dining?.images || [])
    .map((item, index) => photoFromUpload(item.image, item.caption, item.id || `dining-${index}`))
    .filter(Boolean)
  if (fromDining.length) return fromDining

  const fromHome = (page.homeSpotlight?.images || [])
    .map((item, index) => photoFromUpload(item.image, '', item.id || `home-dining-${index}`))
    .filter(Boolean)
  if (fromHome.length) return fromHome

  return (mediaDocs || [])
    .map((doc) => photoFromUpload(doc, doc.alt || doc.caption, doc.id))
    .filter(Boolean)
}

function adaptHours() {
  return DEFAULT_DINING_HOURS
}

function adaptPanels(panels) {
  const rows = (panels || [])
    .map((panel) => ({
      id: panel.id,
      title: pickCopy(panel.title, ''),
      description: asPlain(panel.description),
      backgroundImage: mediaUrl(panel.backgroundImage),
    }))
    .filter((panel) => panel.title)
  return rows
}

async function fetchBarRestaurantPage() {
  const [pages, mediaDocs] = await Promise.all([fetchPages(), fetchDiningMedia()])
  const page = pages.barRestaurant || {}
  const diningSource = page.dining || {}
  const photos = diningPhotos(page, mediaDocs)
  const homeImages = (page.homeSpotlight?.images || []).map((item) => mediaUrl(item.image)).filter(Boolean)

  return {
    hero: {
      eyebrow: pickCopy(page.hero?.eyebrow, DEFAULT_DINING_HERO.eyebrow),
      headline: pickCopy(page.hero?.headline, DEFAULT_DINING_HERO.headline),
      intro: pickCopy(asPlain(page.hero?.intro), DEFAULT_DINING_HERO.intro),
      cta: {
        label: pickCopy(page.hero?.cta?.label, 'Ask us to cook'),
        path: page.hero?.cta?.path || '/contact',
      },
      videoUrl: mediaUrl(page.hero?.videoUrl),
      backgroundImage: headerUrl(page.hero?.backgroundImage, pages.defaultHeaderImage),
    },

    homeSpotlight: {
      eyebrow: pickCopy(page.homeSpotlight?.eyebrow, DEFAULT_HOME_SPOTLIGHT.eyebrow),
      headline: pickCopy(page.homeSpotlight?.headline, DEFAULT_HOME_SPOTLIGHT.headline),
      intro: pickCopy(page.homeSpotlight?.intro, DEFAULT_HOME_SPOTLIGHT.intro),
      features: DEFAULT_RESTAURANT_FEATURES,
      images: homeImages.length ? homeImages : photos.map((photo) => photo.image).slice(0, 4),
      cta: {
        label: pickCopy(page.homeSpotlight?.cta?.label, DEFAULT_HOME_SPOTLIGHT.ctaLabel),
        path: page.homeSpotlight?.cta?.path || '/bar-restaurant',
      },
    },

    hours: adaptHours(),
    panels: adaptPanels(page.panels),

    dining: {
      eyebrow: pickCopy(diningSource.eyebrow, DEFAULT_DINING.eyebrow),
      headline: pickCopy(diningSource.headline, DEFAULT_DINING.headline),
      intro: pickCopy(diningSource.intro, DEFAULT_DINING.intro),
      photos,
    },

    video: {
      eyebrow: page.video?.eyebrow,
      headline: page.video?.headline,
      videoUrl: page.video?.videoUrl || '',
      backgroundImage: mediaUrl(page.video?.backgroundImage),
    },

    cta: {
      headline: pickCopy(page.cta?.headline, DEFAULT_DINING_CTA.headline),
      body: pickCopy(asPlain(page.cta?.body), DEFAULT_DINING_CTA.body),
      buttonLabel: pickCopy(page.cta?.buttonLabel, DEFAULT_DINING_CTA.buttonLabel),
      buttonPath: page.cta?.buttonPath || '/contact',
    },
  }
}

export function useBarRestaurantPage() {
  return useQuery({
    queryKey: ['bar-restaurant-page', 'meals-gallery-v2'],
    queryFn: fetchBarRestaurantPage,
    staleTime: 5 * 60 * 1000,
  })
}
