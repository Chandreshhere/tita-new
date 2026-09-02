'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { ContactHero } from './ContactHero'
import { ContactForm } from './ContactForm'
import { Circles } from './Circles'
import { MonopoText } from '@/components/ui/MonopoText'
import { SITE, OFFICES, PILLARS } from '@/data/site'
import styles from './ContactColumns.module.scss'

/**
 * `c-Contact` — the two-column layout: a sticky headline rail on the left and
 * three stacked sections scrolling past it on the right.
 */
export function ContactColumns() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => setProgress(self.progress),
        invalidateOnRefresh: true,
      })

      gsap.fromTo(
        root.querySelectorAll('[data-reveal]'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 60%', once: true },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className={`${styles.root} container`}>
      <div className="row">
        <div className={`${styles.rail} col-12of24 col-md-24of24 col-sm-12of12`}>
          <ContactHero progress={progress} />
        </div>

        <div className="col-11of24 offset-1of24 col-md-24of24 offset-md-0 col-sm-12of12 offset-sm-0">
          <section className={styles.section}>
            <div className={styles.circles}>
              <Circles />
            </div>

            <div className={styles.item} data-reveal>
              <div className="row between">
                <div className="col-3of11 col-sm-7of12 t-text t-text--gray">
                  <p>
                    Have an idea in mind? Let&rsquo;s connect and explore how we can help
                    bring it to life.
                  </p>
                </div>
                <div className="col-5of11 col-sm-12of12">
                  <a
                    className="t-link-tertiary t-link-tertiary--black"
                    href={`mailto:${SITE.email}`}
                  >
                    <span className="t-link-tertiary-label">{SITE.email}</span>
                    <span className="t-link-tertiary-icon" aria-hidden="true">↗</span>
                  </a>
                  <br />
                  <a
                    className="t-link-tertiary t-link-tertiary--black"
                    href={SITE.phoneHref}
                  >
                    <span className="t-link-tertiary-label">{SITE.phone}</span>
                    <span className="t-link-tertiary-icon" aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.item} data-reveal>
              <div className="row between">
                <div className="col-3of11 col-sm-7of12">
                  <address className="t-address t-text t-text--gray">
                    {OFFICES.map((o) => (
                      <span key={o.city}>
                        {o.city.toUpperCase()} — {o.coords}
                        <br />
                      </span>
                    ))}
                  </address>
                </div>
                <div className="col-5of11 col-sm-12of12">
                  <a
                    className="t-link-tertiary t-link-tertiary--black"
                    href="https://maps.google.com/?q=22.7196,75.8577"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="t-link-tertiary-label">view on google maps</span>
                    <span className="t-link-tertiary-icon" aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={`${styles.circles} ${styles.circles2}`}>
              <Circles rings={7} />
            </div>
            <ContactForm />
          </section>

          <section className={styles.section}>
            <div className={`${styles.circles} ${styles.circles3}`}>
              <Circles rings={11} />
            </div>

            <div className="row">
              <div className="col-6of11 col-sm-12of12">
                <div className={styles.block} data-reveal>
                  <h2 className={`${styles.blockTitle} t-h5 t-h5--bold`}>
                    <MonopoText>Work with us</MonopoText>
                  </h2>
                  <div className="t-wysiwyg t-text">
                    <p>
                      We are always looking for people who can hold both halves of the
                      craft at once — the art and the algorithm. If that sounds like you,
                      send your CV and portfolio to{' '}
                      <a href={`mailto:${SITE.email}`}><strong>{SITE.email}</strong></a>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-4of11 offset-1of11 col-sm-12of12 offset-sm-0">
                <div className={styles.block} data-reveal>
                  <h2 className={`${styles.blockTitle} t-h5 t-h5--bold`}>
                    <MonopoText>What we do</MonopoText>
                  </h2>
                  <div className="t-wysiwyg t-text">
                    <p>
                      {PILLARS.join(' · ')}. Technology, brand and media — the trinity we
                      compose every engagement from. Rebirth is not optional. It is
                      inevitable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
