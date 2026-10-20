import PageHero from '@components/ui/PageHero'
import { useContactPage } from '@lib/queries/useContactPage'

export default function ContactHero() {
  const { data } = useContactPage()
  const hero = data.hero

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
