'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { useSmoothScroll } from './SmoothScrollProvider'
import styles from './Preloader.module.scss'

/**
 * First-load curtain. It sits above everything, holds the scroll, and lifts once
 * fonts and the first paint have settled — so the hero's own entrance timeline
 * starts against a stable layout rather than mid-reflow.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const [done, setDone] = useState(false)
  const { stop, start } = useSmoothScroll()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (prefersReducedMotion()) {
      document.body.classList.add('is-page-ready')
      setDone(true)
      return
    }

    stop()

    const finish = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.add('is-page-ready')
          start()
          setDone(true)
        },
      })

      tl.to(barRef.current, { scaleX: 1, duration: 0.5, ease: 'power2.out' })
        .to(logoRef.current, { opacity: 0, y: -20, duration: 0.5, ease: 'power3.in' }, '-=0.1')
        .to(root, { yPercent: -100, duration: 0.9, ease: 'power3.inOut' }, '-=0.2')
    }

    const intro = gsap.timeline()
    intro
      .fromTo(logoRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 0.7, duration: 1.1, ease: 'power2.out' }, '-=0.5')

    // Wait for fonts so the hero never reveals mid-swap, but never hang on them.
    const fonts = document.fonts?.ready ?? Promise.resolve()
    let timeout = 0
    const ready = new Promise<void>((resolve) => {
      timeout = window.setTimeout(resolve, 2500)
      void fonts.then(() => resolve())
    })

    void ready.then(() => {
      window.clearTimeout(timeout)
      // One more frame so the first paint has definitely happened.
      requestAnimationFrame(() => requestAnimationFrame(finish))
    })

    return () => {
      window.clearTimeout(timeout)
      intro.kill()
      gsap.killTweensOf([root, logoRef.current, barRef.current])
    }
  }, [start, stop])

  if (done) return null

  return (
    <div ref={rootRef} className={styles.root}>
      <div ref={logoRef} className={styles.logo}>
        {/* The studio's own mark from the existing site, not the TITA
            initialism. The white cut is drawn for a dark ground. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.logoImg}
          src="/images/ui/tita-logo-white.png"
          alt="This Is That Agency"
          width={260}
          height={260}
        />
      </div>
      <span className={styles.bar}>
        <span ref={barRef} className={styles.barFill} />
      </span>
    </div>
  )
}
