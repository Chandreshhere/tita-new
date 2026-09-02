'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal, createTextReveal } from '@/lib/animations'
import { PHILOSOPHY } from '@/data/services'
import { MonopoText } from '@/components/ui/MonopoText'
import { PixiImage } from '@/components/webgl/PixiImage'
import styles from './Philosophy.module.scss'

/**
 * "Chiaroscuro Marketing" — TITA's philosophy, in the template's `big-image`
 * slot. Light / Shadow / Together is the studio's own equation.
 */
export function Philosophy() {
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
    <section ref={rootRef} className={styles.root}>
      <div className="container">
        <div className="row">
          <div className="col-2of24 col-md-24of24 col-sm-12of12">
            <span className={`${styles.label} t-text--sm`}>(Our philosophy)</span>
          </div>
          <div className="col-14of24 col-sm-12of12">
            <h2 className={`${styles.title} t-h2`} data-title>
              <span data-line>
                <MonopoText>{PHILOSOPHY.title}</MonopoText>
              </span>
            </h2>
          </div>
        </div>

        <div className={`${styles.equation} row`}>
          {PHILOSOPHY.rows.map((row) => (
            <div className="col-6of24 offset-2of24 col-sm-12of12 offset-sm-0" key={row.key} data-reveal>
              <div className={styles.row}>
                <span className={`${styles.key} t-text--sm`}>{row.key}</span>
                <span className={`${styles.value} t-h3`}>{row.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-10of24 offset-2of24 col-sm-12of12 offset-sm-0">
            <div className={`${styles.lines} t-wysiwyg t-text--lg`} data-reveal>
              {PHILOSOPHY.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.imageWrap} container`}>
        <PixiImage
          className={styles.image}
          src="/images/editorial/statue.jpg"
          alt=""
          ratio={48}
          sizes="100vw"
          parallax
        />
        <p className={`${styles.closer} t-h4`} data-reveal>
          {PHILOSOPHY.closer}
        </p>
      </div>
    </section>
  )
}
