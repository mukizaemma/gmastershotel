import { publicSocialUrl } from './socials'

function firstUrl(...values) {
  for (const value of values) {
    const href = publicSocialUrl(value)
    if (href) return href
  }
  return ''
}

export function reviewLinks(company) {
  const reviews = company?.reviews || {}
  const socials = company?.socials || {}

  const googleWrite = firstUrl(reviews.googleWriteUrl)
  const googleRead = firstUrl(reviews.googleReadUrl, googleWrite)

  const tripadvisorWrite = firstUrl(reviews.tripadvisorWriteUrl)
  const tripadvisorRead = firstUrl(reviews.tripadvisorReadUrl, tripadvisorWrite, socials.tripadvisor)

  return {
    googleWrite,
    googleRead,
    tripadvisorWrite,
    tripadvisorRead,
    hasAny: Boolean(googleWrite || googleRead || tripadvisorWrite || tripadvisorRead),
  }
}
