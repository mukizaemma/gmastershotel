import { useEffect, useMemo, useState } from 'react'
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
  const [pickedId, setPickedId] = useState('')
  const [roomPickerOpen, setRoomPickerOpen] = useState(false)
  const [experiencePickerOpen, setExperiencePickerOpen] = useState(false)

  const picked = useMemo(() => catalog.find((room) => room.id === pickedId) || null, [catalog, pickedId])
  const calendarSlugs = roomCount > 0 ? rooms.map((room) => room.roomId) : pickedId ? [pickedId] : []
  const calendars = useRoomCalendars(calendarSlugs, { enabled: calendarSlugs.length > 0 })

  const blocked = findBlockingClosure(closures, {
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    roomSlugs: roomCount > 0 ? rooms.map((room) => room.roomId) : pickedId ? [pickedId] : [],
  })

  const pickedOpen =
    Boolean(picked && stay.checkIn && stay.checkOut && nights > 0 && !calendars.isLoading) &&
    isStayOpen(calendars.byRoom[picked.id]?.closed, stay.checkIn, stay.checkOut)

  useEffect(() => {
    if (!picked || !pickedOpen || isInCart(picked.id)) return
    addRoom(picked)
  }, [addRoom, isInCart, picked, pickedOpen])

  useEffect(() => {
    if (roomCount > 0 && !pickedId) {
      setPickedId(rooms[0].roomId)
    }
  }, [pickedId, roomCount, rooms])

  function selectRoom(id) {
    const next = String(id || '')
    if (pickedId && pickedId !== next && isInCart(pickedId)) {
      removeRoom(pickedId)
    }
    setPickedId(next)
    setStay({ checkIn: '', checkOut: '' })
  }

  if (roomCount === 0) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Your stay</h2>
        <p className={styles.subtitle}>Choose a room, then pick your nights. Continue unlocks when that room is free.</p>

        <label className={styles.selectField}>
          <span className={styles.fieldLabel}>Room *</span>
          <select
            value={pickedId}
            onChange={(e) => selectRoom(e.target.value)}
            disabled={roomsLoading || catalog.length === 0}
          >
            <option value="">{roomsLoading ? 'Loading rooms…' : 'Select a room'}</option>
            {catalog.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} — ${room.pricePerNight}/night
              </option>
            ))}
          </select>
        </label>

        {!roomsLoading && catalog.length === 0 ? (
          <p className={styles.dateError}>No rooms are published yet. Please check back shortly.</p>
        ) : null}

        {picked ? (
          <>
            <div className={styles.calendarBlock}>
              <p className={styles.calendarLead}>
                Dates for <strong>{picked.name}</strong>
              </p>
              <StayDatePicker
                checkIn={stay.checkIn}
                checkOut={stay.checkOut}
                closures={closures}
                roomSlugs={[picked.id]}
                onChange={(next) => setStay({ checkIn: next.checkIn, checkOut: next.checkOut })}
              />
            </div>

            {stay.checkIn && stay.checkOut && nights > 0 ? (
              calendars.isLoading ? (
                <p className={styles.availableNote}>Checking availability…</p>
              ) : pickedOpen ? (
                <p className={styles.statusOk}>
                  {picked.name} is available {formatDay(stay.checkIn)} – {formatDay(stay.checkOut)}. You can continue.
                </p>
              ) : (
                <p className={styles.dateError}>
                  {picked.name} is not available for those nights. Choose other dates or another room.
                </p>
              )
            ) : null}

            {blocked && stay.checkIn && stay.checkOut ? (
              <p className={styles.dateError}>{guestClosureMessage(blocked)}</p>
            ) : null}
          </>
        ) : (
          <p className={styles.availableNote}>Select a room above to open the calendar.</p>
        )}
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
