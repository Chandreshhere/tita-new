import { HomeHero } from '@/components/home/HomeHero'
import { NovasiteHome } from '@/components/novasite/NovasiteHome'
import { HomeGradientProvider } from '@/components/home/HomeGradientContext'
import styles from './page.module.scss'

export default function HomePage() {
  return (
    // The hero owns the one gradient canvas; everything below it is the
    // Novasite template from `full home .zip`, cloned markup-for-markup and
    // sitting on its own solid ground.
    <HomeGradientProvider>
      <div className={styles.root}>
        <HomeHero />
        <div className={styles.solid}>
          <NovasiteHome />
        </div>
      </div>
    </HomeGradientProvider>
  )
}
