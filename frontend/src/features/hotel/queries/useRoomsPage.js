/**
 * ROOMS PAGE
 * ─────────────────────────────────────────────────────────────
 * One hook for /rooms (RoomsHero, RoomsHighlights, RoomsList) — and
 * reused as-is by RoomDetailPage (/rooms/:roomId), since that page just
 * needs to find one room by slug out of the same list rather than
 * warranting its own endpoint/hook.
 * ─────────────────────────────────────────────────────────────
 */
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@lib/apiClient'
import { adaptRoom, headerUrl } from '../adapters'
import { asPlain } from '@lib/richText'
import { fetchPages } from './usePages'

async function fetchRoomsPage() {
  const [pages, roomsRes] = await Promise.all([
    fetchPages(),
    apiClient.get('/api/rooms?limit=100&depth=2'),
  ])

  const page = pages.rooms || {}

  return {
    hero: {
      eyebrow: page.hero?.eyebrow,
      headline: page.hero?.headline,
      intro: asPlain(page.hero?.intro),
      backgroundImage: headerUrl(page.hero?.backgroundImage, pages.defaultHeaderImage),
      cta: page.hero?.cta || {},
      secondaryCta: page.hero?.secondaryCta || {},
    },
    highlights: (page.highlights || []).map((item) => ({
      id: item.id,
      icon: item.icon,
      label: item.label,
    })),
    rooms: roomsRes.data.docs.map(adaptRoom),
  }
}

export function useRoomsPage() {
  return useQuery({
    queryKey: ['rooms-page'],
    queryFn: fetchRoomsPage,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRoomsList() {
  return useQuery({
    queryKey: ['rooms-list'],
    queryFn: async () => {
      const res = await apiClient.get('/api/rooms?limit=100&depth=2')
      return (res.data.docs || []).map(adaptRoom)
    },
    staleTime: 5 * 60 * 1000,
  })
}
