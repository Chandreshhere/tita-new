'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal, createTextReveal } from '@/lib/animations'
import { manifesto } from '@/data/services'
import { MonopoLines } from '@/components/ui/MonopoText'
import styles from './ServicesManifesto.module.scss'

/**
 * TITA's manifesto, in one block.
 *
 * This replaces the three `CallUsSection`s the page used to stack here. Each of
 * those carried a full-bleed stock image and a couple of sentences, so the same
 * argument took four screens of scroll to make. The copy is unchanged — it is
 * the studio's own — but it now reads as a single statement, and the borrowed
 * art is gone in favour of the real project work in `ServicesWorks` below.
 */
export function ServicesManifesto() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      createTextReveal(root.querySelector('[data-title]'))
      createFadeReveal(root.querySelectorAll('[data-reveal]'), {
        trigger: root,
        stagger: 0.08,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.root} container`}>
      <div className="row">
        <div className="col-2of24 col-md-24of24 col-sm-12of12">
          <span className={`${styles.label} t-text--sm`}>{manifesto.label}</span>
        </div>
        <div className="col-20of24 col-md-24of24 col-sm-12of12">
          <h2 className="t-h2 t-h2--display" data-title>
            <MonopoLines lineClassName={styles.line}>{manifesto.title}</MonopoLines>
          </h2>
        </div>
      </div>

      <div className={`${styles.body} row`}>
        <div className="col-2of24 col-md-24of24 col-sm-12of12" />

        <div className="col-9of24 col-md-11of24 col-sm-12of12">
          <span className={`${styles.caption} t-text--sm`} data-reveal>
            {manifesto.caption}
          </span>
          <div className="t-wysiwyg t-text" data-reveal>
            {manifesto.body.slice(0, 2).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div className="col-9of24 offset-2of24 col-md-11of24 offset-md-1of24 col-sm-12of12 offset-sm-0">
          <div className={`${styles.second} t-wysiwyg t-text`} data-reveal>
            {manifesto.body.slice(2).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.quotes} row`}>
        <div className="col-2of24 col-md-24of24 col-sm-12of12" />
        {manifesto.quotes.map((quote, i) => (
          <blockquote
            className={`${styles.quote} t-quote ${
              i === 0
                ? 'col-9of24 col-md-11of24 col-sm-12of12'
                : 'col-9of24 offset-2of24 col-md-11of24 offset-md-1of24 col-sm-12of12 offset-sm-0'
            }`}
            key={quote.text}
            data-reveal
          >
            <div className={`${styles.quoteText} t-wysiwyg t-h5 t-h5--bold`}>
              <p>{quote.text}</p>
            </div>
            <footer className={`${styles.author} t-text--sm`}>
              {quote.author.map((line, j) => (
                <span key={line}>
                  {line}
                  {j < quote.author.length - 1 && <br />}
                </span>
              ))}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
