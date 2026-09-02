'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal } from '@/lib/animations'
import { processSteps } from '@/data/awards'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './Awards.module.scss'

/**
 * The Work Process as an editorial table, not cards.
 *
 * TITA publishes no press or awards index, so this slot carries the three stages
 * it takes every engagement through instead — same table, real content.
 */
export function Awards() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createFadeReveal(root.querySelectorAll('[data-row]'), {
        trigger: root,
        stagger: 0.04,
        y: 24,
        start: 'top 90%',
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row stretch">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <span className={`${styles.info} t-text--sm`}>Process</span>
        </div>
        <div className="col-16of24 col-md-24of24 col-sm-12of12">
          <h2 className={`${styles.title} t-h2 t-h2--display`}>
            <MonopoText>How we work</MonopoText>
          </h2>
        </div>
      </div>

      <div className="row">
        <div className="col-4of24 offset-2of24 offset-md-0 col-sm-8of12 offset-sm-0">
          <p className={`${styles.justify} t-text--sm`}>[ RESEARCH · DESIGN · IMPLEMENT ]</p>
        </div>

        <div className="col-13of24 offset-3of24 col-md-18of24 offset-md-2of24 col-sm-12of12 offset-sm-0">
          <ul className={`${styles.table} t-list`}>
            {processSteps.map((step) => (
              <li key={step.number} data-row>
                <div className={`${styles.row} t-h6`}>
                  <div className="row middle">
                    <div className={`${styles.date} col-2of13 col-sm-12of12 t-h6--spacing`}>
                      {step.number}
                    </div>
                    <div className="col-10of13 col-sm-10of12">
                      <div className="row">
                        <div className="t-h6--spacing col-5of10 col-sm-12of12">
                          {step.title}
                        </div>
                        <div className={`${styles.project} col-5of10 col-sm-12of12`}>
                          {step.body}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
