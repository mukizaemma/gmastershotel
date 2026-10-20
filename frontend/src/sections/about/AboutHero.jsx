import PageHero from '@components/ui/PageHero'
import { useAboutPage } from '@lib/queries/useAboutPage'

export default function AboutHero() {
  const { data } = useAboutPage()
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
