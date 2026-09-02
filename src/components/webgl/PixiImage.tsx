'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import styles from './PixiImage.module.scss'

type Props = {
  src: string
  alt: string
  /** Intrinsic aspect as a padding-top percentage, matching the reference markup. */
  ratio?: number
  className?: string
  sizes?: string
  priority?: boolean
  /** Adds the slow drift-on-scroll the reference gives its large editorial images. */
  parallax?: boolean
}

/**
 * `c-PixiImage` — an editorial image that fades up as it enters the viewport and
 * drifts slightly against the scroll.
 *
 * Per the brief this stays on `next/image` rather than being uploaded into a
 * WebGL texture: it takes part in no distortion effect, so a GPU texture would
 * cost memory and buy nothing. The WebGL path is reserved for `CircleMaskImage`
 * and `PixiGallery`, where the effect genuinely needs it.
 */
export function PixiImage({
  src,
  alt,
  ratio,
  className,
  sizes = '(max-width: 767px) 100vw, 50vw',
  priority = false,
  parallax = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const inner = innerRef.current
    if (!root || !inner) return

    if (prefersReducedMotion()) {
      gsap.set(inner, { opacity: 1, scale: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { opacity: 0, scale: 1.12 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 92%', once: true },
        },
      )

      if (parallax) {
        gsap.fromTo(
          inner,
          { yPercent: -6 },
          {
            yPercent: 6,
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
      }
    }, root)

    return () => ctx.revert()
  }, [parallax])

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className ?? ''}`}
      style={ratio ? { paddingTop: `${ratio}%` } : undefined}
    >
      <div ref={innerRef} className={styles.inner}>
        <Image
          className={styles.img}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
        />
      </div>
    </div>
  )
}
