'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal } from '@/lib/animations'
import { clientLogos } from '@/data/services'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './Partnerships.module.scss'

/** `c-Services-logos` — client marks in three bands separated by hairlines. */
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
      <div className="row stretch">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <span className={`${styles.info} t-text--sm`}>Clients</span>
        </div>
        <div className="col-9of24 col-sm-12of12">
          <h2 className={`${styles.title} t-h2`}>
            <MonopoText>Brands we compose for</MonopoText>
          </h2>
        </div>
      </div>

      <div className="row">
        <div className="col-13of24 offset-9of24 col-md-18of24 offset-md-6of24 col-sm-10of12 offset-sm-2of12">
          <ul className={`${styles.logos} t-list`}>
            {clientLogos.map((src, i) => (
              <li className={styles.item} key={src} data-reveal>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Client ${i + 1}`} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
