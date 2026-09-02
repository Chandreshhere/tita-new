'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'

type Props = {
  children: ReactNode
  /** Fraction of a viewport height the element lags behind the scroll by. */
  speed?: number
  className?: string
}

/**
 * `c-ParallaxObject` — scrub-linked vertical drift. Kept deliberately subtle;
 * the reference moves these tens of pixels, not hundreds.
 */
export function ParallaxObject({ children, speed = 0.08, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: () => window.innerHeight * speed },
        {
          y: () => -window.innerHeight * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
