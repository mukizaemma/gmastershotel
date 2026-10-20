import PageHero from '@components/ui/PageHero'
import { useGalleryPage } from '@lib/queries/useGalleryPage'

export default function GalleryHero() {
  const { data } = useGalleryPage()
  const { eyebrow, headline, intro, backgroundImage, cta, secondaryCta } = data.hero

  return (
    <PageHero
      image={backgroundImage}
      eyebrow={eyebrow}
      title={headline}
      text={intro}
      primaryTo={cta?.path}
      primaryLabel={cta?.label}
      secondaryTo={secondaryCta?.path}
      secondaryLabel={secondaryCta?.label}
    />
  )
}
