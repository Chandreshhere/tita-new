import type { Metadata } from 'next'
import { ServicesHero } from '@/components/services/ServicesHero'
import { ServicesList } from '@/components/services/ServicesList'
import { CitiesMarquee } from '@/components/services/CitiesMarquee'
import { ServicesManifesto } from '@/components/services/ServicesManifesto'
import { ServicesWorks } from '@/components/services/ServicesWorks'
import { Partnerships } from '@/components/services/Partnerships'
import { Awards } from '@/components/services/Awards'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'Service',
  description:
    'The Trinity — Technology, Brand and Media. Web experiences that adapt, narratives that build relevance, and data-driven acquisition that converts attention into revenue.',
}

/**
 * Five sections and one inversion.
 *
 * The page used to flip between the light and dark palettes four times — two
 * marquees, three near-empty editorial blocks and a logo band all took a turn —
 * which is what made it read as clutter rather than as a sequence. Everything
 * that belongs on black (the manifesto and the work) is now one band, and
 * everything that belongs on white (the offer, the clients, the process) sits
 * either side of it.
 */
export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />

      <div className={styles.dark}>
        <CitiesMarquee />
        <ServicesManifesto />
        <ServicesWorks />
      </div>

      <Partnerships />
      <Awards />
    </>
  )
}
