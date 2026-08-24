import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Images } from 'lucide-react'
import BookStayModal from './BookStayModal'
import RoomImageLightbox, { roomGalleryImages } from './RoomImageLightbox'
import styles from './RoomCard.module.css'

export default function RoomCard({ room, variant = 'default' }) {
  const [booking, setBooking] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const spec = [room.specs?.bed, room.specs?.occupancy].filter(Boolean).join(' · ')
  const images = useMemo(() => roomGalleryImages(room), [room])
  const cover = images[0] || ''
  const extra = Math.max(0, images.length - 1)

  function openGallery(start = 0) {
    if (!images.length) return
    setLightbox(start)
  }

  function step(delta) {
    setLightbox((current) => {
      const total = images.length
      return (current + delta + total) % total
    })
  }

  return (
    <article className={`${styles.card} ${variant === 'showcase' ? styles.showcase : ''}`}>
      <div className={styles.imageWrap}>
        {cover ? (
          <button
            type="button"
            className={styles.imageBtn}
            onClick={() => openGallery(0)}
            aria-label={`View photos of ${room.name}`}
          >
            <img className={styles.image} src={cover} alt="" />
            <span className={styles.imageHint}>
              <Images size={14} />
              {extra > 0 ? `${images.length} photos` : 'View photo'}
            </span>
          </button>
        ) : (
          <div className={styles.image} />
        )}
      </div>
      <div className={styles.body}>
        <h3>{room.name}</h3>
        <p className={styles.price}>
          From <strong>${room.pricePerNight}</strong> / night
        </p>
        <p className={styles.note}>{spec || room.specs?.breakfast || 'Breakfast available'}</p>
        <div className={styles.actions}>
          <Link to={`/accommodation/${room.id}`} className={styles.btn}>
            View room
          </Link>
          <button type="button" className={styles.bookBtn} onClick={() => setBooking(true)}>
            Book now
          </button>
        </div>
      </div>
      {booking ? <BookStayModal room={room} onClose={() => setBooking(false)} /> : null}
      {lightbox != null ? (
        <RoomImageLightbox
          images={images}
          index={lightbox}
          title={room.name}
          onClose={() => setLightbox(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      ) : null}
    </article>
  )
}
