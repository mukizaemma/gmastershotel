import { useRoomsPage } from '@lib/queries/useRoomsPage'
import CardGrid from '@components/ui/CardGrid'
import RoomCard from '@components/hotel/RoomCard'
import styles from './RoomsList.module.css'

export default function RoomsList() {
  const { data } = useRoomsPage()
  const { rooms } = data

  return (
    <section className={styles.section}>
      <div className="container">
        <CardGrid
          items={rooms}
          showAll
          renderCard={(room) => <RoomCard key={room.id} room={room} />}
        />
      </div>
    </section>
  )
}
