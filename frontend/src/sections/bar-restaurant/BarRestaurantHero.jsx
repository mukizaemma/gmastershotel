import PageHero from '@components/ui/PageHero'
import { useBarRestaurantPage } from '@lib/queries/useBarRestaurantPage'

export default function BarRestaurantHero() {
  const { data } = useBarRestaurantPage()
  const { eyebrow, headline, intro, cta, backgroundImage } = data.hero

  return (
    <PageHero
      image={backgroundImage}
      eyebrow={eyebrow}
      title={headline}
      text={intro}
      primaryTo={cta?.path || '/contact'}
      primaryLabel={cta?.label || 'Ask us to cook'}
      secondaryTo="/book"
      secondaryLabel="Book a stay"
    />
  )
}
