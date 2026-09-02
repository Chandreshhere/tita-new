'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { TRANSITION_GRADIENTS } from '@/data/gradients'
import { MonopoGradient } from '@/components/webgl/MonopoGradient'
import { Logo } from '@/components/ui/Logo'
import type { MonopoGradientRenderer } from '@/components/webgl/MonopoGradientRenderer'
import styles from './PageTransition.module.scss'

type TransitionApi = { navigate: (href: string) => void }

const TransitionContext = createContext<TransitionApi>({ navigate: () => {} })
export const usePageTransition = () => useContext(TransitionContext)

const routeKey = (href: string) => `/${href.split('/').filter(Boolean)[0] ?? ''}`

/**
 * `c-AppTransition` — the gradient curtain that covers the viewport between
 * routes.
 *
 * The reference cross-fades this curtain rather than wiping it: its own CSS is
 * `opacity 0 → 1` over 0.6s on `.is-active`, with the wordmark fading in at the
 * centre. Sequence: curtain fades up over the outgoing page while its palette
 * morphs toward the incoming route's, Next swaps the route underneath it, then
 * the curtain fades away and the new page is revealed.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const overlayRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<MonopoGradientRenderer | null>(null)
  const pendingRef = useRef<string | null>(null)
  const runningRef = useRef(false)
  // The first pathname effect fires on mount; there is nothing to reveal then.
  const mountedRef = useRef(false)

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || runningRef.current) return

      if (prefersReducedMotion()) {
        router.push(href)
        return
      }

      runningRef.current = true
      pendingRef.current = href

      const overlay = overlayRef.current
      const target = TRANSITION_GRADIENTS[routeKey(href)] ?? TRANSITION_GRADIENTS['/']
      rendererRef.current?.transitionTo(target, 0.9)

      const tl = gsap.timeline({
        onComplete: () => router.push(href),
      })

      tl.set(overlay, { visibility: 'visible' })
        .to(overlay, { autoAlpha: 1, duration: 0.6, ease: 'power3.inOut' }, 0)
        .to(logoRef.current, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.25)
        .to(overlay, { duration: 0.15 }) // brief hold so the swap is never visible
    },
    [pathname, router],
  )

  // Reveal the new route once its pathname has landed.
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    if (!runningRef.current) return

    const overlay = overlayRef.current
    const tl = gsap.timeline({
      onComplete: () => {
        runningRef.current = false
        pendingRef.current = null
      },
    })
    tl.to(logoRef.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0)
      .to(overlay, {
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        delay: 0.2,
      }, 0)
      .set(overlay, { visibility: 'hidden' })

    return () => {
      tl.kill()
    }
  }, [pathname])

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
        <MonopoGradient
          className={styles.canvas}
          config={TRANSITION_GRADIENTS['/']}
          interactive={false}
          onReady={(r) => {
            rendererRef.current = r
          }}
        />
        <div ref={logoRef} className={styles.logo}>
          <Logo width={190} />
        </div>
      </div>
    </TransitionContext.Provider>
  )
}
