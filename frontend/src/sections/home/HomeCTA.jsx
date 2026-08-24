import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import { PUBLIC_CTA } from '@features/hotel/brand'
import { useHomePage } from '@lib/queries/useHomePage'
import styles from './HomeCTA.module.css'

const FALLBACK_QUOTE = 'Come for the rest. Stay for the view.'

export default function HomeCTA() {
  const { data } = useHomePage()
  const sectionEl = useRef(null)
  const bgRef = useRef(null)
  const [inViewRef, inView] = useInView(0.2)
  const { eyebrow, headline, body, cta, backgroundImage } = data.cta
  const quote = headline || body || FALLBACK_QUOTE
  const support = headline && body ? body : ''
  const buttonLabel = cta?.label || PUBLIC_CTA.label
  const buttonPath = cta?.path || PUBLIC_CTA.path

  function setSectionRef(node) {
    sectionEl.current = node
    inViewRef(node)
  }

  useEffect(() => {
    const section = sectionEl.current
    const bg = bgRef.current
    if (!section || !bg) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined

    let frame = 0

    function update() {
      frame = 0
      const rect = section.getBoundingClientRect()
      const view = window.innerHeight || 1
      const progress = (view - rect.top) / (view + rect.height)
      const clamped = Math.max(0, Math.min(1, progress))
      const shift = (clamped - 0.5) * 18
      bg.style.transform = `translate3d(0, ${shift}%, 0) scale(1.18)`
    }

    function onScroll() {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className={styles.section} ref={setSectionRef}>
      <div
        ref={bgRef}
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
