import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { closedNightSet, closureSummaries, dayKey, eachNight, formatDay } from '@features/hotel/availability'
import { useRoomCalendars } from '@lib/queries/useRoomCalendar'
import styles from './StayDatePicker.module.css'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function monthStart(value) {
  const date = new Date(`${dayKey(value) || new Date().toISOString().slice(0, 10)}T12:00:00`)
  date.setDate(1)
  return date
}

function monthLabel(date) {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

function shiftMonth(date, amount) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + amount)
  return next
}

function daysInMonth(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const startPad = (first.getDay() + 6) % 7
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startPad; i += 1) cells.push(null)
  for (let day = 1; day <= last; day += 1) {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push(key)
  }
  return cells
}

export default function StayDatePicker({ checkIn, checkOut, onChange, closures = [], roomSlugs = [] }) {
  const today = new Date().toISOString().slice(0, 10)
  const [month, setMonth] = useState(() => monthStart(checkIn || today))
  const [hint, setHint] = useState('')
  const calendar = useRoomCalendars(roomSlugs)
  const closed = useMemo(() => {
    const nights = new Set(calendar.closed)
    closedNightSet(closures, roomSlugs).forEach((night) => nights.add(night))
    return nights
  }, [calendar.closed, closures, roomSlugs])
  const summaries = useMemo(() => {
    const lines = [...calendar.notes, ...closureSummaries(closures, roomSlugs)]
    return [...new Set(lines)]
  }, [calendar.notes, closures, roomSlugs])
  const cells = daysInMonth(month)
  const [hoverDay, setHoverDay] = useState('')

  function rangeHitsClosed(start, end) {
    return eachNight(start, end).some((night) => closed.has(night))
  }

  function pick(day) {
    if (!day || day < today) return

    if (!checkIn || day <= checkIn) {
      if (closed.has(day)) {
        setHint(summaries[0] || 'That night is not available.')
        return
      }
      setHint('')
      setHoverDay('')
      onChange({ checkIn: day, checkOut: '' })
      return
    }

    if (rangeHitsClosed(checkIn, day)) {
      setHint(summaries[0] || 'That stay crosses nights that are not available.')
      return
    }

    setHint('')
    setHoverDay('')
    onChange({ checkIn, checkOut: day })
  }

  const previewOut = checkIn && !checkOut && hoverDay > checkIn && !rangeHitsClosed(checkIn, hoverDay)
    ? hoverDay
    : ''
  const stayEnd = checkOut || previewOut
  const guide = !checkIn
    ? 'Click the day you arrive.'
    : !checkOut
      ? 'Now click the morning you leave. Nights in between stay selected.'
      : 'Click a later date to change check-out, or an earlier date to start a new check-in.'

  return (
    <div className={styles.wrap}>
      <p className={styles.guide}>{guide}</p>

      <div className={styles.nav}>
        <button type="button" onClick={() => setMonth((current) => shiftMonth(current, -1))} aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <strong>{monthLabel(month)}</strong>
        <button type="button" onClick={() => setMonth((current) => shiftMonth(current, 1))} aria-label="Next month">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.week}>
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className={styles.grid} onMouseLeave={() => setHoverDay('')}>
        {cells.map((day, index) => {
          if (!day) return <span key={`pad-${index}`} />
          const isClosed = closed.has(day)
          const isPast = day < today
          const isStart = day === checkIn
          const isEnd = Boolean(stayEnd && day === stayEnd)
          const inStay = Boolean(checkIn && stayEnd && day > checkIn && day < stayEnd)
          const isPreview = Boolean(previewOut && day > checkIn && day <= previewOut)
          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              aria-label={
                isStart
                  ? `Check-in ${formatDay(day)}`
                  : isEnd
                    ? `Check-out ${formatDay(day)}`
                    : formatDay(day)
              }
              className={[
                styles.day,
                isPast ? styles.past : '',
                isClosed ? styles.closed : '',
                inStay ? styles.inStay : '',
                isPreview && !isStart ? styles.preview : '',
                isStart ? styles.edgeStart : '',
                isEnd ? styles.edgeEnd : '',
                isStart && !stayEnd ? styles.solo : '',
              ].join(' ')}
              onMouseEnter={() => setHoverDay(day)}
              onClick={() => pick(day)}
            >
              <span>{Number(day.slice(-2))}</span>
              {isStart ? <em>In</em> : null}
              {isEnd ? <em>Out</em> : null}
            </button>
          )
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendOpen}>Open</span>
        <span className={styles.legendClosed}>Closed</span>
        <span className={styles.legendPick}>Your stay</span>
      </div>

      <div className={styles.selected}>
        <span className={!checkIn ? styles.activeBox : ''}>
          <strong>Check-in</strong>
          {checkIn ? formatDay(checkIn) : 'Click a day on the calendar'}
        </span>
        <span className={checkIn && !checkOut ? styles.activeBox : ''}>
          <strong>Check-out</strong>
          {checkOut ? formatDay(checkOut) : checkIn ? 'Click the morning you leave' : '—'}
        </span>
      </div>

      {summaries.map((line) => (
        <p key={line} className={styles.summary}>
          {line}
        </p>
      ))}
      {hint && <p className={styles.hint}>{hint}</p>}
      {checkIn && checkOut && (
        <p className={styles.nights}>
          {eachNight(checkIn, checkOut).length} {eachNight(checkIn, checkOut).length === 1 ? 'night' : 'nights'}
        </p>
      )}
    </div>
  )
}
