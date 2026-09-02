'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal, createTextReveal } from '@/lib/animations'
import { processSteps } from '@/data/awards'
import { MonopoText } from '@/components/ui/MonopoText'
import { PixiImage } from '@/components/webgl/PixiImage'
import styles from './WorkProcess.module.scss'

const STEP_IMAGES = [
  '/images/editorial/process_001.jpeg',
  '/images/editorial/process_002.jpeg',
  '/images/editorial/process_003.jpeg',
]

/**
 * "Work Process" — the three-step band from the supplied template's
 * `section work`, carrying TITA's own Research / Ideate / Test stages.
 */
export function WorkProcess() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createTextReveal(root.querySelector('[data-title]'))
      createFadeReveal(root.querySelectorAll('[data-reveal]'), { trigger: root, stagger: 0.12 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <span className={`${styles.label} t-text--sm`}>Work Process</span>
        </div>

        <div className="col-14of24 col-sm-12of12">
          <h2 className={`${styles.title} t-h2`} data-title>
            <span data-line>
              <MonopoText>How a composition comes together</MonopoText>
            </span>
          </h2>
          <p className={`${styles.lede} t-text`} data-reveal>
            See how our process turns a brand into work that delivers measurable impact
            from day one.
          </p>
        </div>
      </div>

      <ol className={`${styles.steps} row t-list`}>
        {processSteps.map((step, i) => (
          <li
            className={`${styles.step} col-7of24 col-md-11of24 col-sm-12of12 ${
              i > 0 ? 'offset-1of24 offset-md-1of24 offset-sm-0' : ''
            }`}
            key={step.number}
            data-reveal
          >
            <PixiImage
              className={styles.img}
              src={STEP_IMAGES[i % STEP_IMAGES.length]}
              alt=""
              ratio={72}
              sizes="(max-width: 767px) 100vw, 30vw"
            />
            <div className={styles.stepHead}>
              <span className={styles.number}>{step.number}</span>
              <h3 className={`${styles.stepTitle} t-h4`}>{step.title}</h3>
            </div>
            <p className={`${styles.stepBody} t-text`}>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
