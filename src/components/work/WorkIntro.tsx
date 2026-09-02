'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { WORK_GRADIENT } from '@/data/gradients'
import { MonopoGradient } from '@/components/webgl/MonopoGradient'
import { MonopoText } from '@/components/ui/MonopoText'
import { ScrollCue } from '@/components/ui/ScrollCue'
import { Ruler } from '@/components/ui/Ruler'
import styles from './WorkIntro.module.scss'

const LINES = ['We paint', 'legacies, →', 'not posts']

/** The portfolio hero, bottom-aligned over its own gradient. */
export function WorkIntro() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const lines = root.querySelectorAll('[data-line]')
    const body = root.querySelector('[data-body]')

    if (prefersReducedMotion()) {
      gsap.set([lines, body], { yPercent: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.3 })
        .fromTo(
          lines,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'power3.out' },
        )
        .fromTo(
          body,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.7',
        )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <MonopoGradient className={styles.gradient} config={WORK_GRADIENT} />

      <Ruler className={styles.rulerLeft} cm={3} mm={9} progress={0.12} />
      <Ruler className={styles.rulerRight} cm={3} mm={9} progress={0.62} align="right" />

      <div className={`${styles.inner} row bottom`}>
        <div className="col-22of24 col-sm-12of12 offset-sm-0">
          <div className="row bottom">
            <div className="col-12of22 col-sm-12of12">
              <h1 className={`${styles.title} t-h1`}>
                {LINES.map((line) => (
                  <span className={styles.line} key={line}>
                    <span data-line>
                      <MonopoText>{line}</MonopoText>
                    </span>
                  </span>
                ))}
              </h1>
            </div>

            <div className="col-6of22 offset-2of22 col-md-8of22 col-sm-10of12 offset-sm-0">
              <div className={`${styles.body} t-text`} data-body>
                <p>
                  Five collections. Renaissance, Amplify, Compose, Ignite, Genesis.
                  Every engagement composed at the intersection of art, strategy,
                  technology and performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.cue} col-1of24 offset-1of24`}>
          <ScrollCue />
        </div>
      </div>
    </section>
  )
}
