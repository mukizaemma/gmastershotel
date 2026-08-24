import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCartActions } from '@lib/cart/CartContext'
import { useAvailability } from '@lib/queries/useAvailability'
import { useRoomsList } from '@lib/queries/useRoomsPage'
import { useRoomCalendars } from '@lib/queries/useRoomCalendar'
import { eachNight, findBlockingClosure, formatDay, guestClosureMessage, isStayOpen } from '@features/hotel/availability'
import { persistStayDates } from '@features/hotel/booking/persistStay'
import StayDatePicker from '@components/hotel/StayDatePicker'
import styles from './BookStayModal.module.css'

export default function BookStayModal({ room, onClose }) {
  const navigate = useNavigate()
  const { addRoom } = useCartActions()
  const { data: closures = [] } = useAvailability()
  const { data: rooms = [room] } = useRoomsList()
  const [selected, setSelected] = useState(room)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [closed, setClosed] = useState('')

  const slugs = useMemo(() => (rooms.length ? rooms.map((item) => item.id) : [selected.id]), [rooms, selected.id])
  const calendars = useRoomCalendars(slugs)

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

  const nights = checkIn && checkOut ? eachNight(checkIn, checkOut).length : 0
  const selectedOpen =
    Boolean(checkIn && checkOut && !calendars.isLoading) &&
    isStayOpen(calendars.byRoom[selected.id]?.closed, checkIn, checkOut)

  const alternatives = useMemo(() => {
    if (!checkIn || !checkOut || calendars.isLoading) return []
    return rooms.filter(
      (item) => item.id !== selected.id && isStayOpen(calendars.byRoom[item.id]?.closed, checkIn, checkOut),
    )
  }, [calendars.byRoom, calendars.isLoading, checkIn, checkOut, rooms, selected.id])

  function continueToGuest() {
    if (!checkIn || !checkOut || !selectedOpen) return
    const blocked = findBlockingClosure(closures, {
      checkIn,
      checkOut,
      roomSlugs: [selected.id],
    })
    if (blocked) {
      setClosed(guestClosureMessage(blocked))
      return
    }
    addRoom(selected)
    persistStayDates({ checkIn, checkOut, step: 2 })
    navigate('/book')
  }

  function pickRoom(next) {
    setSelected(next)
    setClosed('')
  }

  function clearDates() {
    setCheckIn('')
    setCheckOut('')
    setClosed('')
  }

  const total = nights > 0 ? nights * Number(selected.pricePerNight || 0) : 0

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
            <p className={styles.kicker}>Check availability</p>
            <h2 id="book-stay-title">{selected.name}</h2>
            <p className={styles.price}>From ${selected.pricePerNight} / night</p>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className={styles.body}>
          <p className={styles.lead}>
            Pick your nights first. We then tell you if this room type is free, or which other type you can take instead.
          </p>
          <StayDatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            closures={closures}
            roomSlugs={[selected.id]}
            onChange={(next) => {
              setCheckIn(next.checkIn)
              setCheckOut(next.checkOut)
              setClosed('')
            }}
          />

          {checkIn && checkOut ? (
            <div className={selectedOpen ? styles.statusOk : styles.statusWait}>
              {selectedOpen ? (
                <p>
                  <strong>{selected.name}</strong> is available {formatDay(checkIn)} – {formatDay(checkOut)}
                  {nights ? ` · ${nights} ${nights === 1 ? 'night' : 'nights'}` : ''}.
                </p>
              ) : (
                <>
                  <p>
                    <strong>{selected.name}</strong> is not available for those nights. Choose other dates, or pick a
                    room type that is still open.
                  </p>
                  <button type="button" className={styles.textBtn} onClick={clearDates}>
                    Choose other dates
                  </button>
                </>
              )}
            </div>
          ) : null}

          {checkIn && checkOut && alternatives.length > 0 ? (
            <div className={styles.alts}>
              <p>{selectedOpen ? 'Other rooms also free on these dates' : 'Available on these dates'}</p>
              <ul>
                {alternatives.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => pickRoom(item)}>
                      <span>
                        <strong>{item.name}</strong>
                        <small>From ${item.pricePerNight} / night</small>
                      </span>
                      Switch
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {checkIn && checkOut && !selectedOpen && alternatives.length === 0 ? (
            <p className={styles.notice}>No other room type is free for those nights. Try different dates.</p>
          ) : null}

          {closed ? <p className={styles.notice}>{closed}</p> : null}
        </div>

        <footer className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Close
          </button>
          <div className={styles.footerActions}>
            <p className={styles.nights}>
              {nights > 0 && selectedOpen
                ? `${nights} ${nights === 1 ? 'night' : 'nights'} · $${total}`
                : 'Pick free dates to continue'}
            </p>
            <button type="button" className={styles.continue} disabled={!selectedOpen} onClick={continueToGuest}>
              Continue
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
