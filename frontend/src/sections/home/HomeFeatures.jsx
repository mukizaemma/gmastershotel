import { FEATURE_ICONS } from '@features/hotel/homeFeatures'
import { useHomePage } from '@lib/queries/useHomePage'
import Reveal from '@components/ui/Reveal'
import styles from './HomeFeatures.module.css'

export default function HomeFeatures() {
  const { data } = useHomePage()
  const features = data.features || []
  if (!features.length) return null

  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid}`}>
        {features.map(({ icon, title, text }, index) => {
          const Icon = FEATURE_ICONS[icon] || FEATURE_ICONS.wifi
          return (
            <Reveal key={title || index} as="article" className={styles.item} delay={index * 80}>
              <span className={styles.icon} aria-hidden="true">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
