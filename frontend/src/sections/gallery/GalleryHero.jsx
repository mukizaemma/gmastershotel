import PageHero from '@components/ui/PageHero'
import { useGalleryPage } from '@lib/queries/useGalleryPage'
import { useSiteLayout } from '@lib/queries/useSiteLayout'
import { brandFromCompany } from '@features/hotel/companyBrand'

export default function GalleryHero() {
  const { data } = useGalleryPage()
  const { data: layout } = useSiteLayout()
  const brand = brandFromCompany(layout?.company)
  const { eyebrow, headline, intro, backgroundImage, cta, secondaryCta } = data.hero

  return (
    <PageHero
      image={backgroundImage}
      eyebrow={eyebrow || 'Look around'}
      title={headline || `${brand.name}, in pictures`}
      text={intro || 'Rooms, dining, and the light on Lake Kivu that makes guests linger.'}
      primaryTo={cta?.path || '/book'}
      primaryLabel={cta?.label || 'Book now'}
      secondaryTo={secondaryCta?.path || '/accommodation'}
      secondaryLabel={secondaryCta?.label || 'View rooms'}
    />
  )
}
