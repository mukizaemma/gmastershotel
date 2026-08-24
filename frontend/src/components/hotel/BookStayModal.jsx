import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCartActions } from '@lib/cart/CartContext'
import { useAvailability } from '@lib/queries/useAvailability'
import { eachNight, findBlockingClosure, guestClosureMessage } from '@features/hotel/availability'
import { persistStayDates } from '@features/hotel/booking/persistStay'
import StayDatePicker from '@components/hotel/StayDatePicker'
import styles from './BookStayModal.module.css'

export default function BookStayModal({ room, onClose }) {
  const navigate = useNavigate()
  const { addRoom } = useCartActions()
  const { data: closures = [] } = useAvailability()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [closed, setClosed] = useState('')

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function continueToGuest(nextIn = checkIn, nextOut = checkOut) {
    if (!nextIn || !nextOut) return
    const blocked = findBlockingClosure(closures, {
      checkIn: nextIn,
      checkOut: nextOut,
      roomSlugs: [room.id],
    })
    if (blocked) {
      setClosed(guestClosureMessage(blocked))
      return
    }
    addRoom(room)
    persistStayDates({ checkIn: nextIn, checkOut: nextOut, step: 2 })
    navigate('/book')
  }

  const nights = checkIn && checkOut ? eachNight(checkIn, checkOut).length : 0

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-stay-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Book now</p>
            <h2 id="book-stay-title">{room.name}</h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className={styles.body}>
          <p className={styles.lead}>
            Choose check-in and check-out. Closed nights are marked. After both dates are set,
            we take you to guest details.
          </p>
          <StayDatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            closures={closures}
            roomSlugs={[room.id]}
            onChange={(next) => {
              setCheckIn(next.checkIn)
              setCheckOut(next.checkOut)
              setClosed('')
              if (next.checkIn && next.checkOut) continueToGuest(next.checkIn, next.checkOut)
            }}
          />
          {closed ? <p className={styles.notice}>{closed}</p> : null}
        </div>

        <footer className={styles.footer}>
          <p className={styles.nights}>
            {nights > 0 ? `${nights} ${nights === 1 ? 'night' : 'nights'} · From $${room.pricePerNight}` : 'Select both dates to continue'}
          </p>
          <button
            type="button"
            className={styles.continue}
            disabled={!checkIn || !checkOut}
            onClick={() => continueToGuest()}
          >
            Continue
          </button>
        </footer>
      </div>
    </div>
  )
}
