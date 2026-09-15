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
  const fromCms = (page.dining?.images || [])
    .map((item, index) => photoFromUpload(item.image, item.caption, item.id || `dining-${index}`))
    .filter(Boolean)
  if (fromCms.length) return fromCms

  return (mediaDocs || [])
    .map((doc) => photoFromUpload(doc, doc.alt || doc.caption, doc.id))
    .filter(Boolean)
}

function adaptHours(hours) {
  const rows = (hours || []).filter((item) => item.label)
  if (!rows.length || rows.some((item) => /restaurant/i.test(item.label))) {
    return DEFAULT_DINING_HOURS
  }
  return rows.map((item) => ({
    id: item.id,
    icon: item.icon,
    label: item.label,
    hours: item.hours,
  }))
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
  const diningSource = page.dining || page.menu || {}

  return {
    hero: {
      eyebrow: pickCopy(page.hero?.eyebrow, DEFAULT_DINING_HERO.eyebrow),
      headline: pickCopy(page.hero?.headline, DEFAULT_DINING_HERO.headline),
      intro: pickCopy(asPlain(page.hero?.intro), DEFAULT_DINING_HERO.intro),
      cta: {
        label: pickCopy(page.hero?.cta?.label, 'Ask about dining'),
        path: page.hero?.cta?.path || '/contact',
      },
      videoUrl: mediaUrl(page.hero?.videoUrl),
      backgroundImage: headerUrl(page.hero?.backgroundImage, pages.defaultHeaderImage),
    },

    homeSpotlight: {
      eyebrow: pickCopy(page.homeSpotlight?.eyebrow, DEFAULT_HOME_SPOTLIGHT.eyebrow),
      headline: pickCopy(page.homeSpotlight?.headline, DEFAULT_HOME_SPOTLIGHT.headline),
      intro: pickCopy(page.homeSpotlight?.intro, DEFAULT_HOME_SPOTLIGHT.intro),
      features: (() => {
        const cmsFeatures = (page.homeSpotlight?.features || []).filter((item) => item.title)
        const generic = cmsFeatures.every((item) => ['Food', 'Drinks', 'Coffee'].includes(item.title))
        if (!cmsFeatures.length || generic) return DEFAULT_RESTAURANT_FEATURES
        return cmsFeatures.map((item) => ({
          id: item.id,
          icon: item.icon,
          title: item.title,
          text: item.text,
        }))
      })(),
      images: (page.homeSpotlight?.images || []).map((item) => mediaUrl(item.image)).filter(Boolean),
      cta: {
        label: pickCopy(page.homeSpotlight?.cta?.label, DEFAULT_HOME_SPOTLIGHT.ctaLabel),
        path: page.homeSpotlight?.cta?.path || '/bar-restaurant',
      },
    },

    hours: adaptHours(page.hours),
    panels: adaptPanels(page.panels),

    dining: {
      eyebrow: pickCopy(diningSource.eyebrow, DEFAULT_DINING.eyebrow),
      headline: pickCopy(diningSource.headline, DEFAULT_DINING.headline),
      intro: pickCopy(diningSource.intro, DEFAULT_DINING.intro),
      photos: diningPhotos(page, mediaDocs),
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
    queryKey: ['bar-restaurant-page'],
    queryFn: fetchBarRestaurantPage,
    staleTime: 5 * 60 * 1000,
  })
}
