import { useHomePage } from '@lib/queries/useHomePage'
import CardGrid from '@components/ui/CardGrid'
import RoomCard from '@components/hotel/RoomCard'
import Reveal from '@components/ui/Reveal'
import styles from './HomeRooms.module.css'

function prettyHeadline(text) {
  const value = String(text || '').trim()
  if (!value) return null
  const parts = value.split(/\s+/)
  if (parts.length < 3) return value
  const pivot = Math.max(2, Math.ceil(parts.length * 0.55))
  return (
    <>
      <span className={styles.line}>{parts.slice(0, pivot).join(' ')}</span>
      <span className={styles.accent}>{parts.slice(pivot).join(' ')}</span>
    </>
  )
}

export default function HomeRooms() {
  const { data } = useHomePage()
  const rooms = data.rooms
  if (!rooms.length) return null

  const section = data.roomsSection || {}
  const headline = section.headline || 'Rooms made for real rest'
  const intro =
    section.intro || 'Quiet nights, thoughtful details, and space to unwind by Lake Kivu.'

  return (
    <section className={styles.section}>
      <div className={`container ${styles.wide}`}>
        <Reveal className={styles.header}>
          <span className={styles.eyebrow}>{section.eyebrow || 'Stay'}</span>
          <h2 className={styles.headline}>{prettyHeadline(headline)}</h2>
          <span className={styles.rule} aria-hidden="true" />
          {intro ? <p className={styles.intro}>{intro}</p> : null}
        </Reveal>
        <CardGrid
          items={rooms}
          initialCount={3}
          moreTo="/accommodation"
          moreLabel="View all rooms"
          renderCard={(room) => <RoomCard key={room.id} room={room} variant="showcase" />}
        />
      </div>
    </section>
  )
}
