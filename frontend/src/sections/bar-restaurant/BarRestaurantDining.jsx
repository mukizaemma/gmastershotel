import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Coffee, ChefHat, Building2 } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import Reveal from '@components/ui/Reveal'
import { useBarRestaurantPage } from '@lib/queries/useBarRestaurantPage'
import { DEFAULT_DINING } from '@features/hotel/restaurantSpotlight'
import styles from './BarRestaurantDining.module.css'

const OFFERS = [
  {
    icon: Coffee,
    title: 'Breakfast for our guests',
    text: 'Stay with us as a bed and breakfast. Mornings start with a proper breakfast, cooked here for hotel guests.',
  },
  {
    icon: ChefHat,
    title: 'Any dish you choose',
    text: 'Professional chefs can prepare the meal you want — from local plates to a favourite from home. Just tell the front desk.',
  },
  {
    icon: Building2,
    title: 'Buffet for nearby offices',
    text: 'We are planning a buffet so people working around us can find nice food close by during the day.',
  },
]

export default function BarRestaurantDining() {
  const [ref, inView] = useInView(0.12)
  const { data } = useBarRestaurantPage()
  const dining = { ...DEFAULT_DINING, ...(data?.dining || {}) }
  const photos = dining.photos || []
  const [lightbox, setLightbox] = useState(null)

  return (
    <section className={styles.section} ref={ref} id="dining">
      <div className="container">
        <div className={`${styles.header} fade-in-up ${inView ? 'is-visible' : ''}`}>
          <span className={styles.eyebrow}>{dining.eyebrow}</span>
          <h2 className={styles.headline}>{dining.headline}</h2>
          <p className={styles.lead}>{dining.intro}</p>
        </div>

        <ul className={styles.offers}>
          {OFFERS.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal as="li" key={item.title} className={styles.offer} delay={index * 80}>
                <span className={styles.iconWrap}>
                  <Icon size={22} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            )
          })}
        </ul>

        {photos.length > 0 ? (
          <>
            <p className={styles.galleryLabel}>Breakfast and dishes from our kitchen</p>
            <div className={styles.gallery}>
              {photos.map((photo, index) => (
                <Reveal as="figure" key={photo.id || photo.image} className={styles.photo} delay={(index % 8) * 50}>
                  <button
                    type="button"
                    onClick={() => setLightbox(index)}
                    aria-label={photo.caption ? `Open photo: ${photo.caption}` : 'Open food photo'}
                  >
                    <img src={photo.image} alt={photo.caption || ''} />
                    {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
                  </button>
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <p className={styles.empty}>Photos of breakfast and dishes will appear here as we add them.</p>
        )}
      </div>

      {lightbox != null && photos[lightbox] ? (
        <div className={styles.lightbox} onClick={() => setLightbox(null)} role="presentation">
          <button type="button" className={styles.lightboxClose} onClick={() => setLightbox(null)} aria-label="Close">
            <X size={22} />
          </button>
          {photos.length > 1 ? (
            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.prev}`}
              aria-label="Previous photo"
              onClick={(event) => {
                event.stopPropagation()
                setLightbox((index) => (index - 1 + photos.length) % photos.length)
              }}
            >
              <ChevronLeft size={22} />
            </button>
          ) : null}
          <div className={styles.lightboxStage} onClick={(event) => event.stopPropagation()}>
            <img src={photos[lightbox].image} alt={photos[lightbox].caption || ''} />
            {photos[lightbox].caption ? <p>{photos[lightbox].caption}</p> : null}
          </div>
          {photos.length > 1 ? (
            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.next}`}
              aria-label="Next photo"
              onClick={(event) => {
                event.stopPropagation()
                setLightbox((index) => (index + 1) % photos.length)
              }}
            >
              <ChevronRight size={22} />
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
