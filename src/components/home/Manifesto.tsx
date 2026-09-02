'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal, createTextReveal } from '@/lib/animations'
import { MANIFESTO, MANIFESTO_TWO } from '@/data/site'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './Manifesto.module.scss'

/**
 * "The Renaissance" — the statement block that follows the hero.
 *
 * Mirrors the `section about` slot in the supplied template: an oversized
 * declaration, then the same words restated as body copy in two columns.
 */
export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createTextReveal(root.querySelector('[data-title]'), { stagger: 0.09 })
      createFadeReveal(root.querySelectorAll('[data-reveal]'), { trigger: root, stagger: 0.1 })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <span className={`${styles.label} t-text--sm`}>The Renaissance</span>
        </div>

        <div className="col-20of24 col-sm-12of12">
          <h2 className={`${styles.title} t-h2 t-h2--upper`} data-title>
            {MANIFESTO.map((line, i) => (
              <span className={`${styles.line} ${i % 2 ? styles.indent : ''}`} key={line}>
                <span data-line>
                  <MonopoText>{line}</MonopoText>
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      <div className={`${styles.body} row`}>
        <div className="col-7of24 offset-2of24 col-md-11of24 offset-md-0 col-sm-12of12 offset-sm-0">
          <div className="t-wysiwyg t-text" data-reveal>
            <p>{MANIFESTO.join(' ')}</p>
          </div>
        </div>
        <div className="col-7of24 offset-3of24 col-md-11of24 offset-md-2of24 col-sm-12of12 offset-sm-0">
          <div className="t-wysiwyg t-text" data-reveal>
            <p>{MANIFESTO_TWO.join(' ')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
