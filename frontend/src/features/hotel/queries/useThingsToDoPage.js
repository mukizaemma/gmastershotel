import { useQuery } from '@tanstack/react-query'
import { headerUrl } from '../adapters'
import { asPlain } from '@lib/richText'
import { fetchPages } from './usePages'

async function fetchThingsToDoPage() {
  const pages = await fetchPages()
  const page = pages.thingsToDo || {}
  return {
    eyebrow: page.hero?.eyebrow,
    headline: page.hero?.headline,
    intro: asPlain(page.hero?.intro),
    backgroundImage: headerUrl(page.hero?.backgroundImage, pages.defaultHeaderImage),
    cta: page.hero?.cta || {},
    secondaryCta: page.hero?.secondaryCta || {},
  }
}

export function useThingsToDoPage() {
  return useQuery({
    queryKey: ['things-to-do-page'],
    queryFn: fetchThingsToDoPage,
    staleTime: 5 * 60 * 1000,
  })
}
