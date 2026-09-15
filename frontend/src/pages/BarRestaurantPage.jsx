import { useBarRestaurantPage } from '@lib/queries/useBarRestaurantPage'
import PageLoader from '@components/ui/PageLoader'
import BarRestaurantHero from '@sections/bar-restaurant/BarRestaurantHero'
import BarRestaurantHours from '@sections/bar-restaurant/BarRestaurantHours'
import BarRestaurantPanels from '@sections/bar-restaurant/BarRestaurantPanels'
import BarRestaurantDining from '@sections/bar-restaurant/BarRestaurantDining'
import BarRestaurantVideo from '@sections/bar-restaurant/BarRestaurantVideo'
import BarRestaurantCTA from '@sections/bar-restaurant/BarRestaurantCTA'

export default function BarRestaurantPage() {
  const { data, isLoading, isError } = useBarRestaurantPage()

  if (isLoading) return <PageLoader />
  if (isError) {
    return (
      <div role="alert" style={{ padding: '3rem', textAlign: 'center' }}>
        Couldn't load this page. Please refresh, or try again shortly.
      </div>
    )
  }

  const showVideo = Boolean(data?.video?.videoUrl || data?.video?.backgroundImage)

  return (
    <>
      <BarRestaurantHero />
      <BarRestaurantHours />
      <BarRestaurantPanels />
      <BarRestaurantDining />
      {showVideo ? <BarRestaurantVideo /> : null}
      <BarRestaurantCTA />
    </>
  )
}
