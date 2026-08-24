import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@lib/apiClient'

let inflight = null

export async function fetchPages() {
  if (!inflight) {
    inflight = apiClient
      .get('/api/globals/pages?depth=2')
      .then((res) => res.data)
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function usePages() {
  return useQuery({
    queryKey: ['pages'],
    queryFn: fetchPages,
    staleTime: 5 * 60 * 1000,
  })
}
