import PageHero from '@components/ui/PageHero'
import { useRoomsPage } from '@lib/queries/useRoomsPage'

export default function RoomsHero() {
  const { data } = useRoomsPage()
  const { hero } = data

  return (
    <PageHero
      image={hero.backgroundImage}
      eyebrow={hero.eyebrow}
      title={hero.headline}
      text={hero.intro}
      primaryTo={hero.cta?.path}
      primaryLabel={hero.cta?.label}
      secondaryTo={hero.secondaryCta?.path}
      secondaryLabel={hero.secondaryCta?.label}
    />
  )
}
