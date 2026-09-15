import { Coffee, UtensilsCrossed, ChefHat, Building2 } from 'lucide-react'
import { useBarRestaurantPage } from '@lib/queries/useBarRestaurantPage'
import Reveal from '@components/ui/Reveal'
import styles from './BarRestaurantHours.module.css'

const ICONS = {
  breakfast: Coffee,
  custom: ChefHat,
  buffet: Building2,
  'restaurant-bar': UtensilsCrossed,
}

export default function BarRestaurantHours() {
  const { data } = useBarRestaurantPage()
  const hours = data?.hours || []
  if (!hours.length) return null

  return (
    <div className={styles.strip}>
      <div className={`container ${styles.row}`}>
        {hours.map((item, index) => {
          const Icon = ICONS[item.icon] || Coffee
          return (
            <Reveal key={item.id || item.label} className={styles.item} delay={index * 80}>
              <Icon size={16} />
              <span className={styles.label}>{item.label}</span>
              <span className={styles.hours}>{item.hours}</span>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
