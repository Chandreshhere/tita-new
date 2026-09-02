'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import styles from './CircleMaskImage.module.scss'

type Props = {
  src: string
  alt: string
  /** Optional second frame revealed on hover (the `--hover` variant). */
  hoverSrc?: string
  className?: string
  sizes?: string
  priority?: boolean
}

/**
 * `c-CircleMask` — the image arrives through a circular mask that scales open as
 * the tile enters the viewport, then settles into a full-bleed crop.
 *
 * The reference draws the mask into a `<canvas>`; an animated `clip-path` gets
 * the same result on the compositor thread, which matters here because the Work
 * grid mounts 34 of these at once.
 */
export function CircleMaskImage({
  src,
  alt,
  hoverSrc,
  className,
  sizes = '(max-width: 767px) 100vw, 33vw',
  priority = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (prefersReducedMotion()) {
      gsap.set(root, { '--mask': '150%' })
      root.classList.add(styles.isLoaded)
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { '--mask': '0%' },
        {
          '--mask': '150%',
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 92%', once: true },
          onStart: () => root.classList.add(styles.isLoaded),
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className={`${styles.root} ${className ?? ''}`}>
      <div className={styles.mask}>
        <Image
          className={styles.img}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
        />
        {hoverSrc && (
          <Image
            className={`${styles.img} ${styles.hover}`}
            src={hoverSrc}
            alt=""
            aria-hidden="true"
            fill
            sizes={sizes}
          />
        )}
      </div>
    </div>
  )
}
