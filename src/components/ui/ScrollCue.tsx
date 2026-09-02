'use client'

import { useSmoothScroll } from '@/components/core/SmoothScrollProvider'
import styles from './ScrollCue.module.scss'

/**
 * The thin vertical "scroll down" marker in the corner of every hero. Clicking
 * it advances one viewport, which is what the reference does.
 */
export function ScrollCue({ className }: { className?: string }) {
  const { scrollTo } = useSmoothScroll()

  return (
    <button
      type="button"
      className={`${styles.root} t-btn ${className ?? ''}`}
      onClick={() => scrollTo(window.innerHeight)}
    >
      <span className="u-visually-hidden">Scroll down</span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span className={styles.arrow} aria-hidden="true">↓</span>
    </button>
  )
}
