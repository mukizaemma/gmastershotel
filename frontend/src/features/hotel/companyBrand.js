import { mediaUrl } from './adapters'
import { BRAND } from './brand'

export function brandFromCompany(company) {
  const name = String(company?.name || '').trim() || BRAND.name
  const logo = mediaUrl(company?.logo) || ''
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  return {
    name,
    logo,
    initials: initials || 'H',
    tagline: company?.tagline || BRAND.tagline,
  }
}
