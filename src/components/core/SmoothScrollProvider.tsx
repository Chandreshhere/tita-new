'use client'

import Lenis from 'lenis'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion'

type ScrollApi = {
  lenis: Lenis | null
  stop: () => void
  start: () => void
  scrollTo: (target: number | string | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void
}

const ScrollContext = createContext<ScrollApi>({
  lenis: null,
  stop: () => {},
  start: () => {},
  scrollTo: () => {},
})

export const useSmoothScroll = () => useContext(ScrollContext)

/**
 * The single Lenis instance for the app.
 *
 * Lenis owns the scroll position and pumps ScrollTrigger from its own callback;
 * GSAP's ticker drives Lenis' rAF. Wiring it in this order is what keeps
 * scrubbed timelines in lockstep with the smoothed position instead of one
 * frame behind it.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const [, setReady] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Honouring reduced motion means native scrolling, not slower smoothing.
    if (prefersReducedMotion()) {
      setReady(true)
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      // Native momentum on touch beats an emulated one — and it doesn't fight
      // the browser's own overscroll behaviour.
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Mobile browser chrome resizes the viewport mid-scroll; a CSS var keeps
    // 100vh-derived heights honest without triggering layout thrash.
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }
    setVh()
    window.addEventListener('resize', setVh)

    setReady(true)

    return () => {
      gsap.ticker.remove(raf)
      window.removeEventListener('resize', setVh)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Every route change: jump to the top, then let ScrollTrigger re-measure the
  // new document before any entrance animation reads positions off it.
  useEffect(() => {
    const lenis = lenisRef.current
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)

    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  const stop = useCallback(() => {
    lenisRef.current?.stop()
    document.documentElement.classList.add('lenis-stopped')
  }, [])

  const start = useCallback(() => {
    lenisRef.current?.start()
    document.documentElement.classList.remove('lenis-stopped')
  }, [])

  const scrollTo = useCallback<ScrollApi['scrollTo']>((target, opts) => {
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(target, { offset: opts?.offset ?? 0, immediate: opts?.immediate })
      return
    }
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: opts?.immediate ? 'auto' : 'smooth' })
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      el?.scrollIntoView({ behavior: opts?.immediate ? 'auto' : 'smooth' })
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ lenis: lenisRef.current, stop, start, scrollTo }}>
      {children}
    </ScrollContext.Provider>
  )
}
