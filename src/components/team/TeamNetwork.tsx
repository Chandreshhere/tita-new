'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { createFadeReveal, createTextReveal } from '@/lib/animations'
import { prefersReducedMotion } from '@/lib/motion'
import { network, offices } from '@/data/team'
import { MonopoText } from '@/components/ui/MonopoText'
import { PixiImage } from '@/components/webgl/PixiImage'
import { Circles } from '@/components/contact/Circles'
import styles from './TeamNetwork.module.scss'

/**
 * The two studios over the layered circle motif, followed by every discipline
 * TITA composes with.
 */
export function TeamNetwork() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      createTextReveal(root.querySelector('[data-title]'))
      createFadeReveal(root.querySelectorAll('[data-reveal]'), { trigger: root, stagger: 0.08 })

      if (prefersReducedMotion()) return
      // The ring stack rotates slowly against the scroll.
      const circles = root.querySelector<HTMLElement>(`.${styles.circles}`)
      if (circles) {
        gsap.fromTo(
          circles,
          { rotate: -8 },
          {
            rotate: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      <section className={`${styles.root} container`}>
        <div className="row center">
          <div className="col-8of24 col-sm-12of12">
            {/* The ring motif is drawn, not an asset — same canvas the Contact
                column uses, so there is nothing to keep in sync. */}
            <div className={styles.circles} aria-hidden="true">
              <Circles rings={12} />
            </div>
          </div>
        </div>

        <div className="row center">
          <div className="col-16of24 col-md-24of24 col-sm-12of12">
            <ul className={`${styles.offices} row t-list`}>
              {offices.map((office) => (
                <li
                  className={`${styles.office} col-4of16 col-md-6of24 col-sm-12of12 offset-sm-0`}
                  key={office.city}
                  data-reveal
                >
                  <div className="t-wysiwyg t-text--lg">
                    <p>
                      {office.members}
                      <br />
                      {office.city}
                    </p>
                  </div>
                  {office.url && (
                    <a
                      className={`${styles.officeLink} t-link-tertiary`}
                      href={office.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="t-link-tertiary-icon" aria-hidden="true">↗</span>
                      <span className="t-link-tertiary-label">{office.label}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${styles.community} container`}>
        <div className="row">
          <div className="col-2of24 col-md-24of24 col-sm-12of12">
            <span className={`${styles.info} t-text`}>
              IDR<br />AMD
            </span>
          </div>

          <div className="col-10of24 col-md-12of24 col-sm-12of12">
            <h2 className={`${styles.title} t-h2`} data-title>
              <span data-line>
                <MonopoText>Everything we compose with</MonopoText>
              </span>
            </h2>

            <div className="row">
              <div className="col-3of10 col-md-7of12 col-sm-10of12">
                <div className={`${styles.body} t-wysiwyg t-text`} data-reveal>
                  <p>
                    Light is creativity. Shadow is data. Together they are conversion.
                    We believe in contrast — emotion backed by numbers, story powered by
                    systems.
                  </p>
                </div>
              </div>
              <div className="col-5of10 offset-2of10 col-md-4of12 offset-md-1of12 col-sm-11of12 offset-sm-1of12">
                <ul className={`${styles.disciplines} t-list t-text`} data-reveal>
                  {network.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-10of24 offset-2of24 col-sm-12of12 offset-sm-0">
            <PixiImage
              className={styles.img}
              src="/images/editorial/c2.jpg"
              alt=""
              ratio={59.1781}
              sizes="(max-width: 767px) 100vw, 40vw"
              parallax
            />
          </div>
        </div>
      </section>
    </div>
  )
}
