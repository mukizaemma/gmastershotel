import { Link } from 'react-router-dom'
import { headerUrl } from '@features/hotel/adapters'
import { usePages } from '@lib/queries/usePages'
import { asHtml, asPlain, isBlankHtml } from '@lib/richText'
import PageHero from '@components/ui/PageHero'
import RichText from '@components/ui/RichText'
import Reveal from '@components/ui/Reveal'
import styles from './PolicyPage.module.css'

export default function PolicyPage() {
  const { data } = usePages()
  const page = data?.policy || {}
  const hero = page.hero || {}
  const headline = hero.headline || ''
  const intro = asPlain(hero.intro)
  const body = asHtml(page.body)
  const hasBody = !isBlankHtml(body)
  const hasHero = Boolean(headline || hero.eyebrow || intro || hero.backgroundImage || hero.cta?.label)

  return (
    <>
      {hasHero && (
        <PageHero
          image={headerUrl(hero.backgroundImage, data?.defaultHeaderImage)}
          eyebrow={hero.eyebrow}
          title={headline}
          text={intro}
          primaryTo={hero.cta?.path}
          primaryLabel={hero.cta?.label}
          secondaryTo={hero.secondaryCta?.path}
          secondaryLabel={hero.secondaryCta?.label}
        />
      )}
      <section className={styles.section}>
      <div className="container">
        <Reveal>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span aria-current="page">{headline || 'Booking policy'}</span>
        </nav>
        {!headline && <h1 className={styles.headline}>Booking policy</h1>}
        {!hasHero && intro ? <p className={styles.lede}>{intro}</p> : null}
        {!hasBody && (
        <div className={styles.body}>
          <h2>Requests, not instant confirmation</h2>
          <p>
            Submitting a booking asks us to hold the dates you selected. Pay-on-arrival and Western
            Union requests stay pending until our team confirms availability and payment.
          </p>
          <h2>Payment</h2>
          <p>
            Card payments are processed by Stripe. Mobile Money is processed by MTN. Western Union
            transfers must include your booking reference. Rates shown on the website are in USD
            unless we tell you otherwise.
          </p>
          <h2>Your details</h2>
          <p>
            We use your name, phone, and email only to confirm the stay and contact you about it.
            We do not sell guest information.
          </p>
          <h2>Changes and cancellations</h2>
          <p>
            Contact us by phone, WhatsApp, or email as soon as you need to change dates. We will
            confirm what we can do based on occupancy.
          </p>
        </div>
        )}
        {hasBody && <RichText className={styles.body} value={body} />}
        </Reveal>
      </div>
    </section>
    </>
  )
}
