import type { Metadata } from 'next'
import { callUsSections } from '@/data/services'
import { ServicesHero } from '@/components/services/ServicesHero'
import { ServicesList } from '@/components/services/ServicesList'
import { CallUsSection } from '@/components/services/CallUsSection'
import { CitiesMarquee } from '@/components/services/CitiesMarquee'
import { ServicesWorks } from '@/components/services/ServicesWorks'
import { Partnerships } from '@/components/services/Partnerships'
import { Awards } from '@/components/services/Awards'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'Service',
  description:
    'The Trinity — Technology, Brand and Media. Web experiences that adapt, narratives that build relevance, and data-driven acquisition that converts attention into revenue.',
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />

      {/* The dark band that carries the three "Call us if…" sections. */}
      <div className={styles.dark}>
        <CitiesMarquee />
        {callUsSections.map((section) => (
          <CallUsSection key={section.id} section={section} />
        ))}
        <CitiesMarquee />
      </div>

      <ServicesWorks />

      <div className={styles.dark}>
        <Partnerships />
      </div>

      <Awards />
    </>
  )
}
