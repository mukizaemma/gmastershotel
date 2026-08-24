/**
 * ABOUT PAGE
 * ─────────────────────────────────────────────────────────────
 * One hook for /about. Every section on that page (AboutHero,
 * AboutStory, AboutValues) calls this directly — same query key, so
 * only one request happens; the rest are cache hits. AboutCTA follows
 * the same pattern too, unlike BarRestaurantCTA — About's CTA group has
 * real CMS content (eyebrow/headline/body/button/backgroundImage), it
 * isn't hardcoded copy.
 * ─────────────────────────────────────────────────────────────
 */
import { useQuery } from '@tanstack/react-query'
import { headerUrl, mediaUrl } from '../adapters'
import { asPlain } from '@lib/richText'
import { fetchPages } from './usePages'

async function fetchAboutPage() {
  const pages = await fetchPages()
  const page = pages.about || {}

  return {
    hero: {
      eyebrow: page.hero?.eyebrow,
      headline: page.hero?.headline,
      intro: asPlain(page.hero?.intro),
      backgroundImage: headerUrl(page.hero?.backgroundImage, pages.defaultHeaderImage),
    },

    story: {
      eyebrow: page.story?.eyebrow,
      headline: page.story?.headline,
      paragraphs: (page.story?.paragraphs || []).map((p) => asPlain(p.text)),
      quote: page.story?.quote,
      image: mediaUrl(page.story?.image),
    },

    values: (page.values || []).map((v) => ({
      id: v.id,
      icon: v.icon,
      title: v.title,
      description: asPlain(v.description),
    })),

    cta: {
      eyebrow: page.cta?.eyebrow,
      headline: page.cta?.headline,
      body: asPlain(page.cta?.body),
      button: page.cta?.button || {},
      backgroundImage: mediaUrl(page.cta?.backgroundImage),
    },
  }
}

export function useAboutPage() {
  return useQuery({
    queryKey: ['about-page'],
    queryFn: fetchAboutPage,
    staleTime: 5 * 60 * 1000,
  })
}