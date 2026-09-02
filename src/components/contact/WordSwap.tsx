'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { MonopoText } from '@/components/ui/MonopoText'
import styles from './WordSwap.module.scss'

/**
 * `c-WordSwap` — a single word in the Contact headline that cycles between
 * alternatives, the box resizing to whichever word is showing.
 *
 * The words are all rendered stacked so the widest one defines the box; only the
 * active one is visible, and the others are hidden from assistive tech so the
 * headline reads as one sentence.
 */
export function WordSwap({ words, delay = 0 }: { words: string[]; delay?: number }) {
  const [index, setIndex] = useState(0)
  const rootRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (words.length < 2 || prefersReducedMotion()) return

    let interval = 0
    // `delay` offsets the two swaps in the headline so they don't flip in unison.
    const start = window.setTimeout(() => {
      setIndex((i) => (i + 1) % words.length)
      interval = window.setInterval(() => {
        setIndex((i) => (i + 1) % words.length)
      }, 3200)
    }, 3200 + delay)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
    }
  }, [words.length, delay])

  // Resize the inline box to the active word so the sentence reflows smoothly.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const active = root.querySelector<HTMLElement>(`.${styles.isActive}`)
    if (!active) return

    const width = active.offsetWidth
    if (prefersReducedMotion()) {
      gsap.set(root, { width })
      return
    }
    gsap.to(root, { width, duration: 0.6, ease: 'power3.out' })
  }, [index])

  return (
    <span ref={rootRef} className={styles.root}>
      {words.map((word, i) => (
        <span
          className={`${styles.word} ${i === index ? styles.isActive : ''}`}
          key={word + i}
          aria-hidden={i === index ? undefined : true}
        >
          <MonopoText>{word}</MonopoText>
        </span>
      ))}
    </span>
  )
}
