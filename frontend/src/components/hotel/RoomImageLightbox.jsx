import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import styles from './RoomImageLightbox.module.css'

export default function RoomImageLightbox({ images, index, title, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onNext, onPrev])

  if (!images?.length) return null
  const current = images[index] || images[0]
  const multi = images.length > 1

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close gallery">
        <X size={22} />
      </button>

      {multi ? (
        <button
          type="button"
          className={`${styles.arrow} ${styles.prev}`}
          onClick={(event) => {
            event.stopPropagation()
            onPrev()
          }}
          aria-label="Previous photo"
        >
          <ChevronLeft size={22} />
        </button>
      ) : null}

      <div
        className={styles.stage}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Room photos'}
        onClick={(event) => event.stopPropagation()}
      >
        <img src={current} alt={title || ''} />
        <div className={styles.meta}>
          {title ? <strong>{title}</strong> : null}
          {multi ? (
            <span>
              {index + 1} / {images.length}
            </span>
          ) : null}
        </div>
      </div>

      {multi ? (
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          onClick={(event) => {
            event.stopPropagation()
            onNext()
          }}
          aria-label="Next photo"
        >
          <ChevronRight size={22} />
        </button>
      ) : null}
    </div>
  )
}

export function roomGalleryImages(room) {
  const list = [room?.image, ...(room?.gallery || [])]
    .map((url) => String(url || '').trim())
    .filter(Boolean)
  return [...new Set(list)]
}
