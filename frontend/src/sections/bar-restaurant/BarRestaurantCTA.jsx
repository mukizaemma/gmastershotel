import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import { useBarRestaurantPage } from '@lib/queries/useBarRestaurantPage'
import { DEFAULT_DINING_CTA, looksLikeReservation, pickCopy } from '@features/hotel/restaurantSpotlight'
import styles from './BarRestaurantCTA.module.css'

export default function BarRestaurantCTA() {
  const [ref, inView] = useInView(0.3)
  const { data } = useBarRestaurantPage()
  const raw = data?.cta || {}
  const headline = pickCopy(raw.headline, DEFAULT_DINING_CTA.headline)
  const body = pickCopy(raw.body, DEFAULT_DINING_CTA.body)
  const buttonLabel = looksLikeReservation(raw.buttonLabel)
    ? DEFAULT_DINING_CTA.buttonLabel
    : pickCopy(raw.buttonLabel, DEFAULT_DINING_CTA.buttonLabel)
  const buttonPath = raw.buttonPath || '/contact'

  return (
    <section className={styles.section} ref={ref}>
      <div className={`container ${styles.inner}`}>
        <h2 className={`${styles.headline} fade-in-up ${inView ? 'is-visible' : ''}`}>
          {headline}
        </h2>
        <p className={`${styles.body} fade-in-up ${inView ? 'is-visible' : ''}`} style={{ animationDelay: '0.1s' }}>
          {body}
        </p>
        <Link
          to={buttonPath}
          className={`${styles.ctaBtn} fade-in-up ${inView ? 'is-visible' : ''}`}
          style={{ animationDelay: '0.2s' }}
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  )
}
