'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal, createTextReveal } from '@/lib/animations'
import { history } from '@/data/team'
import { MonopoLines } from '@/components/ui/MonopoText'
import { PixiImage } from '@/components/webgl/PixiImage'
import styles from './TeamHistory.module.scss'

/**
 * `c-Team-section` — the founding timeline. The year sits in the left margin as
 * a sticky marker with a rule running down beside it, so the two entries read as
 * points on one line rather than as separate blocks.
 */
export function TeamHistory() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-entry]').forEach((entry) => {
        createTextReveal(entry.querySelector('[data-title]'))
        createFadeReveal(entry.querySelectorAll('[data-reveal]'), { trigger: entry })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      {history.map((entry, i) => (
        <section className={`${styles.root} container`} key={entry.year} data-entry>
          <div className="row">
            <div className="col-2of24 col-md-24of24 col-sm-12of12">
              <span className={`${styles.year} t-text`}>{entry.year}</span>
            </div>

            <div className="col-10of24 col-md-12of24 col-sm-12of12">
              <h2 className={`${styles.title} t-h2`} data-title>
                <MonopoLines lineClassName={styles.line}>{entry.title}</MonopoLines>
              </h2>

              <div className="row">
                <div className="col-4of10 col-md-5of12 col-sm-6of12">
                  <ul className={`${styles.founders} t-list t-text`} data-reveal>
                    {entry.founders.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-5of10 offset-1of10 col-md-7of12 offset-md-0 col-sm-11of12 offset-sm-1of12">
                  <div className={`${styles.body} t-wysiwyg t-text`} data-reveal>
                    <p>{entry.body}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={
                i === 0
                  ? 'col-10of24 offset-2of24 col-sm-12of12 offset-sm-0'
                  : 'col-7of24 offset-4of24 col-sm-12of12 offset-sm-0'
              }
            >
              <PixiImage
                className={styles.img}
                src={entry.image}
                alt=""
                ratio={entry.ratio}
                sizes="(max-width: 767px) 100vw, 40vw"
                parallax
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
