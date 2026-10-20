import PageHero from '@components/ui/PageHero'
import { useBarRestaurantPage } from '@lib/queries/useBarRestaurantPage'

export default function BarRestaurantHero() {
  const { data } = useBarRestaurantPage()
  const { eyebrow, headline, intro, cta, secondaryCta, backgroundImage } = data.hero

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
