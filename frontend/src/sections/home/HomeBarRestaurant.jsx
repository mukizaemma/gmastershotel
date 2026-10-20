import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBarRestaurantPage } from '@lib/queries/useBarRestaurantPage'
import { RESTAURANT_FEATURE_ICONS } from '@features/hotel/restaurantSpotlight'
import Reveal from '@components/ui/Reveal'
import styles from './HomeBarRestaurant.module.css'

export default function HomeBarRestaurant() {
  const { data } = useBarRestaurantPage()
  const spotlight = data?.homeSpotlight
  const images = spotlight?.images || []
  const [failed, setFailed] = useState([])
  const photos = images.filter((src) => src && !failed.includes(src)).slice(0, 3)

  if (!spotlight) return null
  const features = spotlight.features || []

  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal className={styles.header}>
          {spotlight.eyebrow && <span className={styles.eyebrow}>{spotlight.eyebrow}</span>}
          <h2>{spotlight.headline}</h2>
          {spotlight.intro && <p className={styles.intro}>{spotlight.intro}</p>}
        </Reveal>

        {features.length > 0 && (
          <ul className={styles.features}>
            {features.map((item, index) => {
              const Icon = RESTAURANT_FEATURE_ICONS[item.icon] || RESTAURANT_FEATURE_ICONS.food
              return (
                <Reveal as="li" key={item.id || item.title} className={styles.feature} delay={index * 80}>
                  <span className={styles.iconWrap}>
                    <Icon size={22} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Reveal>
              )
            })}
          </ul>
        )}

        {photos.length > 0 && (
          <div className={styles.gallery}>
            {photos.map((src, index) => (
              <Reveal as="figure" key={src} className={styles.photo} delay={index * 80}>
                <img
                  src={src}
                  alt=""
                  onError={() => setFailed((current) => (current.includes(src) ? current : [...current, src]))}
                />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className={styles.actions} delay={120}>
          <Link to={spotlight.cta.path || '/bar-restaurant'} className={styles.cta}>
            {spotlight.cta.label || 'See how we cook for you'}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
