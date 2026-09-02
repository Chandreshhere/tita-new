'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal } from '@/lib/animations'
import { serviceGroups, servicesIntro } from '@/data/services'
import { TransitionLink } from '@/components/core/TransitionLink'
import styles from './ServicesList.module.scss'

/** The Trinity — TITA's three service pillars. */
export function ServicesList() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createFadeReveal(root.querySelectorAll('[data-reveal]'), {
        trigger: root,
        stagger: 0.1,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <div className={`${styles.label} t-text--sm`}>Services</div>
        </div>

        <div className="col-22of24 col-sm-12of12">
          <div className="row">
            {/* The home page sets this same standing statement across most of
                the measure, so it reads as three or four lines rather than a
                narrow stack. */}
            <div className="col-17of22 col-md-22of22 col-sm-12of12">
              <div className="t-wysiwyg t-h3 t-h3--display" data-reveal>
                <p>{servicesIntro}</p>
              </div>
              <TransitionLink
                className={`${styles.btn} t-btn-primary t-btn-primary--black`}
                href="/work"
                data-cursor="discover"
              >
                <span>View portfolio</span>
                <span className="t-btn-primary-arrow" aria-hidden="true">→</span>
              </TransitionLink>
            </div>
          </div>

          <div className={`${styles.points} row`}>
            {serviceGroups.map((group, i) => (
              <div
                className={
                  i === 0
                    ? 'col-6of22 col-md-7of22 col-sm-12of12'
                    : 'col-6of24 offset-2of24 col-md-7of24 offset-md-1of24 col-sm-12of12 offset-sm-0'
                }
                key={group.number}
              >
                <div className={styles.item} data-reveal>
                  <div className={styles.itemHead}>
                    <span className={styles.number}>{group.number}</span>
                    <h2 className={`${styles.itemLabel} t-h5 t-h5--display`}>{group.title}</h2>
                  </div>
                  <p className={`${styles.subtitle} t-text--sm`}>{group.subtitle}</p>
                  <p className={`${styles.description} t-text`}>{group.description}</p>
                  <ul className="t-list t-h4">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
