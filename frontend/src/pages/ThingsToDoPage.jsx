import { Link } from 'react-router-dom'
import { hasActivityPrice } from '@features/hotel/adapters'
import { useExperiences } from '@lib/queries/useExperiences'
import { useThingsToDoPage } from '@lib/queries/useThingsToDoPage'
import PageLoader from '@components/ui/PageLoader'
import PageHero from '@components/ui/PageHero'
import CardGrid from '@components/ui/CardGrid'
import Reveal from '@components/ui/Reveal'
import styles from './ThingsToDoPage.module.css'

export default function ThingsToDoPage() {
  const experiences = useExperiences()
  const page = useThingsToDoPage()
  const data = experiences.data || []
  const hero = page.data || {}

  if (experiences.isLoading || page.isLoading) return <PageLoader />
  if (experiences.isError) {
    return (
      <div role="alert" style={{ padding: '3rem', textAlign: 'center' }}>
        Couldn't load this page. Please refresh, or try again shortly.
      </div>
    )
  }

  return (
    <>
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
      <section className={styles.section}>
        <div className="container">
          <CardGrid
            items={data}
            initialCount={3}
            moreLabel="View more"
            renderCard={(item) => (
              <article key={item.id} className={styles.card}>
                <div className={styles.image} style={{ backgroundImage: item.image ? `url("${item.image}")` : undefined }} />
                <div className={styles.body}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  {hasActivityPrice(item.price) ? <strong>From ${item.price}</strong> : null}
                </div>
              </article>
            )}
          />
          <Reveal className={styles.cta}>
            <h2>Ready to make this your base in Kigali?</h2>
            <Link to="/book">Book now</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
