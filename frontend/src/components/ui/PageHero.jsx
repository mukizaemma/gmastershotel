import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import styles from './PageHero.module.css'

export default function PageHero({
  image,
  eyebrow,
  title,
  text,
  primaryTo,
  primaryLabel,
  secondaryTo,
  secondaryLabel,
}) {
  return (
    <section
      className={styles.hero}
      style={image ? { backgroundImage: `url("${image}")` } : undefined}
    >
      <div className={styles.tint} />
      <div className={`container ${styles.inner}`}>
        <Reveal>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        {title && <h1 className={styles.title}>{title}</h1>}
        {text && <p className={styles.text}>{text}</p>}
        {(primaryLabel || secondaryLabel) && (
          <div className={styles.actions}>
            {primaryLabel && (
              <Link to={primaryTo || '/book'} className={styles.primary}>
                {primaryLabel}
              </Link>
            )}
            {secondaryLabel && secondaryTo && (
              <Link to={secondaryTo} className={styles.secondary}>
                {secondaryLabel}
              </Link>
            )}
          </div>
        )}
        </Reveal>
      </div>
    </section>
  )
}
