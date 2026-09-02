'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal } from '@/lib/animations'
import { clientLogos } from '@/data/services'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './Partnerships.module.scss'

/** `c-Services-logos` — the client wall, two rows of five on one hairline grid. */
export function Partnerships() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createFadeReveal(root.querySelectorAll('[data-reveal]'), {
        trigger: root,
        stagger: 0.05,
        y: 20,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <span className={`${styles.info} t-text--sm`}>Clients</span>
        </div>
        <div className="col-16of24 col-md-24of24 col-sm-12of12">
          <h2 className="t-h2 t-h2--display">
            <MonopoText>Brands we compose for</MonopoText>
          </h2>
        </div>
      </div>

      <ul className={`${styles.logos} t-list`}>
        {clientLogos.map((logo) => (
          <li
            className={`${styles.item} ${logo.invert ? styles.invert : ''}`}
            key={logo.src}
            data-reveal
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt={logo.name} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
    </section>
  )
}
