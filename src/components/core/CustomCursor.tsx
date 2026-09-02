'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { isTouchDevice, prefersReducedMotion } from '@/lib/motion'
import styles from './CustomCursor.module.scss'

/**
 * `c-Cursor-info` — a white disc that follows the pointer and swaps its label
 * depending on what is under it.
 *
 * Any element carrying `data-cursor="project" | "case" | "discover"` activates
 * the matching state. Pointer position is driven entirely through `gsap.quickTo`
 * so a mousemove never touches React state.
 *
 * The native cursor is deliberately left visible — the reference's stylesheet
 * contains no `cursor: none`, and this disc is additive on top of it.
 */
export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // No custom cursor on touch, and none when the user asked for less motion.
    if (isTouchDevice() || prefersReducedMotion()) return

    const root = rootRef.current
    const circle = circleRef.current
    if (!root || !circle) return

    const xTo = gsap.quickTo(root, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(root, 'y', { duration: 0.5, ease: 'power3.out' })

    let currentState: string | null = null

    const setState = (state: string | null) => {
      if (state === currentState) return
      currentState = state
      root.dataset.state = state ?? ''
      gsap.to(circle, {
        scale: state ? 1 : 0,
        duration: 0.4,
        ease: 'power3.out',
      })
    }

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)

      const target = (e.target as HTMLElement | null)?.closest?.('[data-cursor]')
      setState(target ? (target as HTMLElement).dataset.cursor ?? null : null)
    }

    const onLeave = () => {
      gsap.to(root, { opacity: 0, duration: 0.3 })
      setState(null)
    }
    const onEnter = () => gsap.to(root, { opacity: 1, duration: 0.3 })

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      gsap.killTweensOf([root, circle])
    }
  }, [])

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div ref={circleRef} className={styles.circle}>
        <span className={`${styles.label} ${styles.case}`}>
          View<br />case study<br />→
        </span>
        <span className={`${styles.label} ${styles.project}`}>
          View<br />project<br />→
        </span>
        <span className={`${styles.label} ${styles.discover}`}>
          Discover<br />more →
        </span>
      </div>
    </div>
  )
}
