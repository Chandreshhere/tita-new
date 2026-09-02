'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { MonopoText } from '@/components/ui/MonopoText'
import { Ruler } from '@/components/ui/Ruler'
import { WordSwap } from './WordSwap'
import styles from './ContactHero.module.scss'

/**
 * `c-Contact-right` — the headline rail. On desktop it's sticky beside the
 * scrolling form column, exactly as on the reference.
 */
export function ContactHero({ progress = 0 }: { progress?: number }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const lines = root.querySelectorAll('[data-line]')

    if (prefersReducedMotion()) {
      gsap.set(lines, { yPercent: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.09, ease: 'power3.out', delay: 0.3 },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.sticky}>
        <div className="row middle">
          <div className="col-1of12 col-md-2of24 col-sm-1of12">
            <Ruler className={styles.ruler} cm={3} mm={16} progress={progress} />
          </div>

          {/* 11 of 12 so the headline breaks across three lines as it does on the
              reference, rather than fragmenting into five. */}
          <div className="col-11of12 col-md-20of24 col-sm-11of12">
            <h1 className={`${styles.title} t-h1`}>
              <span className={styles.line}>
                <span data-line>
                  <MonopoText>Ready to </MonopoText>
                  <WordSwap words={['compose', 'ignite']} />
                </span>
              </span>
              <span className={styles.line}>
                <span data-line>
                  <MonopoText>your </MonopoText>
                  <WordSwap words={['renaissance', 'legacy']} delay={400} />
                </span>
              </span>
              <span className={styles.line}>
                <span data-line>
                  <MonopoText>→ with us.</MonopoText>
                </span>
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
