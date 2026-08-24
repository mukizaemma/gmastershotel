import { useMemo, useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { useCart, useCartActions } from '@lib/cart/CartContext'
import { useBooking } from '@lib/booking/BookingContext'
import { useAvailability } from '@lib/queries/useAvailability'
import { useRoomsList } from '@lib/queries/useRoomsPage'
import { useRoomCalendars } from '@lib/queries/useRoomCalendar'
import { findBlockingClosure, formatDay, guestClosureMessage, isStayOpen } from '@features/hotel/availability'
import StayDatePicker from '@components/hotel/StayDatePicker'
import RoomPicker from './RoomPicker'
import ExperiencePicker from './ExperiencePicker'
import styles from './Step1Stay.module.css'

export default function Step1Stay() {
  const { rooms, roomCount, experiences, isInCart } = useCart()
  const { addRoom, removeRoom, removeExperience } = useCartActions()
  const { stay, nights, setStay } = useBooking()
  const { data: closures = [] } = useAvailability()
  const { data: catalog = [], isLoading: roomsLoading } = useRoomsList()
  const [roomPickerOpen, setRoomPickerOpen] = useState(false)
  const [experiencePickerOpen, setExperiencePickerOpen] = useState(false)

  const roomSlugs = useMemo(() => catalog.map((room) => room.id), [catalog])
  const needAvailability = roomCount === 0 && Boolean(stay.checkIn && stay.checkOut && nights > 0)
  const calendars = useRoomCalendars(roomSlugs, { enabled: needAvailability && roomSlugs.length > 0 })

  const blocked = findBlockingClosure(closures, {
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    roomSlugs: rooms.map((room) => room.roomId),
  })

  const availableRooms = useMemo(() => {
    if (!stay.checkIn || !stay.checkOut || calendars.isLoading) return []
    return catalog.filter(
      (room) => !isInCart(room.id) && isStayOpen(calendars.byRoom[room.id]?.closed, stay.checkIn, stay.checkOut),
    )
  }, [calendars.byRoom, calendars.isLoading, catalog, isInCart, stay.checkIn, stay.checkOut])

  const unavailableCount =
    stay.checkIn && stay.checkOut && !calendars.isLoading
      ? catalog.filter((room) => !isInCart(room.id)).length - availableRooms.length
      : 0

  if (roomCount === 0) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Choose your dates</h2>
        <p className={styles.subtitle}>
          Pick check-in and check-out first. We then show which rooms are free for those nights so you can add one.
        </p>
        {blocked && stay.checkIn && stay.checkOut ? (
          <p className={styles.dateError}>{guestClosureMessage(blocked)}</p>
        ) : null}

        <StayDatePicker
          checkIn={stay.checkIn}
          checkOut={stay.checkOut}
          closures={closures}
          roomSlugs={[]}
          onChange={(next) => setStay({ checkIn: next.checkIn, checkOut: next.checkOut })}
        />

        {stay.checkIn && stay.checkOut && nights > 0 ? (
          <div className={styles.availableBlock}>
            <h3 className={styles.availableTitle}>
              Available {formatDay(stay.checkIn)} – {formatDay(stay.checkOut)}
            </h3>
            {roomsLoading || calendars.isLoading ? (
              <p className={styles.availableNote}>Checking availability…</p>
            ) : availableRooms.length === 0 ? (
              <p className={styles.availableNote}>
                No rooms are free for those nights
                {unavailableCount ? ` (${unavailableCount} room type${unavailableCount === 1 ? '' : 's'} sold out or closed)` : ''}.
                Try other dates.
              </p>
            ) : (
              <ul className={styles.availableList}>
                {availableRooms.map((room) => {
                  const units = Math.max(1, Number(calendars.byRoom[room.id]?.units || room.units || 1))
                  return (
                    <li key={room.id} className={styles.availableRow}>
                      <div>
                        <p className={styles.roomName}>{room.name}</p>
                        <p className={styles.roomDates}>
                          ${room.pricePerNight} / night
                          {units > 1 ? ` · ${units} units` : ''}
                        </p>
                      </div>
                      <button type="button" className={styles.addAvailableBtn} onClick={() => addRoom(room)}>
                        <Plus size={15} />
                        Add room
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Your stay</h2>
      <p className={styles.subtitle}>Set your dates and guests, then continue when you are ready.</p>
      {blocked && stay.checkIn && stay.checkOut ? (
        <p className={styles.dateError}>{guestClosureMessage(blocked)}</p>
      ) : null}

      <StayDatePicker
        checkIn={stay.checkIn}
        checkOut={stay.checkOut}
        closures={closures}
        roomSlugs={rooms.map((room) => room.roomId)}
        onChange={(next) => setStay({ checkIn: next.checkIn, checkOut: next.checkOut })}
      />

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Adults *</span>
          <input
            type="number"
            min={1}
            value={stay.adults}
            onChange={(e) => setStay({ adults: Math.max(1, Number(e.target.value) || 1) })}
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Children</span>
          <input
            type="number"
            min={0}
            value={stay.children}
            onChange={(e) => setStay({ children: Math.max(0, Number(e.target.value) || 0) })}
          />
        </label>
      </div>

      {nights > 0 ? (
        <span className={styles.nightsPill}>
          {nights} {nights === 1 ? 'night' : 'nights'}
        </span>
      ) : null}
      {stay.checkIn && stay.checkOut && nights <= 0 ? (
        <p className={styles.dateError}>Check-out must be after check-in.</p>
      ) : null}

      <div className={styles.roomList}>
        {rooms.map((room) => (
          <div key={room.roomId} className={styles.roomCard}>
            <div>
              <p className={styles.roomName}>{room.name}</p>
              <p className={styles.roomDates}>
                {stay.checkIn && stay.checkOut ? `${stay.checkIn} → ${stay.checkOut}` : 'Set dates above'}
              </p>
            </div>
            <button type="button" className={styles.removeLink} onClick={() => removeRoom(room.roomId)}>
              Remove
            </button>
          </div>
        ))}

        {experiences.map((exp) => (
          <div key={exp.experienceId} className={styles.roomCard}>
            <div>
              <p className={styles.roomName}>{exp.name}</p>
              <p className={styles.roomDates}>
                {exp.price != null && exp.price !== '' ? `$${exp.price} · experience` : 'Experience'}
              </p>
            </div>
            <button
              type="button"
              className={styles.removeLink}
              onClick={() => removeExperience(exp.experienceId)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.addRoomBtn} onClick={() => setRoomPickerOpen(true)}>
          <Plus size={15} />
          Add room
        </button>
        <button type="button" className={styles.addExperienceBtn} onClick={() => setExperiencePickerOpen(true)}>
          <Sparkles size={15} />
          Add experience
        </button>
      </div>

      {roomPickerOpen ? <RoomPicker onClose={() => setRoomPickerOpen(false)} /> : null}
      {experiencePickerOpen ? <ExperiencePicker onClose={() => setExperiencePickerOpen(false)} /> : null}
    </div>
  )
}
