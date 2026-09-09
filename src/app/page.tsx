import { HomeHero } from '@/components/home/HomeHero'
import { HomeSections } from '@/components/sections/HomeSections'
import { HomeGradientProvider } from '@/components/home/HomeGradientContext'
import styles from './page.module.scss'

export default function HomePage() {
  return (
    // The hero owns the one gradient canvas; everything below it is the
    // Tita template from `full home .zip`, cloned markup-for-markup and
    // sitting on its own solid ground.
    <HomeGradientProvider>
      <div className={styles.root}>
        <HomeHero />
        <div className={styles.solid}>
          <HomeSections />
        </div>
      </div>
    </HomeGradientProvider>
  )
}
