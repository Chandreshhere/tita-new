'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import styles from './CitiesMarquee.module.scss'

const BAND = 'indore ↔ ahmedabad ↔ we orchestrate movements ↔ '

/**
 * The band that slides horizontally with the scroll.
 * The string is repeated so the strip stays wider than the viewport at any size.
 */
export function CitiesMarquee() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const inner = root?.firstElementChild
    if (!root || !inner || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { xPercent: 0 },
        {
          xPercent: -18,
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
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <span className={`${styles.band} t-h2`}>{BAND.repeat(6)}</span>
    </div>
  )
}
