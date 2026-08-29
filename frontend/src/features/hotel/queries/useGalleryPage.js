/**
 * GALLERY PAGE
 * Public /gallery reads Media files marked showOnGallery.
 * Legacy gallery-photos remain as a fallback until staff curates the new list.
 */
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@lib/apiClient'
import { headerUrl, mediaUrl, displayCaption } from '../adapters'
import { asPlain } from '@lib/richText'
import { fetchPages } from './usePages'

function adaptMedia(doc) {
  return {
    id: doc.id,
    category: doc.galleryCategory || 'rooms',
    caption: displayCaption(doc.alt, doc.filename),
    aspect: 'square',
    image: mediaUrl(doc),
  }
}

function adaptLegacyPhoto(doc) {
  return {
    id: doc.id,
    category: doc.category,
    caption: displayCaption(doc.caption),
    aspect: doc.aspect || 'square',
    image: mediaUrl(doc.photo),
  }
}

async function fetchGalleryPage() {
  const [pages, mediaRes, photosRes] = await Promise.all([
    fetchPages(),
    apiClient.get('/api/media', {
      params: {
        limit: 100,
        sort: 'galleryOrder,-createdAt',
        'where[and][0][showOnGallery][equals]': true,
        'where[and][1][mimeType][contains]': 'image',
        'where[and][2][galleryCategory][not_equals]': 'none',
      },
    }),
    apiClient.get('/api/gallery-photos?limit=100&depth=2'),
  ])

  const page = pages.gallery || {}
  const fromMedia = (mediaRes.data.docs || [])
    .filter((doc) => doc.galleryCategory && doc.galleryCategory !== 'none')
    .map(adaptMedia)
  const images = fromMedia.length
    ? fromMedia
    : (photosRes.data.docs || []).map(adaptLegacyPhoto)

  return {
    hero: {
      eyebrow: page.eyebrow,
      headline: page.headline,
      intro: asPlain(page.intro),
      backgroundImage: headerUrl(page.backgroundImage, pages.defaultHeaderImage),
      cta: page.cta || {},
      secondaryCta: page.secondaryCta || {},
    },
    images,
  }
}

export function useGalleryPage() {
  return useQuery({
    queryKey: ['gallery-page'],
    queryFn: fetchGalleryPage,
    staleTime: 5 * 60 * 1000,
  })
}
