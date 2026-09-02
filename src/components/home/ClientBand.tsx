'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal } from '@/lib/animations'
import { clientLogos } from '@/data/services'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './ClientBand.module.scss'

/** The client marks band — the template's `award` slot, carrying real clients. */
export function ClientBand() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createFadeReveal(root.querySelectorAll('[data-reveal]'), { trigger: root, stagger: 0.05, y: 20 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <span className={`${styles.label} t-text--sm`}>Clients</span>
        </div>
        <div className="col-14of24 col-sm-12of12">
          <h2 className={`${styles.title} t-h2`}>
            <MonopoText>Brands we compose for</MonopoText>
          </h2>
        </div>
      </div>

      <ul className={`${styles.logos} t-list`}>
        {clientLogos.map((src, i) => (
          <li className={styles.item} key={src} data-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Client ${i + 1}`} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
    </section>
  )
}
