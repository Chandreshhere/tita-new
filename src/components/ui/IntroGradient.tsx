'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import type { GradientConfig } from '@/data/gradients'
import { MonopoGradient } from '@/components/webgl/MonopoGradient'
import { Ruler } from './Ruler'
import styles from './IntroGradient.module.scss'

type Props = {
  config: GradientConfig
  children: ReactNode
  /** Rendered against the bottom edge — the metadata strip and scroll cue. */
  foot?: ReactNode
  className?: string
  /**
   * A banner-height hero instead of a full viewport one. The margin rulers go
   * with it: at this height they crowd the headline rather than framing it.
   */
  short?: boolean
}

/**
 * `c-IntroGradient` — the gradient hero shared by Services and Team: centred
 * headline, a measurement ruler down each margin, and the page's own palette
 * behind it. Full viewport by default; `short` cuts it to a banner.
 */
export function IntroGradient({ config, children, foot, className, short = false }: Props) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const lines = root.querySelectorAll('[data-line]')
    const footEl = root.querySelector('[data-foot]')

    if (prefersReducedMotion()) {
      gsap.set([lines, footEl].filter(Boolean) as Element[], { yPercent: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })
      tl.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.09, ease: 'power3.out' },
      )
      if (footEl) {
        tl.fromTo(footEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.7')
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className={`${styles.root} ${short ? styles.short : ''} ${className ?? ''}`}
    >
      <MonopoGradient className={styles.gradient} config={config} />

      {!short && (
        <>
          <Ruler className={`${styles.ruler} ${styles.rulerLeft}`} cm={3} mm={9} progress={0.14} />
          <Ruler className={`${styles.ruler} ${styles.rulerRight}`} cm={3} mm={9} progress={0.68} align="right" />
        </>
      )}

      <div className={styles.inner}>{children}</div>

      {foot && (
        <div className={styles.foot} data-foot>
          {foot}
        </div>
      )}
    </section>
  )
}
