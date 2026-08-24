import { useQueries } from '@tanstack/react-query'
import { apiClient } from '@lib/apiClient'

async function fetchCalendar(room) {
  const query = room ? `?room=${encodeURIComponent(room)}` : ''
  const res = await apiClient.get(`/api/availability/calendar${query}`)
  return {
    room,
    closed: res.data.closed || [],
    notes: res.data.notes || [],
    units: res.data.units || 1,
    holdback: res.data.holdback || 0,
  }
}

export function useRoomCalendars(roomSlugs = []) {
  const slugs = roomSlugs.length ? roomSlugs : ['']
  const results = useQueries({
    queries: slugs.map((room) => ({
      queryKey: ['availability-calendar', room || 'hotel'],
      queryFn: () => fetchCalendar(room),
      staleTime: 60 * 1000,
    })),
  })

  const closed = new Set(results.flatMap((item) => item.data?.closed || []))
  const notes = [...new Set(results.flatMap((item) => item.data?.notes || []))]
  const byRoom = {}
  slugs.forEach((slug, index) => {
    const data = results[index]?.data
    byRoom[slug || 'hotel'] = {
      closed: new Set(data?.closed || []),
      notes: data?.notes || [],
      units: data?.units || 1,
    }
  })
  return { closed, notes, byRoom, isLoading: results.some((item) => item.isLoading) }
}
