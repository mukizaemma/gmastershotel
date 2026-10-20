import { useHomePage } from '@lib/queries/useHomePage'
import CardGrid from '@components/ui/CardGrid'
import RoomCard from '@components/hotel/RoomCard'
import Reveal from '@components/ui/Reveal'
import styles from './HomeRooms.module.css'

function prettyHeadline(text) {
  const value = String(text || '').trim()
  if (!value) return null
  const parts = value.split(/\s+/)
  if (parts.length < 4) return value
  const accentCount = parts.length > 5 ? 3 : 2
  return (
    <>
      {parts.slice(0, -accentCount).join(' ')}{' '}
      <span className={styles.accent}>{parts.slice(-accentCount).join(' ')}</span>
    </>
  )
}

export default function HomeRooms() {
  const { data } = useHomePage()
  const rooms = data.rooms
  if (!rooms.length) return null

  const section = data.roomsSection || {}
  const headline = section.headline || ''
  const intro = section.intro || ''

  return (
    <section className={styles.section}>
      <div className={`container ${styles.wide}`}>
        {(section.eyebrow || headline || intro) && (
          <Reveal className={styles.header}>
            {section.eyebrow ? <span className={styles.eyebrow}>{section.eyebrow}</span> : null}
            {headline ? <h2 className={styles.headline}>{prettyHeadline(headline)}</h2> : null}
            {headline ? <span className={styles.rule} aria-hidden="true" /> : null}
            {intro ? <p className={styles.intro}>{intro}</p> : null}
          </Reveal>
        )}
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
