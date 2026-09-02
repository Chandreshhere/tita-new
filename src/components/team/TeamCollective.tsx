'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal, createTextReveal } from '@/lib/animations'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './TeamCollective.module.scss'

const LINES = [
  'Once, art changed',
  'the world.',
  'Now, data does.',
  'We stand where both meet.',
]

/**
 * The oversized manifesto between the founder grid and the timeline. The rhythm
 * is carried by the alternating line offsets alone.
 */
export function TeamCollective() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createTextReveal(root.querySelector('[data-title]'), { stagger: 0.1 })
      createFadeReveal(root.querySelectorAll('[data-reveal]'), { trigger: root })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row center">
        <div className="col-20of24 col-sm-12of12">
          <h2 className={`${styles.title} t-h1`} data-title>
            {LINES.map((line, i) => (
              <span className={`${styles.line} ${styles[`line${i}`]}`} key={line}>
                <span data-line>
                  <MonopoText>{line}</MonopoText>
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      <div className="row">
        <div className="col-10of24 offset-12of24 col-md-14of24 offset-md-8of24 col-sm-12of12 offset-sm-0">
          <div className={`${styles.foot} row`}>
            <div className="col-4of10 col-md-4of14 col-sm-8of12">
              <span className={`${styles.baseline} t-text--sm`} data-reveal>
                [ We are patrons of modern ambition. ]
              </span>
            </div>
            <div className="col-4of10 offset-1of10 col-md-8of14 offset-md-2of14 col-sm-9of12 offset-sm-1of12">
              <div className="t-wysiwyg t-text" data-reveal>
                <p>
                  We are not vendors. We don&rsquo;t run ads — we orchestrate movements.
                  We don&rsquo;t design posts — we paint legacies. This is the renaissance
                  of brands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
