/**
 * CONTACT PAGE
 */
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@lib/apiClient'
import { adaptRoom, headerUrl } from '../adapters'
import { asPlain } from '@lib/richText'
import { fetchPages } from './usePages'

async function fetchContactPage() {
  const [pages, roomsRes] = await Promise.all([
    fetchPages(),
    apiClient.get('/api/rooms?limit=100&depth=1'),
  ])

  const page = pages.contact || {}

  return {
    hero: {
      eyebrow: page.hero?.eyebrow || 'Get In Touch',
      headline: page.hero?.headline || "Let's Plan Your Stay",
      intro: asPlain(
        page.hero?.intro,
        "Questions, special requests, or ready to book — send us a message and we'll reply within 24 hours.",
      ),
      backgroundImage: headerUrl(page.hero?.backgroundImage, pages.defaultHeaderImage),
      cta: page.hero?.cta || {},
      secondaryCta: page.hero?.secondaryCta || {},
    },
    responseNote: page.responseNote || "We'll get back to you within 24 hours.",
    frontDeskNote: page.frontDeskNote || 'Front desk available 24/7',
    rooms: (roomsRes.data.docs || []).map(adaptRoom),
  }
}

export function useContactPage() {
  return useQuery({
    queryKey: ['contact-page'],
    queryFn: fetchContactPage,
    staleTime: 5 * 60 * 1000,
  })
}
