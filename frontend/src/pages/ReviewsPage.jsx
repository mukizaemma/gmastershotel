import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, ExternalLink, MessageCircle, Star } from 'lucide-react'
import { useSiteLayout } from '@lib/queries/useSiteLayout'
import { reviewLinks } from '@features/hotel/reviewLinks'
import { SOCIAL_ICONS } from '@features/hotel/socialIcons'
import Reveal from '@components/ui/Reveal'
import styles from './ReviewsPage.module.css'

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.2 0-5.8-2.1-6.8-5H1.2v3.1C3.2 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.2C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.4l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.1 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4 3.1C6.2 6.9 8.8 4.8 12 4.8z" />
    </svg>
  )
}

function PlatformCard({ name, mark, writeUrl, readUrl, writeLabel }) {
  if (!writeUrl && !readUrl) return null

  return (
    <article className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.mark}>{mark}</span>
        <div>
          <h2>{name}</h2>
          <p>Public reviews on {name}. We do not store guest comments on this website.</p>
        </div>
      </div>
      <div className={styles.cardActions}>
        {writeUrl ? (
          <a href={writeUrl} target="_blank" rel="noopener noreferrer" className={styles.primary}>
            {writeLabel}
            <ExternalLink size={15} />
          </a>
        ) : null}
        {readUrl ? (
          <a href={readUrl} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
            Read reviews
            <ExternalLink size={15} />
          </a>
        ) : null}
      </div>
    </article>
  )
}

export default function ReviewsPage() {
  const { data } = useSiteLayout()
  const company = data?.company || {}
  const hotel = company.name || 'GMasters Boutique Hotel'
  const links = reviewLinks(company)
  const [copied, setCopied] = useState(false)
  const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}/reviews` : '/reviews'
  const shareText = `How was your stay at ${hotel}? A short Google or TripAdvisor review helps other travelers. ${pageUrl}`
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link', pageUrl)
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Thank you for staying with us</p>
          <h1>Share your stay at {hotel}</h1>
          <p className={styles.lede}>
            A few words on Google or TripAdvisor helps other travelers choose with confidence —
            and it means a great deal to our team in Nyarutarama, Kagugu.
          </p>
          <div className={styles.stars} aria-hidden="true">
            {[0, 1, 2, 3, 4].map((item) => (
              <Star key={item} size={18} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
        </div>
      </div>

      <div className={`container ${styles.body}`}>
        <Reveal>
          {links.hasAny ? (
            <div className={styles.grid}>
              <PlatformCard
                name="Google"
                mark={<GoogleMark />}
                writeUrl={links.googleWrite}
                readUrl={links.googleRead}
                writeLabel="Write a Google review"
              />
              <PlatformCard
                name="TripAdvisor"
                mark={SOCIAL_ICONS.tripadvisor}
                writeUrl={links.tripadvisorWrite}
                readUrl={links.tripadvisorRead}
                writeLabel="Write a TripAdvisor review"
              />
            </div>
          ) : (
            <p className={styles.empty}>
              Review links will appear here once the hotel adds Google and TripAdvisor pages in Site
              setting → Guest reviews.
            </p>
          )}
        </Reveal>

        <Reveal delay={80}>
          <div className={styles.share}>
            <h2>Send this page to a guest</h2>
            <p>
              Copy the link or open WhatsApp. Guests land here, then write on Google or TripAdvisor
              in one tap.
            </p>
            <div className={styles.shareActions}>
              <button type="button" className={styles.primary} onClick={copyLink}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Link copied' : 'Copy review link'}
              </button>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>
                <MessageCircle size={15} />
                Share on WhatsApp
              </a>
            </div>
            <p className={styles.url}>{pageUrl}</p>
          </div>
        </Reveal>

        <p className={styles.back}>
          <Link to="/">Back to the hotel</Link>
        </p>
      </div>
    </section>
  )
}
