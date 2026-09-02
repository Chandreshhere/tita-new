'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { TransitionLink } from '@/components/core/TransitionLink'
import { SITE, MARQUEE } from '@/data/site'
import styles from './CtaMarquee.module.scss'

/**
 * The closing CTA marquee — the template's `section cta`. The band slides with
 * the scroll and carries TITA's own refrain.
 */
export function CtaMarquee() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const band = root?.querySelector(`.${styles.band}`)
    if (!root || !band || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        band,
        { xPercent: 0 },
        {
          xPercent: -22,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.marquee} aria-hidden="true">
        <span className={`${styles.band} t-h1`}>{`${MARQUEE} • `.repeat(6)}</span>
      </div>

      <div className={`${styles.cta} container`}>
        <div className="row center">
          <div className="col-14of24 col-sm-12of12">
            <p className={`${styles.lede} t-h3`}>
              Reach out if you&rsquo;re ready to compose something worth remembering.
            </p>
            <a className={`${styles.email} t-h5`} href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            <div className={styles.btn}>
              <TransitionLink className="t-btn-primary" href="/contact" data-cursor="discover">
                <span>Let&rsquo;s create</span>
                <span className="t-btn-primary-arrow" aria-hidden="true">→</span>
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
