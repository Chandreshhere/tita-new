'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal, createTextReveal } from '@/lib/animations'
import { serviceGroups } from '@/data/services'
import { TransitionLink } from '@/components/core/TransitionLink'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './HomeServices.module.scss'

/**
 * "The Trinity" — the service band from the template's `section service`,
 * carrying TITA's three pillars as an editorial table rather than cards.
 */
export function HomeServices() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createTextReveal(root.querySelector('[data-title]'))
      createFadeReveal(root.querySelectorAll('[data-reveal]'), { trigger: root, stagger: 0.1 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <span className={`${styles.label} t-text--sm`}>Service</span>
        </div>
        <div className="col-14of24 col-sm-12of12">
          <h2 className={`${styles.title} t-h2`} data-title>
            <span data-line>
              <MonopoText>The Trinity</MonopoText>
            </span>
          </h2>
          <p className={`${styles.lede} t-text`} data-reveal>
            Technology · Brand · Media. Three pillars, composed together.
          </p>
        </div>
      </div>

      <div className={styles.list}>
        {serviceGroups.map((group) => (
          <article className={styles.item} key={group.number} data-reveal>
            <div className="row">
              <div className="col-2of24 col-sm-12of12">
                <span className={styles.number}>{group.number}</span>
              </div>
              <div className="col-7of24 col-sm-12of12">
                <h3 className={`${styles.itemTitle} t-h3`}>{group.title}</h3>
                <p className={`${styles.subtitle} t-text--sm`}>{group.subtitle}</p>
              </div>
              <div className="col-7of24 col-sm-12of12">
                <p className={`${styles.desc} t-text`}>{group.description}</p>
              </div>
              <div className="col-6of24 offset-2of24 col-sm-12of12 offset-sm-0">
                <ul className={`${styles.tags} t-list t-h6 t-h6--spacing`}>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.foot}>
        <TransitionLink className="t-btn-primary" href="/services" data-cursor="discover">
          <span>Explore the trinity</span>
          <span className="t-btn-primary-arrow" aria-hidden="true">→</span>
        </TransitionLink>
      </div>
    </section>
  )
}
