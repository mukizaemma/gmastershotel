import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import { PUBLIC_CTA } from '@features/hotel/brand'
import { useHomePage } from '@lib/queries/useHomePage'
import styles from './HomeCTA.module.css'

const FALLBACK_QUOTE = 'Come for the rest. Stay for the view.'

export default function HomeCTA() {
  const { data } = useHomePage()
  const [sectionRef, inView] = useInView(0.2)
  const { eyebrow, headline, body, cta, backgroundImage } = data.cta
  const quote = headline || body || FALLBACK_QUOTE
  const support = headline && body ? body : ''
  const buttonLabel = cta?.label || PUBLIC_CTA.label
  const buttonPath = cta?.path || PUBLIC_CTA.path

  return (
    <section className={styles.section} ref={sectionRef}>
      <div
        className={styles.bg}
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}
        aria-hidden="true"
      />
      <div className={styles.tint} />

      <div className={`container ${styles.inner}`}>
        <div className={`${styles.copy} fade-in-up ${inView ? 'is-visible' : ''}`}>
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <blockquote className={styles.quote}>{quote}</blockquote>
          {support ? <p className={styles.support}>{support}</p> : null}
          <Link to={buttonPath} className={styles.ctaBtn}>
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
